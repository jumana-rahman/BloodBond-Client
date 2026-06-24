"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Form, 
  Fieldset, 
  TextField, 
  Label, 
  Input, 
  FieldError, 
  Button, 
  Select, 
  ListBox 
} from "@heroui/react";
import { Eye, EyeSlash, CloudArrowUpIn, ArrowRight } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client"; 
import { toast } from "react-toastify";
import Link from "next/link";

export default function RegisterPage() {
  // Form Inputs State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Address JSON Data Lists States
  const [districtsList, setDistrictsList] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // Fetch Districts and Upazilas from the public directory on mount using modern fetch API
  useEffect(() => {
    const loadGeographicalData = async () => {
      try {
        const [districtsResponse, upazilasResponse] = await Promise.all([
          fetch("/data/districts.json"),
          fetch("/data/upazilas.json")
        ]);

        if (!districtsResponse.ok || !upazilasResponse.ok) {
          throw new Error("Failed to capture local address streams.");
        }

        const districtsData = await districtsResponse.json();
        const upazilasData = await upazilasResponse.json();

        // Sort data for clean UI presentation
        setDistrictsList(districtsData.sort((a, b) => a.name.localeCompare(b.name)));
        setAllUpazilas(upazilasData);
      } catch (err) {
        console.error("Local Geolocation payload mismatch:", err);
        toast.error("Critical: Could not load regional address mappings.");
      }
    };

    loadGeographicalData();
  }, []);

  // Filter relevant upazilas directly when district changes
  useEffect(() => {
    if (formData.district) {
      // Find matching district object to check using either names or IDs
      const chosenDistrictObj = districtsList.find(d => d.name === formData.district);
      
      if (chosenDistrictObj) {
        const matchedUpazilas = allUpazilas.filter(
          (u) => u.district_id === chosenDistrictObj.id || u.district_name === formData.district
        );
        setFilteredUpazilas(matchedUpazilas.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.district, districtsList, allUpazilas]);

  // Input Field Reducers
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "district") {
      setFormData((prev) => ({ ...prev, upazila: "" })); // Flush dependent dropdown if district overrides
    }
  };

  // Instant Validation States (Live Feedback)
  const isEmailInvalid = formData.email.length > 0 && !/\S+@\S+\.\S+/.test(formData.email);
  const isNameInvalid = formData.name.length > 0 && formData.name.length < 3;
  const isPasswordInvalid = formData.password.length > 0 && formData.password.length < 6;
  const isConfirmPasswordInvalid = formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password;

  // ImgBB Processing Framework
  const uploadToImgBB = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) throw new Error("Missing ImgBB configuration token.");

    const uploadBody = new FormData();
    uploadBody.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: uploadBody,
    });
    const parsed = await res.json();
    if (parsed.success) {
      return parsed.data.url;
    } else {
      throw new Error("Avatar upload failed.");
    }
  };

  // Submit Orchestrator
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!avatar) {
      toast.error("Please upload a profile avatar.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload chosen avatar file stream to ImgBB
      const uploadedAvatarUrl = await uploadToImgBB(avatar);

      // 2. Execute Better-Auth Client Signup Protocol
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: uploadedAvatarUrl,
        data: {
          bloodGroup: formData.bloodGroup,
          district: formData.district,
          upazila: formData.upazila,
          role: "donor",
          status: "active"
        }
      });

      if (error) {
        throw new Error(error.message || "Better-Auth registration failed.");
      }

      toast.success("Welcome aboard! Registration completed successfully.");

      setTimeout(() => {
        router.push("/");
      }, 1200);
      
      // Cleanup inputs
      setFormData({ name: "", email: "", bloodGroup: "", district: "", upazila: "", password: "", confirmPassword: "" });
      setAvatar(null);

    } catch (err) {
      toast.error(err.message || "An expected error occurred during creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white antialiased text-gray-900">
      
      {/* Decorative Brand Panel Sidebar */}
      <div className="hidden lg:flex lg:col-span-4 flex-col justify-between px-8 text-white relative overflow-hidden" style={{ backgroundColor: "#C62828" }}>
        <div className="absolute inset-0 bg-black opacity-5 pattern-grid-lg"></div>
        <div className="my-auto space-y-4 max-w-sm">
          <h1 className="text-4xl font-black tracking-tight leading-none">Be Someone&apos;s Lifeline Today.</h1>
          <p className="text-red-100 text-sm leading-relaxed">
            Register as a structural tier-1 donor. Your location metrics and blood groups aid real-time urgent search operations.
          </p>
        </div>
      </div>

      {/* Main Form workspace */}
      <div className="lg:col-span-8 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-xl">
          
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-500">Every single second counts. Join the structural lifework network.</p>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-6">
            <Fieldset>
              <Fieldset.Legend className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Profile Requirements</Fieldset.Legend>
              
              <Fieldset.Group className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 w-full">
                
                {/* Full Name Input */}
                <TextField isInvalid={isNameInvalid} className="w-full">
                  <Label htmlFor="name" className="text-xs font-semibold text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    aria-label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <FieldError className="text-xs">Name must be at least 3 characters long</FieldError>
                </TextField>

                {/* Email Input */}
                <TextField isInvalid={isEmailInvalid} className="w-full">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@domain.com"
                    aria-label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <FieldError className="text-xs">Please provide a valid email address</FieldError>
                </TextField>

                {/* Blood Group Selector */}
                <div className="flex flex-col gap-1 w-full">
                  <Label className="text-xs font-semibold text-gray-700">Blood Group</Label>
                  <Select
                    placeholder="Choose Blood Group"
                    value={formData.bloodGroup}
                    aria-label="Blood Group"
                    onChange={(val) => handleSelectChange("bloodGroup", val)}
                    required
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                          <ListBox.Item key={group} id={group} textValue={group}>
                            {group}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                {/* Avatar Target Upload Trigger */}
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-xs font-semibold text-gray-700">Display Profile Image</label>
                  <label className="flex items-center gap-3 justify-center border border-gray-300 rounded-xl p-2.5 cursor-pointer bg-white shadow-sm hover:bg-gray-50 transition-all duration-200">
                    <CloudArrowUpIn className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500 font-medium truncate">
                      {avatar ? avatar.name : "Select image file"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setAvatar(e.target.files[0])}
                      required={!avatar}
                    />
                  </label>
                </div>

                {/* District Selector via /public/data/districts.json mapping */}
                <div className="flex flex-col gap-1 w-full">
                  <Label className="text-xs font-semibold text-gray-700">District Location</Label>
                  <Select
                    placeholder="Choose District"
                    value={formData.district}
                    aria-label="District"
                    onChange={(val) => handleSelectChange("district", val)}
                    required
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {districtsList.map((dist) => (
                          <ListBox.Item key={dist.id || dist.name} id={dist.name} textValue={dist.name}>
                            {dist.name}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                {/* Upazila Selector dynamically filtered via related district */}
                <div className="flex flex-col gap-1 w-full">
                  <Label className="text-xs font-semibold text-gray-700">Upazila Location</Label>
                  <Select
                    aria-label="Upazila"
                    placeholder={formData.district ? "Choose Upazila" : "Select district first"}
                    disabled={!formData.district || filteredUpazilas.length === 0}
                    value={formData.upazila}
                    onChange={(val) => handleSelectChange("upazila", val)}
                    required
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {filteredUpazilas.map((upazila) => (
                          <ListBox.Item key={upazila.id || upazila.name} id={upazila.name} textValue={upazila.name}>
                            {upazila.name}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                {/* Password Input */}
                <TextField isInvalid={isPasswordInvalid} className="w-full">
                  <Label htmlFor="password" className="text-xs font-semibold text-gray-700">Security Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError className="text-xs">Password must meet the 6 character minimum criteria</FieldError>
                </TextField>

                {/* Confirm Password Input */}
                <TextField isInvalid={isConfirmPasswordInvalid} className="w-full">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700">Confirm Security Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError className="text-xs font-medium">Passwords do not match</FieldError>
                </TextField>

              </Fieldset.Group>

              {/* Action Buttons & Navigation Trigger link */}
              <Fieldset.Actions className="mt-8 flex flex-col gap-4">
                <Button 
                  type="submit" 
                  isLoading={loading}
                  className="w-full py-6 font-bold text-sm tracking-wide text-white rounded-xl shadow-lg transition-all duration-150 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#C62828" }}
                >
                  {loading ? "Processing Enlistment..." : "Complete Registration"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>

                {/* Login Redirect Anchor Link */}
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link 
                      href="/login" 
                      className="font-bold hover:underline transition-all"
                      style={{ color: "#C62828" }}
                    >
                      Please login
                    </Link>
                  </p>
                </div>
              </Fieldset.Actions>
            </Fieldset>
          </Form>

        </div>
      </div>
    </div>
  );
}
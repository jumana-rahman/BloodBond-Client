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
  ListBox,
} from "@heroui/react";
import { Eye, EyeSlash, CloudArrowUpIn, ArrowRight } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Link from "next/link";

export default function RegisterPage() {
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
  const [districtsList, setDistrictsList] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  useEffect(() => {
    const loadGeographicalData = async () => {
      try {
        const [districtsRes, upazilasRes] = await Promise.all([
          fetch("/data/districts.json"),
          fetch("/data/upazilas.json"),
        ]);
        if (!districtsRes.ok || !upazilasRes.ok) throw new Error("Failed to load address data.");
        const districtsData = await districtsRes.json();
        const upazilasData = await upazilasRes.json();
        setDistrictsList(districtsData.sort((a, b) => a.name.localeCompare(b.name)));
        setAllUpazilas(upazilasData);
      } catch (err) {
        toast.error("Could not load district/upazila data.");
      }
    };
    loadGeographicalData();
  }, []);

  useEffect(() => {
    if (formData.district) {
      const chosenDistrict = districtsList.find((d) => d.name === formData.district);
      if (chosenDistrict) {
        const matched = allUpazilas.filter(
          (u) => u.district_id === chosenDistrict.id || u.district_name === formData.district
        );
        setFilteredUpazilas(matched.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.district, districtsList, allUpazilas]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "district" ? { upazila: "" } : {}),
    }));
  };

  const isEmailInvalid = formData.email.length > 0 && !/\S+@\S+\.\S+/.test(formData.email);
  const isNameInvalid = formData.name.length > 0 && formData.name.length < 3;
  const isPasswordInvalid = formData.password.length > 0 && formData.password.length < 6;
  const isConfirmPasswordInvalid =
    formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password;

  // Upload avatar to ImageBB
  const uploadToImgBB = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) throw new Error("Missing ImageBB API key.");
    const body = new FormData();
    body.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body,
    });
    const parsed = await res.json();
    if (!parsed.success) throw new Error("Avatar upload failed.");
    return parsed.data.url;
  };

  // Sync extra user fields (bloodGroup, district, upazila, role, status) to your MongoDB
  // Better-auth only stores: name, email, image — everything else must be synced separately
  const syncUserToDB = async (email, name, avatarUrl) => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseURL}/api/users/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        avatar: avatarUrl,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
        // role: "donor" and status: "active" are set as defaults on the server
      }),
    });
    if (!res.ok) throw new Error("Failed to sync user profile to database.");
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!avatar) return toast.error("Please upload a profile avatar.");
    if (!formData.bloodGroup) return toast.error("Please select a blood group.");
    if (!formData.district) return toast.error("Please select a district.");
    if (!formData.upazila) return toast.error("Please select an upazila.");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match.");

    setLoading(true);

    try {
      // Step 1: Upload avatar to ImageBB
      const avatarUrl = await uploadToImgBB(avatar);

      // Step 2: Create account via better-auth
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: avatarUrl,
      });

      if (error) throw new Error(error.message || "Registration failed.");

      // Step 3: Sync extra fields (bloodGroup, district, upazila, role, status) to your MongoDB
      // This is the critical step your original code was missing
      await syncUserToDB(formData.email, formData.name, avatarUrl);

      toast.success("Registration successful! Welcome to BloodBond.");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white antialiased text-gray-900">
      {/* Brand Sidebar */}
      <div
        className="hidden lg:flex lg:col-span-4 flex-col justify-between px-8 text-white relative overflow-hidden"
        style={{ backgroundColor: "#C62828" }}
      >
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="my-auto space-y-4 max-w-sm relative z-10">
          <h1 className="text-4xl font-black tracking-tight leading-none">
            Be Someone&apos;s Lifeline Today.
          </h1>
          <p className="text-red-100 text-sm leading-relaxed">
            Register as a donor. Your blood group and location help connect you
            with people who need you most.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="lg:col-span-8 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Join the BloodBond network and save lives.
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-6">
            <Fieldset>
              <Fieldset.Legend className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                Profile Information
              </Fieldset.Legend>

              <Fieldset.Group className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 w-full">
                {/* Full Name */}
                <TextField isInvalid={isNameInvalid} className="w-full">
                  <Label htmlFor="name" className="text-xs font-semibold text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <FieldError className="text-xs">
                    Name must be at least 3 characters
                  </FieldError>
                </TextField>

                {/* Email */}
                <TextField isInvalid={isEmailInvalid} className="w-full">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <FieldError className="text-xs">
                    Please enter a valid email address
                  </FieldError>
                </TextField>

                {/* Blood Group */}
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
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                          <ListBox.Item key={g} id={g} textValue={g}>
                            {g}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                {/* Avatar Upload */}
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-xs font-semibold text-gray-700">Profile Photo</label>
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
                    />
                  </label>
                </div>

                {/* District */}
                <div className="flex flex-col gap-1 w-full">
                  <Label className="text-xs font-semibold text-gray-700">District</Label>
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
                        {districtsList.map((d) => (
                          <ListBox.Item key={d.id || d.name} id={d.name} textValue={d.name}>
                            {d.name}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                {/* Upazila */}
                <div className="flex flex-col gap-1 w-full">
                  <Label className="text-xs font-semibold text-gray-700">Upazila</Label>
                  <Select
                    aria-label="Upazila"
                    placeholder={
                      formData.district ? "Choose Upazila" : "Select district first"
                    }
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
                        {filteredUpazilas.map((u) => (
                          <ListBox.Item key={u.id || u.name} id={u.name} textValue={u.name}>
                            {u.name}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                {/* Password */}
                <TextField isInvalid={isPasswordInvalid} className="w-full">
                  <Label htmlFor="password" className="text-xs font-semibold text-gray-700">
                    Password
                  </Label>
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
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlash className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <FieldError className="text-xs">
                    Password must be at least 6 characters
                  </FieldError>
                </TextField>

                {/* Confirm Password */}
                <TextField isInvalid={isConfirmPasswordInvalid} className="w-full">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700">
                    Confirm Password
                  </Label>
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
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeSlash className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <FieldError className="text-xs">Passwords do not match</FieldError>
                </TextField>
              </Fieldset.Group>

              <Fieldset.Actions className="mt-8 flex flex-col gap-4">
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full py-6 font-bold text-sm tracking-wide text-white rounded-xl shadow-lg transition-all duration-150 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#C62828" }}
                >
                  {loading ? "Creating account..." : "Complete Registration"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-bold hover:underline"
                      style={{ color: "#C62828" }}
                    >
                      Login here
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
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGeoData } from "@/hooks/useGeoData";
import { serverFetch, serverMutation } from "@/lib/core/server";
import { authClient } from "@/lib/auth-client"; // ✅ Using your Better Auth client
import { toast } from "react-toastify";
import {
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaTint,
  FaMapMarkerAlt,
  FaHospital,
  FaMapPin,
  FaCalendar,
  FaClock,
  FaCommentDots,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { BiSolidDonateBlood } from "react-icons/bi";
import { Button } from "@heroui/react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function EditDonationRequestPage() {
  const router = useRouter();
  const { id } = useParams(); // Gets the ID from the URL

  const {
    districts,
    getUpazilasByDistrict,
    loading: geoLoading,
  } = useGeoData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  // 1. Fetch the current user session using authClient
  useEffect(() => {
    const getUser = async () => {
      try {
        const session = await authClient.getSession();
        // Better Auth might return session.user or session.data.user depending on your setup
        // This safely grabs the user from either spot
        const currentUser =
          session?.user || session?.data?.user || session?.data;
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to get session:", error);
        toast.error("Please log in again");
        router.push("/auth/login");
      }
    };
    getUser();
  }, [router]);

  // 2. Check if the user is blocked
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        if (!user?.id) return;
        const data = await serverFetch(`/api/users/${user.id}`);
        if (data.status === "blocked") {
          setIsUserBlocked(true);
          toast.error(
            "Your account has been blocked. You cannot edit donation requests.",
          );
        }
      } catch (error) {
        console.error("Failed to check user status:", error);
      }
    };
    if (user?.id) checkUserStatus();
  }, [user]);

  // 3. Fetch existing request data when page loads
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoadingRequest(true);
        const data = await serverFetch(`/api/donation-requests/${id}`);

        // Format date for input field (YYYY-MM-DD)
        if (data.donationDate) {
          data.donationDate = new Date(data.donationDate)
            .toISOString()
            .split("T")[0];
        }

        console.log("✅ Fetched Request Data:", data);

        // Populate form with existing data
        setFormData({
          recipientName: data.recipientName || "",
          recipientDistrict: data.recipientDistrict || "",
          recipientUpazila: data.recipientUpazila || "",
          hospitalName: data.hospitalName || "",
          fullAddress: data.fullAddress || "",
          bloodGroup: data.bloodGroup || "",
          donationDate: data.donationDate || "",
          donationTime: data.donationTime || "",
          requestMessage: data.requestMessage || "",

          // 🔥 CRITICAL: Save these hidden names too!
          recipientDistrictName: data.recipientDistrictName || "",
          recipientUpazilaName: data.recipientUpazilaName || "",
        });
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load request details");
        router.push("/");
      } finally {
        setLoadingRequest(false);
      }
    };

    if (id) fetchRequest();
  }, [id, router]);

  // 🔥 NEW: Add this second useEffect to update the form when districts load
  useEffect(() => {
    if (!geoLoading && districts.length > 0 && formData.recipientDistrict) {
      // This ensures the UI shows the correct District Name once districts are loaded
      const selectedDistrict = districts.find(
        (d) => d.id === formData.recipientDistrict,
      );
      if (selectedDistrict) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData((prev) => ({
          ...prev,
          recipientDistrictName: selectedDistrict.name,
        }));
      }
    }
  }, [geoLoading, districts, formData.recipientDistrict]);

  // 4. Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. Handle District Change
  const handleDistrictChange = (e) => {
    const selectedDistrictId = e.target.value;
    const selectedDistrict = districts.find((d) => d.id === selectedDistrictId);

    setFormData((prev) => ({
      ...prev,
      recipientDistrict: selectedDistrictId,
      recipientDistrictName: selectedDistrict ? selectedDistrict.name : "",
      recipientUpazila: "", // Reset upazila
      recipientUpazilaName: "",
    }));
  };

  // 6. Handle Upazila Change
  const handleUpazilaChange = (e) => {
    const selectedUpazilaId = e.target.value;
    const upazilas = getUpazilasByDistrict(formData.recipientDistrict);
    const selectedUpazila = upazilas.find((u) => u.id === selectedUpazilaId);

    setFormData((prev) => ({
      ...prev,
      recipientUpazila: selectedUpazilaId,
      recipientUpazilaName: selectedUpazila ? selectedUpazila.name : "",
    }));
  };

  // 7. Handle Form Submission (UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.recipientName.trim()) {
      toast.error("Recipient name is required");
      return;
    }
    if (!formData.recipientDistrict) {
      toast.error("Please select a district");
      return;
    }
    if (!formData.recipientUpazila) {
      toast.error("Please select an upazila");
      return;
    }
    if (!formData.hospitalName.trim()) {
      toast.error("Hospital name is required");
      return;
    }
    if (!formData.fullAddress.trim()) {
      toast.error("Full address is required");
      return;
    }
    if (!formData.bloodGroup) {
      toast.error("Please select a blood group");
      return;
    }
    if (!formData.donationDate) {
      toast.error("Please select a donation date");
      return;
    }
    if (!formData.donationTime) {
      toast.error("Please select a donation time");
      return;
    }
    if (
      !formData.requestMessage.trim() ||
      formData.requestMessage.length < 20
    ) {
      toast.error(
        "Please write a detailed request message (minimum 20 characters)",
      );
      return;
    }

    // Blocked user check
    if (isUserBlocked) {
      toast.error("Your account is blocked. You cannot edit requests.");
      return;
    }

    if (!user) {
      toast.error("Please log in again");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the payload
      const payload = {
        requesterId: user.authId || user.id, // ✅ Ensure you send the authId used in the database,
        requesterName: user.name,
        requesterEmail: user.email,
        recipientName: formData.recipientName.trim(),
        recipientDistrict: formData.recipientDistrict,
        recipientDistrictName: formData.recipientDistrictName,
        recipientUpazila: formData.recipientUpazila,
        recipientUpazilaName: formData.recipientUpazilaName,
        hospitalName: formData.hospitalName.trim(),
        fullAddress: formData.fullAddress.trim(),
        bloodGroup: formData.bloodGroup,
        donationDate: formData.donationDate,
        donationTime: formData.donationTime,
        requestMessage: formData.requestMessage.trim(),
        userId: user.authId || user.id, // ✅ Critical: This must match request.requesterId in DB,
        role: user.role || "donor",
      };

      // CALL THE PUT API
      const response = await serverMutation(
        `/api/donation-requests/edit/${id}`,
        payload,
        "PUT",
      );

      if (response.success) {
        toast.success("Donation request updated successfully!");
        setTimeout(() => {
          router.push("/dashboard/my-donation-requests"); // Redirect to donor dashboard
        }, 1500);
      } else {
        toast.error(response.message || "Failed to update request");
      }
    } catch (error) {
      console.error("Error updating donation request:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loadingRequest || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }

  if (isUserBlocked) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-red-700 mb-2">Account Blocked</h2>
        <p className="text-red-600">
          Your account has been blocked by the administrator. You are unable to
          edit donation requests.
        </p>
      </div>
    );
  }

  // Get current upazilas based on selected district
  const currentUpazilas = getUpazilasByDistrict(formData.recipientDistrict);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-4"
    >
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/my-donation-requests")}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 mb-4 transition-colors"
      >
        <FaArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Donation Request
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update the details of your donation request below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ── Requester Info (Read-only) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaUser className="inline mr-2 text-gray-400" /> Requester Name
              </label>
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="inline mr-2 text-gray-400" /> Requester
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed text-gray-500"
              />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* ── Recipient Info ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Enter recipient's full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaTint className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white transition-colors"
                  required
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Location Info ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient District <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.recipientDistrict}
                  onChange={handleDistrictChange}
                  disabled={geoLoading}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  required
                >
                  <option value="">
                    {geoLoading ? "Loading districts..." : "Select District"}
                  </option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Upazila <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.recipientUpazila}
                  onChange={handleUpazilaChange}
                  disabled={!formData.recipientDistrict}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  required
                >
                  <option value="">
                    {!formData.recipientDistrict
                      ? "Select district first"
                      : "Select Upazila"}
                  </option>
                  {currentUpazilas.map((upazila) => (
                    <option key={upazila.id} value={upazila.id}>
                      {upazila.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Hospital & Address ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaHospital className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="e.g., Dhaka Medical College Hospital"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  placeholder="e.g., Zahir Raihan Rd, Dhaka"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* ── Date & Time ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="donationDate"
                  value={formData.donationDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  name="donationTime"
                  value={formData.donationTime}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* ── Request Message ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Message <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaCommentDots className="absolute left-3 top-4 text-gray-400" />
              <textarea
                name="requestMessage"
                value={formData.requestMessage}
                onChange={handleChange}
                rows={5}
                placeholder="Explain why you need blood. Include details about the patient, medical condition, urgency, and any special requirements."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Minimum 20 characters. Be as detailed as possible to attract more
              donors.
            </p>
          </div>

          {/* ── Submit Button ── */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
            className="w-full mt-4 bg-linear-to-r from-red-600 to-red-700 text-white font-semibold shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2 rounded-xl"
            size="lg"
          >
            {!isSubmitting && <BiSolidDonateBlood size={22} />}
            {isSubmitting ? "Updating Request..." : "Update Donation Request"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

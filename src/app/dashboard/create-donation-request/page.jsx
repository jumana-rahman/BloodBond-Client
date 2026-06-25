"use client";

import { useState, useEffect } from "react";
import { Form, Fieldset, TextField, Button } from "@heroui/react";
import { GiBlood } from "react-icons/gi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { serverMutation } from "@/lib/core/server";

export default function CreateDonationRequest() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  // Geo State Containers
  const [districtsList, setDistrictsList] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // Form Fields State
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

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Check if the current user profile status is explicitly blocked
  const isBlocked = session?.user?.status === "blocked";

  useEffect(() => {
    const loadGeographicalData = async () => {
      try {
        const [districtsResponse, upazilasResponse] = await Promise.all([
          fetch("/data/districts.json"),
          fetch("/data/upazilas.json")
        ]);
        const districtsData = await districtsResponse.json();
        const upazilasData = await upazilasResponse.json();

        const rawDistrictsArray = Array.isArray(districtsData) ? districtsData : (districtsData.districts || []);
        const rawUpazilasArray = Array.isArray(upazilasData) ? upazilasData : (upazilasData.upazilas || []);

        setDistrictsList([...rawDistrictsArray].sort((a, b) => a.name.localeCompare(b.name)));
        setAllUpazilas(rawUpazilasArray);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load regional tracking coordinates.");
      }
    };
    loadGeographicalData();
  }, []);

  const handleDistrictChange = (e) => {
    const selectedDistrictName = e.target.value;
    setFormData((prev) => ({ ...prev, recipientDistrict: selectedDistrictName, recipientUpazila: "" }));

    const targetDistrictObj = districtsList.find((d) => d.name === selectedDistrictName);
    if (targetDistrictObj) {
      const correlatedUpazilas = allUpazilas.filter((u) => u.district_id === targetDistrictObj.id);
      setFilteredUpazilas([...correlatedUpazilas].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlocked) {
      toast.error("Access Denied: Blocked profiles are restricted from creating donation requests.");
      return;
    }
    setLoading(true);

    try {
      // Backend automatically maps default status: "pending" on creation
      const result = await serverMutation("/api/donation-requests", formData, "POST");
      if (result.success) {
        toast.success("Donation request created successfully!");
        router.push("/dashboard");
        router.refresh();
      } else {
        throw new Error(result.message || "Failed to finalize database records.");
      }
    } catch (err) {
      toast.error(err.message || "An operational error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <GiBlood className="text-red-600 w-6 h-6" /> Create Donation Request
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Broadcast an emergency request across the operational dashboard network.
        </p>
      </div>

      {isBlocked && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-800">
          ⚠️ Your account status is currently marked as BLOCKED. You do not have permission to submit requests.
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <Form onSubmit={handleSubmit} className="space-y-6">
          <Fieldset disabled={isBlocked}>
            
            {/* Read-Only Authenticated Requester Identity Segment */}
            <Fieldset.Legend className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Requester Identity (Read Only)
            </Fieldset.Legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-6">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-400">Requester Name</label>
                <input
                  type="text"
                  value={session?.user?.name || ""}
                  readOnly
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-400">Requester Email</label>
                <input
                  type="text"
                  value={session?.user?.email || ""}
                  readOnly
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <Fieldset.Legend className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Recipient & Case Information
            </Fieldset.Legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              <TextField className="w-full">
                <label className="text-xs font-semibold text-gray-700">Recipient Name</label>
                <input
                  id="recipientName"
                  type="text"
                  placeholder="e.g. Rahat Karim"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all"
                />
              </TextField>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700">Blood Group</label>
                <select
                  id="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData(p => ({ ...p, bloodGroup: e.target.value }))}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700">Recipient District</label>
                <select
                  id="recipientDistrict"
                  value={formData.recipientDistrict}
                  onChange={handleDistrictChange}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all"
                >
                  <option value="">Select District</option>
                  {districtsList.map((d) => <option key={d.id || d.name} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700">Recipient Upazila</label>
                <select
                  id="recipientUpazila"
                  value={formData.recipientUpazila}
                  onChange={(e) => setFormData(p => ({ ...p, recipientUpazila: e.target.value }))}
                  required
                  disabled={!formData.recipientDistrict}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all disabled:opacity-50"
                >
                  <option value="">Select Upazila</option>
                  {filteredUpazilas.map((u) => <option key={u.id || u.name} value={u.name}>{u.name}</option>)}
                </select>
              </div>

              <TextField className="w-full">
                <label className="text-xs font-semibold text-gray-700">Hospital Name</label>
                <input
                  id="hospitalName"
                  type="text"
                  placeholder="e.g. Dhaka Medical College Hospital"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all"
                />
              </TextField>

              <TextField className="w-full">
                <label className="text-xs font-semibold text-gray-700">Full Address Line</label>
                <input
                  id="fullAddress"
                  type="text"
                  placeholder="e.g. Zahir Raihan Rd, Dhaka"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all"
                />
              </TextField>

              <TextField className="w-full">
                <label className="text-xs font-semibold text-gray-700">Donation Date</label>
                <input
                  id="donationDate"
                  type="date"
                  value={formData.donationDate}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </TextField>

              <TextField className="w-full">
                <label className="text-xs font-semibold text-gray-700">Donation Time</label>
                <input
                  id="donationTime"
                  type="time"
                  value={formData.donationTime}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </TextField>
            </div>

            <div className="w-full mt-5">
              <label className="text-xs font-semibold text-gray-700">Request Message</label>
              <textarea
                id="requestMessage"
                rows={4}
                placeholder="Explain the detailed context here..."
                value={formData.requestMessage}
                onChange={handleInputChange}
                required
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all resize-none"
              />
            </div>

            <Fieldset.Actions className="mt-8 flex justify-end gap-3">
              <Button type="button" variant="light" className="font-bold text-xs" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={loading}
                isDisabled={isBlocked}
                className="font-bold text-xs text-white rounded-xl bg-red-700 shadow-md"
              >
                Request
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
      </div>
    </div>
  );
}
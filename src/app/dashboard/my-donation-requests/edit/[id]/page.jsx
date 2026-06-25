"use client";

import { useState, useEffect } from "react";
import { Form, Fieldset, TextField } from "@heroui/react";
import { GiBlood } from "react-icons/gi";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { protectedFetch, serverMutation } from "@/lib/server";

export default function EditDonationRequest() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = authClient.useSession();
  
  // Data Loading Lifecycle Indicators
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Geo State Containers
  const [districtsList, setDistrictsList] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // Form Fields State Infrastructure
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

  // 1. Initial Load: Fetch Geocoding Records & Existing Request Form Payload
  useEffect(() => {
    const initializePageData = async () => {
      try {
        // Fetch regional geocoding data pools
        const [districtsResponse, upazilasResponse] = await Promise.all([
          fetch("/data/districts.json"),
          fetch("/data/upazilas.json")
        ]);
        const districtsData = await districtsResponse.json();
        const upazilasData = await upazilasResponse.json();

        const rawDistricts = Array.isArray(districtsData) ? districtsData : (districtsData.districts || []);
        const rawUpazilas = Array.isArray(upazilasData) ? upazilasData : (upazilasData.upazilas || []);

        const sortedDistricts = [...rawDistricts].sort((a, b) => a.name.localeCompare(b.name));
        setDistrictsList(sortedDistricts);
        setAllUpazilas(rawUpazilas);

        // Fetch targeting donation details from your Express routing instance
        const response = await protectedFetch(`/api/donation-requests/${id}`);
        const requestData = response?.request || response;

        if (requestData) {
          setFormData({
            recipientName: requestData.recipientName || "",
            recipientDistrict: requestData.recipientDistrict || "",
            recipientUpazila: requestData.recipientUpazila || "",
            hospitalName: requestData.hospitalName || "",
            fullAddress: requestData.fullAddress || "",
            bloodGroup: requestData.bloodGroup || "",
            donationDate: requestData.donationDate || "",
            donationTime: requestData.donationTime || "",
            requestMessage: requestData.requestMessage || "",
          });

          // Pre-populate cascade dependency mapping for upazilas
          const currentDistrictObj = sortedDistricts.find(d => d.name === requestData.recipientDistrict);
          if (currentDistrictObj) {
            const relatedUpazilas = rawUpazilas.filter(u => u.district_id === currentDistrictObj.id);
            setFilteredUpazilas([...relatedUpazilas].sort((a, b) => a.name.localeCompare(b.name)));
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to recover entry dataset logs.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      initializePageData();
    }
  }, [id]);

  // 2. Cascade Handler on District Selection Change
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

  // 3. Dispatch Updated Parameters payload back to REST endpoint via PUT or PATCH
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Maps back directly to your Express route logic: PUT /api/donation-requests/:id
      const result = await serverMutation(`/api/donation-requests/${id}`, formData, "PUT");

      if (result.success) {
        toast.success("Donation request modified successfully.");
        router.push("/dashboard/my-donation-requests");
        router.refresh();
      } else {
        throw new Error(result.message || "Request validation failed inside cluster database layers.");
      }
    } catch (err) {
      toast.error(err.message || "An transmission pipeline execution error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center gap-3">
        <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Syncing Selected Field Matrix...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <GiBlood className="text-amber-500 w-6 h-6" /> Edit Donation Request
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Modify and update tracking parameters for this emergency requisition file.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <Form onSubmit={handleSubmit} className="space-y-6">
          <Fieldset>
            
            {/* Read-Only Verified Identities Section */}
            <Fieldset.Legend className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Requester Profile Meta Logs
            </Fieldset.Legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-6">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-400">Requester Name</label>
                <input
                  type="text"
                  value={session?.user?.name || ""}
                  readOnly
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-400 cursor-not-allowed outline-none font-medium"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-400">Requester Email</label>
                <input
                  type="text"
                  value={session?.user?.email || ""}
                  readOnly
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-400 cursor-not-allowed outline-none font-medium"
                />
              </div>
            </div>

            <Fieldset.Legend className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Recipient & Case Information Form Fields
            </Fieldset.Legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              
              <TextField className="w-full">
                <label className="text-xs font-semibold text-gray-700">Recipient Name</label>
                <input
                  id="recipientName"
                  type="text"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all font-medium"
                />
              </TextField>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700">Blood Group</label>
                <select
                  id="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData(p => ({ ...p, bloodGroup: e.target.value }))}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all font-bold text-gray-700"
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
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all font-medium"
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
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all disabled:opacity-50 font-medium"
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
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all font-medium"
                />
              </TextField>

              <TextField className="w-full">
                <label className="text-xs font-semibold text-gray-700">Full Address Line</label>
                <input
                  id="fullAddress"
                  type="text"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all font-medium"
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
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 font-medium"
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
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 font-medium"
                />
              </TextField>
            </div>

            <div className="w-full mt-5">
              <label className="text-xs font-semibold text-gray-700">Request Message</label>
              <textarea
                id="requestMessage"
                rows={4}
                value={formData.requestMessage}
                onChange={handleInputChange}
                required
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:border-red-600 transition-all resize-none font-medium"
              />
            </div>

            <Fieldset.Actions className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 font-bold text-xs text-white rounded-xl bg-amber-500 hover:bg-amber-600 transition-all shadow-sm disabled:opacity-50"
              >
                {submitting ? "Updating Data Matrix..." : "Update Donation Request"}
              </button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
      </div>
    </div>
  );
}
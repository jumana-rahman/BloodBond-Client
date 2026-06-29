"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaTint,
  FaMapMarkerAlt,
  FaUser,
  FaSpinner,
} from "react-icons/fa";

import { useGeoData } from "@/hooks/useGeoData";
import { searchDonorsAction } from "@/lib/action/search.action";
import Image from "next/image";

export default function SearchPage() {
  // 1. Load Geo Data
  const {
    districts,
    getUpazilasByDistrict,
    loading: geoLoading,
  } = useGeoData();

  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // 2. Form State
  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  // 3. Handle Input Changes (Reset Upazila if District changes)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "district") {
        newData.upazila = "";
      }
      return newData;
    });
  };

  // 4. Handle Search Submit
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    try {
      const result = await searchDonorsAction(formData);
      if (result.success) {
        setDonors(result.data);
        if (result.data.length === 0) {
          toast.info("No donors found matching your criteria.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to search donors");
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  // 5. Calculate filtered Upazilas based on selected District ID
  const filteredUpazilas = getUpazilasByDistrict(formData.district);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Search <span className="text-red-600">Blood Donors</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Find life-saving donors in your area instantly
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* District (Passes ID to backend) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="">Select District</option>
                {geoLoading ? (
                  <option disabled>Loading districts...</option>
                ) : (
                  districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Upazila (Passes ID to backend) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upazila / Area
              </label>
              <select
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                disabled={!formData.district || geoLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              {!formData.district && (
                <p className="text-xs text-gray-400 mt-1">
                  Select a district first
                </p>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              disabled={loading || geoLoading}
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md shadow-red-500/20 disabled:opacity-70"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              {loading ? "Searching..." : "Search Donors"}
            </button>
          </div>
        </form>

        {/* Results Section */}
        <div>
          {/* Empty State */}
          {!hasSearched && (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-4">
                <FaSearch className="text-red-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">
                Search for Donors
              </h3>
              <p className="text-gray-400 mt-1">
                Select your criteria above and click Search to find matching
                donors.
              </p>
            </div>
          )}

          {/* No Results Found */}
          {hasSearched && donors.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 text-lg">
                No donors found matching your search.
              </p>
            </div>
          )}

          {/* Donor Grid Results */}
          {hasSearched && donors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor, index) => (
                <div
                  key={donor._id || index}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Top Section: User Info & Blood Group */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar Image (Using DB image) */}
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-red-50 border border-gray-200 relative">
                        {donor.image ? (
                          <Image
                            src={donor.image}
                            alt={donor.name || "Donor"}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          // Fallback if no image exists in DB
                          <div className="w-full h-full flex items-center justify-center text-red-400">
                            <FaUser size={20} />
                          </div>
                        )}
                      </div>

                      {/* Name and Email */}
                      <div className="flex flex-col">
                        <h3 className="font-bold text-gray-900 text-base leading-tight">
                          {donor.name || "Anonymous Donor"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">
                          {donor.email}
                        </p>
                      </div>
                    </div>

                    {/* Blood Badge */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm shrink-0 ml-2">
                      <FaTint className="mr-1.5 text-[10px]" />{" "}
                      {donor.bloodGroup}
                    </span>
                  </div>

                  {/* Bottom Section: Divider + Location/Phone */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
                    {/* Location */}
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-red-500 text-xs w-4 shrink-0" />
                      <span>
                        {donor.districtName || "N/A"},{" "}
                        {donor.upazilaName || "N/A"}
                      </span>
                    </div>
                    {/* Phone */}
                    {donor.phone && (
                      <div className="flex items-center gap-2.5 text-sm text-gray-600">
                        <span className="text-red-500 font-bold text-xs w-4 shrink-0">
                          📞
                        </span>
                        <span>{donor.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

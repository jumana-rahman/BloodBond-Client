"use client";

import { useState } from "react";
import { Select, SelectItem, Card, CardBody, Avatar, Chip } from "@heroui/react";
import { MagnifyingGlass, MapPin, Envelope, Phone, ShieldCheck } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { protectedFetch } from "@/lib/server";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Placeholder geographic structures — substitute with your real location lists if necessary
const DISTRICTS = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"];
const UPAZILAS_BY_DISTRICT = {
  Dhaka: ["Mirpur", "Uttara", "Gulshan", "Dhanmondi", "Savar"],
  Chittagong: ["Panchlaish", "Double Mooring", "Hathazari", "Anwara"],
  Sylhet: ["Beanibazar", "Golapganj", "Fenchuganj"],
  Rajshahi: ["Boalia", "Rajpara", "Puthia"],
};

export default function PublicDonorSearch() {
  // Query Form Parameters state variables
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  // Search Results Tracking Matrix Pipelines
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!bloodGroup || !district || !upazila) {
      toast.warning("Please specify all search criteria fields.");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // Compiles structural constraints onto API request parameters securely
      const queryParams = new URLSearchParams({
        bloodGroup,
        district,
        upazila,
      }).toString();

      const data = await protectedFetch(`/api/public-donors/search?${queryParams}`);
      setDonors(data.donors || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to query target donor system network registry entries.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen animate-fade-in">
      
      {/* Informative Grid Context Section Text Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Find Available Blood Donors
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
          Search the live verified organization network registry directory database. Profiles are masked and protected by privacy protocols by default.
        </p>
      </div>

      {/* Primary Parametric Search Filtration Component Form Panel Sheet */}
      <Card shadow="none" className="bg-white border border-gray-100 rounded-3xl shadow-sm max-w-4xl mx-auto">
        <CardBody className="p-6 md:p-8">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            
            {/* Blood Group Matrix Constraint Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Blood Group</label>
              <Select
                placeholder="Select Blood Group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                radius="xl"
                variant="flat"
                required
              >
                {BLOOD_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Targeted Registry District Location Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target District</label>
              <Select
                placeholder="Select District"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setUpazila(""); // Reset current sub-district parameter selection cleanly 
                }}
                radius="xl"
                variant="flat"
                required
              >
                {DISTRICTS.map((dist) => (
                  <SelectItem key={dist} value={dist}>
                    {dist}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Dynamic Localized Upazila Selector Block Element */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Upazila</label>
              <Select
                placeholder="Select Upazila"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                disabled={!district}
                radius="xl"
                variant="flat"
                required
              >
                {(UPAZILAS_BY_DISTRICT[district] || []).map((subDist) => (
                  <SelectItem key={subDist} value={subDist}>
                    {subDist}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Submit Action Query Operations Execution Anchor Button */}
            <div className="md:col-span-3 pt-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-w-[200px] h-12 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <MagnifyingGlass className="w-4 h-4" />
                Search Directory Ledger
              </button>
            </div>

          </form>
        </CardBody>
      </Card>

      {/* --- Dynamic Content Area (Empty, Loading, or Grid Presentation) --- */}
      <div className="pt-4">
        {loading ? (
          <div className="h-[30vh] flex flex-col justify-center items-center gap-2">
            <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Scanning Network Arrays...</span>
          </div>
        ) : !hasSearched ? (
          /* Default Empty State Condition: No donor details visible before query submission */
          <div className="text-center text-gray-400 max-w-sm mx-auto space-y-2 py-8">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Database Context Masked</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Specify system filtration metrics above to extract matched community blood donor nodes.
              </p>
            </div>
          </div>
        ) : donors.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm space-y-2">
            <p className="text-sm font-bold text-gray-700">No Matched Donors Matched</p>
            <p className="text-xs text-gray-400">There are currently no active system participants registered with those exact matrix credentials.</p>
          </div>
        ) : (
          /* Responsive Presentation Grid display mapping parameters */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
              <Card key={donor._id} shadow="none" className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <CardBody className="p-6 space-y-5">
                  
                  {/* Donor Avatar Profile & Verified Status Header Elements */}
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={donor.name}
                      src={donor.avatarUrl}
                      className="w-12 h-12 font-black text-sm text-gray-700 bg-gray-100 shrink-0 rounded-2xl border border-gray-200"
                    />
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="text-sm font-black text-gray-900 truncate">{donor.name}</div>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider inline-block">
                        Active Node
                      </span>
                    </div>
                    <Chip size="md" variant="flat" color="danger" className="font-black text-xs px-2.5 h-7 rounded-xl shrink-0">
                      {donor.bloodGroup || bloodGroup}
                    </Chip>
                  </div>

                  {/* Location Coordinate Blocks Mapping Parameters */}
                  <div className="bg-gray-50/50 rounded-2xl p-3.5 flex items-start gap-2.5 border border-gray-100/50">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div className="text-xs font-semibold text-gray-600 leading-relaxed">
                      <span className="text-gray-400 block font-bold text-[10px] uppercase tracking-wider mb-0.5">Primary Location Matrix</span>
                      {donor.upazila || upazila}, {donor.district || district}
                    </div>
                  </div>

                  {/* Private Protected Contact Parameters Channels Grid */}
                  <div className="space-y-2 pt-1 border-t border-gray-50 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Envelope className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{donor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{donor.phoneNumber || "Not explicitly published"}</span>
                    </div>
                  </div>

                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
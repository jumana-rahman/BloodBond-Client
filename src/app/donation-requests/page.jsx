"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Chip, Card, CardBody } from "@heroui/react";
import { Clock, Calendar, Person, MapPin, Eye } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { protectedFetch } from "@/lib/core/server";

export default function PublicDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      // Fetch only the pending cross-network blood requests
      const data = await protectedFetch("/api/public-donation-requests?status=pending");
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync system pending request matrices.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 min-h-screen animate-fade-in">
      
      {/* Page Context Description Text Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Active Blood Requisitions
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
          Review emergency alerts across localized system networks. Step forward to assign yourself or share to coordinate donor response matrices.
        </p>
      </div>

      {/* Main Core Loading / Grid Representation Box */}
      {loading ? (
        <div className="h-[40vh] flex flex-col justify-center items-center gap-2">
          <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Compiling Pending Ledger...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm space-y-2">
          <p className="text-sm font-bold text-gray-700">All Requisitions Fulfilled</p>
          <p className="text-xs text-gray-400">There are currently no pending emergency blood requests active in the system database layer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <Card key={req._id} shadow="none" className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              <CardBody className="p-6 space-y-5">
                
                {/* Header Information: Recipient profile information and targeted Blood Group Matrix Variable */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Recipient Profile</span>
                    <div className="flex items-center gap-1.5 text-gray-900 font-black text-base">
                      <Person className="w-4 h-4 text-gray-400" />
                      {req.recipientName}
                    </div>
                  </div>
                  <Chip size="md" variant="flat" color="danger" className="font-black text-xs px-2.5 h-7 rounded-xl">
                    {req.bloodGroup}
                  </Chip>
                </div>

                {/* Location Grid Coordination Section */}
                <div className="bg-gray-50/50 rounded-2xl p-3.5 flex items-start gap-2.5 border border-gray-100/50">
                  <MapPin className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <div className="text-xs font-semibold text-gray-600 leading-relaxed">
                    <span className="text-gray-400 block font-bold text-[10px] uppercase tracking-wider mb-0.5">Donation Facility Location</span>
                    {req.hospitalName}, {req.recipientUpazila}, {req.recipientDistrict}
                  </div>
                </div>

                {/* Date & Time Constraints Presentation Metrics Row */}
                <div className="grid grid-cols-2 gap-3 border-t border-b border-gray-50 py-3.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Required Date</span>
                      <span className="text-xs font-bold text-gray-700">{req.donationDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Target Time</span>
                      <span className="text-xs font-bold text-gray-700">{req.donationTime}</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Dynamic Redirect Trigger Action Anchor */}
                <Link
                  href={`/donation-requests/${req._id}`}
                  className="w-full h-10 bg-gray-900 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group-hover:shadow"
                >
                  <Eye className="w-4 h-4" />
                  View Details Node
                </Link>

              </CardBody>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
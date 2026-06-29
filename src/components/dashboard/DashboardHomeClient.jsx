"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { TrashBin, Pencil, Person, FileText, CreditCard } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { getDashboardStats } from "@/lib/api/admin";
import { getMyDonationRequests } from "@/lib/api/donationRequests";
import {
  deleteDonationRequest,
  updateDonationRequestStatus,
} from "@/lib/actions/donationRequests"; 

export default function DashboardHomeClient({ initialUser }) {
  const userRole = initialUser?.role || "donor";

  // Data states
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalDonors: 0, totalFunding: 0, totalRequests: 0 });
  
  // Loading indicators
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Safely execute data fetching on the client loop
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      if (userRole === "donor") {
        const data = await getMyDonationRequests(1, 3);
        setRequests(data?.requests || []);
      } else {
        const statData = await getDashboardStats();
        if (statData) setStats(statData);
      }
    } catch (err) {
      console.error("Dashboard client sync failure:", err);
      toast.error("Failed to sync platform metrics database entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUser) {
      loadDashboardData();
    }
  }, [initialUser, userRole]);

  const handleUpdateStatus = async (id, targetStatus) => {
    setActionLoading(true);
    try {
      await updateDonationRequestStatus(id, targetStatus);
      toast.success(`Request status updated to ${targetStatus}`);
      await loadDashboardData(); // Refresh logs
    } catch (err) {
      toast.error("Status migration rejected by backend parameters.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteTargetId) return;
    setActionLoading(true);
    try {
      await deleteDonationRequest(deleteTargetId);
      toast.success("Query purged from registry workflows successfully.");
      setDeleteTargetId(null);
      await loadDashboardData(); // Refresh logs
    } catch (err) {
      toast.error("Deletion pipeline encountered failure error.");
    } finally {
      setActionLoading(false);
    }
  };

  const statusColorMap = {
    pending: "warning",
    inprogress: "primary",
    done: "success",
    canceled: "danger",
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex flex-col justify-center items-center gap-2">
        <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold uppercase text-gray-400 tracking-widest">Loading Workspace Logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Welcome back, {initialUser?.name || "User Workspace"}
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
            System Access Node: {initialUser?.email}
          </p>
        </div>
        <Chip size="sm" className="font-bold text-xs uppercase tracking-wider px-3 py-1 bg-red-50 text-red-700 rounded-xl">
          Role: {userRole}
        </Chip>
      </div>

      {/* VIEW A: DONOR WORKSPACE VIEW */}
      {userRole === "donor" && (
        <>
          {requests.length > 0 ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  Recent Donation Requests
                </h2>
                <p className="text-xs text-gray-400">Your maximum 3 most recent blood requisition instances.</p>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table aria-label="Recent Requests Tabular View" className="min-w-full">
                    <TableHeader>
                      <TableColumn className="font-bold text-xs">RECIPIENT NAME</TableColumn>
                      <TableColumn className="font-bold text-xs">RECIPIENT LOCATION</TableColumn>
                      <TableColumn className="font-bold text-xs">DONATION DATE</TableColumn>
                      <TableColumn className="font-bold text-xs">DONATION TIME</TableColumn>
                      <TableColumn className="font-bold text-xs">BLOOD GROUP</TableColumn>
                      <TableColumn className="font-bold text-xs">DONATION STATUS</TableColumn>
                      <TableColumn className="font-bold text-xs text-center">CONTROLS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {requests.map((req) => (
                        <TableRow key={req._id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                          <TableCell>
                            <div className="font-bold text-gray-900 text-sm">{req.recipientName}</div>
                            {req.status === "inprogress" && req.donorInfo && (
                              <div className="text-[11px] text-blue-800 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg mt-1 font-medium max-w-xs">
                                <span className="font-bold">Donor:</span> {req.donorInfo.name} ({req.donorInfo.email})
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-gray-600">
                            {req.recipientUpazila}, {req.recipientDistrict}
                          </TableCell>
                          <TableCell className="text-sm font-bold text-gray-700">{req.donationDate}</TableCell>
                          <TableCell className="text-sm font-medium text-gray-500">{req.donationTime}</TableCell>
                          <TableCell>
                            <Chip size="sm" className="font-extrabold text-xs bg-red-50 text-red-700 rounded-md">
                              {req.bloodGroup}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Chip variant="dot" color={statusColorMap[req.status]} className="capitalize font-bold text-xs">
                              {req.status}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              {req.status === "inprogress" && (
                                <>
                                  <button
                                    disabled={actionLoading}
                                    onClick={() => handleUpdateStatus(req._id, "done")}
                                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
                                  >
                                    Done
                                  </button>
                                  <button
                                    disabled={actionLoading}
                                    onClick={() => handleUpdateStatus(req._id, "canceled")}
                                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              <Link
                                href={`/dashboard/my-donation-requests/edit/${req._id}`}
                                className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-colors flex items-center justify-center"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                              <button
                                disabled={actionLoading}
                                onClick={() => setDeleteTargetId(req._id)}
                                className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors flex items-center justify-center"
                              >
                                <TrashBin className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-start pt-2">
                <Link
                  href="/dashboard/my-donation-requests"
                  className="px-5 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition-all inline-block"
                >
                  View All Requests
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">No history records found.</p>
            </div>
          )}
        </>
      )}

      {/* VIEW B: PRIVILEGED SUMMARY VIEW (Admin & Volunteer) */}
      {userRole !== "donor" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-700 rounded-xl">
              <Person className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{stats.totalDonors || 0}</div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Donors</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">${stats.totalFunding || 0}</div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Funding</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{stats.totalRequests || 0}</div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Donation Requests</div>
            </div>
          </div>
        </div>
      )}

      {/* Safeguard Overlay Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <h4 className="text-base font-black text-gray-900 tracking-tight">Confirm Deletion Registry Pipeline</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Are you sure you want to permanently delete this requisition registry instance? This step cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                disabled={actionLoading}
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Abort
              </button>
              <button
                disabled={actionLoading}
                onClick={handleDeleteRequest}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl transition-all"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
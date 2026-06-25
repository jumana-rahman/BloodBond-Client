"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { Funnel, CircleCheck } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { protectedFetch, serverMutation } from "@/lib/server";

export default function AllBloodDonationRequests() {
  const { data: session } = authClient.useSession();
  const userRole = session?.user?.role;

  // Table & Filtering Pipeline States
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const limit = 10;

  // Action Lifecycle Status
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAllRequests();
  }, [currentPage, statusFilter]);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      // Calls your global request tracking dataset router
      let queryPath = `/api/all-donation-requests?page=${currentPage}&limit=${limit}`;
      if (statusFilter) {
        queryPath += `&status=${statusFilter}`;
      }
      
      const data = await protectedFetch(queryPath);
      setRequests(data.requests || []);
      setTotalRequests(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to recover systemic request registry matrices.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, targetStatus) => {
    setActionLoading(true);
    try {
      // Volunteers can perform status patch updates securely
      await serverMutation(`/api/donation-requests/${id}/status`, { status: targetStatus }, "PATCH");
      toast.success(`Request status updated safely to ${targetStatus}`);
      fetchAllRequests();
    } catch (err) {
      toast.error("Status update rejection returned by core server clusters.");
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

  const totalPages = Math.ceil(totalRequests / limit);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Context Control Headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            All Blood Donation Requests
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Systemic tracking network monitoring node. Privileges configured: <span className="font-bold underline text-amber-600">{userRole}</span>
          </p>
        </div>

        {/* Global Filter Trigger Dropdown */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm self-start sm:self-center">
          <Funnel className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs font-bold text-gray-600 bg-transparent outline-none cursor-pointer"
          >
            <option value="">All Status Records</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Primary Global Grid Layout Sheet Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-[40vh] flex flex-col justify-center items-center gap-2">
            <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Compiling Records Grid...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="h-[40vh] flex flex-col justify-center items-center text-center p-6 space-y-1">
            <span className="text-xl">📊</span>
            <div className="text-sm font-bold text-gray-700">Empty Request Buffer</div>
            <p className="text-xs text-gray-400">No cross-network blood requests match this filter state.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table aria-label="Volunteer Management Audit View Table" removeWrapper shadow="none" className="min-w-full">
                <TableHeader>
                  <TableColumn className="font-bold text-xs">REQUESTER DETAILS</TableColumn>
                  <TableColumn className="font-bold text-xs">RECIPIENT NAME</TableColumn>
                  <TableColumn className="font-bold text-xs">LOCATION (DISTRICT/UPAZILA)</TableColumn>
                  <TableColumn className="font-bold text-xs">TARGET TIMELINE</TableColumn>
                  <TableColumn className="font-bold text-xs">BLOOD GROUP</TableColumn>
                  <TableColumn className="font-bold text-xs">STATUS STATE</TableColumn>
                  <TableColumn className="font-bold text-xs text-center">VOLUNTEER CONTROLS</TableColumn>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      
                      {/* Requester Account Log Details */}
                      <TableCell>
                        <div className="font-bold text-gray-800 text-sm">{req.requesterName}</div>
                        <div className="text-[11px] text-gray-400 font-medium">{req.requesterEmail}</div>
                      </TableCell>

                      {/* Recipient Contact Name Column */}
                      <TableCell>
                        <div className="font-semibold text-gray-900 text-sm">{req.recipientName}</div>
                        {req.status === "inprogress" && req.donorInfo && (
                          <div className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                            Assigned Donor: {req.donorInfo.name}
                          </div>
                        )}
                      </TableCell>

                      {/* Regional Tracking Coordinates */}
                      <TableCell className="text-sm font-medium text-gray-600">
                        {req.recipientUpazila}, {req.recipientDistrict}
                      </TableCell>

                      {/* Timeline Constraints Parameters */}
                      <TableCell>
                        <div className="text-sm font-bold text-gray-700">{req.donationDate}</div>
                        <div className="text-xs text-gray-400 font-medium">{req.donationTime}</div>
                      </TableCell>

                      {/* Target Blood Matrix Variable */}
                      <TableCell>
                        <Chip size="sm" variant="flat" color="danger" className="font-extrabold text-xs">
                          {req.bloodGroup}
                        </Chip>
                      </TableCell>

                      {/* System State Chips */}
                      <TableCell>
                        <Chip variant="dot" color={statusColorMap[req.status]} className="capitalize font-bold text-xs">
                          {req.status}
                        </Chip>
                      </TableCell>

                      {/* Volunteer Controls (Restricted solely to changing inprogress lifecycles) */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-1.5">
                          {req.status === "inprogress" ? (
                            <>
                              <button
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(req._id, "done")}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors disabled:opacity-50"
                              >
                                Done
                              </button>
                              <button
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(req._id, "canceled")}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg transition-colors disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1">
                              <CircleCheck className="w-3.5 h-3.5" /> No Action Required
                            </span>
                          )}
                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Custom Pagination Footer Controllers Component */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/30">
                <span className="text-xs font-bold text-gray-400">
                  Page {currentPage} of {totalPages} ({totalRequests} Active queries synced)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
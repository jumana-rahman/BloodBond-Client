"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Chip 
} from "@heroui/react";
import { GiBlood } from "react-icons/gi";
import { toast } from "react-toastify";
import Link from "next/link";
import { protectedFetch, serverMutation } from "@/lib/core/server";

export default function MyDonationRequests() {
  // Pagination & Filter States
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const limit = 5; // Total records displayed per pagination window step

  // Modals & Action State Trackers
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let queryPath = `/api/my-donation-requests?page=${currentPage}&limit=${limit}`;
      if (statusFilter) {
        queryPath += `&status=${statusFilter}`;
      }

      const data = await protectedFetch(queryPath);
      setRequests(data.requests || []);
      setTotalRequests(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync historical donation records.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, targetStatus) => {
    setActionLoading(true);
    try {
      await serverMutation(`/api/donation-requests/${id}/status`, { status: targetStatus }, "PATCH");
      toast.success(`Request status updated to ${targetStatus}.`);
      fetchRequests();
    } catch (err) {
      toast.error("Status transition rejected by server parameters.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteTargetId) return;
    setActionLoading(true);
    try {
      await serverMutation(`/api/donation-requests/${deleteTargetId}`, {}, "DELETE");
      toast.success("Donation query deleted successfully.");
      setDeleteTargetId(null);
      fetchRequests();
    } catch (err) {
      toast.error("Deletion cycle encountered a pipeline exception.");
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
      
      {/* Upper Content Controller Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <GiBlood className="text-red-700 w-6 h-6" /> My Donation Requests
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage, filter, and monitor all personal emergency blood requisitions.
          </p>
        </div>

        {/* Requirements Metric Status Filter Selector */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Flush back to step 1 on state rewrite
            }}
            className="px-3 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-700 transition-all"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Primary Tabular Interface Frame Workspace */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-[40vh] flex flex-col justify-center items-center gap-2">
            <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Querying System Matrix...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="h-[40vh] flex flex-col justify-center items-center text-center p-6 space-y-2">
            <span className="text-2xl">📬</span>
            <div className="text-sm font-bold text-gray-700">No Requisitions Found</div>
            <p className="text-xs text-gray-400 max-w-xs">No current donation records match the chosen status criteria filter.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table aria-label="Donation Requisitions Audit Table" removeWrapper shadow="none" className="min-w-full">
                <TableHeader>
                  <TableColumn className="font-bold text-xs">RECIPIENT</TableColumn>
                  <TableColumn className="font-bold text-xs">LOCATION</TableColumn>
                  <TableColumn className="font-bold text-xs">DATE & TIME</TableColumn>
                  <TableColumn className="font-bold text-xs">GROUP</TableColumn>
                  <TableColumn className="font-bold text-xs">STATUS</TableColumn>
                  <TableColumn className="font-bold text-xs text-center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req._id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                      <TableCell>
                        <div className="font-bold text-gray-900 text-sm">{req.recipientName}</div>
                        {req.status === "inprogress" && req.donorInfo && (
                          <div className="text-[11px] text-blue-800 bg-blue-50/60 px-2 py-0.5 rounded-md mt-1 inline-block font-medium">
                            🧑‍⚕️ Donor: {req.donorInfo.name} ({req.donorInfo.email})
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-gray-600">
                        {req.recipientUpazila}, {req.recipientDistrict}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-bold text-gray-700">{req.donationDate}</div>
                        <div className="text-xs text-gray-400 font-medium">{req.donationTime}</div>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color="danger" className="font-extrabold text-xs">
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
                          
                          {/* Done & Cancel status toggles only showing when layout state is inprogress */}
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

                          {/* Pure Semantic HTML Elements without any component nesting */}
                          <Link 
                            href={`/dashboard/donation-requests/edit/${req._id}`}
                            className="px-2.5 py-1.5 hover:bg-gray-100 text-amber-600 font-bold text-xs rounded-xl transition-colors"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => setDeleteTargetId(req._id)}
                            className="px-2.5 py-1.5 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Custom Semantic Pagination Controllers Footer View */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/40">
                <span className="text-xs font-bold text-gray-400">
                  Page {currentPage} of {totalPages} ({totalRequests} Entries captured)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Safeguard Backdrop Box Overlay */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4 animate-scale-up">
            <h4 className="text-base font-black text-gray-900 tracking-tight">Erase Donation Query</h4>
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
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-md transition-all"
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
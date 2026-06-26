"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { Funnel, CircleCheck, Pencil, Trash } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { getAllDonationRequests } from "@/lib/api/admin";

import {
  updateDonationRequestStatus,
  deleteDonationRequest,
} from "@/lib/actions/donationRequests";

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
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    fetchAllRequests();
  }, [currentPage, statusFilter]);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      let queryPath = `/api/all-donation-requests?page=${currentPage}&limit=${limit}`;
      if (statusFilter) {
        queryPath += `&status=${statusFilter}`;
      }
      
      const data = await getAllDonationRequests({
        page: currentPage,
        limit,
        status: statusFilter,
      });
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
      await updateDonationRequestStatus(id, targetStatus);
      toast.success(`Request status updated safely to ${targetStatus}`);
      fetchAllRequests();
    } catch (err) {
      toast.error("Status update rejection returned by core server clusters.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteTargetId) return;
    setActionLoading(true);
    try {
      await deleteDonationRequest(deleteTargetId);
      toast.success("Blood requisition cleared from database pools successfully.");
      setDeleteTargetId(null);
      fetchAllRequests();
    } catch (err) {
      toast.error("Server cluster rejected deletion workflow parameters.");
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
            Systemic tracking network monitoring node. Privileges configured: <span className="font-bold underline text-amber-600 capitalize">{userRole}</span>
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
            <div className="text-sm font-bold text-gray-700">Empty Request Buffer</div>
            <p className="text-xs text-gray-400">No cross-network blood requests match this filter state.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table aria-label="Management Audit View Table" removeWrapper shadow="none" className="min-w-full">
                <TableHeader>
                  <TableColumn className="font-bold text-xs">REQUESTER DETAILS</TableColumn>
                  <TableColumn className="font-bold text-xs">RECIPIENT NAME</TableColumn>
                  <TableColumn className="font-bold text-xs">LOCATION (DISTRICT/UPAZILA)</TableColumn>
                  <TableColumn className="font-bold text-xs">TARGET TIMELINE</TableColumn>
                  <TableColumn className="font-bold text-xs">BLOOD GROUP</TableColumn>
                  <TableColumn className="font-bold text-xs">STATUS STATE</TableColumn>
                  <TableColumn className="font-bold text-xs text-center">MANAGEMENT CONTROLS</TableColumn>
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

                      {/* Dynamic Management Controls Section based on Admin or Volunteer Role */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* Shared Feature: Both Volunteer & Admin can update status if 'inprogress' */}
                          {req.status === "inprogress" && (
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
                          )}

                          {/* Admin Privileged Actions: Full Edit and Delete capability */}
                          {userRole === "admin" && (
                            <>
                              <Link
                                href={`/dashboard/my-donation-requests/edit/${req._id}`}
                                className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-colors flex items-center justify-center"
                                title="Edit Request Parameters"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => setDeleteTargetId(req._id)}
                                className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors flex items-center justify-center"
                                title="Delete Request File"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Restrict message for volunteers when no actions are available */}
                          {userRole !== "admin" && req.status !== "inprogress" && (
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

      {/* Confirmation Safeguard Backdrop Box Overlay for Admins */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4 animate-scale-up">
            <h4 className="text-base font-black text-gray-900 tracking-tight">Confirm Deletion Registry Pipeline</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Are you sure you want to permanently delete this blood requisition registry instance? This step cannot be undone.
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
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { Eye, Trash, Pencil } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { protectedFetch, serverMutation } from "@/lib/server";

export default function DashboardHome() {
  const { data: session } = authClient.useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Fetch only the top 3 maximum recent donation requests created by this donor
  const fetchRecentRequests = async () => {
    try {
      const data = await protectedFetch("/api/my-donation-requests?limit=3&page=1");
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch historical database entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentRequests();
  }, []);

  const handleUpdateStatus = async (id, targetStatus) => {
    setActionLoading(true);
    try {
      await serverMutation(`/api/donation-requests/${id}/status`, { status: targetStatus }, "PATCH");
      toast.success(`Request status updated to ${targetStatus}`);
      fetchRecentRequests();
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
      await serverMutation(`/api/donation-requests/${deleteTargetId}`, {}, "DELETE");
      toast.success("Query purged from registry workflows successfully.");
      setDeleteTargetId(null);
      fetchRecentRequests();
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
      
      {/* Welcome Message Section displaying user's logged-in name */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          Welcome back, {session?.user?.name || "Donor Workspace"}
        </h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
          System Access Node: {session?.user?.email}
        </p>
      </div>

      {/* Hidden Section Rule: If the user has not made any donation request yet, this section will be hidden */}
      {requests.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              Recent Donation Requests
            </h2>
            <p className="text-xs text-gray-400">
              Your maximum 3 most recent blood requisition instances.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table aria-label="Recent Requests Tabular View" removeWrapper shadow="none" className="min-w-full">
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
                      
                      {/* Recipient Name Column with Donor Info display when 'inprogress' */}
                      <TableCell>
                        <div className="font-bold text-gray-900 text-sm">{req.recipientName}</div>
                        {req.status === "inprogress" && req.donorInfo && (
                          <div className="text-[11px] text-blue-800 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg mt-1 font-medium max-w-xs">
                            <span className="font-bold">Donor:</span> {req.donorInfo.name} ({req.donorInfo.email})
                          </div>
                        )}
                      </TableCell>

                      {/* Recipient Location Column showing only district and upazila */}
                      <TableCell className="text-sm font-semibold text-gray-600">
                        {req.recipientUpazila}, {req.recipientDistrict}
                      </TableCell>

                      {/* Donation Date Column */}
                      <TableCell className="text-sm font-bold text-gray-700">
                        {req.donationDate}
                      </TableCell>

                      {/* Donation Time Column */}
                      <TableCell className="text-sm font-medium text-gray-500">
                        {req.donationTime}
                      </TableCell>

                      {/* Blood Group Column */}
                      <TableCell>
                        <Chip size="sm" variant="flat" color="danger" className="font-extrabold text-xs">
                          {req.bloodGroup}
                        </Chip>
                      </TableCell>

                      {/* Donation Status Column */}
                      <TableCell>
                        <Chip variant="dot" color={statusColorMap[req.status]} className="capitalize font-bold text-xs">
                          {req.status}
                        </Chip>
                      </TableCell>

                      {/* Controls Management Column */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* Done and Cancel toggle switches are visible ONLY while status is inprogress */}
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

                          {/* View Button */}
                          <Link
                            href={`/dashboard/my-donation-requests/details/${req._id}`}
                            className="p-2 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors flex items-center justify-center"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Edit Button redirection */}
                          <Link
                            href={`/dashboard/my-donation-requests/edit/${req._id}`}
                            className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-colors flex items-center justify-center"
                            title="Edit Requisition"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>

                          {/* Delete Button with structural state handler assignment */}
                          <button
                            onClick={() => setDeleteTargetId(req._id)}
                            className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors flex items-center justify-center"
                            title="Delete Request"
                          >
                            <Trash className="w-4 h-4" />
                          </button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* View My All Request Navigation Link Button */}
          <div className="flex justify-start pt-2">
            <Link
              href="/dashboard/my-donation-requests"
              className="px-5 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition-all shadow-sm inline-block"
            >
              View My All Request
            </Link>
          </div>
        </div>
      )}

      {/* Confirmation Safeguard Backdrop Box Overlay */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4 animate-scale-up">
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
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { serverFetch, serverMutation } from "@/lib/core/server";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaArrowRight,
  FaHeartbeat,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function DonorDashboardClient({ userId }) {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch recent requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await serverFetch(
          `/api/donation-requests/recent/${userId}`,
        );
        setRequests(data);
      } catch (error) {
        toast.error("Failed to load donation requests");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  // 2. Handle Status Update (Done / Canceled)
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const session = await authClient.getSession();
      const userId = session?.user?.id || session?.data?.user?.id;
      const role = session?.user?.role || session?.data?.user?.role;

      const response = await serverMutation(
        `/api/donation-requests/${requestId}`,
        { status: newStatus, userId, role },
        "PATCH",
      );

      if (response.success) {
        toast.success(`Request marked as ${newStatus}!`);

        // Re-fetch the list immediately so the UI updates!
        const updatedData = await serverFetch(
          `/api/donation-requests/recent/${userId}`,
        );
        setRequests(updatedData);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  // 3. Open Delete Confirmation Modal
  const openDeleteModal = (requestId) => {
    setDeletingRequestId(requestId);
    setIsDeleteModalOpen(true);
  };

  // 4. Handle Delete Request (Called from Modal)
  const handleDeleteConfirm = async () => {
    if (!deletingRequestId) return;

    try {
      setIsDeleting(true);
      const session = await authClient.getSession();

      // Safe extraction: Check both possible paths!
      const userId = session?.data?.user?.id || session?.user?.id;
      const role = session?.data?.user?.role || session?.user?.role;

      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        setIsDeleting(false);
        return;
      }

      const response = await serverMutation(
        `/api/donation-requests/${deletingRequestId}`,
        { userId, role },
        "DELETE",
      );

      if (response.success) {
        toast.success("Request deleted successfully");
        setRequests((prev) =>
          prev.filter((req) => req._id !== deletingRequestId),
        );
        setIsDeleteModalOpen(false);
        setDeletingRequestId(null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete request");
    } finally {
      setIsDeleting(false);
    }
  };

  // 5. Close Modal without deleting
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingRequestId(null);
  };

  // ── Status Badge Helper ──
  const getStatusBadge = (status) => {
    const config = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <FaClock className="text-xs" />,
      },
      inprogress: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <FaSpinner className="text-xs animate-spin" />,
      },
      done: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <FaCheckCircle className="text-xs" />,
      },
      canceled: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <FaTimesCircle className="text-xs" />,
      },
    };
    return config[status] || config.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }

  // ── EMPTY STATE UI ──
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full mb-4">
          <FaHeartbeat className="text-red-400 text-3xl sm:text-4xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          No Donation Requests Yet
        </h3>
        <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-sm mx-auto">
          You haven&apos;t created any donation requests. Start by creating your
          first request to help save a life.
        </p>
        <Link
          href="/dashboard/donor"
          className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-md shadow-red-500/20"
        >
          Go to Dashboard
          <FaArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // ── DATA VIEW (Table + Mobile Cards) ──
  return (
    <>
      {/* CHANGED: min-w-0 prevents outer overflow */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
        {/* CHANGED: p-4 lg:p-6, text-base lg:text-xl */}
        <div className="p-4 lg:p-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-base lg:text-xl font-semibold text-gray-800">
            Recent Donation Requests
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full shrink-0">
            Showing {requests.length} recent
          </span>
        </div>

        {/* ── DESKTOP TABLE — CHANGED: hidden lg:block (was md) ── */}
        <div className="hidden lg:block overflow-x-auto w-full">
          {/* CHANGED: px-3 lg:px-6 on all cells via th/td below, minWidth for safety */}
          <table
            className="w-full text-sm text-left text-gray-600"
            style={{ minWidth: "700px" }}
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 xl:px-6 py-3">Recipient</th>
                {/* CHANGED: hide Location on lg, show on xl */}
                <th className="px-4 xl:px-6 py-3 hidden xl:table-cell">
                  Location
                </th>
                {/* CHANGED: hide Date on lg, show on xl */}
                <th className="px-4 xl:px-6 py-3 hidden xl:table-cell">
                  Date & Time
                </th>
                <th className="px-4 xl:px-6 py-3">Blood Group</th>
                <th className="px-4 xl:px-6 py-3">Status & Donor</th>
                <th className="px-4 xl:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => {
                const statusBadge = getStatusBadge(req.status);
                return (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 xl:px-6 py-4 font-medium text-gray-900">
                      {/* CHANGED: sub-info shown on lg when location col is hidden */}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate max-w-[160px]">
                          {req.recipientName}
                        </span>
                        <span className="text-xs text-gray-400 xl:hidden mt-0.5 truncate max-w-[160px]">
                          {req.recipientDistrictName},{" "}
                          {req.recipientUpazilaName}
                        </span>
                      </div>
                    </td>
                    {/* CHANGED: hidden xl:table-cell */}
                    <td className="px-4 xl:px-6 py-4 hidden xl:table-cell">
                      <div className="flex flex-col">
                        <span className="text-gray-700">
                          {req.recipientDistrictName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {req.recipientUpazilaName}
                        </span>
                      </div>
                    </td>
                    {/* CHANGED: hidden xl:table-cell */}
                    <td className="px-4 xl:px-6 py-4 hidden xl:table-cell">
                      <div className="flex flex-col">
                        <span className="text-gray-700">
                          {new Date(req.donationDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {req.donationTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 xl:px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 w-fit">
                          {req.bloodGroup}
                        </span>
                        {/* CHANGED: date shown under blood group on lg when date col hidden */}
                        <span className="text-xs text-gray-400 xl:hidden">
                          {new Date(req.donationDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 xl:px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.color} whitespace-nowrap`}
                      >
                        {statusBadge.icon}
                        {req.status}
                      </span>

                      {req.status === "inprogress" && req.donorName && (
                        // CHANGED: max-w + truncate on donor info
                        <div className="mt-1 flex-row items-center gap-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 w-fit inline-flex ">
                          <FaUser
                            className="text-blue-500 shrink-0"
                            size={10}
                          />
                          <span className="font-medium ">{req.donorName}</span>
                          <span className="text-gray-400">
                            ({req.donorEmail})
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 xl:px-6 py-4 text-right">
                      {/* CHANGED: gap-1, flex-nowrap so actions don't wrap on lg */}
                      <div className="flex items-center justify-end gap-1 flex-nowrap">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/edit-donation-request/${req._id}`,
                            )
                          }
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors shrink-0"
                          title="Edit Request"
                        >
                          <FaEdit size={14} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(req._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0"
                          title="Delete Request"
                        >
                          <FaTrash size={14} />
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/donation-requests/${req._id}`)
                          }
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors shrink-0"
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>

                        {req.status === "inprogress" && (
                          <div className="flex gap-0.5 ml-0.5 shrink-0">
                            <button
                              onClick={() =>
                                handleStatusUpdate(req._id, "done")
                              }
                              className="px-1.5 py-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors whitespace-nowrap"
                            >
                              Done
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(req._id, "canceled")
                              }
                              className="px-1.5 py-1 text-[10px] font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors whitespace-nowrap"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS — CHANGED: block lg:hidden (was md) ── */}
        <div className="block lg:hidden divide-y divide-gray-100">
          {requests.map((req) => {
            const statusBadge = getStatusBadge(req.status);
            return (
              <div
                key={req._id}
                className="p-3 sm:p-4 space-y-2.5 hover:bg-gray-50 transition-colors"
              >
                {/* Header: Name & Blood Group */}
                {/* CHANGED: min-w-0 + gap-2 prevents name from pushing badge off */}
                <div className="flex justify-between items-start gap-2 min-w-0">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {req.recipientName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {req.recipientDistrictName}, {req.recipientUpazilaName}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 shrink-0">
                    {req.bloodGroup}
                  </span>
                </div>

                {/* Date & Time — CHANGED: text-xs, removed emoji for cleaner look */}
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                  <span>
                    📅 {new Date(req.donationDate).toLocaleDateString()}
                  </span>
                  <span>⏰ {req.donationTime}</span>
                </div>

                {/* Status & Donor Info */}
                <div className="space-y-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.color}`}
                  >
                    {statusBadge.icon}
                    {req.status}
                  </span>

                  {req.status === "inprogress" && req.donorName && (
                    // CHANGED: max-w + overflow-hidden so long email doesn't blow layout
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-100 w-fit max-w-full overflow-hidden">
                      <FaUser className="text-blue-500 shrink-0" size={11} />
                      <span className="font-medium truncate">
                        {req.donorName}
                      </span>
                      <span className="text-gray-400 truncate ">
                        ({req.donorEmail})
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile Actions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                  {req.status === "inprogress" && (
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleStatusUpdate(req._id, "done")}
                        className="py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-center"
                      >
                        Mark Done
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "canceled")}
                        className="py-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 text-center"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/donor/edit-donation-request/${req._id}`,
                          )
                        }
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={13} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(req._id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={13} />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/donation-requests/${req._id}`)
                        }
                        className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                        title="View"
                      >
                        <FaEye size={13} />
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      #{req._id.slice(-6)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ── */}
        {/* CHANGED: p-4 lg:p-6 */}
        <div className="p-4 lg:p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
          <Link
            href="/dashboard/donor"
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-md shadow-red-500/20"
          >
            View All My Requests
            <FaArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 sm:p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <FaExclamationTriangle className="text-xl sm:text-2xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Delete Request
              </h3>
            </div>

            <p className="text-gray-600 mb-5 sm:mb-6 text-sm">
              Are you sure you want to delete this donation request?
              <br />
              <span className="text-xs sm:text-sm text-gray-400">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex gap-2 sm:gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash size={13} />
                    Delete Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

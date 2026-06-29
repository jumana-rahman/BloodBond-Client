"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { serverFetch, serverMutation } from "@/lib/core/server";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaCheck,
  FaBan,
} from "react-icons/fa";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];

export default function AllRequestsClient({ currentUserRole }) {
  const router = useRouter();

  // State for Data
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const limit = 10;

  // State for Filtering
  const [statusFilter, setStatusFilter] = useState("all");

  // Dropdown State
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = currentUserRole === "admin";

  // 1. Fetch ALL requests with pagination & filter
  const fetchRequests = async (page = 1, status = "all") => {
    try {
      setLoading(true);
      let url = `/api/donation-requests/all?page=${page}&limit=${limit}`;
      if (status && status !== "all") {
        url += `&status=${status}`;
      }

      const response = await serverFetch(url);

      if (response.success) {
        setRequests(response.data);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
        setTotalRequests(response.pagination.totalRequests);
      }
    } catch (error) {
      toast.error("Failed to load donation requests");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  // 2. Handle Status Update
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await serverMutation(
        `/api/donation-requests/${requestId}`,
        { status: newStatus },
        "PATCH",
      );

      if (response.success) {
        toast.success(`Request marked as ${newStatus}!`);
        fetchRequests(currentPage, statusFilter);
        setOpenDropdownId(null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  // 3. Handle Delete Request (ADMIN ONLY)
  const handleDeleteConfirm = async () => {
    if (!deletingRequestId) return;

    try {
      setIsDeleting(true);
      const response = await serverMutation(
        `/api/donation-requests/admin-delete/${deletingRequestId}`,
        { role: "admin" }, // ✅ This satisfies the backend permission check
        "DELETE",
      );

      if (response.success) {
        toast.success("Request deleted successfully");
        fetchRequests(currentPage, statusFilter);
        setIsDeleteModalOpen(false);
        setDeletingRequestId(null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete request");
    } finally {
      setIsDeleting(false);
    }
  };

  // UI Helpers
  const openDeleteModal = (requestId) => {
    setDeletingRequestId(requestId);
    setIsDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingRequestId(null);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
    setOpenDropdownId(null);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenDropdownId(null);
    }
  };

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

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mx-auto w-full max-w-7xl min-w-0">
        {/* ── Header & Filters ── */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate">
              All Donation Requests
            </h2>
            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
              {totalRequests} total
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <label
              htmlFor="status-filter"
              className="text-sm text-gray-600 font-medium whitespace-nowrap"
            >
              Filter:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleFilterChange}
              className="flex-1 sm:flex-none sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {requests.length === 0 && !loading && (
          <div className="p-10 text-center">
            <p className="text-gray-500">
              No donation requests found matching the current filter.
            </p>
          </div>
        )}

        {requests.length > 0 && (
          <>
            {/* ── DESKTOP TABLE VIEW ── */}
            <div className="hidden lg:block w-full overflow-x-auto">
              <table
                className="w-full text-sm text-left text-gray-600"
                style={{ minWidth: "680px" }}
              >
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 lg:px-4 py-3">Recipient</th>
                    <th className="px-3 lg:px-4 py-3 hidden xl:table-cell">
                      Location
                    </th>
                    <th className="px-3 lg:px-4 py-3 hidden xl:table-cell">
                      Date & Time
                    </th>
                    <th className="px-3 lg:px-4 py-3 hidden lg:table-cell whitespace-nowrap">
                      Blood Group
                    </th>
                    <th className="px-3 lg:px-4 py-3 whitespace-nowrap">
                      Status & Donor
                    </th>
                    <th className="px-3 lg:px-4 py-3 text-right whitespace-nowrap">
                      Actions
                    </th>
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
                        <td className="px-3 lg:px-4 py-4 font-medium text-gray-900">
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold truncate max-w-[140px] lg:max-w-[180px]">
                              {req.recipientName}
                            </span>
                            <span className="text-xs text-gray-400 font-normal xl:hidden mt-0.5 truncate">
                              {req.recipientDistrictName},{" "}
                              {req.recipientUpazilaName}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 lg:px-4 py-4 hidden xl:table-cell">
                          <div className="flex flex-col">
                            <span className="text-gray-700">
                              {req.recipientDistrictName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {req.recipientUpazilaName}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 lg:px-4 py-4 hidden xl:table-cell">
                          <div className="flex flex-col">
                            <span className="text-gray-700">
                              {new Date(req.donationDate).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-400">
                              {req.donationTime}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 lg:px-4 py-4 hidden lg:table-cell whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 w-fit">
                            {req.bloodGroup}
                          </span>
                        </td>
                        <td className="px-3 lg:px-4 py-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.color} whitespace-nowrap`}
                            >
                              {statusBadge.icon}
                              <span className="lg:hidden mr-1 font-semibold text-red-700">
                                {req.bloodGroup} ·
                              </span>
                              {req.status}
                            </span>
                            {req.status === "inprogress" && req.donorName && (
                              <div className="mt-1 flex-row items-center gap-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 w-fit inline-flex">
                                <FaUser
                                  className="text-blue-500 shrink-0"
                                  size={10}
                                />
                                <span className="font-medium">
                                  {req.donorName}
                                </span>
                                <span className="text-gray-400">
                                  ({req.donorEmail})
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* ── POLISHED ACTIONS COLUMN ── */}
                        <td className="px-3 lg:px-4 py-4 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Button - Always Visible */}
                            <button
                              onClick={() =>
                                router.push(`/donation-requests/${req._id}`)
                              }
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors shrink-0"
                              title="View Details"
                            >
                              <FaEye size={14} />
                            </button>

                            {/* 3-Dot Menu Button */}
                            <div className="relative inline-block">
                              <button
                                onClick={() =>
                                  setOpenDropdownId(
                                    openDropdownId === req._id ? null : req._id,
                                  )
                                }
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <FaEllipsisV size={16} />
                              </button>

                              {/* ── DROPDOWN MENU ── */}
                              {openDropdownId === req._id && (
                                <div className="absolute right-0 top-8 z-20 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 text-sm animate-in fade-in zoom-in-95 duration-100 text-left">
                                  {/* Admin Actions: Edit & Delete */}
                                  {isAdmin && (
                                    <>
                                      <button
                                        onClick={() => {
                                          router.push(
                                            `/dashboard/edit-donation-request/${req._id}`,
                                          );
                                          setOpenDropdownId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                      >
                                        <FaEdit size={14} /> Edit
                                      </button>
                                      <button
                                        onClick={() => openDeleteModal(req._id)}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                                      >
                                        <FaTrash size={14} /> Delete
                                      </button>
                                    </>
                                  )}

                                  {/* Status Actions: Done & Cancel (For both Admin & Volunteer) */}
                                  {req.status === "inprogress" && (
                                    <>
                                      <div className="border-t border-gray-100 my-1"></div>
                                      <button
                                        onClick={() =>
                                          handleStatusUpdate(req._id, "done")
                                        }
                                        className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 flex items-center gap-2"
                                      >
                                        <FaCheck size={14} /> Mark Done
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleStatusUpdate(
                                            req._id,
                                            "canceled",
                                          )
                                        }
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <FaBan size={14} /> Cancel
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE CARD VIEW ── */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {requests.map((req) => {
                const statusBadge = getStatusBadge(req.status);
                return (
                  <div
                    key={req._id}
                    className="p-3 sm:p-4 bg-white hover:bg-gray-50 transition-colors relative"
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-2 gap-2 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate min-w-0">
                        {req.recipientName}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 shrink-0">
                        {req.bloodGroup}
                      </span>
                    </div>

                    {/* Card Details */}
                    <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-gray-600 mb-3">
                      <p className="flex items-start gap-2 min-w-0">
                        <span className="font-medium text-gray-500 shrink-0">
                          Location:
                        </span>
                        <span className="truncate">
                          {req.recipientDistrictName},{" "}
                          {req.recipientUpazilaName}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-gray-500 shrink-0">
                          Date:
                        </span>
                        <span>
                          {new Date(req.donationDate).toLocaleDateString()} at{" "}
                          {req.donationTime}
                        </span>
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
                        <span
                          className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.color}`}
                        >
                          {statusBadge.icon} {req.status}
                        </span>
                        {req.status === "inprogress" && req.donorName && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-100 w-fit max-w-full overflow-hidden">
                            <FaUser
                              className="text-blue-500 shrink-0"
                              size={11}
                            />
                            <span className="font-medium truncate">
                              {req.donorName}
                            </span>
                            <span className="text-gray-400 truncate">
                              ({req.donorEmail})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Action Buttons - Clean & Even Width */}
                    <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* View Button - Full Width on its own */}
                        <button
                          onClick={() =>
                            router.push(`/donation-requests/${req._id}`)
                          }
                          className="flex-1 py-2 px-3 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2"
                        >
                          <FaEye size={12} /> View Details
                        </button>

                        {/* 3-Dot Menu & Status Buttons for Mobile */}
                        {req.status === "inprogress" || isAdmin ? (
                          <div className="relative inline-block">
                            <button
                              onClick={() =>
                                setOpenDropdownId(
                                  openDropdownId === req._id ? null : req._id,
                                )
                              }
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <FaEllipsisV size={16} />
                            </button>

                            {/* ── MOBILE DROPDOWN MENU ── */}
                            {openDropdownId === req._id && (
                              <div className="absolute right-0 top-8 z-20 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 text-sm animate-in fade-in zoom-in-95 duration-100 text-left">
                                {/* Admin Actions: Edit & Delete */}
                                {isAdmin && (
                                  <>
                                    <button
                                      onClick={() => {
                                        router.push(
                                          `/dashboard/edit-donation-request/${req._id}`,
                                        );
                                        setOpenDropdownId(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                    >
                                      <FaEdit size={14} /> Edit
                                    </button>
                                    <button
                                      onClick={() => openDeleteModal(req._id)}
                                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                                    >
                                      <FaTrash size={14} /> Delete
                                    </button>
                                  </>
                                )}

                                {/* Status Actions: Done & Cancel (For both Admin & Volunteer) */}
                                {req.status === "inprogress" && (
                                  <>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(req._id, "done")
                                      }
                                      className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 flex items-center gap-2"
                                    >
                                      <FaCheck size={14} /> Mark Done
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(req._id, "canceled")
                                      }
                                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <FaBan size={14} /> Cancel
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* ── Pagination Footer ── */}
            <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50">
              <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Showing{" "}
                {totalRequests === 0 ? 0 : (currentPage - 1) * limit + 1}–
                {Math.min(currentPage * limit, totalRequests)} of{" "}
                {totalRequests} requests
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft size={13} />
                </button>
                <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap px-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight size={13} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Delete Modal ── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-5 sm:p-6 animate-in fade-in zoom-in duration-200"
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
                    <FaSpinner className="animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash size={13} /> Delete Request
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

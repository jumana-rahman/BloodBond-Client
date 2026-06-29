"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { protectedFetch, serverFetch, serverMutation } from "@/lib/core/server";
import {
  FaSpinner,
  FaUser,
  FaUserCheck,
  FaUserCog,
  FaUserSlash,
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";

const STATUS_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

export default function AllUsersClient() {
  const router = useRouter();

  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const limit = 10;

  // 1. Fetch Users
  const fetchUsers = async (page = 1, status = "all") => {
    try {
      setLoading(true);
      let url = `/api/admin/users?page=${page}&limit=${limit}`;
      if (status && status !== "all") {
        url += `&status=${status}`;
      }

      const response = await protectedFetch(url);

      if (response.success) {
        setUsers(response.data);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
        setTotalUsers(response.pagination.totalUsers);
      }
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  // 2. Handle Filter Change
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
    setOpenDropdownId(null);
  };

  // 3. Handle Pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenDropdownId(null);
    }
  };

  // 4. Handle User Actions
  const handleUserAction = async (userId, action) => {
    try {
      setProcessingId(userId);
      setOpenDropdownId(null);

      const targetUser = users.find((u) => u._id === userId);

      console.log("🔍 Sending authId to backend:", targetUser?.authId);

      if (!targetUser || !targetUser.authId) {
        toast.error("User Auth ID missing!");
        setProcessingId(null);
        return;
      }

      const response = await serverMutation(
        `/api/admin/users/${targetUser.authId.trim()}`,
        { action },
        "PATCH",
      );

      if (response.success) {
        toast.success(response.message || "User updated successfully!");
        fetchUsers(currentPage, statusFilter);
      }
    } catch (error) {
      console.error("🔥 Frontend Error:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setProcessingId(null);
    }
  };

  // ── Role & Status Badge Helpers ──
  const getRoleBadge = (role) => {
    const config = {
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      volunteer: "bg-blue-100 text-blue-800 border-blue-200",
      donor: "bg-green-100 text-green-800 border-green-200",
    };
    return config[role] || config.donor;
  };

  const getStatusBadge = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  // ── Reusable Avatar ──
  const UserAvatar = ({ image, name, size = 8 }) =>
    image ? (
      <div
        className={`relative w-${size} h-${size} rounded-full overflow-hidden shrink-0 border border-gray-200`}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    ) : (
      <div
        className={`w-${size} h-${size} rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0`}
      >
        <FaUser size={14} />
      </div>
    );

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mx-auto w-full max-w-7xl min-w-0">
      {/* ── Header & Filters ── */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
            All Users
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
            {totalUsers} total
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

      {/* ── Empty State ── */}
      {users.length === 0 && !loading && (
        <div className="p-10 text-center">
          <p className="text-gray-500">
            No users found matching the current filter.
          </p>
        </div>
      )}

      {users.length > 0 && (
        <>
          {/* ── DESKTOP TABLE VIEW ── */}
          <div className="hidden lg:block w-full overflow-x-auto">
            {/* CHANGED: minWidth 750 → 680, table-fixed removed so columns breathe */}
            <table
              className="w-full text-sm text-left text-gray-600"
              style={{ minWidth: "680px" }}
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  {/* CHANGED: w-[220px] so User col gets enough room */}
                  <th className="px-4 py-3 w-[220px]">User</th>
                  {/* CHANGED: hide Email on lg, show on xl */}
                  <th className="px-4 py-3 w-[220px]">Email</th>
                  <th className="px-4 py-3 w-[100px]">Role</th>
                  <th className="px-4 py-3 w-[100px]">Status</th>
                  <th className="px-4 py-3 text-right w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar image={user.image} name={user.name} />
                        <div>
                          <span className="font-medium text-gray-900 whitespace-nowrap block">
                            {user.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* CHANGED: hidden xl:table-cell */}
                    <td className="px-4 py-4 w-[220px] text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(user.status)}`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === user._id ? null : user._id,
                            )
                          }
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          disabled={processingId === user._id}
                        >
                          {processingId === user._id ? (
                            <FaSpinner className="animate-spin" size={15} />
                          ) : (
                            <FaEllipsisV size={15} />
                          )}
                        </button>

                        {/* ── Dropdown Menu ── */}
                        {openDropdownId === user._id && (
                          <div className="absolute right-0 top-10 z-20 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-200 py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
                            {user.status === "active" ? (
                              <button
                                onClick={() =>
                                  handleUserAction(user._id, "block")
                                }
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <FaUserSlash size={14} /> Block User
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleUserAction(user._id, "unblock")
                                }
                                className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 flex items-center gap-2"
                              >
                                <FaUserCheck size={14} /> Unblock User
                              </button>
                            )}
                            {user.role === "donor" && (
                              <button
                                onClick={() =>
                                  handleUserAction(user._id, "makeVolunteer")
                                }
                                className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 flex items-center gap-2 border-t border-gray-100"
                              >
                                <FaUserCog size={14} /> Make Volunteer
                              </button>
                            )}
                            {user.role !== "admin" && (
                              <button
                                onClick={() =>
                                  handleUserAction(user._id, "makeAdmin")
                                }
                                className="w-full text-left px-4 py-2 text-purple-600 hover:bg-purple-50 flex items-center gap-2 border-t border-gray-100"
                              >
                                <FaUserCog size={14} /> Make Admin
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARD VIEW ── */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-3 sm:p-4 bg-white hover:bg-gray-50 transition-colors relative"
              >
                <div className="flex justify-between items-start mb-2 gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* CHANGED: user.avatar → user.image, use fill pattern */}
                    <UserAvatar image={user.image} name={user.name} />
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {user.name}
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === user._id ? null : user._id,
                      )
                    }
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded-md shrink-0"
                    disabled={processingId === user._id}
                  >
                    {processingId === user._id ? (
                      <FaSpinner className="animate-spin" size={16} />
                    ) : (
                      <FaEllipsisV size={16} />
                    )}
                  </button>
                </div>

                <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-2">
                  <p className="truncate">
                    <span className="font-medium text-gray-500">Email:</span>{" "}
                    {user.email}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(user.status)}`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* ── Mobile Dropdown ── */}
                {openDropdownId === user._id && (
                  <div className="absolute right-4 top-14 z-20 w-44 bg-white rounded-md shadow-lg border border-gray-200 py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
                    {user.status === "active" ? (
                      <button
                        onClick={() => handleUserAction(user._id, "block")}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <FaUserSlash size={14} /> Block User
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUserAction(user._id, "unblock")}
                        className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 flex items-center gap-2"
                      >
                        <FaUserCheck size={14} /> Unblock User
                      </button>
                    )}
                    {user.role === "donor" && (
                      <button
                        onClick={() =>
                          handleUserAction(user._id, "makeVolunteer")
                        }
                        className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 flex items-center gap-2 border-t border-gray-100"
                      >
                        <FaUserCog size={14} /> Make Volunteer
                      </button>
                    )}
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleUserAction(user._id, "makeAdmin")}
                        className="w-full text-left px-4 py-2 text-purple-600 hover:bg-purple-50 flex items-center gap-2 border-t border-gray-100"
                      >
                        <FaUserCog size={14} /> Make Admin
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Pagination Footer ── */}
          <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50">
            <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing {totalUsers === 0 ? 0 : (currentPage - 1) * limit + 1}–
              {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
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
  );
}

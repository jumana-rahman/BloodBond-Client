"use client";

import { useState, useEffect } from "react";
import { Avatar, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { Funnel, Ellipsis, Shield, ShieldUser, Ban, Check } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { getAllUsers } from "@/lib/api/admin";

import {
  updateUserRole,
  updateUserStatus,
} from "@/lib/actions/admin";

export default function AllUsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers(statusFilter);

      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync system database user entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const handleUpdateStatus = async (userId, currentStatus) => {
    setActionLoading(true);
    const nextStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      await updateUserStatus(userId, nextStatus);
      toast.success(`User profile status configured to ${nextStatus}`);
      fetchUsers();
    } catch (err) {
      toast.error("Account parameter lock state modification failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async (userId, nextRole) => {
    setActionLoading(true);
    try {
      await updateUserRole(userId, nextRole);
      toast.success(`User profile role adjusted to ${nextRole}`);
      fetchUsers();
    } catch (err) {
      toast.error("System privilege assignment modification failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const roleColorMap = {
    admin: "danger",
    volunteer: "primary",
    donor: "default",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Upper Page Heading and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">System User Accounts Ledger</h2>
          <p className="text-xs text-gray-400">View, monitor, filter, and adjust system permissions for global accounts.</p>
        </div>

        {/* Status Filtering Controller Dropdown */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm self-start sm:self-center">
          <Funnel className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold text-gray-600 bg-transparent outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Primary Data Grid View Spreadsheet */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-[40vh] flex flex-col justify-center items-center gap-2">
            <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rebuilding Registry Grid...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="h-[40vh] flex flex-col justify-center items-center text-center p-6 text-gray-400">
            <p className="text-sm font-bold">No Records Enlisted</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table aria-label="System Users Ledger Presentation Grid" removeWrapper shadow="none" className="min-w-full">
              <TableHeader>
                <TableColumn className="font-bold text-xs">AVATAR</TableColumn>
                <TableColumn className="font-bold text-xs">ACCOUNT IDENTIFICATION NAME</TableColumn>
                <TableColumn className="font-bold text-xs">EMAIL ADDRESS</TableColumn>
                <TableColumn className="font-bold text-xs">ASSIGNED ROLE</TableColumn>
                <TableColumn className="font-bold text-xs">ACCOUNT LOCK STATUS</TableColumn>
                <TableColumn className="font-bold text-xs text-center">PRIVILEGED CONTROLS</TableColumn>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    
                    {/* User Avatar */}
                    <TableCell>
                      <Avatar src={user.avatar || ""} name={user.name} size="sm" radius="md" isBordered color="danger" />
                    </TableCell>

                    {/* Account Name */}
                    <TableCell className="font-bold text-gray-900 text-sm">
                      {user.name}
                    </TableCell>

                    {/* Email Node Reference */}
                    <TableCell className="text-sm font-medium text-gray-500">
                      {user.email}
                    </TableCell>

                    {/* Dynamic System Role Chip */}
                    <TableCell>
                      <Chip variant="flat" size="sm" color={roleColorMap[user.role]} className="capitalize font-extrabold text-xs">
                        {user.role}
                      </Chip>
                    </TableCell>

                    {/* Account Operational Status */}
                    <TableCell>
                      <Chip variant="dot" size="sm" color={user.status === "active" ? "success" : "danger"} className="capitalize font-bold text-xs">
                        {user.status}
                      </Chip>
                    </TableCell>

                    {/* Dropdown Three-Dot Controller Action Component */}
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Dropdown placement="bottom-end">
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light" radius="xl" disabled={actionLoading}>
                              <Ellipsis className="w-4 h-4 text-gray-400" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Account Access Control Options Menu" variant="flat" className="font-semibold text-xs">
                            
                            {/* Toggle Block status */}
                            <DropdownItem
                              key="status-toggle"
                              color={user.status === "active" ? "danger" : "success"}
                              startContent={user.status === "active" ? <Ban className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                              onClick={() => handleUpdateStatus(user._id, user.status)}
                            >
                              {user.status === "active" ? "Block User Account" : "Unblock User Account"}
                            </DropdownItem>

                            {/* Make Volunteer Rule Trigger */}
                            {user.role === "donor" && (
                              <DropdownItem
                                key="make-volunteer"
                                color="primary"
                                startContent={<ShieldUser className="w-3.5 h-3.5" />}
                                onClick={() => handleUpdateRole(user._id, "volunteer")}
                              >
                                Promote to Volunteer
                              </DropdownItem>
                            )}

                            {/* Make Admin Rule Trigger */}
                            {user.role !== "admin" && (
                              <DropdownItem
                                key="make-admin"
                                color="danger"
                                startContent={<Shield className="w-3.5 h-3.5" />}
                                onClick={() => handleUpdateRole(user._id, "admin")}
                              >
                                Promote to System Admin
                              </DropdownItem>
                            )}

                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

    </div>
  );
}
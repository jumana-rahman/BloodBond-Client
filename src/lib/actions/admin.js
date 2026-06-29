"use server";

import { serverMutation } from "../core/server";

export const updateUserStatus = (id, status) => {
  return serverMutation(
    `/api/admin/users/${id}/status`,
    { status },
    "PATCH"
  );
};

export const updateUserRole = (id, role) => {
  return serverMutation(
    `/api/admin/users/${id}/role`,
    { role },
    "PATCH"
  );
};
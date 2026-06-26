import { protectedFetch } from "../core/server";

export const getAllDonationRequests = async ({
  page = 1,
  limit = 10,
  status = "",
}) => {
  let path = `/api/admin/donation-requests?page=${page}&limit=${limit}`;

  if (status) {
    path += `&status=${status}`;
  }

  return protectedFetch(path);
};

export const getAllUsers = async (status = "") => {
  let path = "/api/admin/users";

  if (status) {
    path += `?status=${status}`;
  }

  return protectedFetch(path);
};
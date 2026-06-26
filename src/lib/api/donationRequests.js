import { protectedFetch } from "../core/server";

export const getMyDonationRequests = async (
  page = 1,
  limit = 5,
  status = ""
) => {
  let url = `/api/my-donation-requests?page=${page}&limit=${limit}`;

  if (status) {
    url += `&status=${status}`;
  }

  return protectedFetch(url);
};

export const getDonationRequest = async (id) => {
  return protectedFetch(`/api/donation-requests/${id}`);
};
import { publicFetch, protectedFetch } from "../core/server";

// Public donation requests
export const getPublicDonationRequests = async () => {
  return publicFetch("/api/donation-requests");
};

// Public single request
export const getDonationRequest = async (id) => {
  return publicFetch(`/api/donation-requests/${id}`);
};

// Logged in user's requests
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

export const getDonationRequestDetails = async (id) => {
  return protectedFetch(`/api/donation-requests/${id}`);
};
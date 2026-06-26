"use server";

import { serverMutation } from "../core/server";

export const createDonationRequest = (data) => {
  return serverMutation(
    "/api/donation-requests",
    data,
    "POST"
  );
};

export const updateDonationRequestStatus = async (
  id,
  status,
  donorInfo = null
) => {
  const body = { status };

  if (donorInfo) {
    body.donorInfo = donorInfo;
  }

  return serverMutation(
    `/api/donation-requests/${id}/status`,
    body,
    "PATCH"
  );
};

export const updateDonationRequest = async (id, data) => {
  return serverMutation(
    `/api/donation-requests/${id}`,
    data,
    "PATCH"
  );
};

export const deleteDonationRequest = async (id) => {
  return serverMutation(
    `/api/donation-requests/${id}`,
    {},
    "DELETE"
  );
};
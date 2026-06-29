import { serverMutation } from "../core/server";

export const setDonationInProgress = async (payload, requestId) => {
  return serverMutation(
    `/api/donation-requests/${requestId}`,
    payload,
    "PATCH",
  );
};

import { serverMutation } from "../core/server";

export const createDonationRequest = async (payload) => {
  return serverMutation("/api/donation-requests", payload);
};

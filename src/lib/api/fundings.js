import { protectedFetch } from "../core/server";

export const getFundingHistory = () => {
  return protectedFetch("/api/fundings");
};
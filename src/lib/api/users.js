import { serverFetch } from "../core/server";

//! For Shared Profile use
export const getUserById = async (userId) => {
  return serverFetch(`/api/users/${userId}`);
};

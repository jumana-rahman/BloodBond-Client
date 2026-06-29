"use server";

import { serverMutation } from "../core/server";

//! For Updating Profile
export const updateUserById = async (userId, updatedData) => {
  return serverMutation(`/api/users/${userId}`, updatedData, "PATCH");
};

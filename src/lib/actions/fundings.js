"use server";

import { serverMutation } from "../core/server";

export const createPaymentIntent = (amount) => {
  return serverMutation(
    "/api/create-payment-intent",
    { amount },
    "POST"
  );
};

export const saveFunding = (data) => {
  return serverMutation(
    "/api/fundings",
    data,
    "POST"
  );
};
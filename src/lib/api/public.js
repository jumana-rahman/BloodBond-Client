import { publicFetch } from "../core/server";

export const getLandingPulse = async () => {
  return publicFetch("/api/public/landing-pulse");
};
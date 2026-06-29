import { publicFetch } from "../core/server";

export const searchDonors = async ({
  bloodGroup,
  district,
  upazila,
}) => {
  const params = new URLSearchParams({
    bloodGroup,
    district,
    upazila,
  });

  return publicFetch(`/api/search/donors?${params.toString()}`);
};
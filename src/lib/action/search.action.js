"use server";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function searchDonorsAction(formData) {
  try {
    const { bloodGroup, district, upazila } = formData;

    // Build query string
    const params = new URLSearchParams();
    if (bloodGroup && bloodGroup !== "all")
      params.append("bloodGroup", bloodGroup);
    if (district && district !== "all") params.append("district", district);
    if (upazila && upazila !== "all") params.append("upazila", upazila);

    const url = `${baseURL}/api/donors/search?${params.toString()}`;

    const res = await fetch(url, { cache: "no-store" }); // Ensure fresh data

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Search failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Search Action Error:", error);
    throw error;
  }
}

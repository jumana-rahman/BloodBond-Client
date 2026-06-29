"use server";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function donateBloodAction(requestId, payload) {
  try {
    const res = await fetch(`${baseURL}/api/donation-requests/${requestId}`, {
      method: "PATCH", // HARDCODED to PATCH
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Donation Action Error:", error);
    throw error;
  }
}

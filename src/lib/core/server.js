"use server";

import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const authHeader = async () => {
  const token = await getUserToken();
  const header = token
    ? {
        authorization: `Bearer ${token}`,
      }
    : {};

  return header;
};

const handleStatusCode = (res, errorData = {}) => {
  const errorMessage =
    errorData.message || `Request failed with status ${res.status}`;

  switch (res.status) {
    case 401:
      console.warn("Unauthorized request. Access tokens may be expired.");
      redirect("/unauthorized");
      break;
    case 403:
      console.warn("Forbidden. You do not have permission.");
      redirect("/forbidden");
      break;
    case 404:
      console.warn("Resource not found.");
      redirect("/not-found");
      break;
    case 500:
      console.error("Internal Server Error.");
      break;
    default:
      console.error(`HTTP Error: ${res.status}`);
  }

  throw new Error(errorMessage);
};

export const serverFetch = async (path) => {
  try {
    const res = await fetch(`${baseURL}${path}`);

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = {};
      }
      throw new Error(
        errorData.message || `Fetch failed with status ${res.status}`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error(`Server Fetch error at ${path}:`, error);
    throw error;
  }
};

export const protectedFetch = async (path) => {
  try {
    const res = await fetch(`${baseURL}${path}`, {
      headers: await authHeader(),
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = {};
      }
      handleStatusCode(res, errorData);
    }

    return res.json();
  } catch (error) {
    console.error(`Protected Fetch error at ${path}:`, error);
    throw error;
  }
};


// ServerMutation
export const serverMutation = async (path, data, method = "POST") => {
  try {
    console.log(`🚀 Request Method: ${method} | URL: ${baseURL}${path}`);

    const res = await fetch(`${baseURL}${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(await authHeader()),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: "An unknown error occurred" };
      }
      handleStatusCode(res, errorData);
    }

    if (res.status === 204) {
      return { success: true };
    }

    return await res.json();
  } catch (error) {
    console.error(`Mutation failed at [${method}] ${path}:`, error);
    throw error;
  }
};

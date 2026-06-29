import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import AllRequestsClient from "./AllRequestsClient";

export async function generateMetadata() {
  const user = await getUserSession();
  return {
    title: user ? `All Blood Donation Requests` : "All Donation Requests",
    description: "View and manage all blood donation requests.",
  };
}

export default async function AllRequestsPage() {
  const user = await getUserSession();

  // Secure Route: Only Admins and Volunteers can access
  if (!user || (user.role !== "admin" && user.role !== "volunteer")) {
    redirect("/unauthorized");
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-gray-900">
          All <span className="text-red-600">Donation Requests</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          {user.role === "admin"
            ? "Manage, edit, and delete all blood donation requests."
            : "View all donation requests and update their status."}
        </p>
      </div>

      {/* Pass the role down to the client component */}
      <AllRequestsClient currentUserRole={user.role} />
    </div>
  );
}

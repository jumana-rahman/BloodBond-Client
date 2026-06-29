import { getUserSession } from "@/lib/core/session";
import MyRequestsClient from "./MyRequestsClient";

export async function generateMetadata() {
  const user = await getUserSession();
  return {
    title: user ? `${user.name} - My Requests` : "My Donation Requests",
    description: "View and manage all your blood donation requests.",
  };
}

export default async function MyRequestsPage() {
  const user = await getUserSession();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Please log in to view your requests.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-gray-900">
          My <span className="text-red-600">Donation Requests</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          View, filter, and manage all your blood donation requests.
        </p>
      </div>

      <MyRequestsClient userId={user.id} />
    </div>
  );
}

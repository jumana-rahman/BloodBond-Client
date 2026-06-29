import { getUserSession } from "@/lib/core/session";
import DonorDashboardClient from "./DonorDashboardClient";

export async function generateMetadata() {
  const user = await getUserSession();
  return {
    title: user ? `${user.name} - Dashboard` : "Donor Dashboard",
    description: "Manage your blood donation requests and activity.",
  };
}

export default async function DonorDashboardPage() {
  const user = await getUserSession();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-red-500 to-red-600 rounded-xl p-6 mb-8 text-white shadow-md">
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="font-extrabold">{user.name}</span>! 🩸
        </h1>
        <p className="text-red-100 mt-2 text-lg">
          Your generosity can save lives. Check your recent requests below.
        </p>
      </div>

      {/* Client Component for the Data Table */}
      <DonorDashboardClient userId={user.id} />
    </div>
  );
}

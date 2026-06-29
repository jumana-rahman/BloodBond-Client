import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export async function generateMetadata() {
  return {
    title: "Dashboard",
    description: "Manage your blood donation platform activity.",
  };
}

export default async function DashboardPage() {
  const user = await getUserSession();

  // If not logged in, send them to login
  if (!user) {
    redirect("/login");
  }

  // If it's a Donor, redirect them to their specific Donor Dashboard
  // (Assuming you already have a /dashboard/donor route or page)
  if (user.role === "donor") {
    redirect("/dashboard/donor");
  }

  return (
    <div className="w-full">
      <DashboardClient user={user} />
    </div>
  );
}

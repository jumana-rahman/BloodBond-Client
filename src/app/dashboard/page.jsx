import DashboardHomeClient from "@/components/dashboard/DashboardHomeClient";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardHomeClient
      initialUser={{
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    />
  );
}
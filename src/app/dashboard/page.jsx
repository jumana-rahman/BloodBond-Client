import DashboardHomeClient from "@/components/dashboard/DashboardHomeClient";

export default async function DashboardPage() {

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
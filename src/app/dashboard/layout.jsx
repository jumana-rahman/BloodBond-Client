import { requireRoles } from "@/lib/core/session";

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default async function DashboardLayout({
  children,
}) {
  const user = await requireRoles([
    "donor",
    "volunteer",
    "admin",
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col">
        <DashboardNavbar user={user} />

        <main className="flex-1 p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
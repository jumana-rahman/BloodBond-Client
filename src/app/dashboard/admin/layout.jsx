import { requireRole } from "@/lib/core/session";

export default async function AdminDashboardLayout({ children }) {
  const user = await requireRole("admin");

  return <>{children}</>;
}

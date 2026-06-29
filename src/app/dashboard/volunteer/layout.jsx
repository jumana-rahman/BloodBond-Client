import { requireRole } from "@/lib/core/session";

export default async function VolunteerLayout({ children }) {
  // ✅ Protect all volunteer routes
  const user = await requireRole("volunteer");

  return <>{children}</>;
}

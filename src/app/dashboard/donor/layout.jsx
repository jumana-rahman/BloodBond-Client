import { requireRole } from "@/lib/core/session";

export default async function DonorLayout({ children }) {
  // ✅ Protect all donor routes
  const user = await requireRole("donor");

  return <>{children}</>;
}

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar />

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
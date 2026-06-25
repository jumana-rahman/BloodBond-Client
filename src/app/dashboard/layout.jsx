"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Imported requested icon libraries
import { House, Person } from "@gravity-ui/icons";
import { GiBlood } from "react-icons/gi";
import { BiMoney } from "react-icons/bi";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  // Mobile drawer open/close switch state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic contextual layout items selector matching your roles
  const getSidebarLinks = (role) => {
    const commonLinks = [{ name: "Console Home", href: "/dashboard", icon: <House className="w-4 h-4" /> }];

    switch (role) {
      case "admin":
        return [
          ...commonLinks,
          { name: "Manage Users", href: "/dashboard/users", icon: <Person className="w-4 h-4" /> },
          { name: "All Blood Requests", href: "/dashboard/all-requests", icon: <GiBlood className="w-4 h-4 text-red-600" /> },
          { name: "Funding Records", href: "/dashboard/funding", icon: <BiMoney className="w-4 h-4 text-emerald-600" /> },
        ];
      case "volunteer":
        return [
          ...commonLinks,
          { name: "All Blood Requests", href: "/dashboard/all-blood-donation-request", icon: <GiBlood className="w-4 h-4 text-red-600" /> },
        ];
      case "donor":
      default:
        return [
          ...commonLinks,
          { name: "Create Request", href: "/dashboard/create-donation-request", icon: <GiBlood className="w-4 h-4 text-red-500" /> },
          { name: "My Requests", href: "/dashboard/my-donation-requests", icon: <GiBlood className="w-4 h-4 text-red-700" /> },
        ];
    }
  };

  if (isPending) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-50 gap-3">
        <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Verifying Identity Access Matrix...</p>
      </div>
    );
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  const currentUserRole = session.user?.role || "donor";
  const activeMenuLinks = getSidebarLinks(currentUserRole);

  // Render fragment for the sidebar elements
  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-6 bg-white">
      <div className="space-y-8">
        {/* Brand Header Wrapper */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider uppercase text-red-700">BloodBond</span>
            <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {currentUserRole}
            </span>
          </div>
          {/* Close button icon for small devices */}
          <button 
            className="md:hidden text-gray-400 hover:text-gray-900 text-sm font-bold p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Dynamic Sidebar Links mapping */}
        <nav className="space-y-1">
          {activeMenuLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-red-700 text-white shadow-md shadow-red-700/10"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={`shrink-0 ${isActive ? "text-white" : ""}`}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="text-xs text-gray-400 font-medium pt-4">
        © 2026 BloodBond Panel
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex relative overflow-x-hidden">
      
      {/* Permanent Sidebar for Desktop displays */}
      <aside className="w-64 border-r border-gray-200 hidden md:block shrink-0 bg-white">
        <SidebarContent />
      </aside>

      {/* Responsive Hamburger Slide-out Drawer overlay for Mobile layout views */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-sm h-full shadow-2xl z-10 animate-slide-right">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Right panel section containing header and dynamic children wrappers */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger button visible only on mobile screens */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 md:hidden transition-colors"
              aria-label="Toggle system view menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">
                Secure Terminal Workspace /
              </span>
              <span className="text-xs font-black text-red-700 capitalize">
                {currentUserRole} Console
              </span>
            </div>
          </div>

          <Link href="/" className="text-xs font-bold text-gray-500 hover:text-red-700 transition-colors">
            Exit to Public Site →
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
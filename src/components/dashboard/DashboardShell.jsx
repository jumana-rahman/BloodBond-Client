"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { House, Person } from "@gravity-ui/icons";
import { GiBlood } from "react-icons/gi";
import { BiMoney } from "react-icons/bi";

export default function DashboardShell({ children, user }) {
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentUserRole = user?.role || "donor";

  const getSidebarLinks = (role) => {
    const commonLinks = [
      {
        name: "Console Home",
        href: "/dashboard",
        icon: <House className="w-4 h-4" />,
      },
    ];

    switch (role) {
      case "admin":
        return [
          ...commonLinks,
          {
            name: "Manage Users",
            href: "/dashboard/users",
            icon: <Person className="w-4 h-4" />,
          },
          {
            name: "All Blood Requests",
            href: "/dashboard/all-requests",
            icon: <GiBlood className="w-4 h-4 text-red-600" />,
          },
          {
            name: "Funding Records",
            href: "/dashboard/funding",
            icon: <BiMoney className="w-4 h-4 text-emerald-600" />,
          },
        ];

      case "volunteer":
        return [
          ...commonLinks,
          {
            name: "All Blood Requests",
            href: "/dashboard/all-blood-donation-request",
            icon: <GiBlood className="w-4 h-4 text-red-600" />,
          },
        ];

      default:
        return [
          ...commonLinks,
          {
            name: "Create Request",
            href: "/dashboard/create-donation-request",
            icon: <GiBlood className="w-4 h-4 text-red-500" />,
          },
          {
            name: "My Requests",
            href: "/dashboard/my-donation-requests",
            icon: <GiBlood className="w-4 h-4 text-red-700" />,
          },
        ];
    }
  };

  const activeMenuLinks = getSidebarLinks(currentUserRole);

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-6 bg-white">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider uppercase text-red-700">
              BloodBond
            </span>

            <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {currentUserRole}
            </span>
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-gray-900 text-sm font-bold p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ✕
          </button>
        </div>

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
                <span className={isActive ? "text-white" : ""}>
                  {item.icon}
                </span>

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
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-gray-200 bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-64 h-full bg-white shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-xl hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-xs font-bold uppercase tracking-widest text-gray-400">
                Secure Terminal Workspace /
              </span>

              <span className="text-xs font-black text-red-700 capitalize">
                {currentUserRole} Console
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs font-bold text-gray-500 hover:text-red-700 transition-colors"
          >
            Exit to Public Site →
          </Link>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FaHome,
  FaTint,
  FaUser,
  FaHandHoldingHeart,
} from "react-icons/fa";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: FaHome,
  },
  {
    name: "My Requests",
    href: "/dashboard/my-donation-requests",
    icon: FaTint,
  },
  {
    name: "Create Request",
    href: "/dashboard/create-donation-request",
    icon: FaHandHoldingHeart,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: FaUser,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex
        w-72
        bg-white
        border-r
        shadow-sm
        flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold text-red-600">
          BloodBond
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Donor Dashboard
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300

              ${
                active
                  ? "bg-red-600 text-white shadow-lg"
                  : "hover:bg-red-50 text-gray-700"
              }`}
            >
              <Icon />

              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
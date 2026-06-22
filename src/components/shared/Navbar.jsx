"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaHeart } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { Separator } from "@heroui/react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const navLinks = [
    { name: "Donation Requests", href: "/donations" },
  ];

  if (user) {
    navLinks.push({ name: "Funding", href: "/funding" });
  }

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
                src="/logo.png"
                alt="BloodBond"
                width={180}
                height={50}
                priority
                className="h-12 w-auto"
            />
          <span className="text-xl font-bold text-gray-800">
            BloodBond
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-[#C62828] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Separator
            orientation="vertical"
            className="h-6 opacity-40 mx-2 self-center"
            />

          {/* AUTH SECTION */}
          {!user ? (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-[#C62828] text-white text-sm font-medium hover:opacity-90"
            >
              Login
            </Link>
          ) : (
            <div className="relative group">
              <Image
                src={user?.image || "https://i.ibb.co/placeholder.png"}
                className="w-9 h-9 rounded-full border cursor-pointer"
                alt="avatar"
                width={36}
                height={36}
              />

              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg w-40 overflow-hidden">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE RIGHT SIDE (Avatar + Hamburger side-by-side) */}
        <div className="md:hidden flex items-center gap-3">
          {user && (
            <Image
              src={user?.image || "https://i.ibb.co/placeholder.png"}
              className="w-9 h-9 rounded-full border"
              alt="avatar"
              width={36}
              height={36}
            />
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-700"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (SLIDE DOWN) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-t"
          >
            <div className="px-4 py-3 flex flex-col gap-2">

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isActive(link.href)
                      ? "bg-[#C62828] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {!user ? (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#C62828] text-white text-center"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 rounded-full hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full text-left text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
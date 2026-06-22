"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Envelope, Handset, MapPin } from "@gravity-ui/icons";

export default function Footer() {
  return (
    <footer className="bg-[#C62828] text-white mt-20 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">

        {/* TOP GRID */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
        >

          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/logo.png"
                alt="BloodBond"
                width={100}
                height={50}
                priority
                className="h-12 w-auto"
              />
              <h2 className="text-xl font-bold">BloodBond</h2>
            </div>

            <p className="text-sm text-white/80 leading-relaxed">
              Connecting blood donors with those in need. Save lives through
              fast, reliable donation requests.
            </p>
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm">
              {["Home", "Donation Requests", "Search Donors", "Login"].map((item, i) => (
                <Link
                  key={i}
                  href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  className="hover:translate-x-1 transition-transform hover:underline"
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* DASHBOARD LINKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold mb-4">Dashboard</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link className="hover:translate-x-1 transition-transform hover:underline" href="/dashboard">
                Dashboard
              </Link>
              <Link className="hover:translate-x-1 transition-transform hover:underline" href="/dashboard/profile">
                Profile
              </Link>
              <Link className="hover:translate-x-1 transition-transform hover:underline" href="/dashboard/my-donation-requests">
                My Requests
              </Link>
              <Link className="hover:translate-x-1 transition-transform hover:underline" href="/funding">
                Funding
              </Link>
            </div>
          </motion.div>

          {/* CONTACT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="text-sm text-white/80 space-y-2">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <p>Dhaka, Bangladesh</p>
                </div>

                <div className="flex items-center gap-2">
                    <Envelope className="w-4 h-4" />
                    <p>support@bloodbond.com</p>
                </div>

                <div className="flex items-center gap-2">
                    <Handset className="w-4 h-4" />
                    <p>+880 1916754322</p>
                </div>
            </div>
          </motion.div>

        </motion.div>

        {/* BOTTOM BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/80"
        >
          <p>© {new Date().getFullYear()} BloodBond. All rights reserved.</p>

          <div className="flex gap-4 mt-3 md:mt-0">
            <Link className="hover:underline" href="/privacy">Privacy Policy</Link>
            <Link className="hover:underline" href="/terms">Terms & Conditions</Link>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
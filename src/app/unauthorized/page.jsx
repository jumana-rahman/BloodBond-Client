"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaLock, FaArrowLeft, FaEnvelope } from "react-icons/fa";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* ── Staggered Container ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
        >
          {/* Animated Lock Icon */}
          <motion.div
            variants={{
              hidden: { scale: 0, rotate: -30 },
              visible: {
                scale: 1,
                rotate: 0,
                transition: { type: "spring", stiffness: 260, damping: 20 },
              },
            }}
            className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 shadow-lg shadow-red-200"
          >
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -10, 10, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaLock className="text-red-600 text-4xl" />
            </motion.div>
          </motion.div>

          {/* 403 Heading */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: -30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 mb-2 drop-shadow-sm"
          >
            403
          </motion.h1>

          {/* Main Title */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0 },
            }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Access Denied
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed"
          >
            You do not have the necessary permissions to view this page. If you
            believe this is a mistake, please contact your system administrator.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium w-full sm:w-auto justify-center shadow-sm"
            >
              <FaArrowLeft className="text-sm" />
              Go Back Home
            </Link>

            <Link
              href="mailto:support@bloodsync.com"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium w-full sm:w-auto justify-center shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5"
            >
              <FaEnvelope className="text-sm" />
              Contact Support
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="mt-10 pt-6 border-t border-gray-200"
          >
            <p className="text-sm text-gray-400">
              Need help? Email us at{" "}
              <span className="text-red-600 font-medium">
                support@bloodsync.com
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

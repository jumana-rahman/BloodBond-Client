"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaShieldAlt, FaArrowLeft, FaEnvelope, FaBan } from "react-icons/fa";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50 px-4 py-12">
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
          {/* Animated Shield Icon with Ban Overlay */}
          <motion.div
            variants={{
              hidden: { scale: 0, rotate: -30 },
              visible: {
                scale: 1,
                rotate: 0,
                transition: { type: "spring", stiffness: 260, damping: 20 },
              },
            }}
            className="relative inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6 shadow-lg shadow-orange-200"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaShieldAlt className="text-orange-600 text-4xl" />
            </motion.div>
            {/* Ban circle overlay */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1.5 shadow-md"
            >
              <FaBan className="text-white text-sm" />
            </motion.div>
          </motion.div>

          {/* 403 Heading */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: -30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500 mb-2 drop-shadow-sm"
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
            Forbidden Access
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="text-gray-600 mb-2 max-w-sm mx-auto leading-relaxed"
          >
            You don&apos;t have permission to access this resource. This area is
            restricted to authorized personnel only.
          </motion.p>

          {/* Additional context */}
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-8 max-w-sm mx-auto"
          >
            <span className="font-semibold">💡 Tip:</span> If you believe you
            should have access, try logging in with an account that has the
            required permissions or contact your administrator.
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
              href="/login"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-medium w-full sm:w-auto justify-center shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5"
            >
              <FaShieldAlt className="text-sm" />
              Switch Account
            </Link>
          </motion.div>

          {/* Additional Help Link */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="mt-4"
          >
            <Link
              href="mailto:support@bloodsync.com"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200"
            >
              <FaEnvelope className="text-xs" />
              Contact Support for Access
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
              Need immediate assistance? Email us at{" "}
              <span className="text-orange-600 font-medium">
                support@bloodsync.com
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

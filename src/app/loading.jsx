// app/loading.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-white">
      {/* ── Logo ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Image
          src="/assets/nav-logo.png"
          alt="BloodSync"
          width={160}
          height={48}
          priority
          className="object-contain"
        />
      </motion.div>

      {/* ── Animated Blood Drop ── */}
      <div className="relative flex items-center justify-center">
        {/* Outer ping ring */}
        <motion.span
          className="absolute inline-flex rounded-full bg-red-100"
          animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          style={{ width: 100, height: 100 }}
        />

        {/* Inner ping ring */}
        <motion.span
          className="absolute inline-flex rounded-full bg-red-200"
          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.3,
          }}
          style={{ width: 70, height: 70 }}
        />

        {/* Blood drop */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 80"
            width="60"
            height="72"
          >
            <path
              d="M32 4 C32 4 6 36 6 52 a26 26 0 0052 0 C58 36 32 4 32 4z"
              fill="#dc2626"
            />
            {/* Cross */}
            <rect
              x="27"
              y="36"
              width="10"
              height="3"
              rx="1.5"
              fill="white"
              opacity="0.9"
            />
            <rect
              x="30.5"
              y="32"
              width="3"
              height="10"
              rx="1.5"
              fill="white"
              opacity="0.9"
            />
            {/* Shine */}
            <ellipse
              cx="22"
              cy="46"
              rx="4"
              ry="7"
              fill="white"
              opacity="0.15"
            />
          </svg>
        </motion.div>

        {/* Drip drop 1 */}
        <motion.div
          className="absolute -bottom-4 left-3"
          animate={{ y: [0, 12], opacity: [0.8, 0] }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "easeIn",
            delay: 0,
          }}
        >
          <svg viewBox="0 0 10 14" width="8" height="10">
            <path
              d="M5 0 C5 0 1 6 1 9 a4 4 0 008 0 C9 6 5 0 5 0z"
              fill="#dc2626"
              opacity="0.5"
            />
          </svg>
        </motion.div>

        {/* Drip drop 2 */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12], opacity: [0.8, 0] }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "easeIn",
            delay: 0.45,
          }}
        >
          <svg viewBox="0 0 10 14" width="6" height="8">
            <path
              d="M5 0 C5 0 1 6 1 9 a4 4 0 008 0 C9 6 5 0 5 0z"
              fill="#dc2626"
              opacity="0.4"
            />
          </svg>
        </motion.div>

        {/* Drip drop 3 */}
        <motion.div
          className="absolute -bottom-4 right-3"
          animate={{ y: [0, 12], opacity: [0.8, 0] }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "easeIn",
            delay: 0.9,
          }}
        >
          <svg viewBox="0 0 10 14" width="8" height="10">
            <path
              d="M5 0 C5 0 1 6 1 9 a4 4 0 008 0 C9 6 5 0 5 0z"
              fill="#dc2626"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      </div>

      {/* ── Tagline ── */}
      <motion.p
        className="text-xs text-gray-400 tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Saving Lives Together
      </motion.p>

      {/* ── Progress bar ── */}
      <motion.div
        className="rounded-full overflow-hidden bg-red-100"
        style={{ width: 160, height: 2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full rounded-full bg-red-500"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── Bottom red accent line ── */}
      <motion.div
        className="fixed bottom-0 left-0 w-full"
        style={{
          height: 1,
          background:
            "linear-gradient(to right, transparent, #dc2626, transparent)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </div>
  );
}

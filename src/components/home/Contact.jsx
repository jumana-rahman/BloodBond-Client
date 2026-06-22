"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [focused, setFocused] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Contact <span className="text-[#C62828]">Us</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-10">

        {/* CONTACT INFO */}
        <div className="space-y-4 text-gray-700">
          <p>📍 Dhaka, Bangladesh</p>
          <p>📧 support@bloodbond.com</p>
          <p>📞 +880 1XXXXXXXXX</p>

          <p className="mt-6 text-sm text-gray-500">
            We usually respond within 24 hours.
          </p>
        </div>

        {/* FORM WRAPPER WITH ANIMATED BORDER */}
        <motion.div
          animate={{
            boxShadow: focused
              ? "0 0 0 3px rgba(198, 40, 40, 0.4), 0 0 25px rgba(198, 40, 40, 0.2)"
              : "0 0 0 1px rgba(198, 40, 40, 0.3)",
          }}
          transition={{ duration: 0.3 }}
          className="rounded-xl p-6 bg-white border border-[#C62828]"
        >

          <form className="space-y-4">

            <input
              type="text"
              placeholder="Your Name"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#C62828]"
            />

            <input
              type="email"
              placeholder="Your Email"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#C62828]"
            />

            <textarea
              rows="4"
              placeholder="Your Message"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#C62828]"
            />

            <button
              type="submit"
              className="w-full bg-[#C62828] text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Send Message
            </button>

          </form>

        </motion.div>

      </div>
    </section>
  );
}
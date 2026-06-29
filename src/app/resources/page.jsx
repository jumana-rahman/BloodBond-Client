export const metadata = {
  title: "Resources",
  description:
    "Explore helpful resources about BloodSync including About Us, FAQ, Privacy Policy, and Terms & Conditions.",
  keywords: [
    "blood donation resources",
    "bloodsync help",
    "faq blood donation",
    "privacy policy bloodsync",
    "terms and conditions blood donation",
  ],
};

import Link from "next/link";
import {
  FaInfoCircle,
  FaQuestionCircle,
  FaShieldAlt,
  FaFileContract,
} from "react-icons/fa";

export default function ResourcesPage() {
  const items = [
    {
      title: "About Us",
      desc: "Learn about BloodSync mission and vision.",
      icon: <FaInfoCircle />,
      href: "/resources/about",
    },
    {
      title: "FAQ",
      desc: "Common questions about blood donation.",
      icon: <FaQuestionCircle />,
      href: "/resources/faq",
    },
    {
      title: "Privacy Policy",
      desc: "How we handle and protect your data.",
      icon: <FaShieldAlt />,
      href: "/resources/privacy-policy",
    },
    {
      title: "Terms & Conditions",
      desc: "Rules and usage guidelines of BloodSync.",
      icon: <FaFileContract />,
      href: "/resources/terms",
    },
  ];

  return (
    <main className="bg-white">
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <div className="text-center">
          <span className="px-4 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold">
            Resources
          </span>

          <h1 className="mt-5 text-4xl font-bold text-gray-900">
            Help & Information Center
          </h1>

          <p className="mt-4 text-gray-600">
            Everything you need to understand and use BloodSync.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="group border border-red-100 rounded-3xl p-6 hover:shadow-lg transition"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 text-xl group-hover:scale-110 transition">
                {item.icon}
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                {item.title}
              </h2>

              <p className="mt-2 text-gray-600">{item.desc}</p>

              <span className="mt-4 inline-block text-sm text-red-600 font-semibold">
                View Details →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

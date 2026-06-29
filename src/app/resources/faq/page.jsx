import Breadcrumb from "@/components/Breadcrumb";

export const metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about blood donation, eligibility, and how BloodSync works.",
  keywords: [
    "blood donation faq",
    "donate blood questions",
    "is blood donation safe",
    "bloodsync help",
  ],
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Who can donate blood?",
      a: "Healthy individuals meeting medical criteria can donate blood.",
    },
    {
      q: "Is blood donation safe?",
      a: "Yes, it is safe and medically supervised.",
    },
    {
      q: "How does BloodSync work?",
      a: "It connects donors and patients based on location and blood group.",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-20">
      <Breadcrumb
        items={[{ label: "Resources", href: "/resources" }, { label: "FAQ" }]}
      />

      <h1 className="text-4xl font-bold text-gray-900">FAQ</h1>

      <div className="mt-10 space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="border border-red-100 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900">{f.q}</h3>
            <p className="mt-2 text-gray-600">{f.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

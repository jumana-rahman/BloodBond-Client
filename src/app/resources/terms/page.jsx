import Breadcrumb from "@/components/Breadcrumb";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions for using BloodSync platform responsibly and safely.",
  keywords: [
    "bloodSync terms",
    "blood donation rules",
    "platform usage policy",
    "donor guidelines",
  ],
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      <Breadcrumb
        items={[
          { label: "Resources", href: "/resources" },
          { label: "Terms & Conditions" },
        ]}
      />

      <h1 className="text-4xl font-bold text-gray-900">Terms & Conditions</h1>

      <div className="mt-6 space-y-4 text-gray-600 leading-7">
        <p>Users must provide accurate information when using BloodSync.</p>

        <p>
          Misuse of the platform or fake requests may result in account
          suspension.
        </p>

        <p>BloodSync is only a connecting platform, not a medical provider.</p>
      </div>
    </main>
  );
}

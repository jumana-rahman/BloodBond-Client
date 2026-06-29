import Breadcrumb from "@/components/Breadcrumb";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Learn how BloodSync collects, uses, and protects your personal information securely.",
  keywords: [
    "privacy policy bloodsync",
    "data protection blood donation",
    "user privacy blood bank platform",
  ],
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      <Breadcrumb
        items={[
          { label: "Resources", href: "/resources" },
          { label: "Privacy Policy" },
        ]}
      />

      <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>

      <div className="mt-6 space-y-4 text-gray-600 leading-7">
        <p>
          We collect only necessary user information such as name, blood group,
          and contact details.
        </p>

        <p>Your data is securely stored and never sold to third parties.</p>

        <p>Information is only shared in emergency situations when required.</p>
      </div>
    </main>
  );
}

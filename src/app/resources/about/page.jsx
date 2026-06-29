import Breadcrumb from "@/components/Breadcrumb";

export const metadata = {
  title: "About Us",
  description:
    "Learn about BloodSync mission, vision, and how we connect blood donors with patients in need.",
  keywords: [
    "about bloodsync",
    "blood donation platform",
    "donor network",
    "save lives blood donation",
  ],
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-20">
      <Breadcrumb
        items={[
          { label: "Resources", href: "/resources" },
          { label: "About Us" },
        ]}
      />

      <h1 className="text-4xl font-bold text-gray-900">About BloodSync</h1>

      <p className="mt-6 text-gray-600 leading-7">
        BloodSync is a platform designed to connect blood donors with patients
        in urgent need. We aim to reduce delays and save lives through fast
        communication and reliable donor matching.
      </p>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="p-6 border border-red-100 rounded-2xl">
          <h2 className="font-semibold text-gray-900">Mission</h2>
          <p className="mt-2 text-gray-600">
            Ensure no patient suffers due to lack of timely blood supply.
          </p>
        </div>

        <div className="p-6 border border-red-100 rounded-2xl">
          <h2 className="font-semibold text-gray-900">Vision</h2>
          <p className="mt-2 text-gray-600">
            A world where blood is available within minutes.
          </p>
        </div>
      </div>
    </main>
  );
}

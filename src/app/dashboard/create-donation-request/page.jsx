import { redirect } from "next/navigation";
import CreateDonationRequestClient from "./CreateDonationRequestClient";
import { getUserSession } from "@/lib/core/session";

export async function generateMetadata() {
  const user = await getUserSession();
  return {
    title: user ? `${user.name} - Create Request` : "Create Donation Request",
    description: "Submit a new blood donation request.",
  };
}

export default async function CreateDonationRequestPage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Create <span className="text-red-600">Donation Request</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Fill out the form below to request blood for someone in need.
        </p>
      </div>

      <CreateDonationRequestClient user={user} />
    </div>
  );
}

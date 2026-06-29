import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import FundingClient from "./FundingClient";

export async function generateMetadata() {
  return {
    title: "Funding - Support BloodSync",
    description: "Donate to support our blood donation platform.",
  };
}

export default async function FundingPage() {
  const user = await getUserSession();
  if (!user) redirect("/login");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          <span className="text-red-600">Fund</span> Our Mission
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Your contribution helps us save lives and maintain this platform.
        </p>
      </div>

      <FundingClient currentUserId={user.id} />
    </div>
  );
}

// This is a SERVER COMPONENT (No "use client" here)
import { auth } from "@/lib/auth"; // Your Better Auth server instance
import { headers } from "next/headers";
import ProfileClient from "./ProfileClient";

// ✅ 1. Dynamic Metadata (Runs on the server)
export async function generateMetadata() {
  // Get the session to access the user's name
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const userName = user?.name || "User";

  return {
    title: `${userName} - Profile`,
    description: `Manage your personal information and donor credentials on BloodSync. Welcome, ${userName}!`,
    keywords: [
      "blood donation",
      "donate blood",
      "blood bank",
      "blood request",
      "save lives",
      "donor registration",
      "profile settings",
    ],
    authors: [{ name: "Shahadat Hossain" }],
    // Optional: Add Open Graph for better sharing
    openGraph: {
      title: `${userName} - Profile Settings | BloodSync`,
      description: `Manage your donor profile and credentials on BloodSync.`,
      type: "website",
    },
  };
}

export default async function ProfilePage() {
  // 1. Get the session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // 2. If no user, return a simple fallback (or redirect)
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Please log in to view your profile.
      </div>
    );
  }

  // 3. Render the Client Wrapper and pass the user data
  return (
    <div className="max-w-3xl mx-auto">
      {/* ✅ Server-side Heading (No JavaScript needed here) */}
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Profile <span className="text-red-600">Settings</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Manage your personal information and donor credentials.
        </p>
      </div>

      {/* ✅ Pass the serializable user data to the Client Component */}
      <ProfileClient initialUser={user} />
    </div>
  );
}

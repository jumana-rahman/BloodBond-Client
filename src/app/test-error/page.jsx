"use client";
import Link from "next/link";

import { useState } from "react";

export default function TestError() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error("🧪 Testing BloodSync Error Page - Triggered by button");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Error Page Test</h1>
      <p className="text-gray-600 mb-4">
        Click the button below to trigger an error and see the error page
      </p>
      <button
        onClick={() => setHasError(true)}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Trigger Test Error
      </button>
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Back to Home
      </Link>
    </div>
  );
}

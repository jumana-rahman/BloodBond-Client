"use client";

export default function DashboardNavbar() {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-500">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
          J
        </div>
      </div>
    </header>
  );
}
"use client";

import { useState, useEffect, useCallback } from "react";
import { protectedFetch, serverFetch } from "@/lib/core/server";
import {
  FaUsers,
  FaMoneyBillWave,
  FaHandHoldingHeart,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// ── Pie chart status colors ──────────────────────────────────
const STATUS_COLORS = {
  Canceled: "#6b7280", // gray
  Done: "#22c55e", // green
  Inprogress: "#3b82f6", // blue
  Pending: "#f59e0b", // amber
};
const FALLBACK_COLORS = ["#f59e0b", "#3b82f6", "#22c55e", "#6b7280", "#ef4444"];

// ── Custom Pie label ──────────────────────────────────────────
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  viewBox,
}) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const isMobile = viewBox?.width && viewBox.width < 500;
  const fontSize = isMobile ? 10 : 12;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ── Stat card ────────────────────────────────────────────────
function StatCard({ icon, label, value, iconBg, iconColor }) {
  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100
                    flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow min-w-0"
    >
      <div
        className={`w-14 h-14 shrink-0 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
        <p
          className="text-xl lg:text-2xl font-bold text-gray-900 break-all"
          title={String(value)}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function DashboardClient({ user }) {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalFunding: 0,
    totalRequests: 0,
  });
  const [statusData, setStatusData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: Responsive Pie Radius State and Effect MUST be declared at the TOP
  const [pieRadius, setPieRadius] = useState(105);
  useEffect(() => {
    const handleResize = () => {
      setPieRadius(window.innerWidth < 640 ? 80 : 105);
    };
    handleResize(); // Set on initial load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAdminOrVolunteer =
    user?.role === "admin" || user?.role === "volunteer";

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const [donorsRes, fundingRes, requestsRes, statusRes, weeklyRes] =
        await Promise.all([
          serverFetch("/api/users/count"),
          protectedFetch("/api/funding/total"),
          serverFetch("/api/donation-requests/count"),
          serverFetch("/api/donation-requests/status-breakdown"),
          serverFetch("/api/donation-requests/weekly-stats"),
        ]);

      setStats({
        totalDonors: donorsRes?.success ? donorsRes.count : 0,
        totalFunding: fundingRes?.success ? fundingRes.totalAmount : 0,
        totalRequests: requestsRes?.success ? requestsRes.count : 0,
      });
      setStatusData(statusRes?.success ? statusRes.data : []);
      setWeeklyData(weeklyRes?.success ? weeklyRes.data : []);
    } catch (error) {
      console.error("Dashboard stats fetch failed:", error);
      toast.error("Could not load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }

  const formattedFunding = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(stats.totalFunding);

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Welcome ─────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 break-words leading-tight">
          Welcome back, <span className="text-red-600">{user?.name}</span>!
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-500">
          {isAdminOrVolunteer
            ? "Here is an overview of your platform's activity."
            : "Track your donation requests and help save lives."}
        </p>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1  xl:grid-cols-2 gap-5 mb-10">
        <StatCard
          icon={<FaUsers size={26} />}
          label="Total Donors"
          value={stats.totalDonors.toLocaleString()}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={<FaMoneyBillWave size={26} />}
          label="Total Funding"
          value={formattedFunding}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          icon={<FaHandHoldingHeart size={26} />}
          label="Blood Requests"
          value={stats.totalRequests.toLocaleString()}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      {/* ── Charts (Admin & Volunteer only) ─────────────────── */}
      {isAdminOrVolunteer && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Request Status Distribution
            </h2>

            <div className="h-[220px] md:h-[260px] w-full flex-grow">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={pieRadius}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomLabel}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            STATUS_COLORS[entry.name] ??
                            FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} requests`, name]}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm">No status data yet.</p>
                </div>
              )}
            </div>

            {statusData.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {statusData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full inline-block shrink-0"
                      style={{
                        background:
                          STATUS_COLORS[entry.name] ??
                          FALLBACK_COLORS[index % FALLBACK_COLORS.length],
                      }}
                    />
                    <span className="text-xs text-gray-600 truncate">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Weekly Requests (Last 7 Days)
            </h2>
            <div className="h-[240px] md:h-[300px] w-full flex-grow">
              {weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barCategoryGap="35%">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} requests`, "Count"]}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                      cursor={{ fill: "#fef2f2" }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#dc2626"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm">
                    No activity in the last 7 days.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

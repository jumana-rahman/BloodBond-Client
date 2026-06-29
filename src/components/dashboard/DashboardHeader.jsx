'use client';

import { Avatar } from '@heroui/react';
import { FaBars, FaBell } from 'react-icons/fa';

export default function DashboardHeader({ user, toggleSidebar }) {
  // ── Initials helper (same logic as UserDropdown) ──────────
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between shrink-0">
      {/* ── Left: Hamburger + Page Title ── */}
      <div className="flex items-center gap-3">
        {/* ✅ FIX 1: Mobile hamburger to open sidebar */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Open sidebar"
        >
          <FaBars size={18} />
        </button>

        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-800 leading-tight">
            Dashboard
          </h2>
          {/* ✅ FIX 2: Role badge under title — useful context at a glance */}
          {user?.role && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : user.role === 'volunteer'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
              }`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* ── Right: Bell + User info ── */}
      <div className="flex items-center gap-3">
        {/* ✅ FIX 3: Bell with proper accessible label */}
        <button
          className="relative p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Notifications"
        >
          <FaBell size={18} />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* ✅ FIX 4: User info — name + avatar, no redundant wrapper div */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-800 leading-tight truncate max-w-[140px]">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 truncate max-w-[140px]">
              {user?.email}
            </p>
          </div>

          {/* ✅ FIX 5: Clean Avatar — no pointless wrapper div around it */}
          <Avatar
            size="sm"
            className="cursor-default ring-2 ring-red-200 shrink-0 md:w-9! md:h-9!"
          >
            <Avatar.Image src={user?.image || user?.avatar} />

            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

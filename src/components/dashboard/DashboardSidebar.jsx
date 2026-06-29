'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaPlusCircle,
  FaUsers,
  FaSignOutAlt,
  FaTimes,
} from 'react-icons/fa';
import { MdSpaceDashboard } from 'react-icons/md';
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from 'react-icons/tb';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Image from 'next/image';
import { Avatar } from '@heroui/react';

const ROLE_BADGE = {
  admin: 'bg-purple-100 text-purple-700 border border-purple-200',
  volunteer: 'bg-blue-100   text-blue-700   border border-blue-200',
  donor: 'bg-red-100    text-red-700    border border-red-200',
};

export default function DashboardSidebar({ user, isOpen, toggleSidebar }) {
  const pathname = usePathname();
  const { logout } = useContext(AuthContext);
  const role = user?.role?.toLowerCase() || 'donor';
  const [collapsed, setCollapsed] = useState(false);

  // 1. Dynamic root calculation based on user's role
  const dashboardRoot = role === 'donor' ? '/dashboard/donor' : '/dashboard';

  const COMMON_ITEMS = [
    { label: 'Home', href: '/', icon: FaHome },
    { label: 'Dashboard', href: dashboardRoot, icon: MdSpaceDashboard },
    { label: 'Profile', href: '/dashboard/profile', icon: FaUser },
    {
      label: 'My Requests',
      href: '/dashboard/my-donation-requests',
      icon: FaClipboardList,
    },
    {
      label: 'Create Request',
      href: '/dashboard/create-donation-request',
      icon: FaPlusCircle,
    },
  ];

  const ROLE_ITEMS = {
    admin: [
      { label: 'All Users', href: '/dashboard/admin/all-users', icon: FaUsers },
      {
        label: 'All Requests',
        href: '/dashboard/all-blood-donation-request',
        icon: FaClipboardList,
      },
    ],
    volunteer: [
      {
        label: 'All Requests',
        href: '/dashboard/all-blood-donation-request',
        icon: FaClipboardList,
      },
    ],
    donor: [],
  };

  const navItems = [...COMMON_ITEMS, ...(ROLE_ITEMS[role] || [])];

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const handleLogout = async () => {
    await logout();
    window.location.href = '/auth/signin';
  };

  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768)
      toggleSidebar();
  };

  // collapsed only affects md+ screens
  // on mobile: always show full expanded drawer
  const isCollapsed = collapsed; // used with md: prefix everywhere

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-30
          w-72 ${isCollapsed ? 'md:w-[72px]' : 'md:w-64'}
          flex flex-col h-full
          bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* ── Logo ── */}
        <div
          className={`
            h-16 flex items-center border-b border-gray-100 shrink-0
            justify-between px-5
            ${isCollapsed ? 'md:justify-center md:px-0' : ''}
          `}
        >
          {/* Mobile + expanded desktop: full logo */}
          <Link
            href="/"
            className={`flex items-center gap-2.5 ${isCollapsed ? 'md:hidden' : ''}`}
          >
            <Image
              src="/assets/nav-logo.png"
              alt="BloodSync Logo"
              width={140}
              height={40}
              priority
              className="object-contain"
            />
            {/* <span className="text-[17px] font-bold tracking-tight text-gray-900">
              Blood<span className="text-red-600">Sync</span>
            </span> */}
          </Link>

          {/* Collapsed desktop: favicon only */}
          {isCollapsed && (
            <Link href="/" className="hidden md:flex">
              <Image
                src="/assets/logo-db.png"
                alt="BloodSync"
                width={28}
                height={28}
                className="object-contain"
              />
            </Link>
          )}

          {/* Mobile close button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* ── User card ── */}
        <div
          className={`
            border-b border-gray-100 bg-gray-50 shrink-0
            px-4 py-4
            ${isCollapsed ? 'md:px-0 md:py-4 md:flex md:justify-center' : ''}
          `}
        >
          {/* Collapsed desktop: avatar only */}
          {isCollapsed && (
            <div className="hidden md:flex justify-center">
              <Avatar size="sm" className="ring-2 ring-red-200 shrink-0">
                <Avatar.Image src={user?.image || user?.avatar} />
                <Avatar.Fallback className="bg-red-50 text-red-600 text-xs font-bold">
                  {initials}
                </Avatar.Fallback>
              </Avatar>
            </div>
          )}

          {/* Mobile + expanded desktop: full user card */}
          <div
            className={`flex items-center gap-3 ${isCollapsed ? 'md:hidden' : ''}`}
          >
            <Avatar size="sm" className="ring-2 ring-red-200 shrink-0">
              <Avatar.Image src={user?.image || user?.avatar} />
              <Avatar.Fallback className="bg-red-50 text-red-600 text-xs font-bold">
                {initials}
              </Avatar.Fallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                {user?.name}
              </p>
              <p className="text-[11px] text-gray-400 truncate mb-1">
                {user?.email}
              </p>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_BADGE[role] ?? ROLE_BADGE.donor}`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-none">
          <ul className={`space-y-0.5 px-3 ${isCollapsed ? 'md:px-2' : ''}`}>
            {navItems.map(item => {
              // 2. Updated conditional active state checks
              const isActive =
                item.href === '/' ? pathname === '/' : pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    title={isCollapsed ? item.label : undefined}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all duration-150 group relative
                      ${isCollapsed ? 'md:justify-center md:p-3 md:gap-0' : ''}
                      ${
                        isActive
                          ? 'bg-red-50 text-red-600'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    {/* Active left bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-500 rounded-r-full" />
                    )}

                    <Icon
                      size={15}
                      className={`shrink-0 ${isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'}`}
                    />

                    {/* Label: always visible on mobile, hidden when collapsed on desktop */}
                    <span
                      className={`text-sm font-medium truncate ${isCollapsed ? 'md:hidden' : ''}`}
                    >
                      {item.label}
                    </span>

                    {/* Active dot */}
                    {isActive && (
                      <span
                        className={`ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 ${isCollapsed ? 'md:hidden' : ''}`}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Help box: hidden when collapsed on desktop ── */}
        <div
          className={`mx-3 mb-3 p-3 rounded-xl bg-red-50 border border-red-100 ${isCollapsed ? 'md:hidden' : ''}`}
        >
          <p className="text-xs font-semibold text-red-700 mb-0.5">
            Need help?
          </p>
          <p className="text-[11px] text-red-400 leading-relaxed">
            Contact support or visit our docs anytime.
          </p>
        </div>

        {/* ── Bottom ── */}
        <div className="border-t border-gray-100 p-3 shrink-0 flex flex-col gap-2">
          {/* Collapse toggle — desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              hidden md:flex items-center rounded-lg px-3 py-2.5
              text-gray-400 hover:text-gray-700 hover:bg-gray-50
              transition-all duration-150
              ${isCollapsed ? 'md:justify-center md:p-3' : 'gap-3'}
            `}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <TbLayoutSidebarLeftExpand size={17} />
            ) : (
              <>
                <TbLayoutSidebarLeftCollapse size={17} />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center rounded-lg gap-3 px-3 py-2.5
              bg-red-50 hover:bg-red-100
              text-red-600 hover:text-red-700
              border border-red-200
              transition-all duration-150
              ${isCollapsed ? 'md:justify-center md:p-3 md:gap-0' : ''}
            `}
            title={isCollapsed ? 'Sign out' : undefined}
          >
            <FaSignOutAlt size={14} className="shrink-0" />
            <span
              className={`text-sm font-semibold ${isCollapsed ? 'md:hidden' : ''}`}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

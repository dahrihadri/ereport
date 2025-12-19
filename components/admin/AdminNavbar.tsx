'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FolderTree,
} from 'lucide-react';
import SignOutButton from './SignOutButton';

interface AdminNavbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function AdminNavbar({
  user,
  activeTab = 'users',
  onTabChange,
}: AdminNavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  const tabs = [
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'sectors', label: 'Sectors', icon: Building2, href: '/admin/sectors' },
    {
      id: 'divisions',
      label: 'Divisions',
      icon: FolderTree,
      href: '/admin/divisions',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Briefcase,
      href: '/admin/projects',
    },
  ];

  const handleTabClick = (tab: (typeof tabs)[0]) => {
    onTabChange?.(tab.id);
    router.push(tab.href);
    setShowMobileMenu(false);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image
                src="/MCMC_Logo.png"
                alt="MCMC Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                DMDPR Admin
              </h1>
              <p className="text-xs text-gray-500 hidden md:block">
                System Administration Panel
              </p>
            </div>
            <h1 className="text-lg font-bold text-gray-800 sm:hidden">
              DMDPR Admin
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Back to Dashboard Link */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {user?.name.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role.replace('_', ' ') || 'System Admin'}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    showUserMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile Settings
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      User Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <div className="px-2">
                      <SignOutButton variant="text" className="w-full justify-start px-2" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation - Desktop */}
      <div className="hidden md:block bg-white border-t border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Admin Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      isActive
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4 space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {user?.name.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'admin@mcmc.gov.my'}
                </p>
                <p className="text-xs text-red-600 font-medium">
                  {user?.role.replace('_', ' ') || 'System Admin'}
                </p>
              </div>
            </div>

            {/* Admin Tabs */}
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}

            <hr className="border-gray-200" />

            {/* Navigation Links */}
            <Link
              href="/dashboard"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              User Dashboard
            </Link>

            <Link
              href="/profile"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              Profile Settings
            </Link>

            <Link
              href="/settings"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>

            <hr className="border-gray-200" />

            <SignOutButton variant="text" className="w-full justify-start px-3 hover:bg-red-50 rounded-lg py-2.5" />
          </div>
        </div>
      )}
    </nav>
  );
}

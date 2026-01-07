'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, ChevronDown, User, Settings, ClipboardList, LogOut, Menu, X, Calendar, LayoutDashboard, BarChart3, Shield } from 'lucide-react';
import { mockReportsWithRelations } from '@/lib/mock-data';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    router.push('/login');
  };

  // Generate notifications from actual mock data
  const generateNotifications = () => {
    const notifs = [];
    const reports = mockReportsWithRelations;

    // Get the first few reports and create notifications based on their status
    if (reports[0]) {
      notifs.push({
        id: '1',
        title: 'Report Approved',
        message: `Your report "${reports[0].title}" has been approved by ${reports[0].createdBy.name}`,
        type: 'success' as const,
        time: '5 minutes ago',
        read: false,
        reportId: reports[0].id,
      });
    }

    if (reports[1]) {
      notifs.push({
        id: '2',
        title: 'New Comment',
        message: `${reports[1].createdBy.name} commented on "${reports[1].title}"`,
        type: 'info' as const,
        time: '1 hour ago',
        read: false,
        reportId: reports[1].id,
      });
    }

    if (reports[4]) {
      notifs.push({
        id: '3',
        title: 'Report Returned for Revision',
        message: `Your report "${reports[4].title}" needs revision. Please check the feedback.`,
        type: 'error' as const,
        time: '2 hours ago',
        read: false,
        reportId: reports[4].id,
      });
    }

    if (reports[3]) {
      notifs.push({
        id: '4',
        title: 'Draft Report',
        message: `You have a draft report "${reports[3].title}" waiting for submission`,
        type: 'info' as const,
        time: '3 hours ago',
        read: true,
        reportId: reports[3].id,
      });
    }

    if (reports[2]) {
      notifs.push({
        id: '5',
        title: 'Report Awaiting Approval',
        message: `Report "${reports[2].title}" is awaiting final approval`,
        type: 'warning' as const,
        time: '5 hours ago',
        read: true,
        reportId: reports[2].id,
      });
    }

    return notifs;
  };

  const notifications = generateNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link href="/dashboard" className="flex items-center gap-3 sm:gap-4 hover:opacity-80 transition-opacity">
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
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">DMDPR</h1>
              <p className="text-xs text-gray-500 hidden md:block">Project Management System</p>
            </div>
            <h1 className="text-lg font-bold text-gray-800 sm:hidden">DMDPR</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link
              href="/summary"
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">Summary</span>
            </Link>
            <Link
              href="/calendar"
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Calendar</span>
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </>
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[600px] flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                        <p className="text-xs text-gray-500">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
                      </div>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                        Mark all as read
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                          <Bell className="w-16 h-16 mb-3 opacity-30" />
                          <p className="text-sm font-medium">No notifications</p>
                          <p className="text-xs mt-1">You&apos;re all caught up!</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => {
                                if (notification.reportId) {
                                  setShowNotifications(false);
                                  router.push(`/reports/${notification.reportId}`);
                                }
                              }}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer group ${
                                !notification.read ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                {getNotificationIcon(notification.type)}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                      {notification.title}
                                    </h4>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-3 border-t border-gray-200">
                        <Link
                          href="/notifications"
                          onClick={() => setShowNotifications(false)}
                          className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold py-1"
                        >
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {user?.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-gray-800">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Employee'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile Settings
                    </Link>
                    {user?.role === 'SYSTEM_ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
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
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {user?.name.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@mcmc.gov.my'}</p>
                <p className="text-xs text-blue-600 font-medium">{user?.role || 'Employee'}</p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            <Link
              href="/calendar"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Calendar
            </Link>

            <Link
              href="/notifications"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/profile"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              Profile Settings
            </Link>

            <Link
              href="/tasks"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <ClipboardList className="w-5 h-5" />
              My Tasks
            </Link>

            <Link
              href="/settings"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>

            <hr className="border-gray-200" />

            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

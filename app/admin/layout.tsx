'use client';

import { useRouter } from 'next/navigation';
import { Users, Building2, Briefcase, FolderTree } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useCurrentUser } from '@/lib/use-current-user';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const currentUser = useCurrentUser();

  // Auth check - redirect non-admin users
  useEffect(() => {
    if (currentUser && currentUser.role !== 'SYSTEM_ADMIN') {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const tabs = [
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'sectors', label: 'Sectors', icon: Building2, href: '/admin/sectors' },
    { id: 'divisions', label: 'Divisions', icon: FolderTree, href: '/admin/divisions' },
    { id: 'projects', label: 'Projects', icon: Briefcase, href: '/admin/projects' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-bold">A</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-2 sm:px-0"
            >
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0" aria-label="Admin Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    router.push(tab.href);
                  }}
                  className={`
                    flex items-center space-x-1.5 sm:space-x-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap
                    ${isActive
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Welcome Banner */}
          <div
            className="relative rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl overflow-hidden h-32 sm:h-40 flex flex-col justify-center"
            style={{
              backgroundImage: 'url(/balanceCard.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="mb-0">
                <p className="text-xs sm:text-sm opacity-90">
                  Peace Be Upon You! {currentUser?.name.toUpperCase() || 'ADMIN'}
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                  Welcome to Admin Panel
                </h2>
              </div>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

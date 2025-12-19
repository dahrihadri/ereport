'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useCurrentUser } from '@/lib/use-current-user';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { motion } from 'framer-motion';

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

  // Detect active tab from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/users')) setActiveTab('users');
      else if (path.includes('/sectors')) setActiveTab('sectors');
      else if (path.includes('/divisions')) setActiveTab('divisions');
      else if (path.includes('/projects')) setActiveTab('projects');
    }
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <AdminNavbar
        user={{
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Welcome Banner */}
            <div
              className="relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl overflow-hidden h-32 sm:h-40 flex flex-col justify-center"
              style={{
                backgroundImage: 'url(/balanceCard.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
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
          </motion.div>
        </div>
      </main>
    </div>
  );
}

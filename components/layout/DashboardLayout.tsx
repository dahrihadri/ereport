'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/main/Navbar';
import RightSidebar from '@/components/main/RightSidebar';
import { Task, User } from '@/types';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
  };
  currentUser?: User;
  onTaskClick?: (task: Task) => void;
}

export default function DashboardLayout({ children, user, currentUser, onTaskClick }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar user={user} />

      <div className="flex-1 overflow-hidden">
        {/* Main Grid Layout with fixed height */}
        <div className="grid grid-cols-1 xl:grid-cols-3 h-[calc(100vh-64px)]">

          {/* LEFT SIDE - Main Content with independent scroll */}
          <motion.div
            className="xl:col-span-2 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-5 md:space-y-6 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Curved edge decoration - just the border curve */}
            <div className="hidden xl:block absolute top-0 right-0 h-full w-1 pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 10 100" preserveAspectRatio="none">
                <path d="M10,0 Q5,50 10,100" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {children}
          </motion.div>

          {/* RIGHT SIDE - Sidebar with independent scroll - Hidden on mobile */}
          <div className="hidden xl:block xl:col-span-1 overflow-y-auto">
            <RightSidebar onTaskClick={onTaskClick} currentUser={currentUser} />
          </div>
        </div>
      </div>

      {/* Floating Action Button - Only visible on mobile/tablet */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="xl:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all active:scale-95"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile/Tablet Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="xl:hidden fixed top-16 right-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <RightSidebar
                currentUser={currentUser}
                onTaskClick={(task) => {
                  onTaskClick?.(task);
                  setIsSidebarOpen(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

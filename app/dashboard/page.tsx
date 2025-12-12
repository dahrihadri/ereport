'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import RightSidebar from '@/components/RightSidebar';
import TaskModal from '@/components/TaskModal';
import ReportStatusBadge from '@/components/ReportStatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import { ReportWithRelations, Task } from '@/types';
import { mockReportsWithRelations, getUserById } from '@/lib/mock-data';
import { Plus, ListTodo, Timer, CheckCircle2, NotebookIcon, FileText, Clock, Inbox } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [reports] = useState<ReportWithRelations[]>(mockReportsWithRelations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  // Simulating current user
  const currentUser = getUserById('user-1');

  const stats = {
    total: reports.length,
    draft: reports.filter(r => r.currentStatus === 'draft').length,
    underReview: reports.filter(r =>
      r.currentStatus === 'under_review_sector' ||
      r.currentStatus === 'under_review_dmd'
    ).length,
    approved: reports.filter(r => r.currentStatus === 'final_approved').length,
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleCreateReport = () => {
    setSelectedTask(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Partial<Task>) => {
    console.log('Save task:', task);
    // TODO: Add task to reports list
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        user={{
          name: currentUser?.name || 'Ahmad Faizal',
          email: currentUser?.email || 'ahmad.faizal@mcmc.gov.my',
          role: 'DMDD',
        }}
      />

      <div className="w-full">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 min-h-[calc(100vh-64px)]">

          {/* LEFT SIDE - Account Overview & Stats */}
          <motion.div
            className="xl:col-span-2 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-5 md:space-y-6 relative"
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

           {/* Balance Card */}
            <div
              className="relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl overflow-hidden h-40 flex flex-col justify-center"
              style={{
                backgroundImage: 'url(/balanceCard.png)',
                backgroundSize: '100',
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
                    Peace Be Upon You! {currentUser?.name.toUpperCase()}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">
                    You have {reports.length} Reports
                  </h2>
                </div>
              </div>
            </div>
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StatCard
                title="Total Reports"
                value={stats.total}
                color="blue"
                icon={ListTodo}
                subtitle="All reports"
                //backgroundImage="/totalReport.png"
              />
              <StatCard
                title="Under Review"
                value={stats.underReview}
                color="purple"
                icon={Timer}
                subtitle="In progress"
                //backgroundImage="/underReviewCard.png"
              />
              <StatCard
                title="Approved"
                value={stats.approved}
                color="green"
                icon={CheckCircle2}
                subtitle="Completed"
              />
              <StatCard
                title="Draft"
                value={stats.draft}
                color="yellow"
                icon={NotebookIcon}
                subtitle="Not submitted"
              />
            </div>

            {/* My Reports Overview Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">My Reports Overview</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {/* Main Report Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 sm:p-5 md:p-6 text-white col-span-1 md:col-span-3">
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm opacity-90">IT Development Division</p>
                    <h4 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                      {reports.length} Active Reports
                    </h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs opacity-75">Division Code: DIV-IT-DEV</p>
                    <div className="hidden sm:flex gap-4 md:gap-8 opacity-50">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="w-1 h-1 bg-white rounded-full"></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Create New Report */}
                <div
                  onClick={handleCreateReport}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-5 border-2 border-green-200 flex flex-col items-center justify-center hover:border-green-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-green-600 transition-all shadow-md">
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-green-700 text-center">Create New Report</p>
                </div>

                {/* My Drafts */}
                <Link
                  href="/reports?status=draft"
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 sm:p-5 border-2 border-yellow-200 flex flex-col items-center justify-center hover:border-yellow-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-yellow-600 transition-all shadow-md relative">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    {stats.draft > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {stats.draft}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-yellow-700 text-center">My Drafts</p>
                </Link>

                {/* Awaiting My Action */}
                <Link
                  href="/reports?filter=awaiting-action"
                  className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 sm:p-5 border-2 border-orange-200 flex flex-col items-center justify-center hover:border-orange-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-orange-600 transition-all shadow-md relative">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    {stats.underReview > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {stats.underReview}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-orange-700 text-center">Awaiting Action</p>
                </Link>

                {/* View All Reports */}
                <Link
                  href="/reports"
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 border-2 border-blue-200 flex flex-col items-center justify-center hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-blue-600 transition-all shadow-md relative">
                    <Inbox className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <span className="absolute -top-1 -right-1 bg-blue-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {stats.total}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-blue-700 text-center">All Reports</p>
                </Link>

                {/* Approved Reports */}
                <Link
                  href="/reports?status=approved"
                  className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 sm:p-5 border-2 border-green-200 flex flex-col items-center justify-center hover:border-green-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-emerald-600 transition-all shadow-md relative">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    {stats.approved > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {stats.approved}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-green-700 text-center">Approved</p>
                </Link>
              </div>
            </div>

            {/* Promotional Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                    Your Workflow Status at a Glance!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Track your reports through the 3-tier approval process – No Extra Effort Needed!
                  </p>
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all">
                    View All Reports
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - Recent Reports & Create New */}
          <RightSidebar onCreateReport={handleCreateReport} onTaskClick={handleTaskClick} />
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        mode={modalMode}
      />
    </div>
  );
}

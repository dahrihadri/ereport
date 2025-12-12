'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import TaskModal from '@/components/ui/TaskModal';
import AwaitingActionWidget from '@/components/dashboard/AwaitingActionWidget';
import OverdueReportsWidget from '@/components/dashboard/OverdueReportsWidget';
import MyDivisionReports from '@/components/dashboard/MyDivisionReports';
import { ReportWithRelations, Task } from '@/types';
import { mockReportsWithRelations, getUserById } from '@/lib/mock-data';
import { ListTodo, Timer, CheckCircle2, NotebookIcon } from 'lucide-react';

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

  const handleSaveTask = (task: Partial<Task>) => {
    console.log('Save task:', task);
    // TODO: Add task to reports list
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout
      user={{
        name: currentUser?.name || 'Ahmad Faizal',
        email: currentUser?.email || 'ahmad.faizal@mcmc.gov.my',
        role: 'DMDD',
      }}
      onTaskClick={handleTaskClick}
    >
      {/* Balance Card */}
      <div
        className="relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl overflow-hidden h-40 flex flex-col justify-center"
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
              Peace Be Upon You! {currentUser?.name.toUpperCase()}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">
              Welcome to Your Dashboard
            </h2>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Reports"
          value={stats.total}
          color="blue"
          icon={ListTodo}
          subtitle="All reports"
          href="/reports"
        />
        <StatCard
          title="Under Review"
          value={stats.underReview}
          color="purple"
          icon={Timer}
          subtitle="In progress"
          href="/reports?status=under_review"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          color="green"
          icon={CheckCircle2}
          subtitle="Completed"
          href="/reports?status=approved"
        />
        <StatCard
          title="Draft"
          value={stats.draft}
          color="yellow"
          icon={NotebookIcon}
          subtitle="Not submitted"
          href="/reports?status=draft"
        />
      </div>

      {/* Awaiting Action Widget */}
      <AwaitingActionWidget
        reports={reports}
        userRole={currentUser?.role || 'HEAD_OF_DIVISION'}
        userId={currentUser?.id || 'user-1'}
      />

      {/* Overdue Reports Widget */}
      <OverdueReportsWidget
        reports={reports}
        userRole={currentUser?.role || 'HEAD_OF_DIVISION'}
        userId={currentUser?.id || 'user-1'}
      />

      {/* My Division Reports - Only for HoD and Secretary */}
      {(currentUser?.role === 'HEAD_OF_DIVISION' || currentUser?.role === 'DIVISION_SECRETARY') && (
        <MyDivisionReports
          reports={reports}
          divisionId={currentUser?.divisionIds?.[0] || 'div-1'}
          divisionName="IT Development Division"
        />
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        mode={modalMode}
      />
    </DashboardLayout>
  );
}

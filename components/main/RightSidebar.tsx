'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TimelineView from '@/components/TimelineView';
import { ReportStatus, ReportWithRelations, Task, User } from '@/types';
import { mockReportsWithRelations, mockUsers } from '@/lib/mock-data';
import { Plus, FileText, Timer, CheckCircle2, FileEdit } from 'lucide-react';
import SimpleStatCard from '@/components/ui/SimpleStatCard';
import { filterReportsByUserRole } from '@/lib/permissions';

interface RightSidebarProps {
  currentUser?: User;
}

export default function RightSidebar({ currentUser }: RightSidebarProps) {
  const router = useRouter();

  // Use default user if not provided (for demo purposes)
  const user = currentUser || mockUsers[0]; // Default to Ahmad Faizal (HoD)

  // Filter reports based on user's role
  const userReports = useMemo(
    () => filterReportsByUserRole(mockReportsWithRelations, user),
    [user]
  );

  const [reports] = useState<ReportWithRelations[]>(userReports);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all');

  // Calculate statistics
  const stats = {
    total: reports.length,
    draft: reports.filter(r => r.currentStatus === 'draft').length,
    underReview: reports.filter(r =>
      r.currentStatus === 'under_review_sector' ||
      r.currentStatus === 'under_review_dmd'
    ).length,
    approved: reports.filter(r => r.currentStatus === 'final_approved').length,
  };

  const filteredReports = filterStatus === 'all'
    ? reports
    : reports.filter(r => r.currentStatus === filterStatus);

  // Convert reports to tasks for Timeline view compatibility
  const tasksFromReports: Task[] = filteredReports.map(report => ({
    id: report.id,
    title: report.title,
    description: report.summary,
    status: 'in_progress' as const,
    priority: report.priority,
    assignedTo: report.createdBy.name,
    assignedToEmail: report.createdBy.email,
    createdBy: report.createdBy.name,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    startDate: report.createdAt,
    endDate: report.updatedAt,
    completionLevel: 'in_progress' as const,
    department: report.division.name,
    tags: [report.project.code],
  }));

  const handleTaskClick = (task: Task) => {
    // Navigate to the report detail page
    router.push(`/reports/${task.id}`);
  };

  const handleCreateReport = () => {
    // Navigate to create report page instead of opening modal
    router.push('/reports/create');
  };

  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-200 px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 flex flex-col gap-4 sm:gap-5 md:gap-6 h-full">

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3">
        <SimpleStatCard
          title="Total"
          value={stats.total}
          icon={FileText}
          color="blue"
          subtitle="Reports"
          href="/reports"
        />
        <SimpleStatCard
          title="Review"
          value={stats.underReview}
          icon={Timer}
          color="blue"
          subtitle="Pending"
          href="/reports?status=under_review"
        />
        <SimpleStatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle2}
          color="blue"
          subtitle="Done"
          href="/reports?status=approved"
        />
        <SimpleStatCard
          title="Draft"
          value={stats.draft}
          icon={FileEdit}
          color="blue"
          subtitle="Drafts"
          href="/reports?status=draft"
        />
      </div>

      {/* Create New Report Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
        <button
          onClick={handleCreateReport}
          className="w-full bg-white text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 sm:w-5 sm:h-5" />
          Create New Report
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4">
        <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Filter Reports</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ReportStatus | 'all')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">All Reports</option>
          <option value="draft">Draft</option>
          <option value="submitted_to_sector">Submitted</option>
          <option value="under_review_sector">Under Review (Sector)</option>
          <option value="under_review_dmd">Under Review (DMD)</option>
          <option value="final_approved">Final Approved</option>
          <option value="returned_for_revision_sector">Returned</option>
        </select>
      </div>

      {/* Recent Reports Timeline */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Recent Reports</h3>
            <span className="bg-blue-100 text-blue-700 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold">
              {filteredReports.length}
            </span>
          </div>
        </div>

        <div className="overflow-y-auto p-3 sm:p-4 flex-1 min-h-0">
          <TimelineView tasks={tasksFromReports} onTaskClick={handleTaskClick} />
        </div>
      </div>
    </div>
  );
}

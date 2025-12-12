'use client';

import { useRouter } from 'next/navigation';
import { ReportWithRelations, UserRole } from '@/types';
import { AlertCircle, Calendar, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import ReportStatusBadge from '@/components/ui/ReportStatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import CompactStatCard from '@/components/ui/CompactStatCard';

interface OverdueReportsWidgetProps {
  reports: ReportWithRelations[];
  userRole: UserRole;
  userId: string;
}

export default function OverdueReportsWidget({ reports, userRole, userId }: OverdueReportsWidgetProps) {
  const router = useRouter();

  // Calculate overdue reports based on updatedAt (example: 7 days without update)
  const getOverdueReports = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return reports.filter(report => {
      const isOverdue = new Date(report.updatedAt) < sevenDaysAgo;
      const isNotCompleted = report.currentStatus !== 'final_approved' && report.currentStatus !== 'cancelled';

      // Role-based filtering
      switch (userRole) {
        case 'HEAD_OF_DIVISION':
        case 'DIVISION_SECRETARY':
          // Only show my division's overdue reports
          return isOverdue && isNotCompleted && report.createdBy.id === userId;

        case 'CHIEF_OF_SECTOR':
          // Show all sector reports under review
          return isOverdue && isNotCompleted &&
            (report.currentStatus === 'under_review_sector' || report.currentStatus === 'submitted_to_sector');

        case 'DEPUTY_MD':
          // Show all reports awaiting DMD review
          return isOverdue && isNotCompleted &&
            (report.currentStatus === 'under_review_dmd' || report.currentStatus === 'approved_by_sector');

        default:
          return isOverdue && isNotCompleted;
      }
    });
  };

  const overdueReports = getOverdueReports();

  const getDaysOverdue = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getSeverityColor = (daysOverdue: number) => {
    if (daysOverdue >= 14) return 'red'; // Critical: 2+ weeks
    if (daysOverdue >= 10) return 'orange'; // High: 10+ days
    return 'yellow'; // Medium: 7-9 days
  };

  if (overdueReports.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Overdue Reports</h3>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold text-gray-800">All On Track!</p>
              <p className="text-xs sm:text-sm text-gray-600">No reports are overdue</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mediumOverdue = overdueReports.filter(r => getDaysOverdue(r.updatedAt) < 10).length;
  const highOverdue = overdueReports.filter(r => {
    const days = getDaysOverdue(r.updatedAt);
    return days >= 10 && days < 14;
  }).length;
  const criticalOverdue = overdueReports.filter(r => getDaysOverdue(r.updatedAt) >= 14).length;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Overdue Reports</h3>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
        <CompactStatCard
          title="Total Overdue"
          value={overdueReports.length}
          color="red"
          icon={AlertCircle}
          subtitle="7+ days"
        />
        <CompactStatCard
          title="7-9 Days"
          value={mediumOverdue}
          color="yellow"
          icon={Clock}
          subtitle="Medium"
        />
        <CompactStatCard
          title="10-14 Days"
          value={highOverdue}
          color="orange"
          icon={AlertTriangle}
          subtitle="High"
        />
        <CompactStatCard
          title="14+ Days"
          value={criticalOverdue}
          color="red"
          icon={AlertCircle}
          subtitle="Critical"
        />
      </div>

      {/* Reports List */}
      <div className="space-y-2 sm:space-y-3">
        {overdueReports.slice(0, 3).map((report) => {
          const daysOverdue = getDaysOverdue(report.updatedAt);

          return (
            <div
              key={report.id}
              onClick={() => router.push(`/reports/${report.id}`)}
              className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-red-300 hover:shadow-sm transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  {/* Overdue Badge & Priority */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                    <div className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs sm:text-sm font-bold flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {daysOverdue}d overdue
                    </div>
                    <PriorityBadge priority={report.priority} />
                    <ReportStatusBadge status={report.currentStatus} />
                  </div>

                  {/* Title */}
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-1.5 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {report.title}
                  </h4>

                  {/* Meta Info */}
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
                    <span className="truncate max-w-[120px] sm:max-w-none">{report.division.name}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="whitespace-nowrap text-xs sm:text-sm">Updated: {new Date(report.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Arrow */}
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-all">
                  <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-600 group-hover:text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Link */}
      {overdueReports.length > 3 && (
        <button
          onClick={() => router.push('/reports?overdue=true')}
          className="mt-3 sm:mt-4 w-full text-sm sm:text-base text-red-600 hover:text-red-700 font-semibold py-2.5 sm:py-3 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all active:scale-[0.98]"
        >
          View All {overdueReports.length} Overdue Reports →
        </button>
      )}
    </div>
  );
}

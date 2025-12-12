'use client';

import { useRouter } from 'next/navigation';
import { ReportWithRelations, UserRole } from '@/types';
import { Bell, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import ReportStatusBadge from '@/components/ui/ReportStatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';

interface AwaitingActionWidgetProps {
  reports: ReportWithRelations[];
  userRole: UserRole;
  userId: string;
}

export default function AwaitingActionWidget({ reports, userRole, userId }: AwaitingActionWidgetProps) {
  const router = useRouter();

  // Filter reports that need action based on role
  const getReportsNeedingAction = () => {
    switch (userRole) {
      case 'HEAD_OF_DIVISION':
        // Reports returned for revision (from Sector or DMD)
        return reports.filter(r =>
          (r.currentStatus === 'returned_for_revision_sector' ||
           r.currentStatus === 'returned_for_revision_dmd') &&
          r.createdBy.id === userId
        );

      case 'DIVISION_SECRETARY':
        // Drafts created by secretary that need completion
        return reports.filter(r =>
          r.currentStatus === 'draft' &&
          r.createdBy.id === userId
        );

      case 'CHIEF_OF_SECTOR':
        // Reports submitted to sector for review
        return reports.filter(r =>
          (r.currentStatus === 'submitted_to_sector' ||
           r.currentStatus === 'under_review_sector')
        );

      case 'DEPUTY_MD':
        // Reports approved by sector, awaiting DMD review
        return reports.filter(r =>
          (r.currentStatus === 'approved_by_sector' ||
           r.currentStatus === 'under_review_dmd')
        );

      default:
        return [];
    }
  };

  const actionableReports = getReportsNeedingAction();

  const getActionText = () => {
    switch (userRole) {
      case 'HEAD_OF_DIVISION':
        return 'Needs Revision';
      case 'DIVISION_SECRETARY':
        return 'Draft to Complete';
      case 'CHIEF_OF_SECTOR':
        return 'Awaiting Review';
      case 'DEPUTY_MD':
        return 'Awaiting Approval';
      default:
        return 'Needs Action';
    }
  };

  const getActionIcon = () => {
    switch (userRole) {
      case 'HEAD_OF_DIVISION':
        return <AlertTriangle className="w-5 h-5" />;
      case 'DIVISION_SECRETARY':
        return <Clock className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  if (actionableReports.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-semibold text-gray-800">All Caught Up!</p>
            <p className="text-xs sm:text-sm text-gray-600">No items need your attention right now</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              {getActionIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-bold text-gray-800 truncate">Awaiting Your Action</p>
              <p className="text-xs sm:text-sm text-orange-600 font-medium truncate">{getActionText()}</p>
            </div>
          </div>
          <div className="bg-orange-600 px-2.5 sm:px-3 py-1 rounded-full flex-shrink-0">
            <span className="text-white font-bold text-sm sm:text-base">{actionableReports.length}</span>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-2 sm:space-y-3">
        {actionableReports.slice(0, 3).map((report) => (
          <div
            key={report.id}
            onClick={() => router.push(`/reports/${report.id}`)}
            className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                {/* Priority & Status */}
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                  <PriorityBadge priority={report.priority} />
                  <ReportStatusBadge status={report.currentStatus} />
                </div>

                {/* Title */}
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-1.5 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {report.title}
                </h4>

                {/* Meta Info */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
                  <span className="truncate max-w-[150px] sm:max-w-none">{report.division.name}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">{new Date(report.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Arrow */}
              <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-all">
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-600 group-hover:text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      {actionableReports.length > 3 && (
        <button
          onClick={() => router.push('/reports')}
          className="mt-3 sm:mt-4 w-full text-sm sm:text-base text-orange-600 hover:text-orange-700 font-semibold py-2.5 sm:py-3 hover:bg-orange-50 rounded-lg sm:rounded-xl transition-all active:scale-[0.98]"
        >
          View All {actionableReports.length} Items →
        </button>
      )}
    </div>
  );
}

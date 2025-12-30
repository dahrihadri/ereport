'use client';

import { useRouter } from 'next/navigation';
import { ReportWithRelations, UserRole } from '@/types';
import { Bell, Clock, AlertTriangle, ArrowRight, Flame, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import ReportStatusBadge from '@/components/ui/ReportStatusBadge';
import { useMemo, useState } from 'react';

interface AwaitingActionWidgetProps {
  reports: ReportWithRelations[];
  userRole: UserRole;
  userId: string;
}

export default function AwaitingActionWidget({ reports, userRole, userId }: AwaitingActionWidgetProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Sort reports by priority (critical > high > medium > low) and then by date
  const sortedReports = useMemo(() => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...actionableReports].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });
  }, [actionableReports]);

  // Count by priority for summary
  const priorityCounts = useMemo(() => ({
    critical: actionableReports.filter(r => r.priority === 'critical').length,
    high: actionableReports.filter(r => r.priority === 'high').length,
    medium: actionableReports.filter(r => r.priority === 'medium').length,
    low: actionableReports.filter(r => r.priority === 'low').length,
  }), [actionableReports]);

  // Adaptive display limits based on data volume
  const getDisplayLimit = () => {
    const total = actionableReports.length;
    if (total <= 3) return total;
    if (total <= 10) return 5;
    return 8; // Show more items for large datasets
  };

  const displayLimit = getDisplayLimit();
  const isCompactMode = actionableReports.length > 5; // More aggressive compact mode

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
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          {/* Subtle animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold text-gray-800">All Caught Up!</p>
              <p className="text-xs sm:text-sm text-gray-600">No items need your attention right now</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5 relative overflow-hidden group/header">
        {/* Subtle animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover/header:shadow-md transition-shadow duration-200">
                {getActionIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-bold text-gray-800 truncate">Awaiting Your Action</p>
                <p className="text-xs sm:text-sm text-orange-600 font-medium truncate">{getActionText()}</p>
              </div>
            </div>
            <div className="bg-orange-600 px-2.5 sm:px-3 py-1 rounded-full flex-shrink-0 shadow-md group-hover/header:shadow-lg group-hover/header:scale-105 transition-all duration-200">
              <span className="text-white font-bold text-sm sm:text-base">{actionableReports.length}</span>
            </div>
          </div>

          {/* Priority Summary - Only show if there are items */}
          {(priorityCounts.critical > 0 || priorityCounts.high > 0) && (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-3 border-t border-orange-200/50">
              {priorityCounts.critical > 0 && (
                <div className="flex items-center gap-1.5 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{priorityCounts.critical} Critical</span>
                </div>
              )}
              {priorityCounts.high > 0 && (
                <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{priorityCounts.high} High</span>
                </div>
              )}
              {(priorityCounts.medium > 0 || priorityCounts.low > 0) && (
                <div className="text-xs text-gray-600 px-2">
                  +{priorityCounts.medium + priorityCounts.low} more
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reports List - Scrollable container for many items */}
      <div
        className={`
          ${isCompactMode ? "space-y-2" : "space-y-3"}
          ${actionableReports.length > 10 ? "max-h-[600px] overflow-y-auto pr-2 custom-scrollbar" : ""}
        `}
      >
        {(isExpanded ? sortedReports : sortedReports.slice(0, displayLimit)).map((report) => {
          // Get priority indicator
          const priorityConfig = {
            critical: { icon: Flame, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-300', ringColor: 'ring-red-200' },
            high: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-300', ringColor: 'ring-orange-200' },
            medium: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300', ringColor: 'ring-yellow-200' },
            low: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-300', ringColor: 'ring-blue-200' }
          };
          const config = priorityConfig[report.priority];
          const PriorityIcon = config.icon;

          return (
            <div
              key={report.id}
              onClick={() => router.push(`/reports/${report.id}`)}
              className={`
                relative bg-white border-l-4 ${config.border}
                border-y border-r border-gray-200
                rounded-lg ${isCompactMode ? 'p-2.5 sm:p-3' : 'p-3 sm:p-4'}
                hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent
                transition-all duration-200 cursor-pointer group
                active:scale-[0.99]
              `}
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                {/* Left: Priority Icon */}
                <div className={`flex-shrink-0 ${isCompactMode ? 'w-7 h-7' : 'w-8 h-8'} ${config.bg} rounded-lg flex items-center justify-center ring-1 ${config.ringColor}`}>
                  <PriorityIcon className={`${isCompactMode ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${config.color}`} />
                </div>

                {/* Middle: Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h4 className={`${isCompactMode ? 'text-xs sm:text-sm' : 'text-sm'} font-semibold text-gray-900 mb-0.5 sm:mb-1 line-clamp-2 group-hover:text-orange-700 transition-colors duration-200`}>
                    {report.title}
                  </h4>

                  {/* Meta Info */}
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                    <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">{report.division.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="whitespace-nowrap">{new Date(report.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    {!isCompactMode && (
                      <>
                        <span className="text-gray-400 hidden sm:inline">•</span>
                        <span className="hidden sm:inline capitalize text-gray-500">{report.priority}</span>
                      </>
                    )}
                  </div>

                  {/* Status Badge - Only show in non-compact mode and on larger screens */}
                  {!isCompactMode && (
                    <div className="mt-1.5 hidden sm:flex items-center gap-1.5">
                      <ReportStatusBadge status={report.currentStatus} />
                    </div>
                  )}
                </div>

                {/* Right: Action Arrow */}
                <div className={`flex-shrink-0 ${isCompactMode ? 'w-7 h-7' : 'w-8 h-8'} bg-gray-100/80 rounded-lg flex items-center justify-center group-hover:bg-orange-600 group-hover:scale-110 transition-all duration-200`}>
                  <ArrowRight className={`${isCompactMode ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gray-600 group-hover:text-white transition-colors duration-200`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse or View All Actions */}
      {actionableReports.length > displayLimit && (
        <div className="mt-4 space-y-2">
          {/* Expand/Collapse Button - For moderate amount of data */}
          {actionableReports.length <= 20 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-sm font-medium py-2.5 bg-white hover:bg-gray-50 border border-gray-300 hover:border-orange-400 rounded-lg transition-all duration-200 active:scale-[0.98] group flex items-center justify-center gap-2 text-gray-700 hover:text-orange-700"
            >
              <span>{isExpanded ? 'Show Less' : `Show All ${actionableReports.length} Items`}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 transition-transform duration-200" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              )}
            </button>
          )}

          {/* View All Button - For large datasets */}
          {actionableReports.length > 20 && !isExpanded && (
            <button
              onClick={() => router.push('/reports')}
              className="w-full text-sm font-semibold py-3 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-600 hover:to-orange-700 border border-orange-200 hover:border-orange-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] group flex items-center justify-center gap-2 text-orange-700 hover:text-white"
            >
              <span>View All {actionableReports.length} Items in Reports Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          )}

          {/* Context info */}
          {!isExpanded && (
            <p className="text-center text-[10px] sm:text-xs text-gray-500">
              Showing top {displayLimit} by priority • {actionableReports.length - displayLimit} more pending
            </p>
          )}
        </div>
      )}
    </div>
  );
}

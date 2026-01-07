'use client';

import { ReportStatusHistory, ReportStatus } from '@/types';
import { getUserById } from '@/lib/mock-data';
import { Clock, CheckCircle2, XCircle, ArrowRight, User } from 'lucide-react';

interface ReportTimelineProps {
  statusHistory: ReportStatusHistory[];
}

const getStatusIcon = (status: ReportStatus) => {
  switch (status) {
    case 'draft':
      return { icon: Clock, color: 'bg-gray-400' };
    case 'submitted_to_sector':
      return { icon: ArrowRight, color: 'bg-blue-500' };
    case 'under_review_sector':
    case 'under_review_dmd':
      return { icon: Clock, color: 'bg-yellow-500' };
    case 'approved_by_sector':
    case 'final_approved':
      return { icon: CheckCircle2, color: 'bg-green-500' };
    case 'returned_for_revision_sector':
    case 'returned_for_revision_dmd':
      return { icon: XCircle, color: 'bg-red-500' };
    case 'cancelled':
      return { icon: XCircle, color: 'bg-gray-500' };
    default:
      return { icon: Clock, color: 'bg-gray-400' };
  }
};

const getStatusLabel = (status: ReportStatus): string => {
  const labels: Record<ReportStatus, string> = {
    draft: 'Draft',
    submitted_to_sector: 'Submitted to Sector',
    under_review_sector: 'Under Review (Sector)',
    returned_for_revision_sector: 'Returned for Revision (Sector)',
    approved_by_sector: 'Approved by Sector',
    under_review_dmd: 'Under Review (DMD)',
    returned_for_revision_dmd: 'Returned for Revision (DMD)',
    final_approved: 'Final Approved',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

export default function ReportTimeline({ statusHistory }: ReportTimelineProps) {
  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(a.actionAt).getTime() - new Date(b.actionAt).getTime()
  );

  if (sortedHistory.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <p className="text-gray-500 text-sm sm:text-base">No status history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white shadow-md">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Status Timeline</span>
          </h3>
          <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded whitespace-nowrap">
            {sortedHistory.length} {sortedHistory.length === 1 ? 'Step' : 'Steps'}
          </span>
        </div>
      </div>

      {/* Horizontal Flow Timeline */}
      <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 hover:scrollbar-thumb-blue-400">
        <div className="inline-flex gap-2 sm:gap-3 pb-4 px-1">
          {sortedHistory.map((history, index) => {
            const actionUser = getUserById(history.actionByUserId);
            const toStatusConfig = getStatusIcon(history.toStatus);
            const ToStatusIcon = toStatusConfig.icon;
            const isLatest = index === sortedHistory.length - 1;
            const isFirst = index === 0;

            return (
              <div key={history.id} className="flex items-center gap-2 sm:gap-3">
                {/* Status Card */}
                <div className={`flex-shrink-0 w-64 sm:w-72 min-h-[240px] bg-white rounded-lg border-2 p-2.5 sm:p-3 transition-all flex flex-col ${
                  isLatest ? 'border-blue-400 shadow-lg' : 'border-gray-200'
                }`}>
                  {/* Header with Icon and Step */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${toStatusConfig.color} flex items-center justify-center flex-shrink-0 ${
                      isLatest ? 'ring-2 ring-blue-300' : ''
                    }`}>
                      <ToStatusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5 sm:mb-1 flex-wrap">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          #{index + 1}
                        </span>
                        {isFirst && (
                          <span className="text-xs">🚀</span>
                        )}
                        {isLatest && (
                          <span className="text-xs">⭐</span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                        {getStatusLabel(history.toStatus)}
                      </h4>
                    </div>
                  </div>

                  {/* User & Date */}
                  <div className="space-y-1 mb-2 sm:mb-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate text-xs">{actionUser?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs whitespace-nowrap">{new Date(history.actionAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Transition */}
                  <div className="flex items-center gap-1 text-xs mb-2">
                    <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium text-center text-[10px] sm:text-xs leading-tight" title={getStatusLabel(history.fromStatus)}>
                      {getStatusLabel(history.fromStatus)}
                    </span>
                    <ArrowRight className="w-3 h-3 text-blue-600 flex-shrink-0" />
                    <span className="px-1.5 sm:px-2 py-0.5 bg-blue-600 text-white rounded font-medium text-center text-[10px] sm:text-xs leading-tight" title={getStatusLabel(history.toStatus)}>
                      {getStatusLabel(history.toStatus)}
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="mt-auto">
                    {history.comment && (
                      <div className="bg-amber-50 border-l-2 border-amber-400 rounded-r p-1.5 sm:p-2 text-xs text-gray-700">
                        <p className="line-clamp-3 leading-snug">{history.comment}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow Connector */}
                {!isLatest && (
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Table View Alternative */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">From → To</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Changed By</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedHistory.map((history, index) => {
                const actionUser = getUserById(history.actionByUserId);
                const toStatusConfig = getStatusIcon(history.toStatus);
                const ToStatusIcon = toStatusConfig.icon;
                const isLatest = index === sortedHistory.length - 1;

                return (
                  <tr key={history.id} className={`hover:bg-gray-50 transition-colors ${isLatest ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-700">#{index + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded ${toStatusConfig.color} flex items-center justify-center`}>
                          <ToStatusIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">{getStatusLabel(history.toStatus)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 whitespace-nowrap" title={getStatusLabel(history.fromStatus)}>
                          {getStatusLabel(history.fromStatus)}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium whitespace-nowrap" title={getStatusLabel(history.toStatus)}>
                          {getStatusLabel(history.toStatus)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-700">{actionUser?.name || 'Unknown'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(history.actionAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      {history.comment ? (
                        <span className="line-clamp-2">{history.comment}</span>
                      ) : (
                        <span className="text-gray-400 italic">No comment</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Hidden on desktop */}
        <div className="lg:hidden divide-y divide-gray-200">
          {sortedHistory.map((history, index) => {
            const actionUser = getUserById(history.actionByUserId);
            const toStatusConfig = getStatusIcon(history.toStatus);
            const ToStatusIcon = toStatusConfig.icon;
            const isLatest = index === sortedHistory.length - 1;

            return (
              <div
                key={history.id}
                className={`p-3 sm:p-4 transition-colors ${isLatest ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                {/* Header with # and Status */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-700 text-sm">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${toStatusConfig.color} flex items-center justify-center flex-shrink-0`}>
                        <ToStatusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm sm:text-base break-words">
                        {getStatusLabel(history.toStatus)}
                      </span>
                    </div>
                  </div>
                  {isLatest && (
                    <span className="flex-shrink-0 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                      Latest
                    </span>
                  )}
                </div>

                {/* From → To */}
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 text-xs flex-wrap">
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">
                      {getStatusLabel(history.fromStatus)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="px-2 py-1 bg-blue-600 text-white rounded font-medium">
                      {getStatusLabel(history.toStatus)}
                    </span>
                  </div>
                </div>

                {/* User and Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-gray-400" />
                    <span className="font-medium truncate">{actionUser?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-gray-400" />
                    <span>{new Date(history.actionAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Comment */}
                {history.comment && (
                  <div className="bg-amber-50 border-l-2 border-amber-400 rounded-r-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{history.comment}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-blue-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Total Status Changes</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-700">{sortedHistory.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-green-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Current Status</p>
          <p className="text-xs sm:text-sm font-bold text-green-700 line-clamp-2">
            {getStatusLabel(sortedHistory[sortedHistory.length - 1]?.toStatus)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-purple-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Last Updated</p>
          <p className="text-xs sm:text-sm font-bold text-purple-700">
            {new Date(sortedHistory[sortedHistory.length - 1]?.actionAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

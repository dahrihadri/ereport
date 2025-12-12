'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReportWithRelations, ReportStatus } from '@/types';
import { Building2, TrendingUp, BarChart3, ArrowRight, Filter, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import ReportStatusBadge from '@/components/ui/ReportStatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import StatCard from '@/components/ui/StatCard';

interface MyDivisionReportsProps {
  reports: ReportWithRelations[];
  divisionId: string;
  divisionName: string;
}

export default function MyDivisionReports({ reports, divisionId, divisionName }: MyDivisionReportsProps) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all');

  // Filter reports by division
  const divisionReports = reports.filter(r => r.division.id === divisionId);

  // Apply status filter
  const filteredReports = filterStatus === 'all'
    ? divisionReports
    : divisionReports.filter(r => r.currentStatus === filterStatus);

  // Calculate stats
  const stats = {
    total: divisionReports.length,
    draft: divisionReports.filter(r => r.currentStatus === 'draft').length,
    inProgress: divisionReports.filter(r =>
      r.currentStatus === 'submitted_to_sector' ||
      r.currentStatus === 'under_review_sector' ||
      r.currentStatus === 'approved_by_sector' ||
      r.currentStatus === 'under_review_dmd'
    ).length,
    approved: divisionReports.filter(r => r.currentStatus === 'final_approved').length,
    returned: divisionReports.filter(r =>
      r.currentStatus === 'returned_for_revision_sector' ||
      r.currentStatus === 'returned_for_revision_dmd'
    ).length,
  };

  const getCompletionRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.approved / stats.total) * 100);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
        My Division Reports - {divisionName}
      </h3>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          title="Draft"
          value={stats.draft}
          color="yellow"
          icon={FileText}
          subtitle="Not submitted"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          color="blue"
          icon={Clock}
          subtitle="Under review"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          color="green"
          icon={CheckCircle2}
          subtitle="Completed"
        />
        <StatCard
          title="Returned"
          value={stats.returned}
          color="red"
          icon={XCircle}
          subtitle="For revision"
        />
      </div>

      {/* Completion Rate */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Completion Rate</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">{getCompletionRate()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${getCompletionRate()}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {stats.approved} of {stats.total} reports approved
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ReportStatus | 'all')}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="all">All Status ({divisionReports.length})</option>
          <option value="draft">Draft ({stats.draft})</option>
          <option value="submitted_to_sector">Submitted ({divisionReports.filter(r => r.currentStatus === 'submitted_to_sector').length})</option>
          <option value="under_review_sector">Under Review - Sector ({divisionReports.filter(r => r.currentStatus === 'under_review_sector').length})</option>
          <option value="under_review_dmd">Under Review - DMD ({divisionReports.filter(r => r.currentStatus === 'under_review_dmd').length})</option>
          <option value="final_approved">Approved ({stats.approved})</option>
          <option value="returned_for_revision_sector">Returned - Sector ({divisionReports.filter(r => r.currentStatus === 'returned_for_revision_sector').length})</option>
          <option value="returned_for_revision_dmd">Returned - DMD ({divisionReports.filter(r => r.currentStatus === 'returned_for_revision_dmd').length})</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-2">
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No reports found</p>
            <p className="text-sm text-gray-400 mt-1">
              {filterStatus === 'all' ? 'No reports in your division yet' : `No reports with status: ${filterStatus}`}
            </p>
          </div>
        ) : (
          filteredReports.slice(0, 3).map((report) => (
            <div
              key={report.id}
              onClick={() => router.push(`/reports/${report.id}`)}
              className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Priority & Status */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <PriorityBadge priority={report.priority} />
                    <ReportStatusBadge status={report.currentStatus} />
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {report.title}
                  </h4>

                  {/* Meta Info */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{report.project.code}</span>
                    <span>•</span>
                    <span>{new Date(report.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Arrow */}
                <div className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-all">
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Link */}
      {filteredReports.length > 3 && (
        <button
          onClick={() => router.push(`/reports?division=${divisionId}`)}
          className="mt-3 w-full text-sm text-blue-600 hover:text-blue-700 font-semibold py-2 hover:bg-blue-50 rounded-lg transition-all"
        >
          View All {filteredReports.length} Division Reports →
        </button>
      )}
    </div>
  );
}

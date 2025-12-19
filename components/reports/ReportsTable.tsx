'use client';

import { useState } from 'react';
import { ReportWithRelations } from '@/types';
import ReportRow from './ReportRow';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortField = 'title' | 'division' | 'status' | 'priority' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface ReportsTableProps {
  reports: ReportWithRelations[];
  selectedReports: string[];
  onSelectReport: (reportId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onReportClick: (report: ReportWithRelations) => void;
  onView?: (report: ReportWithRelations) => void;
  onEdit?: (report: ReportWithRelations) => void;
  onDelete?: (report: ReportWithRelations) => void;
  onDownload?: (report: ReportWithRelations) => void;
  onSubmit?: (report: ReportWithRelations) => void;
}

export default function ReportsTable({
  reports,
  selectedReports,
  onSelectReport,
  onSelectAll,
  onReportClick,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onSubmit,
}: ReportsTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const allSelected = reports.length > 0 && selectedReports.length === reports.length;
  const someSelected = selectedReports.length > 0 && selectedReports.length < reports.length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'division':
        aValue = a.division.name.toLowerCase();
        bValue = b.division.name.toLowerCase();
        break;
      case 'status':
        aValue = a.currentStatus;
        bValue = b.currentStatus;
        break;
      case 'priority':
        const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-visible">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto overflow-y-visible">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* Select All Checkbox */}
              <th className="px-4 lg:px-6 py-3 lg:py-4 w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </th>

              {/* Title */}
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                >
                  Report Title
                  <SortIcon field="title" />
                </button>
              </th>

              {/* Division */}
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left">
                <button
                  onClick={() => handleSort('division')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                >
                  Division
                  <SortIcon field="division" />
                </button>
              </th>

              {/* Status */}
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>

              {/* Priority */}
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                >
                  Priority
                  <SortIcon field="priority" />
                </button>
              </th>

              {/* Date */}
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                >
                  Created
                  <SortIcon field="createdAt" />
                </button>
              </th>

              {/* Actions */}
              <th className="px-4 lg:px-6 py-3 lg:py-4 w-20">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedReports.map((report) => (
              <ReportRow
                key={report.id}
                report={report}
                isSelected={selectedReports.includes(report.id)}
                onSelect={onSelectReport}
                onClick={onReportClick}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onDownload={onDownload}
                onSubmit={onSubmit}
              />
            ))}
          </tbody>
        </table>

        {sortedReports.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No reports found</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {sortedReports.map((report) => (
          <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedReports.includes(report.id)}
                onChange={(e) => onSelectReport(report.id, e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Content */}
              <div className="flex-1 min-w-0" onClick={() => onReportClick(report)}>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                  {report.title}
                </h4>

                <div className="space-y-1.5 mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium">Division:</span>
                    <span className="truncate">{report.division.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium">Created:</span>
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    report.currentStatus === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                    report.currentStatus === 'final_approved' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {report.currentStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>

                  {/* Priority Badge */}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    report.priority === 'critical' ? 'bg-red-100 text-red-700' :
                    report.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    report.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {report.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {sortedReports.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-sm">No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}

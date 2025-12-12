'use client';

import { ReportWithRelations } from '@/types';
import ReportStatusBadge from '../ui/ReportStatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import ReportQuickActions from '../ReportQuickActions';
import { FileText } from 'lucide-react';

interface ReportRowProps {
  report: ReportWithRelations;
  isSelected: boolean;
  onSelect: (reportId: string, selected: boolean) => void;
  onClick: (report: ReportWithRelations) => void;
  onView?: (report: ReportWithRelations) => void;
  onEdit?: (report: ReportWithRelations) => void;
  onDelete?: (report: ReportWithRelations) => void;
  onDownload?: (report: ReportWithRelations) => void;
  onSubmit?: (report: ReportWithRelations) => void;
}

export default function ReportRow({
  report,
  isSelected,
  onSelect,
  onClick,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onSubmit,
}: ReportRowProps) {
  return (
    <tr
      className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={() => onClick(report)}
    >
      {/* Checkbox */}
      <td className="px-6 py-4 w-12">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(report.id, e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </td>

      {/* Title & Project */}
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
              {report.title}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {report.project.code}
            </p>
          </div>
        </div>
      </td>

      {/* Division */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-700">{report.division.name}</span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <ReportStatusBadge status={report.currentStatus} />
      </td>

      {/* Priority */}
      <td className="px-6 py-4">
        <PriorityBadge priority={report.priority} />
      </td>

      {/* Date */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">
          {new Date(report.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <ReportQuickActions
          report={report}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
          onSubmit={onSubmit}
        />
      </td>
    </tr>
  );
}

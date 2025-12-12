'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Edit, Trash2, Download, Send } from 'lucide-react';
import { ReportWithRelations } from '@/types';

interface ReportQuickActionsProps {
  report: ReportWithRelations;
  onView?: (report: ReportWithRelations) => void;
  onEdit?: (report: ReportWithRelations) => void;
  onDelete?: (report: ReportWithRelations) => void;
  onDownload?: (report: ReportWithRelations) => void;
  onSubmit?: (report: ReportWithRelations) => void;
}

export default function ReportQuickActions({
  report,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onSubmit,
}: ReportQuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(() => onView(report));
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          )}

          {onEdit && report.currentStatus === 'draft' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(() => onEdit(report));
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Report
            </button>
          )}

          {onSubmit && report.currentStatus === 'draft' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(() => onSubmit(report));
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit Report
            </button>
          )}

          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(() => onDownload(report));
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          )}

          {onDelete && report.currentStatus === 'draft' && (
            <>
              <div className="my-1 border-t border-gray-200"></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(() => onDelete(report));
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Report
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

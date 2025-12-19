'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Download, CheckCircle, XCircle, Loader2, X } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { exportToCSV } from '@/lib/csv-export';

interface BulkActionsBarProps {
  selectedIds: string[];
  selectedItems: any[];
  onClearSelection: () => void;
  onBulkDelete?: (ids: string[]) => Promise<{ success: number; failed: number }>;
  onBulkActivate?: (ids: string[]) => Promise<{ success: number; failed: number }>;
  onBulkDeactivate?: (ids: string[]) => Promise<{ success: number; failed: number }>;
  onSuccess?: () => void;
  entityType: 'user' | 'sector' | 'division' | 'project';
  csvColumnMapping?: Record<string, string>;
  showActivateActions?: boolean;
}

/**
 * Bulk Actions Toolbar
 * Shows when items are selected, provides bulk operations
 *
 * Usage:
 * <BulkActionsBar
 *   selectedIds={selectedIds}
 *   selectedItems={selectedUsers}
 *   onClearSelection={() => setSelectedIds([])}
 *   onBulkDelete={bulkDeleteUsers}
 *   onSuccess={refreshUsers}
 *   entityType="user"
 *   showActivateActions
 * />
 */
export default function BulkActionsBar({
  selectedIds,
  selectedItems,
  onClearSelection,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  onSuccess,
  entityType,
  csvColumnMapping,
  showActivateActions = false,
}: BulkActionsBarProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const count = selectedIds.length;
  const entityLabel = {
    user: 'user',
    sector: 'sector',
    division: 'division',
    project: 'project',
  }[entityType];

  if (count === 0) return null;

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (!onBulkDelete) return;

    setIsProcessing(true);

    try {
      const { success, failed } = await onBulkDelete(selectedIds);

      if (failed === 0) {
        toast.success(`Successfully deleted ${success} ${entityLabel}${success > 1 ? 's' : ''}`, {
          icon: <CheckCircle className="w-5 h-5" />,
        });
      } else if (success === 0) {
        toast.error(`Failed to delete ${failed} ${entityLabel}${failed > 1 ? 's' : ''}`, {
          icon: <XCircle className="w-5 h-5" />,
        });
      } else {
        toast.warning(
          `Deleted ${success} ${entityLabel}${success > 1 ? 's' : ''}, ${failed} failed`,
          {
            description: 'Some items could not be deleted',
            duration: 5000,
          }
        );
      }

      onClearSelection();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error('Bulk delete operation failed', {
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
    }
  };

  // Bulk Activate
  const handleBulkActivate = async () => {
    if (!onBulkActivate) return;

    setIsProcessing(true);

    try {
      const { success, failed } = await onBulkActivate(selectedIds);

      if (failed === 0) {
        toast.success(`Activated ${success} ${entityLabel}${success > 1 ? 's' : ''}`);
      } else {
        toast.warning(
          `Activated ${success}, failed ${failed}`,
          {
            description: 'Some items could not be activated',
          }
        );
      }

      onClearSelection();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error('Bulk activate failed', {
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
      setShowActivateConfirm(false);
    }
  };

  // Bulk Deactivate
  const handleBulkDeactivate = async () => {
    if (!onBulkDeactivate) return;

    setIsProcessing(true);

    try {
      const { success, failed } = await onBulkDeactivate(selectedIds);

      if (failed === 0) {
        toast.success(`Deactivated ${success} ${entityLabel}${success > 1 ? 's' : ''}`);
      } else {
        toast.warning(
          `Deactivated ${success}, failed ${failed}`,
          {
            description: 'Some items could not be deactivated',
          }
        );
      }

      onClearSelection();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error('Bulk deactivate failed', {
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
      setShowDeactivateConfirm(false);
    }
  };

  // CSV Export
  const handleExport = () => {
    if (!csvColumnMapping) {
      toast.error('Export configuration not available');
      return;
    }

    try {
      const filename = `${entityType}s-${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(selectedItems, filename, csvColumnMapping);
      toast.success(`Exported ${count} ${entityLabel}${count > 1 ? 's' : ''} to CSV`, {
        icon: <Download className="w-5 h-5" />,
      });
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 animate-in slide-in-from-top-2 duration-200">
        <div className="flex items-center justify-between">
          {/* Left: Selection info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
              {count}
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">
                {count} {entityLabel}
                {count > 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-blue-700">Choose an action below</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Export CSV */}
            {csvColumnMapping && (
              <button
                onClick={handleExport}
                disabled={isProcessing}
                className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}

            {/* Activate */}
            {showActivateActions && onBulkActivate && (
              <button
                onClick={() => setShowActivateConfirm(true)}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Activate
              </button>
            )}

            {/* Deactivate */}
            {showActivateActions && onBulkDeactivate && (
              <button
                onClick={() => setShowDeactivateConfirm(true)}
                disabled={isProcessing}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Deactivate
              </button>
            )}

            {/* Delete */}
            {onBulkDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            )}

            {/* Clear Selection */}
            <button
              onClick={onClearSelection}
              disabled={isProcessing}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              title="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => !isProcessing && setShowDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${count} ${entityLabel}${count > 1 ? 's' : ''}?`}
        message={`Are you sure you want to delete ${count} selected ${entityLabel}${
          count > 1 ? 's' : ''
        }? This action cannot be undone.`}
        confirmText={`Delete ${count} ${entityLabel}${count > 1 ? 's' : ''}`}
        cancelText="Cancel"
        variant="danger"
        loading={isProcessing}
      />

      {/* Activate Confirmation */}
      <ConfirmDialog
        isOpen={showActivateConfirm}
        onClose={() => !isProcessing && setShowActivateConfirm(false)}
        onConfirm={handleBulkActivate}
        title={`Activate ${count} ${entityLabel}${count > 1 ? 's' : ''}?`}
        message={`Activate ${count} selected ${entityLabel}${count > 1 ? 's' : ''}?`}
        confirmText={`Activate ${count}`}
        cancelText="Cancel"
        variant="success"
        loading={isProcessing}
      />

      {/* Deactivate Confirmation */}
      <ConfirmDialog
        isOpen={showDeactivateConfirm}
        onClose={() => !isProcessing && setShowDeactivateConfirm(false)}
        onConfirm={handleBulkDeactivate}
        title={`Deactivate ${count} ${entityLabel}${count > 1 ? 's' : ''}?`}
        message={`Deactivate ${count} selected ${entityLabel}${count > 1 ? 's' : ''}?`}
        confirmText={`Deactivate ${count}`}
        cancelText="Cancel"
        variant="warning"
        loading={isProcessing}
      />
    </>
  );
}

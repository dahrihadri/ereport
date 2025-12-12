import { Trash2, Download, Send, X } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete?: () => void;
  onBulkDownload?: () => void;
  onBulkSubmit?: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkDownload,
  onBulkSubmit,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50">
      <div className="bg-blue-600 text-white rounded-2xl sm:rounded-full shadow-2xl px-4 sm:px-6 py-3 sm:py-4">
        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">
                {selectedCount}
              </div>
              <span className="font-semibold text-sm">
                {selectedCount} selected
              </span>
            </div>
            <button
              onClick={onClearSelection}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {onBulkSubmit && (
              <button
                onClick={onBulkSubmit}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-xs font-medium active:scale-95"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            )}

            {onBulkDownload && (
              <button
                onClick={onBulkDownload}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-xs font-medium active:scale-95"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}

            {onBulkDelete && (
              <button
                onClick={onBulkDelete}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-xs font-medium active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
              {selectedCount}
            </div>
            <span className="font-semibold">
              {selectedCount} report{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="w-px h-6 bg-white/30"></div>

          <div className="flex items-center gap-2">
            {onBulkSubmit && (
              <button
                onClick={onBulkSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium active:scale-95"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            )}

            {onBulkDownload && (
              <button
                onClick={onBulkDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium active:scale-95"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}

            {onBulkDelete && (
              <button
                onClick={onBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm font-medium active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}

            <button
              onClick={onClearSelection}
              className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Only show a limited number of page buttons on mobile
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex-shrink-0 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
          Showing {startIndex + 1}-{endIndex} of {totalItems}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          <div className="flex gap-1">
            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={`ellipsis-${index}`} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                  {page}
                </span>
              )
            )}
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

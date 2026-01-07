'use client';

import { useState, Suspense, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FilterButton from '@/components/ui/FilterButton';
import Pagination from '@/components/ui/Pagination';
import ReportsTable from '../../components/reports/ReportsTable';
import BulkActionsBar from '@/components/ui/BulkActionsBar';
import UserSwitcher from '@/components/ui/UserSwitcher';
import { ReportWithRelations, Task, ReportStatus } from '@/types';
import { mockReportsWithRelations } from '@/lib/mock-data';
import { useCurrentUser } from '@/lib/use-current-user';
import { filterReportsByUserRole } from '@/lib/permissions';
import { Search, Filter, FileText, Download, FileSpreadsheet } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { exportReportsToCSV } from '@/lib/export-utils';

type FilterType = 'all' | ReportStatus;

function ReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusParam = searchParams.get('status') as ReportStatus | null;

  // Get current user
  const currentUser = useCurrentUser();

  // Filter reports by user role - use useMemo directly, no useState
  const reports = useMemo(
    () => currentUser ? filterReportsByUserRole(mockReportsWithRelations, currentUser) : [],
    [currentUser]
  );

  const [filterStatus, setFilterStatus] = useState<FilterType>(() => statusParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.currentStatus === filterStatus;
    const matchesSearch = searchQuery === '' ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.division.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (status: FilterType) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };  const handleReportClick = (report: ReportWithRelations) => {
    // Navigate to report detail page
    router.push(`/reports/${report.id}`);
  };

  // Show loading while user is being loaded
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Bulk selection handlers
  const handleSelectReport = (reportId: string, selected: boolean) => {
    if (selected) {
      setSelectedReports([...selectedReports, reportId]);
    } else {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedReports(paginatedReports.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedReports([]);
  };

  // Quick actions handlers
  const handleView = (report: ReportWithRelations) => {
    router.push(`/reports/${report.id}`);
  };

  const handleEdit = (report: ReportWithRelations) => {
    router.push(`/reports/${report.id}/edit`);
  };

  const handleDelete = (report: ReportWithRelations) => {
    console.log('Delete report:', report.id);
    // Add delete logic here
  };

  const handleDownload = (report: ReportWithRelations) => {
    console.log('Download report:', report.id);
    // Add download logic here
  };

  const handleSubmit = (report: ReportWithRelations) => {
    console.log('Submit report:', report.id);
    // Add submit logic here
  };

  // Bulk actions handlers
  const handleBulkDelete = () => {
    console.log('Bulk delete:', selectedReports);
    // Add bulk delete logic here
    setSelectedReports([]);
  };

  const handleBulkDownload = () => {
    console.log('Bulk download:', selectedReports);
    // Add bulk download logic here
  };

  const handleBulkSubmit = () => {
    console.log('Bulk submit:', selectedReports);
    // Add bulk submit logic here
  };

  // Export handlers
  const handleExportCSV = () => {
    const reportsToExport = selectedReports.length > 0
      ? reports.filter(r => selectedReports.includes(r.id))
      : filteredReports;

    exportReportsToCSV(reportsToExport);
  };

  // Count reports by status
  const statusCounts = {
    all: reports.length,
    draft: reports.filter(r => r.currentStatus === 'draft').length,
    submitted_to_sector: reports.filter(r => r.currentStatus === 'submitted_to_sector').length,
    under_review_sector: reports.filter(r => r.currentStatus === 'under_review_sector').length,
    under_review_dmd: reports.filter(r => r.currentStatus === 'under_review_dmd').length,
    final_approved: reports.filter(r => r.currentStatus === 'final_approved').length,
    returned_for_revision_sector: reports.filter(r => r.currentStatus === 'returned_for_revision_sector').length,
  };

  return (
    <DashboardLayout
      user={{
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      }}
      currentUser={currentUser}    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Reports Management</h1>
            <p className="text-xs sm:text-sm opacity-90 line-clamp-1">
              Manage and track all your reports in one place
            </p>
          </div>
          <div className="hidden sm:block flex-shrink-0">
            <FileText className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-20" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700">Filter by Status</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="All Reports"
            count={statusCounts.all}
            active={filterStatus === 'all'}
            color="blue"
            onClick={() => handleFilterChange('all')}
          />
          <FilterButton
            label="Draft"
            count={statusCounts.draft}
            active={filterStatus === 'draft'}
            color="yellow"
            onClick={() => handleFilterChange('draft')}
          />
          <FilterButton
            label="Submitted"
            count={statusCounts.submitted_to_sector}
            active={filterStatus === 'submitted_to_sector'}
            color="blue"
            onClick={() => handleFilterChange('submitted_to_sector')}
          />
          <FilterButton
            label="Under Review"
            count={statusCounts.under_review_sector + statusCounts.under_review_dmd}
            active={filterStatus === 'under_review_sector' || filterStatus === 'under_review_dmd'}
            color="blue"
            onClick={() => handleFilterChange('under_review_sector')}
          />
          <FilterButton
            label="Approved"
            count={statusCounts.final_approved}
            active={filterStatus === 'final_approved'}
            color="green"
            onClick={() => handleFilterChange('final_approved')}
          />
          <FilterButton
            label="Returned"
            count={statusCounts.returned_for_revision_sector}
            active={filterStatus === 'returned_for_revision_sector'}
            color="red"
            onClick={() => handleFilterChange('returned_for_revision_sector')}
          />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span className="font-medium">
              {selectedReports.length > 0
                ? `${selectedReports.length} report${selectedReports.length !== 1 ? 's' : ''} selected`
                : `Showing ${filteredReports.length} of ${reports.length} reports`}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportCSV}
              disabled={filteredReports.length === 0}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">
                Export {selectedReports.length > 0 ? 'Selected' : 'All'}
              </span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      {paginatedReports.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-1">No reports found</p>
          <p className="text-xs sm:text-sm text-gray-500">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <ReportsTable
          reports={paginatedReports}
          selectedReports={selectedReports}
          onSelectReport={handleSelectReport}
          onSelectAll={handleSelectAll}
          onReportClick={handleReportClick}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onSubmit={handleSubmit}
        />
      )}

      {/* Pagination */}
      {filteredReports.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredReports.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Task Modal */}

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedReports.length}
        onClearSelection={handleClearSelection}
        onBulkDelete={handleBulkDelete}
        onBulkDownload={handleBulkDownload}
        onBulkSubmit={handleBulkSubmit}
      />

      {/* User Switcher - Development Only */}
      <UserSwitcher />
    </DashboardLayout>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    }>
      <ReportsContent />
    </Suspense>
  );
}

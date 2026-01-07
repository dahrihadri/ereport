import { ReportWithRelations, User, Project, Division, Sector } from '@/types';
import { convertToCSV, downloadCSV } from './csv-export';

/**
 * Export reports to CSV format
 */
export function exportReportsToCSV(reports: ReportWithRelations[], filename?: string) {
  const headers = [
    'Report ID',
    'Title',
    'Summary',
    'Project Code',
    'Project Name',
    'Division',
    'Sector',
    'Status',
    'Priority',
    'Category',
    'Created By',
    'Created Date',
    'Updated Date',
    'Submitted Date',
  ];

  const data = reports.map(report => ({
    'Report ID': report.id,
    'Title': report.title,
    'Summary': report.summary,
    'Project Code': report.project?.code || 'N/A',
    'Project Name': report.project?.name || 'N/A',
    'Division': report.division?.name || 'N/A',
    'Sector': report.sector?.name || 'N/A',
    'Status': formatStatus(report.currentStatus),
    'Priority': report.priority.toUpperCase(),
    'Category': report.category || 'N/A',
    'Created By': report.createdBy?.name || 'N/A',
    'Created Date': formatDate(report.createdAt),
    'Updated Date': formatDate(report.updatedAt),
    'Submitted Date': report.submittedAt ? formatDate(report.submittedAt) : 'Not submitted',
  }));

  const exportFilename = filename || `MCMC_Reports_${new Date().toISOString().split('T')[0]}.csv`;
  const csv = convertToCSV(data, headers);
  downloadCSV(csv, exportFilename);
}

/**
 * Export users to CSV format
 */
export function exportUsersToCSV(users: User[], filename?: string) {
  const headers = [
    'User ID',
    'Name',
    'Email',
    'Role',
    'Status',
    'Sector IDs',
    'Division IDs',
    'Azure AD Object ID',
    'Created Date',
  ];

  const data = users.map(user => ({
    'User ID': user.id,
    'Name': user.name,
    'Email': user.email,
    'Role': formatRole(user.role),
    'Status': user.isActive ? 'Active' : 'Inactive',
    'Sector IDs': user.sectorIds?.join('; ') || 'None',
    'Division IDs': user.divisionIds?.join('; ') || 'None',
    'Azure AD Object ID': user.azureAdObjectId,
    'Created Date': formatDate(user.createdAt),
  }));

  const exportFilename = filename || `MCMC_Users_${new Date().toISOString().split('T')[0]}.csv`;
  const csv = convertToCSV(data, headers);
  downloadCSV(csv, exportFilename);
}

/**
 * Export projects to CSV format
 */
export function exportProjectsToCSV(projects: Project[], filename?: string) {
  const headers = [
    'Project Code',
    'Project Name',
    'Description',
    'Status',
    'Sector ID',
    'Division ID',
    'Start Date',
    'End Date',
    'Created Date',
  ];

  const data = projects.map(project => ({
    'Project Code': project.code,
    'Project Name': project.name,
    'Description': project.description || 'N/A',
    'Status': formatProjectStatus(project.status),
    'Sector ID': project.sectorId,
    'Division ID': project.divisionId,
    'Start Date': formatDate(project.startDate),
    'End Date': project.endDate ? formatDate(project.endDate) : 'N/A',
    'Created Date': formatDate(project.createdAt),
  }));

  const exportFilename = filename || `MCMC_Projects_${new Date().toISOString().split('T')[0]}.csv`;
  const csv = convertToCSV(data, headers);
  downloadCSV(csv, exportFilename);
}

/**
 * Export divisions to CSV format
 */
export function exportDivisionsToCSV(divisions: Division[], filename?: string) {
  const headers = [
    'Division Code',
    'Division Name',
    'Sector ID',
    'Created Date',
  ];

  const data = divisions.map(division => ({
    'Division Code': division.code,
    'Division Name': division.name,
    'Sector ID': division.sectorId,
    'Created Date': formatDate(division.createdAt),
  }));

  const exportFilename = filename || `MCMC_Divisions_${new Date().toISOString().split('T')[0]}.csv`;
  const csv = convertToCSV(data, headers);
  downloadCSV(csv, exportFilename);
}

/**
 * Export sectors to CSV format
 */
export function exportSectorsToCSV(sectors: Sector[], filename?: string) {
  const headers = [
    'Sector Code',
    'Sector Name',
    'Description',
    'Created Date',
  ];

  const data = sectors.map(sector => ({
    'Sector Code': sector.code,
    'Sector Name': sector.name,
    'Description': sector.description || 'N/A',
    'Created Date': formatDate(sector.createdAt),
  }));

  const exportFilename = filename || `MCMC_Sectors_${new Date().toISOString().split('T')[0]}.csv`;
  const csv = convertToCSV(data, headers);
  downloadCSV(csv, exportFilename);
}

/**
 * Format report status for export
 */
function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'draft': 'Draft',
    'submitted_to_sector': 'Submitted to Sector',
    'under_review_sector': 'Under Review (Sector)',
    'approved_by_sector': 'Approved by Sector',
    'returned_for_revision_sector': 'Returned for Revision (Sector)',
    'under_review_dmd': 'Under Review (DMD)',
    'final_approved': 'Final Approved',
    'returned_for_revision_dmd': 'Returned for Revision (DMD)',
    'cancelled': 'Cancelled',
  };
  return statusMap[status] || status;
}

/**
 * Format user role for export
 */
function formatRole(role: string): string {
  const roleMap: Record<string, string> = {
    'HEAD_OF_DIVISION': 'Head of Division',
    'DIVISION_SECRETARY': 'Division Secretary',
    'CHIEF_OF_SECTOR': 'Chief of Sector',
    'DEPUTY_MD': 'Deputy Managing Director',
    'SYSTEM_ADMIN': 'System Administrator',
  };
  return roleMap[role] || role;
}

/**
 * Format project status for export
 */
function formatProjectStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'active': 'Active',
    'completed': 'Completed',
    'on_hold': 'On Hold',
    'cancelled': 'Cancelled',
  };
  return statusMap[status] || status;
}

/**
 * Format date for export
 */
function formatDate(date: Date | string): string {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

import { User, ReportWithRelations } from '@/types';

/**
 * Filter reports based on user's role and permissions
 */
export function filterReportsByUserRole(
  reports: ReportWithRelations[],
  user: User
): ReportWithRelations[] {
  const role = user.role;

  switch (role) {
    case 'DEPUTY_MD':
      // DMD can see all reports
      return reports;

    case 'SYSTEM_ADMIN':
      // Admin can see all reports
      return reports;

    case 'CHIEF_OF_SECTOR':
      // Sector Chief can see reports from their sectors
      return reports.filter(report =>
        user.sectorIds.includes(report.sectorId)
      );

    case 'HEAD_OF_DIVISION':
      // HoD can see reports from their divisions
      return reports.filter(report =>
        user.divisionIds.includes(report.divisionId)
      );

    case 'DIVISION_SECRETARY':
      // Secretary can see reports from their divisions
      return reports.filter(report =>
        user.divisionIds.includes(report.divisionId)
      );

    default:
      // No access by default
      return [];
  }
}

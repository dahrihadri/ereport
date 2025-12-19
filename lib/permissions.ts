import { User, ReportWithRelations, ROLE_PERMISSIONS, Permission } from '@/types';

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User, permission: Permission): boolean {
  return ROLE_PERMISSIONS[user.role].includes(permission);
}

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

/**
 * Check if user can edit a report
 */
export function canEditReport(user: User, report: ReportWithRelations): boolean {
  // Only creator can edit, and only if it's in draft status
  if (report.currentStatus !== 'draft') {
    return false;
  }

  // Secretary and HoD can edit drafts from their division
  if (
    (user.role === 'HEAD_OF_DIVISION' || user.role === 'DIVISION_SECRETARY') &&
    user.divisionIds.includes(report.divisionId)
  ) {
    return true;
  }

  return false;
}

/**
 * Check if user can submit a report
 */
export function canSubmitReport(user: User, report: ReportWithRelations): boolean {
  // Only HoD can submit (not Secretary)
  if (user.role !== 'HEAD_OF_DIVISION') {
    return false;
  }

  // Must be in draft status
  if (report.currentStatus !== 'draft') {
    return false;
  }

  // Must be from their division
  return user.divisionIds.includes(report.divisionId);
}

/**
 * Check if user can approve a report at sector level
 */
export function canApproveBySector(user: User, report: ReportWithRelations): boolean {
  // Only Sector Chief can approve
  if (user.role !== 'CHIEF_OF_SECTOR') {
    return false;
  }

  // Must be in submitted_to_sector or under_review_sector status
  if (
    report.currentStatus !== 'submitted_to_sector' &&
    report.currentStatus !== 'under_review_sector'
  ) {
    return false;
  }

  // Must be from their sector
  return user.sectorIds.includes(report.sectorId);
}

/**
 * Check if user can give final approval
 */
export function canApproveFinal(user: User, report: ReportWithRelations): boolean {
  // Only DMD can give final approval
  if (user.role !== 'DEPUTY_MD') {
    return false;
  }

  // Must be in approved_by_sector or under_review_dmd status
  return (
    report.currentStatus === 'approved_by_sector' ||
    report.currentStatus === 'under_review_dmd'
  );
}

/**
 * Check if user can return a report for revision
 */
export function canReturnReport(user: User, report: ReportWithRelations): boolean {
  // Sector Chief can return reports under their review
  if (user.role === 'CHIEF_OF_SECTOR') {
    return (
      user.sectorIds.includes(report.sectorId) &&
      (report.currentStatus === 'submitted_to_sector' ||
        report.currentStatus === 'under_review_sector')
    );
  }

  // DMD can return reports under their review
  if (user.role === 'DEPUTY_MD') {
    return (
      report.currentStatus === 'approved_by_sector' ||
      report.currentStatus === 'under_review_dmd'
    );
  }

  return false;
}

/**
 * Get available workflow actions for a user on a report
 */
export function getAvailableActions(user: User, report: ReportWithRelations) {
  const actions = [];

  if (canEditReport(user, report)) {
    actions.push({ action: 'edit', label: 'Edit Report' });
  }

  if (canSubmitReport(user, report)) {
    actions.push({ action: 'submit', label: 'Submit to Sector' });
  }

  if (canApproveBySector(user, report)) {
    actions.push({ action: 'approve_sector', label: 'Approve & Forward to DMD' });
  }

  if (canApproveFinal(user, report)) {
    actions.push({ action: 'approve_final', label: 'Final Approval' });
  }

  if (canReturnReport(user, report)) {
    actions.push({ action: 'return', label: 'Return for Revision' });
  }

  // Anyone can view and comment
  actions.push({ action: 'view', label: 'View Details' });

  if (hasPermission(user, 'comment:create')) {
    actions.push({ action: 'comment', label: 'Add Comment' });
  }

  return actions;
}

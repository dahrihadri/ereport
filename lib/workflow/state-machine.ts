// ============================================================================
// DMDPR Workflow State Machine
// Defines allowed state transitions and business rules
// ============================================================================

import { ReportStatus, UserRole } from '@/types';

// ============================================================================
// WORKFLOW TRANSITION RULES
// ============================================================================

/**
 * Allowed state transitions for each report status
 */
export const WORKFLOW_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
  // Draft can be submitted or cancelled
  draft: ['submitted_to_sector', 'cancelled'],

  // Once submitted, Chief starts review
  submitted_to_sector: ['under_review_sector'],

  // Chief can return or approve
  under_review_sector: ['returned_for_revision_sector', 'approved_by_sector'],

  // Returned reports go back to draft for HoD to edit
  returned_for_revision_sector: ['draft'],

  // Approved by Chief goes to DMD
  approved_by_sector: ['under_review_dmd'],

  // DMD can return or give final approval
  under_review_dmd: ['returned_for_revision_dmd', 'final_approved'],

  // DMD returns go back to sector (then to division)
  returned_for_revision_dmd: ['submitted_to_sector'],

  // Final states - no further transitions
  final_approved: [],
  cancelled: [],
};

/**
 * Roles allowed to perform each transition
 */
export const TRANSITION_ROLES: Record<string, UserRole[]> = {
  // HoD submits draft to sector
  'draft->submitted_to_sector': ['HEAD_OF_DIVISION'],

  // Auto-transition when Chief opens
  'submitted_to_sector->under_review_sector': ['CHIEF_OF_SECTOR', 'SYSTEM_ADMIN'],

  // Chief returns to HoD
  'under_review_sector->returned_for_revision_sector': ['CHIEF_OF_SECTOR'],

  // Chief approves to DMD
  'under_review_sector->approved_by_sector': ['CHIEF_OF_SECTOR'],

  // HoD re-submits after fixing
  'returned_for_revision_sector->draft': ['HEAD_OF_DIVISION', 'DIVISION_SECRETARY'],

  // Auto-transition when DMD opens
  'approved_by_sector->under_review_dmd': ['DEPUTY_MD', 'SYSTEM_ADMIN'],

  // DMD returns
  'under_review_dmd->returned_for_revision_dmd': ['DEPUTY_MD'],

  // DMD final approval
  'under_review_dmd->final_approved': ['DEPUTY_MD'],

  // DMD returns flow back to sector
  'returned_for_revision_dmd->submitted_to_sector': ['CHIEF_OF_SECTOR', 'SYSTEM_ADMIN'],

  // HoD or Secretary can cancel draft
  'draft->cancelled': ['HEAD_OF_DIVISION', 'DIVISION_SECRETARY'],
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Check if a status transition is allowed
 */
export function isTransitionAllowed(
  fromStatus: ReportStatus,
  toStatus: ReportStatus
): boolean {
  const allowedTransitions = WORKFLOW_TRANSITIONS[fromStatus] || [];
  return allowedTransitions.includes(toStatus);
}

/**
 * Check if a user role can perform a specific transition
 */
export function canUserTransition(
  fromStatus: ReportStatus,
  toStatus: ReportStatus,
  userRole: UserRole
): boolean {
  // First check if transition is valid
  if (!isTransitionAllowed(fromStatus, toStatus)) {
    return false;
  }

  // Check if user role is allowed
  const transitionKey = `${fromStatus}->${toStatus}`;
  const allowedRoles = TRANSITION_ROLES[transitionKey] || [];

  return allowedRoles.includes(userRole);
}

/**
 * Get all possible transitions from current status
 */
export function getPossibleTransitions(
  currentStatus: ReportStatus
): ReportStatus[] {
  return WORKFLOW_TRANSITIONS[currentStatus] || [];
}

/**
 * Get allowed transitions for specific user role
 */
export function getAllowedTransitions(
  currentStatus: ReportStatus,
  userRole: UserRole
): ReportStatus[] {
  const possibleTransitions = getPossibleTransitions(currentStatus);

  return possibleTransitions.filter((toStatus) =>
    canUserTransition(currentStatus, toStatus, userRole)
  );
}

// ============================================================================
// WORKFLOW METADATA
// ============================================================================

/**
 * Status display configuration
 */
export interface StatusConfig {
  label: string;
  description: string;
  color: string;        // Tailwind color class
  icon: string;         // Icon identifier
  tier: 1 | 2 | 3 | 0;  // Workflow tier (0 = terminal)
}

export const STATUS_CONFIG: Record<ReportStatus, StatusConfig> = {
  draft: {
    label: 'Draft',
    description: 'Report is being prepared',
    color: 'gray',
    icon: 'file-text',
    tier: 1,
  },
  submitted_to_sector: {
    label: 'Submitted to Sector',
    description: 'Awaiting Sector Chief review',
    color: 'blue',
    icon: 'send',
    tier: 1,
  },
  under_review_sector: {
    label: 'Under Review (Sector)',
    description: 'Sector Chief is reviewing',
    color: 'yellow',
    icon: 'eye',
    tier: 2,
  },
  returned_for_revision_sector: {
    label: 'Returned by Sector',
    description: 'Returned to division for revision',
    color: 'orange',
    icon: 'arrow-left',
    tier: 2,
  },
  approved_by_sector: {
    label: 'Approved by Sector',
    description: 'Forwarded to Deputy MD',
    color: 'indigo',
    icon: 'check-circle',
    tier: 2,
  },
  under_review_dmd: {
    label: 'Under Review (DMD)',
    description: 'Deputy MD is reviewing',
    color: 'purple',
    icon: 'eye',
    tier: 3,
  },
  returned_for_revision_dmd: {
    label: 'Returned by DMD',
    description: 'Returned for revision by Deputy MD',
    color: 'red',
    icon: 'x-circle',
    tier: 3,
  },
  final_approved: {
    label: 'Final Approved',
    description: 'Approved by Deputy MD - Completed',
    color: 'green',
    icon: 'check-circle-2',
    tier: 0,
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Report withdrawn',
    color: 'gray',
    icon: 'x',
    tier: 0,
  },
};

/**
 * Get status configuration
 */
export function getStatusConfig(status: ReportStatus): StatusConfig {
  return STATUS_CONFIG[status];
}

/**
 * Check if status is terminal (no further transitions)
 */
export function isTerminalStatus(status: ReportStatus): boolean {
  return WORKFLOW_TRANSITIONS[status].length === 0;
}

/**
 * Get status display color classes
 */
export function getStatusColorClasses(status: ReportStatus): {
  bg: string;
  text: string;
  border: string;
} {
  const config = STATUS_CONFIG[status];
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    gray: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-300',
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
      border: 'border-indigo-300',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
    },
  };

  return colorMap[config.color] || colorMap.gray;
}

// ============================================================================
// BUSINESS RULES
// ============================================================================

/**
 * Check if a report can be edited in its current status
 */
export function canEditReport(status: ReportStatus, userRole: UserRole): boolean {
  // Only drafts and returned reports can be edited
  if (status !== 'draft' && status !== 'returned_for_revision_sector') {
    return false;
  }

  // HoD and Secretary can edit drafts
  if (userRole === 'HEAD_OF_DIVISION' || userRole === 'DIVISION_SECRETARY') {
    return true;
  }

  // Admin can always edit (for maintenance)
  if (userRole === 'SYSTEM_ADMIN') {
    return true;
  }

  return false;
}

/**
 * Check if a comment is required for a transition
 */
export function isCommentRequired(
  fromStatus: ReportStatus,
  toStatus: ReportStatus
): boolean {
  // Comments required when returning reports
  const requireCommentTransitions = [
    'under_review_sector->returned_for_revision_sector',
    'under_review_dmd->returned_for_revision_dmd',
  ];

  const transitionKey = `${fromStatus}->${toStatus}`;
  return requireCommentTransitions.includes(transitionKey);
}

/**
 * Get next logical status for auto-transitions
 */
export function getAutoTransitionStatus(
  currentStatus: ReportStatus
): ReportStatus | null {
  const autoTransitions: Partial<Record<ReportStatus, ReportStatus>> = {
    submitted_to_sector: 'under_review_sector',
    approved_by_sector: 'under_review_dmd',
  };

  return autoTransitions[currentStatus] || null;
}

/**
 * Validate transition with business rules
 */
export interface TransitionValidation {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export function validateTransition(
  fromStatus: ReportStatus,
  toStatus: ReportStatus,
  userRole: UserRole,
  comment?: string
): TransitionValidation {
  // Check if transition is allowed
  if (!isTransitionAllowed(fromStatus, toStatus)) {
    return {
      isValid: false,
      error: `Invalid transition from ${fromStatus} to ${toStatus}`,
    };
  }

  // Check user permissions
  if (!canUserTransition(fromStatus, toStatus, userRole)) {
    return {
      isValid: false,
      error: `User role ${userRole} cannot perform this transition`,
    };
  }

  // Check comment requirement
  if (isCommentRequired(fromStatus, toStatus) && !comment) {
    return {
      isValid: false,
      error: 'Comment is required for this action',
    };
  }

  return { isValid: true };
}

// ============================================================================
// DMDPR - Top Management Report Management System
// Type Definitions
// ============================================================================

// ============================================================================
// USER ROLES & PERMISSIONS
// ============================================================================

export type UserRole =
  | 'HEAD_OF_DIVISION'   // HoD - Tier 1: Create & submit reports
  | 'DIVISION_SECRETARY' // Secretary - Tier 1 Support: Create drafts only
  | 'CHIEF_OF_SECTOR'    // Chief - Tier 2: Review & approve to DMD
  | 'DEPUTY_MD'          // DMD - Tier 3: Final approval
  | 'SYSTEM_ADMIN';      // Admin: System management

// ============================================================================
// REPORT WORKFLOW STATUSES
// ============================================================================

export type ReportStatus =
  | 'draft'                        // Created by HoD/Secretary, not submitted
  | 'submitted_to_sector'          // HoD submitted to Sector Chief
  | 'under_review_sector'          // Sector Chief is reviewing
  | 'returned_for_revision_sector' // Sector Chief returned to HoD
  | 'approved_by_sector'           // Sector Chief approved, sent to DMD
  | 'under_review_dmd'             // DMD is reviewing
  | 'returned_for_revision_dmd'    // DMD returned for revision
  | 'final_approved'               // DMD final approval - completed
  | 'cancelled';                   // Withdrawn/cancelled

// ============================================================================
// REPORT ATTRIBUTES
// ============================================================================

export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export type ReportCategory = 'operational' | 'strategic' | 'compliance' | 'financial' | 'technical';

export type CommentType = 'general' | 'review' | 'approval' | 'rejection' | 'system';

export type NotificationType =
  | 'report_submitted'
  | 'report_approved'
  | 'report_returned'
  | 'comment_added'
  | 'mention'
  | 'system';

export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'cancelled';

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * User - System user with Azure AD integration
 */
export interface User {
  id: string;
  azureAdObjectId: string;
  name: string;
  email: string;
  role: UserRole;
  sectorIds: string[];    // User can belong to multiple sectors
  divisionIds: string[];  // User can belong to multiple divisions
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Sector - Top-level organizational unit
 */
export interface Sector {
  id: string;
  code: string;          // e.g., "SEC-IT", "SEC-FIN"
  name: string;
  description?: string;
  chiefUserId?: string;  // Chief of Sector
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Division - Mid-level organizational unit under Sector
 */
export interface Division {
  id: string;
  code: string;          // e.g., "DIV-IT-DEV", "DIV-IT-OPS"
  name: string;
  description?: string;
  sectorId: string;
  hodUserId?: string;    // Head of Division
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project - Project that reports are linked to
 */
export interface Project {
  id: string;
  code: string;          // Project ID (e.g., "PROJ-2025-001")
  name: string;
  description: string;
  sectorId: string;
  divisionId: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  metadata?: Record<string, any>; // Additional project data
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Report - Top Management Report
 */
export interface Report {
  id: string;
  projectId: string;
  title: string;
  summary: string;

  // Report sections
  objectives?: string;
  keyIssues?: string;
  statusUpdate?: string;
  risks?: string;
  recommendations?: string;

  // Status & classification
  currentStatus: ReportStatus;
  priority: ReportPriority;
  category?: ReportCategory;

  // Ownership & tracking
  createdByUserId: string;
  divisionId: string;
  sectorId: string;
  currentVersion: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedBySectorAt?: Date;
  finalApprovedAt?: Date;
}

/**
 * ReportVersion - Versioning for audit and rollback
 */
export interface ReportVersion {
  id: string;
  reportId: string;
  versionNumber: number;
  content: Record<string, any>; // JSON snapshot of all report fields
  createdByUserId: string;
  createdAt: Date;
  changeDescription?: string;
}

/**
 * ReportStatusHistory - Audit trail of status changes
 */
export interface ReportStatusHistory {
  id: string;
  reportId: string;
  fromStatus: ReportStatus;
  toStatus: ReportStatus;
  actionByUserId: string;
  actionAt: Date;
  comment?: string;
  metadata?: Record<string, any>;
}

/**
 * Comment - Comments and discussions on reports
 */
export interface Comment {
  id: string;
  reportId: string;
  userId: string;
  commentText: string;
  type: CommentType;
  parentCommentId?: string; // For threaded comments
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Attachment - File attachments for reports
 */
export interface Attachment {
  id: string;
  reportId: string;
  fileName: string;
  fileSize: number;      // In bytes
  fileType: string;      // MIME type
  filePath: string;      // Storage path
  uploadedByUserId: string;
  uploadedAt: Date;
}

/**
 * Notification - User notifications
 */
export interface Notification {
  id: string;
  userId: string;
  reportId?: string;
  type: NotificationType;
  title: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;    // Link to relevant page
}

// ============================================================================
// LEGACY TYPES (Keep for backward compatibility during migration)
// ============================================================================

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type CompletionLevel = 'not_started' | 'started' | 'in_progress' | 'nearly_complete' | 'complete';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  assignedToEmail: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  completionLevel: CompletionLevel;
  tags?: string[];
  department?: string;
}

// ============================================================================
// VIEW MODELS & DTOs
// ============================================================================

/**
 * ReportWithRelations - Report with populated relationships
 */
export interface ReportWithRelations extends Report {
  project: Project;
  createdBy: User;
  division: Division;
  sector: Sector;
  attachments?: Attachment[];
  commentsCount?: number;
  latestComment?: Comment;
}


// ============================================================================
// PERMISSIONS & AUTHORIZATION
// ============================================================================

/**
 * Permission - Action-based permissions
 */
export type Permission =
  // Report permissions
  | 'report:create'
  | 'report:edit'
  | 'report:submit'
  | 'report:review'
  | 'report:approve_sector'
  | 'report:approve_final'
  | 'report:return'
  | 'report:cancel'
  | 'report:view_all'
  | 'report:view_sector'
  | 'report:view_division'
  // Comment permissions
  | 'comment:create'
  | 'comment:edit_own'
  | 'comment:delete_own'
  // Admin permissions
  | 'admin:users'
  | 'admin:sectors'
  | 'admin:divisions'
  | 'admin:projects'
  | 'admin:audit_logs';

/**
 * RolePermissions - Mapping of roles to permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  HEAD_OF_DIVISION: [
    'report:create',
    'report:edit',
    'report:submit',
    'report:view_division',
    'comment:create',
    'comment:edit_own',
  ],
  DIVISION_SECRETARY: [
    'report:create',
    'report:edit',
    'report:view_division',
    'comment:create',
  ],
  CHIEF_OF_SECTOR: [
    'report:view_sector',
    'report:review',
    'report:approve_sector',
    'report:return',
    'comment:create',
    'comment:edit_own',
  ],
  DEPUTY_MD: [
    'report:view_all',
    'report:review',
    'report:approve_final',
    'report:return',
    'comment:create',
    'comment:edit_own',
  ],
  SYSTEM_ADMIN: [
    'report:view_all',
    'admin:users',
    'admin:sectors',
    'admin:divisions',
    'admin:projects',
    'admin:audit_logs',
    'comment:create',
    'comment:edit_own',
    'comment:delete_own',
  ],
};

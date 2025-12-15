// Mock data for DMDPR frontend development
import {
  User,
  Sector,
  Division,
  Project,
  Report,
  ReportWithRelations,
} from '@/types';

// ============================================================================
// USERS
// ============================================================================

export const mockUsers: User[] = [
  {
    id: 'user-1',
    azureAdObjectId: 'azure-1',
    name: 'Ahmad Faizal',
    email: 'ahmad.faizal@mcmc.gov.my',
    role: 'HEAD_OF_DIVISION',
    sectorIds: ['sector-1'],
    divisionIds: ['division-1'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    azureAdObjectId: 'azure-2',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@mcmc.gov.my',
    role: 'DIVISION_SECRETARY',
    sectorIds: ['sector-1'],
    divisionIds: ['division-1'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-3',
    azureAdObjectId: 'azure-3',
    name: 'Datuk Hassan Ibrahim',
    email: 'hassan.ibrahim@mcmc.gov.my',
    role: 'CHIEF_OF_SECTOR',
    sectorIds: ['sector-1'],
    divisionIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-4',
    azureAdObjectId: 'azure-4',
    name: 'Tan Sri Dr. Rahman',
    email: 'rahman@mcmc.gov.my',
    role: 'DEPUTY_MD',
    sectorIds: [],
    divisionIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-5',
    azureAdObjectId: 'azure-5',
    name: 'Muhammad Ali',
    email: 'muhammad.ali@mcmc.gov.my',
    role: 'HEAD_OF_DIVISION',
    sectorIds: ['sector-1'],
    divisionIds: ['division-2'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-6',
    azureAdObjectId: 'azure-6',
    name: 'Nurul Ain Abdullah',
    email: 'nurul.ain@mcmc.gov.my',
    role: 'HEAD_OF_DIVISION',
    sectorIds: ['sector-2'],
    divisionIds: ['division-3'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-admin',
    azureAdObjectId: 'azure-admin',
    name: 'Aliff Najmi',
    email: 'admin@mcmc.gov.my',
    role: 'SYSTEM_ADMIN',
    sectorIds: [],
    divisionIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// ============================================================================
// SECTORS
// ============================================================================

export const mockSectors: Sector[] = [
  {
    id: 'sector-1',
    code: 'SEC-IT',
    name: 'Information Technology Sector',
    description: 'Responsible for IT infrastructure, development, and digital services',
    chiefUserId: 'user-3',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'sector-2',
    code: 'SEC-REG',
    name: 'Regulatory Sector',
    description: 'Handles regulatory compliance and policy enforcement',
    chiefUserId: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'sector-3',
    code: 'SEC-FIN',
    name: 'Finance Sector',
    description: 'Manages financial operations and budgeting',
    chiefUserId: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// ============================================================================
// DIVISIONS
// ============================================================================

export const mockDivisions: Division[] = [
  {
    id: 'division-1',
    code: 'DIV-IT-DEV',
    name: 'IT Development Division',
    description: 'Software development and web applications',
    sectorId: 'sector-1',
    hodUserId: 'user-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'division-2',
    code: 'DIV-IT-OPS',
    name: 'IT Operations Division',
    description: 'Infrastructure and operations management',
    sectorId: 'sector-1',
    hodUserId: 'user-5',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'division-3',
    code: 'DIV-REG-COM',
    name: 'Compliance Division',
    description: 'Regulatory compliance monitoring',
    sectorId: 'sector-2',
    hodUserId: 'user-6',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// ============================================================================
// PROJECTS
// ============================================================================

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    code: 'PROJ-2025-001',
    name: 'DMDPR Web Application',
    description: 'Top Management Report Management System',
    sectorId: 'sector-1',
    divisionId: 'division-1',
    status: 'active',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'project-2',
    code: 'PROJ-2025-002',
    name: 'Network Infrastructure Upgrade',
    description: 'Nationwide network modernization project',
    sectorId: 'sector-1',
    divisionId: 'division-2',
    status: 'active',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-11-30'),
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'project-3',
    code: 'PROJ-2025-003',
    name: 'Regulatory Compliance Framework',
    description: 'Enhanced compliance monitoring system',
    sectorId: 'sector-2',
    divisionId: 'division-3',
    status: 'active',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-10-31'),
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
];

// ============================================================================
// REPORTS
// ============================================================================

export const mockReports: Report[] = [
  {
    id: 'report-1',
    projectId: 'project-1',
    title: 'DMDPR Project - Phase 1 Completion Report',
    summary: 'Completed foundational setup including type definitions, database schema design, and workflow state machine implementation.',
    objectives: 'Establish core framework and architecture for the DMDPR system',
    keyIssues: 'None at this stage',
    statusUpdate: 'Phase 1 completed successfully. Ready to proceed with Phase 2 (Authentication).',
    risks: 'Low risk - foundation is solid',
    recommendations: 'Proceed with Azure AD integration and RBAC implementation',
    currentStatus: 'final_approved',
    priority: 'high',
    category: 'operational',
    createdByUserId: 'user-1',
    divisionId: 'division-1',
    sectorId: 'sector-1',
    currentVersion: 3,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-10'),
    submittedAt: new Date('2025-01-06'),
    approvedBySectorAt: new Date('2025-01-08'),
    finalApprovedAt: new Date('2025-01-10'),
  },
  {
    id: 'report-2',
    projectId: 'project-1',
    title: 'DMDPR Frontend Development Progress - Week 3',
    summary: 'Weekly progress report on frontend components and UI implementation',
    objectives: 'Develop user-facing components and dashboards',
    keyIssues: 'Minor styling inconsistencies identified',
    statusUpdate: 'Completed Report Status Badge component and mock data setup',
    risks: 'None',
    recommendations: 'Continue with dashboard updates',
    currentStatus: 'under_review_sector',
    priority: 'medium',
    category: 'operational',
    createdByUserId: 'user-1',
    divisionId: 'division-1',
    sectorId: 'sector-1',
    currentVersion: 1,
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
    submittedAt: new Date('2025-01-12'),
  },
  {
    id: 'report-3',
    projectId: 'project-2',
    title: 'Network Infrastructure Assessment Report',
    summary: 'Comprehensive assessment of current network infrastructure and upgrade requirements',
    objectives: 'Identify infrastructure gaps and recommend upgrade paths',
    keyIssues: 'Legacy equipment in 3 regional offices requires immediate attention',
    statusUpdate: 'Assessment completed. Procurement planning in progress.',
    risks: 'Budget constraints may delay timeline',
    recommendations: 'Prioritize critical sites for Phase 1 deployment',
    currentStatus: 'approved_by_sector',
    priority: 'critical',
    category: 'strategic',
    createdByUserId: 'user-5',
    divisionId: 'division-2',
    sectorId: 'sector-1',
    currentVersion: 2,
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-11'),
    submittedAt: new Date('2025-01-09'),
    approvedBySectorAt: new Date('2025-01-11'),
  },
  {
    id: 'report-4',
    projectId: 'project-1',
    title: 'Authentication Module Implementation Plan',
    summary: 'Draft plan for implementing Azure AD SSO and RBAC system',
    objectives: 'Design and implement secure authentication flow',
    keyIssues: undefined,
    statusUpdate: 'Initial research completed, awaiting HoD review',
    risks: undefined,
    recommendations: undefined,
    currentStatus: 'draft',
    priority: 'high',
    category: 'technical',
    createdByUserId: 'user-2',
    divisionId: 'division-1',
    sectorId: 'sector-1',
    currentVersion: 1,
    createdAt: new Date('2025-01-13'),
    updatedAt: new Date('2025-01-13'),
  },
  {
    id: 'report-5',
    projectId: 'project-3',
    title: 'Q4 2024 Compliance Monitoring Summary',
    summary: 'Quarterly summary of regulatory compliance monitoring activities',
    objectives: 'Report compliance status across all monitored entities',
    keyIssues: '2 minor violations detected and resolved',
    statusUpdate: 'Quarterly review completed',
    risks: 'Low compliance risk overall',
    recommendations: 'Maintain current monitoring frequency',
    currentStatus: 'returned_for_revision_sector',
    priority: 'medium',
    category: 'compliance',
    createdByUserId: 'user-6',
    divisionId: 'division-3',
    sectorId: 'sector-2',
    currentVersion: 2,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-12'),
    submittedAt: new Date('2025-01-11'),
  },
  {
    id: 'report-6',
    projectId: 'project-2',
    title: 'Cybersecurity Audit - Network Infrastructure',
    summary: 'Security assessment of network infrastructure upgrade plans',
    objectives: 'Ensure security compliance in upgrade specifications',
    keyIssues: 'Firewall configuration needs enhancement',
    statusUpdate: 'Audit completed, recommendations provided',
    risks: 'Medium - security gaps in legacy systems',
    recommendations: 'Implement zero-trust architecture',
    currentStatus: 'under_review_dmd',
    priority: 'critical',
    category: 'compliance',
    createdByUserId: 'user-5',
    divisionId: 'division-2',
    sectorId: 'sector-1',
    currentVersion: 3,
    createdAt: new Date('2025-01-07'),
    updatedAt: new Date('2025-01-11'),
    submittedAt: new Date('2025-01-08'),
    approvedBySectorAt: new Date('2025-01-10'),
  },
];

// ============================================================================
// REPORTS WITH RELATIONS
// ============================================================================

export const mockReportsWithRelations: ReportWithRelations[] = mockReports.map((report) => ({
  ...report,
  project: mockProjects.find((p) => p.id === report.projectId)!,
  createdBy: mockUsers.find((u) => u.id === report.createdByUserId)!,
  division: mockDivisions.find((d) => d.id === report.divisionId)!,
  sector: mockSectors.find((s) => s.id === report.sectorId)!,
  attachments: [],
  commentsCount: Math.floor(Math.random() * 5),
}));

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getUserById(id: string) {
  return mockUsers.find((u) => u.id === id);
}

import { z } from 'zod';

// ============================================================================
// USER VALIDATION SCHEMA
// ============================================================================

export const userFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, dots, hyphens and apostrophes'),

  email: z.string()
    .email('Invalid email address')
    .regex(/^[a-zA-Z0-9._%+-]+@mcmc\.gov\.my$/, 'Email must be from mcmc.gov.my domain'),

  azureAdObjectId: z.string()
    .min(5, 'Azure AD Object ID is required')
    .regex(/^[a-zA-Z0-9-]+$/, 'Invalid Azure AD Object ID format'),

  role: z.enum([
    'SYSTEM_ADMIN',
    'DEPUTY_MD',
    'CHIEF_OF_SECTOR',
    'HEAD_OF_DIVISION',
    'DIVISION_SECRETARY'
  ], {
    message: 'Please select a valid role'
  }),

  sectorIds: z.array(z.string()).default([]),

  divisionIds: z.array(z.string()).default([]),

  isActive: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userFormSchema>;

// ============================================================================
// SECTOR VALIDATION SCHEMA
// ============================================================================

export const sectorFormSchema = z.object({
  code: z.string()
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code must be less than 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'Code must be uppercase letters, numbers, and hyphens only')
    .transform(val => val.toUpperCase()),

  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(200, 'Name must be less than 200 characters'),

  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),

  chiefOfSectorId: z.string().optional().or(z.literal('')),
});

export type SectorFormData = z.infer<typeof sectorFormSchema>;

// ============================================================================
// DIVISION VALIDATION SCHEMA
// ============================================================================

export const divisionFormSchema = z.object({
  code: z.string()
    .min(2, 'Code must be at least 2 characters')
    .max(30, 'Code must be less than 30 characters')
    .regex(/^[A-Z0-9-]+$/, 'Code must be uppercase letters, numbers, and hyphens only')
    .transform(val => val.toUpperCase()),

  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(200, 'Name must be less than 200 characters'),

  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),

  sectorId: z.string()
    .min(1, 'Please select a sector'),

  headOfDivisionId: z.string().optional().or(z.literal('')),
});

export type DivisionFormData = z.infer<typeof divisionFormSchema>;

// ============================================================================
// PROJECT VALIDATION SCHEMA
// ============================================================================

export const projectFormSchema = z.object({
  code: z.string()
    .min(2, 'Code must be at least 2 characters')
    .max(50, 'Code must be less than 50 characters')
    .regex(/^[A-Z0-9-]+$/, 'Code must be uppercase letters, numbers, and hyphens only')
    .transform(val => val.toUpperCase()),

  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(300, 'Name must be less than 300 characters'),

  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .or(z.literal('')),

  sectorId: z.string()
    .min(1, 'Please select a sector'),

  divisionId: z.string()
    .min(1, 'Please select a division'),

  status: z.enum(['active', 'completed', 'on_hold', 'cancelled'], {
    message: 'Please select a valid status'
  }),

  startDate: z.string()
    .min(1, 'Start date is required'),

  endDate: z.string()
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  if (!data.endDate) return true;
  return new Date(data.endDate) >= new Date(data.startDate);
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

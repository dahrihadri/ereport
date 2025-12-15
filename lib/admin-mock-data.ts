// ============================================================================
// Admin Mock Data Management
// In-memory CRUD operations for admin features
// ============================================================================

import { User, Sector, Division, Project } from '@/types';
import { mockUsers, mockSectors, mockDivisions, mockProjects } from './mock-data';

// ============================================================================
// IN-MEMORY STORES (will reset on page refresh)
// ============================================================================

let usersStore: User[] = [...mockUsers];
let sectorsStore: Sector[] = [...mockSectors];
let divisionsStore: Division[] = [...mockDivisions];
let projectsStore: Project[] = [...mockProjects];

// ============================================================================
// USER CRUD OPERATIONS
// ============================================================================

export const getAllUsers = (): User[] => {
  return [...usersStore];
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  usersStore.push(newUser);
  return newUser;
};

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const index = usersStore.findIndex(u => u.id === id);
  if (index === -1) return null;

  usersStore[index] = {
    ...usersStore[index],
    ...updates,
    updatedAt: new Date(),
  };
  return usersStore[index];
};

export const deleteUser = (id: string): boolean => {
  const index = usersStore.findIndex(u => u.id === id);
  if (index === -1) return false;

  usersStore.splice(index, 1);
  return true;
};

export const deactivateUser = (id: string): User | null => {
  return updateUser(id, { isActive: false });
};

export const activateUser = (id: string): User | null => {
  return updateUser(id, { isActive: true });
};

// ============================================================================
// SECTOR CRUD OPERATIONS
// ============================================================================

export const getAllSectors = (): Sector[] => {
  return [...sectorsStore];
};

export const createSector = (sectorData: Omit<Sector, 'id' | 'createdAt' | 'updatedAt'>): Sector => {
  const newSector: Sector = {
    ...sectorData,
    id: `sector-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  sectorsStore.push(newSector);
  return newSector;
};

export const updateSector = (id: string, updates: Partial<Sector>): Sector | null => {
  const index = sectorsStore.findIndex(s => s.id === id);
  if (index === -1) return null;

  sectorsStore[index] = {
    ...sectorsStore[index],
    ...updates,
    updatedAt: new Date(),
  };
  return sectorsStore[index];
};

export const deleteSector = (id: string): boolean => {
  const index = sectorsStore.findIndex(s => s.id === id);
  if (index === -1) return false;

  // Check if sector has divisions
  const hasDivisions = divisionsStore.some(d => d.sectorId === id);
  if (hasDivisions) {
    throw new Error('Cannot delete sector with existing divisions');
  }

  sectorsStore.splice(index, 1);
  return true;
};

// ============================================================================
// DIVISION CRUD OPERATIONS
// ============================================================================

export const getAllDivisions = (): Division[] => {
  return [...divisionsStore];
};

export const getDivisionsBySectorId = (sectorId: string): Division[] => {
  return divisionsStore.filter(d => d.sectorId === sectorId);
};

export const createDivision = (divisionData: Omit<Division, 'id' | 'createdAt' | 'updatedAt'>): Division => {
  const newDivision: Division = {
    ...divisionData,
    id: `division-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  divisionsStore.push(newDivision);
  return newDivision;
};

export const updateDivision = (id: string, updates: Partial<Division>): Division | null => {
  const index = divisionsStore.findIndex(d => d.id === id);
  if (index === -1) return null;

  divisionsStore[index] = {
    ...divisionsStore[index],
    ...updates,
    updatedAt: new Date(),
  };
  return divisionsStore[index];
};

export const deleteDivision = (id: string): boolean => {
  const index = divisionsStore.findIndex(d => d.id === id);
  if (index === -1) return false;

  // Check if division has projects
  const hasProjects = projectsStore.some(p => p.divisionId === id);
  if (hasProjects) {
    throw new Error('Cannot delete division with existing projects');
  }

  divisionsStore.splice(index, 1);
  return true;
};

// ============================================================================
// PROJECT CRUD OPERATIONS
// ============================================================================

export const getAllProjects = (): Project[] => {
  return [...projectsStore];
};

export const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
  const newProject: Project = {
    ...projectData,
    id: `project-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  projectsStore.push(newProject);
  return newProject;
};

export const updateProject = (id: string, updates: Partial<Project>): Project | null => {
  const index = projectsStore.findIndex(p => p.id === id);
  if (index === -1) return null;

  projectsStore[index] = {
    ...projectsStore[index],
    ...updates,
    updatedAt: new Date(),
  };
  return projectsStore[index];
};

export const deleteProject = (id: string): boolean => {
  const index = projectsStore.findIndex(p => p.id === id);
  if (index === -1) return false;

  projectsStore.splice(index, 1);
  return true;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

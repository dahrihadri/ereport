// Audit Trail System

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ACTIVATE' | 'DEACTIVATE';
  entity: 'USER' | 'SECTOR' | 'DIVISION' | 'PROJECT';
  entityId: string;
  entityName: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: Record<string, any>;
}

const AUDIT_STORAGE_KEY = 'mcmc_audit_logs';
const MAX_LOGS = 1000;

// Load audit logs from localStorage
function loadLogsFromStorage(): AuditLog[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!stored) return [];

    const logs = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return logs.map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load audit logs from localStorage:', error);
    return [];
  }
}

// Save audit logs to localStorage
function saveLogsToStorage(logs: AuditLog[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save audit logs to localStorage:', error);
  }
}

// In-memory audit log store with localStorage persistence
let auditLogs: AuditLog[] = loadLogsFromStorage();

export function logAuditEvent(
  userId: string,
  userName: string,
  action: AuditLog['action'],
  entity: AuditLog['entity'],
  entityId: string,
  entityName: string,
  changes?: AuditLog['changes'],
  metadata?: Record<string, any>
): void {
  const log: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    userId,
    userName,
    action,
    entity,
    entityId,
    entityName,
    changes,
    metadata,
  };

  auditLogs.unshift(log); // Add to beginning for newest first

  // Keep only last MAX_LOGS logs in memory
  if (auditLogs.length > MAX_LOGS) {
    auditLogs = auditLogs.slice(0, MAX_LOGS);
  }

  // Persist to localStorage
  saveLogsToStorage(auditLogs);
}

export function getAuditLogs(filters?: {
  entity?: AuditLog['entity'];
  entityId?: string;
  userId?: string;
  action?: AuditLog['action'];
  limit?: number;
}): AuditLog[] {
  let filtered = [...auditLogs];

  if (filters?.entity) {
    filtered = filtered.filter(log => log.entity === filters.entity);
  }

  if (filters?.entityId) {
    filtered = filtered.filter(log => log.entityId === filters.entityId);
  }

  if (filters?.userId) {
    filtered = filtered.filter(log => log.userId === filters.userId);
  }

  if (filters?.action) {
    filtered = filtered.filter(log => log.action === filters.action);
  }

  if (filters?.limit) {
    filtered = filtered.slice(0, filters.limit);
  }

  return filtered;
}

export function clearAuditLogs(): void {
  auditLogs = [];
  saveLogsToStorage(auditLogs);
}

export function getEntityHistory(entity: AuditLog['entity'], entityId: string): AuditLog[] {
  return auditLogs.filter(log => log.entity === entity && log.entityId === entityId);
}

export function getUserActivity(userId: string, limit: number = 50): AuditLog[] {
  return auditLogs.filter(log => log.userId === userId).slice(0, limit);
}

// Helper to detect changes between old and new objects
export function detectChanges(oldObj: any, newObj: any): AuditLog['changes'] {
  const changes: AuditLog['changes'] = [];
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  allKeys.forEach(key => {
    // Skip internal fields
    if (['id', 'createdAt', 'updatedAt'].includes(key)) return;

    const oldValue = oldObj[key];
    const newValue = newObj[key];

    // Handle arrays
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      if (JSON.stringify(oldValue.sort()) !== JSON.stringify(newValue.sort())) {
        changes.push({ field: key, oldValue, newValue });
      }
    }
    // Handle objects
    else if (typeof oldValue === 'object' && typeof newValue === 'object') {
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({ field: key, oldValue, newValue });
      }
    }
    // Handle primitives
    else if (oldValue !== newValue) {
      changes.push({ field: key, oldValue, newValue });
    }
  });

  return changes.length > 0 ? changes : undefined;
}

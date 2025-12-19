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

// In-memory audit log store
let auditLogs: AuditLog[] = [];

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

  // Keep only last 1000 logs in memory
  if (auditLogs.length > 1000) {
    auditLogs = auditLogs.slice(0, 1000);
  }
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

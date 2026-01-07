'use client';

import { useState, useEffect } from 'react';
import { getAuditLogs, clearAuditLogs, AuditLog } from '@/lib/audit-trail';
import { FileText, Filter, Download, Trash2, Clock, User, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [entityFilter, setEntityFilter] = useState<AuditLog['entity'] | 'all'>('all');
  const [actionFilter, setActionFilter] = useState<AuditLog['action'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load logs on mount
  useEffect(() => {
    loadLogs();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = logs;

    if (entityFilter !== 'all') {
      filtered = filtered.filter(log => log.entity === entityFilter);
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, entityFilter, actionFilter, searchTerm]);

  const loadLogs = () => {
    setLogs(getAuditLogs());
  };

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      clearAuditLogs();
      loadLogs();
      toast.success('Audit Logs Cleared', {
        description: 'All audit logs have been permanently deleted',
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity Name', 'Changes'];
    const rows = filteredLogs.map(log => [
      new Date(log.timestamp).toLocaleString('en-MY'),
      log.userName,
      log.action,
      log.entity,
      log.entityName,
      log.changes ? JSON.stringify(log.changes) : 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Export Complete', {
      description: `Exported ${filteredLogs.length} audit logs`,
    });
  };

  const getActionColor = (action: AuditLog['action']) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'ACTIVATE': return 'bg-emerald-100 text-emerald-800';
      case 'DEACTIVATE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntityIcon = (entity: AuditLog['entity']) => {
    switch (entity) {
      case 'USER': return '👤';
      case 'SECTOR': return '🏢';
      case 'DIVISION': return '📁';
      case 'PROJECT': return '📊';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            View and track all system changes and user activities
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:bg-gray-400"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button
            onClick={handleClearLogs}
            disabled={logs.length === 0}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:bg-gray-400"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Logs</span>
            <span className="sm:hidden">Clear</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Total Logs</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{logs.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Creates</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {logs.filter(l => l.action === 'CREATE').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Updates</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {logs.filter(l => l.action === 'UPDATE').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Deletes</div>
          <div className="text-xl sm:text-2xl font-bold text-red-600">
            {logs.filter(l => l.action === 'DELETE').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Entity or user name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Entity Type</label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Entities</option>
              <option value="USER">Users</option>
              <option value="SECTOR">Sectors</option>
              <option value="DIVISION">Divisions</option>
              <option value="PROJECT">Projects</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="ACTIVATE">Activate</option>
              <option value="DEACTIVATE">Deactivate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No audit logs found</p>
            <p className="text-sm text-gray-500 mt-1">
              {logs.length === 0 ? 'Audit logs will appear here as users make changes' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entity
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Changes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {new Date(log.timestamp).toLocaleString('en-MY', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="font-medium text-gray-900">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{getEntityIcon(log.entity)}</span>
                        <div>
                          <div className="font-medium text-gray-900">{log.entityName}</div>
                          <div className="text-xs text-gray-500">{log.entity}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                      {log.changes ? (
                        <div className="space-y-1 max-w-md">
                          {log.changes.map((change, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-medium text-gray-700">{change.field}:</span>{' '}
                              <span className="text-red-600">{JSON.stringify(change.oldValue)}</span>
                              {' → '}
                              <span className="text-green-600">{JSON.stringify(change.newValue)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No changes recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results count */}
      {filteredLogs.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      )}
    </div>
  );
}

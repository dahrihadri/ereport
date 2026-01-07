'use client';

import { useState } from 'react';
import { Sector } from '@/types';
import {
  getAllSectors,
  createSector,
  updateSector,
  deleteSector,
  getAllUsers,
  getDivisionsBySectorId,
} from '@/lib/admin-mock-data';
import { Plus, Edit2, Building2, FileSpreadsheet } from 'lucide-react';
import SectorForm from '@/components/admin/SectorForm';
import DeleteButton from '@/components/admin/DeleteButton';
import { exportSectorsToCSV } from '@/lib/export-utils';
import { logAuditEvent, detectChanges } from '@/lib/audit-trail';

export default function SectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>(getAllSectors());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<Sector | undefined>(undefined);

  const loadSectors = () => {
    setSectors(getAllSectors());
  };

  const handleCreateSector = () => {
    setSelectedSector(undefined);
    setIsFormOpen(true);
  };

  const handleEditSector = (sector: Sector) => {
    setSelectedSector(sector);
    setIsFormOpen(true);
  };

  const handleSaveSector = (sectorData: Partial<Sector>) => {
    const currentUser = { id: 'admin-1', name: 'System Admin' };

    if (selectedSector) {
      const changes = detectChanges(selectedSector, sectorData);
      updateSector(selectedSector.id, sectorData);

      logAuditEvent(
        currentUser.id,
        currentUser.name,
        'UPDATE',
        'SECTOR',
        selectedSector.id,
        sectorData.name || selectedSector.name,
        changes
      );
    } else {
      const newSector = createSector(sectorData as Omit<Sector, 'id' | 'createdAt' | 'updatedAt'>);

      logAuditEvent(
        currentUser.id,
        currentUser.name,
        'CREATE',
        'SECTOR',
        newSector.id,
        newSector.name
      );
    }
    loadSectors();
    setIsFormOpen(false);
  };

  const handleDeleteSector = async (sectorId: string): Promise<boolean> => {
    try {
      const currentUser = { id: 'admin-1', name: 'System Admin' };
      const sector = getAllSectors().find(s => s.id === sectorId);

      deleteSector(sectorId);

      if (sector) {
        logAuditEvent(
          currentUser.id,
          currentUser.name,
          'DELETE',
          'SECTOR',
          sectorId,
          sector.name
        );
      }

      loadSectors();
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete sector');
    }
  };

  const getChiefName = (chiefUserId?: string) => {
    if (!chiefUserId) return 'Not assigned';
    const users = getAllUsers();
    const chief = users.find((u) => u.id === chiefUserId);
    return chief?.name || 'Unknown';
  };

  const getDivisionCount = (sectorId: string) => {
    return getDivisionsBySectorId(sectorId).length;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sector Management</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage organizational sectors and their leadership
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportSectorsToCSV(sectors)}
            disabled={sectors.length === 0}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base whitespace-nowrap disabled:bg-gray-400"
          >
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button
            onClick={handleCreateSector}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Create Sector</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Total Sectors</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{sectors.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">With Assigned Chiefs</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {sectors.filter((s) => s.chiefUserId).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 col-span-2 md:col-span-1">
          <div className="text-xs sm:text-sm text-gray-600">Total Divisions</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {sectors.reduce((sum, s) => sum + getDivisionCount(s.id), 0)}
          </div>
        </div>
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {sector.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">{sector.code}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {sector.description && (
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                  {sector.description}
                </p>
              )}

              {/* Stats */}
              <div className="space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Chief:</span>
                  <span className="font-medium text-gray-900 truncate ml-2">
                    {getChiefName(sector.chiefUserId)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Divisions:</span>
                  <span className="font-medium text-gray-900">
                    {getDivisionCount(sector.id)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditSector(sector)}
                  className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Edit</span>
                </button>
                <DeleteButton
                  itemId={sector.id}
                  itemName={sector.name}
                  itemType="sector"
                  onDelete={handleDeleteSector}
                  variant="text"
                  confirmMessage={`Are you sure you want to delete ${sector.name}? This will fail if there are divisions under this sector.`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {sectors.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
          <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No sectors yet</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Get started by creating your first sector
          </p>
          <button
            onClick={handleCreateSector}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Create Sector</span>
          </button>
        </div>
      )}

      {/* Sector Form Modal */}
      <SectorForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveSector}
        sector={selectedSector}
      />
    </div>
  );
}

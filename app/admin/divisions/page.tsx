'use client';

import { useState } from 'react';
import { Division } from '@/types';
import {
  getAllDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
  getAllSectors,
  getAllUsers,
} from '@/lib/admin-mock-data';
import { Plus, FileSpreadsheet } from 'lucide-react';
import DivisionForm from '@/components/admin/DivisionForm';
import OrgStructureTree from '@/components/admin/OrgStructureTree';
import DeleteButton from '@/components/admin/DeleteButton';
import { exportDivisionsToCSV } from '@/lib/export-utils';
import { logAuditEvent, detectChanges } from '@/lib/audit-trail';

export default function DivisionsPage() {
  const [divisions, setDivisions] = useState<Division[]>(getAllDivisions());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');

  const loadDivisions = () => {
    setDivisions(getAllDivisions());
  };

  const handleCreateDivision = () => {
    setSelectedDivision(undefined);
    setIsFormOpen(true);
  };

  const handleEditDivision = (division: Division) => {
    setSelectedDivision(division);
    setIsFormOpen(true);
  };

  const handleSaveDivision = (divisionData: Partial<Division>) => {
    const currentUser = { id: 'admin-1', name: 'System Admin' };

    if (selectedDivision) {
      const changes = detectChanges(selectedDivision, divisionData);
      updateDivision(selectedDivision.id, divisionData);

      logAuditEvent(
        currentUser.id,
        currentUser.name,
        'UPDATE',
        'DIVISION',
        selectedDivision.id,
        divisionData.name || selectedDivision.name,
        changes
      );
    } else {
      const newDivision = createDivision(divisionData as Omit<Division, 'id' | 'createdAt' | 'updatedAt'>);

      logAuditEvent(
        currentUser.id,
        currentUser.name,
        'CREATE',
        'DIVISION',
        newDivision.id,
        newDivision.name
      );
    }
    loadDivisions();
    setIsFormOpen(false);
  };

  const handleDeleteDivision = async (divisionId: string): Promise<boolean> => {
    try {
      const currentUser = { id: 'admin-1', name: 'System Admin' };
      const division = divisions.find(d => d.id === divisionId);

      deleteDivision(divisionId);

      if (division) {
        logAuditEvent(
          currentUser.id,
          currentUser.name,
          'DELETE',
          'DIVISION',
          divisionId,
          division.name
        );
      }

      loadDivisions();
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete division');
    }
  };

  const sectors = getAllSectors();
  const users = getAllUsers();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Division Management</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Manage divisions and their organizational hierarchy
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {/* View Toggle */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md ${
                viewMode === 'tree'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tree View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => exportDivisionsToCSV(divisions)}
              disabled={divisions.length === 0}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base whitespace-nowrap disabled:bg-gray-400"
            >
              <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button
              onClick={handleCreateDivision}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base whitespace-nowrap"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Create Division</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Total Divisions</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{divisions.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">With Assigned HODs</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {divisions.filter((d) => d.hodUserId).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Sectors</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{sectors.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Avg per Sector</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {sectors.length > 0 ? (divisions.length / sectors.length).toFixed(1) : 0}
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'tree' ? (
        <OrgStructureTree
          onEditDivision={handleEditDivision}
          onDeleteDivision={handleDeleteDivision}
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sector
                </th>
                <th className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Head of Division
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {divisions.map((division) => {
                const sector = sectors.find((s) => s.id === division.sectorId);
                const hod = division.hodUserId
                  ? users.find((u) => u.id === division.hodUserId)
                  : null;

                return (
                  <tr key={division.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {division.code}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {division.name}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {sector?.name || 'Unknown'}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {hod?.name || 'Not assigned'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleEditDivision(division)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <DeleteButton
                          itemId={division.id}
                          itemName={division.name}
                          itemType="division"
                          onDelete={handleDeleteDivision}
                          variant="text"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Division Form Modal */}
      <DivisionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveDivision}
        division={selectedDivision}
      />
    </div>
  );
}

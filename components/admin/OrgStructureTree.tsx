'use client';

import { useState, useEffect } from 'react';
import { Sector, Division } from '@/types';
import { getAllSectors, getAllDivisions, getAllUsers, getDivisionsBySectorId } from '@/lib/admin-mock-data';
import { ChevronDown, ChevronRight, Building2, FolderTree, Edit2, User } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';

interface OrgStructureTreeProps {
  onEditDivision: (division: Division) => void;
  onDeleteDivision: (divisionId: string) => Promise<boolean>;
}

export default function OrgStructureTree({ onEditDivision, onDeleteDivision }: OrgStructureTreeProps) {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSectors(getAllSectors());
    setDivisions(getAllDivisions());
    // Expand all sectors by default
    setExpandedSectors(new Set(getAllSectors().map(s => s.id)));
  }, []);

  const toggleSector = (sectorId: string) => {
    setExpandedSectors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectorId)) {
        newSet.delete(sectorId);
      } else {
        newSet.add(sectorId);
      }
      return newSet;
    });
  };

  const users = getAllUsers();

  const getUserName = (userId?: string) => {
    if (!userId) return null;
    return users.find(u => u.id === userId)?.name;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizational Structure</h3>

        {sectors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No organizational structure defined yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sectors.map(sector => {
              const sectorDivisions = getDivisionsBySectorId(sector.id);
              const isExpanded = expandedSectors.has(sector.id);
              const chiefName = getUserName(sector.chiefUserId);

              return (
                <div key={sector.id} className="border border-gray-200 rounded-lg">
                  {/* Sector Header */}
                  <div
                    onClick={() => toggleSector(sector.id)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <button className="text-gray-400 hover:text-gray-600">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{sector.name}</h4>
                          <span className="text-sm text-gray-500">({sector.code})</span>
                        </div>
                        {chiefName && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                            <User className="w-3 h-3" />
                            <span>Chief: {chiefName}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{sectorDivisions.length} divisions</span>
                      </div>
                    </div>
                  </div>

                  {/* Divisions List */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      {sectorDivisions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No divisions in this sector
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {sectorDivisions.map(division => {
                            const hodName = getUserName(division.hodUserId);

                            return (
                              <div
                                key={division.id}
                                className="flex items-center justify-between p-4 pl-16 hover:bg-gray-100"
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FolderTree className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-gray-900">{division.name}</span>
                                      <span className="text-sm text-gray-500">({division.code})</span>
                                    </div>
                                    {hodName && (
                                      <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                                        <User className="w-3 h-3" />
                                        <span>HOD: {hodName}</span>
                                      </div>
                                    )}
                                    {division.description && (
                                      <p className="text-sm text-gray-500 mt-1">{division.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEditDivision(division);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    title="Edit division"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <DeleteButton
                                      itemId={division.id}
                                      itemName={division.name}
                                      itemType="division"
                                      onDelete={onDeleteDivision}
                                      variant="icon"
                                      size="md"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { User, UserRole } from '@/types';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllSectors, getAllDivisions } from '@/lib/admin-mock-data';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  user?: User;
}

// Helper component to reset state when user changes
function UserFormContent({ onClose, onSave, user, isOpen }: UserFormProps) {
  const sectors = getAllSectors();
  const divisions = getAllDivisions();

  // Initialize form data from user prop
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: (user?.role || 'HEAD_OF_DIVISION') as UserRole,
    sectorIds: user?.sectorIds || [] as string[],
    divisionIds: user?.divisionIds || [] as string[],
    azureAdObjectId: user?.azureAdObjectId || '',
    isActive: user?.isActive ?? true,
  });

  // Lock body scroll when form is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleSector = (sectorId: string) => {
    setFormData(prev => ({
      ...prev,
      sectorIds: prev.sectorIds.includes(sectorId)
        ? prev.sectorIds.filter(id => id !== sectorId)
        : [...prev.sectorIds, sectorId],
    }));
  };

  const toggleDivision = (divisionId: string) => {
    setFormData(prev => ({
      ...prev,
      divisionIds: prev.divisionIds.includes(divisionId)
        ? prev.divisionIds.filter(id => id !== divisionId)
        : [...prev.divisionIds, divisionId],
    }));
  };

  if (!isOpen) return null;

  const roleOptions: { value: UserRole; label: string }[] = [
    { value: 'SYSTEM_ADMIN', label: 'System Admin' },
    { value: 'DEPUTY_MD', label: 'Deputy Managing Director' },
    { value: 'CHIEF_OF_SECTOR', label: 'Chief of Sector' },
    { value: 'HEAD_OF_DIVISION', label: 'Head of Division' },
    { value: 'DIVISION_SECRETARY', label: 'Division Secretary' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInFromRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `
      }} />

      {/* Grey Backdrop with Fade Animation */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
        style={{
          animation: 'fadeIn 0.3s ease-in-out forwards',
        }}
      />

      {/* Side Panel with Slide Animation and Curved Edge */}
      <div
        className="fixed inset-y-0 right-0 w-full md:w-1/2 bg-white shadow-2xl z-50 overflow-hidden rounded-l-3xl flex flex-col"
        style={{
          animation: 'slideInFromRight 0.3s ease-in-out forwards',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {user ? 'Edit User' : 'Create New User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Azure AD Object ID *
                </label>
                <input
                  type="text"
                  value={formData.azureAdObjectId}
                  onChange={(e) => setFormData({ ...formData, azureAdObjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active User
              </label>
            </div>

            {/* Sectors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sectors
              </label>
              <div className="border border-gray-300 rounded-xl p-4 max-h-40 overflow-y-auto">
                {sectors.map(sector => (
                  <div key={sector.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`sector-${sector.id}`}
                      checked={formData.sectorIds.includes(sector.id)}
                      onChange={() => toggleSector(sector.id)}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`sector-${sector.id}`} className="ml-2 text-sm text-gray-700">
                      {sector.name} ({sector.code})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Divisions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Divisions
              </label>
              <div className="border border-gray-300 rounded-xl p-4 max-h-40 overflow-y-auto">
                {divisions.map(division => (
                  <div key={division.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`division-${division.id}`}
                      checked={formData.divisionIds.includes(division.id)}
                      onChange={() => toggleDivision(division.id)}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`division-${division.id}`} className="ml-2 text-sm text-gray-700">
                      {division.name} ({division.code})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                {user ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default function UserForm({ isOpen, onClose, onSave, user }: UserFormProps) {
  // Use key prop to reset component state when user changes
  return <UserFormContent key={user?.id || 'new'} isOpen={isOpen} onClose={onClose} onSave={onSave} user={user} />;
}

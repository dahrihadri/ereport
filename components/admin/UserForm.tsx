'use client';

import { User, UserRole } from '@/types';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllSectors, getAllDivisions } from '@/lib/admin-mock-data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, type UserFormData } from '@/lib/validations/admin-schemas';

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

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: (user?.role || 'HEAD_OF_DIVISION') as UserRole,
      sectorIds: user?.sectorIds || [],
      divisionIds: user?.divisionIds || [],
      azureAdObjectId: user?.azureAdObjectId || '',
      isActive: user?.isActive ?? true,
    },
  });

  // Watch form values for multi-select
  const sectorIds = watch('sectorIds');
  const divisionIds = watch('divisionIds');

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: user?.name || '',
        email: user?.email || '',
        role: (user?.role || 'HEAD_OF_DIVISION') as UserRole,
        sectorIds: user?.sectorIds || [],
        divisionIds: user?.divisionIds || [],
        azureAdObjectId: user?.azureAdObjectId || '',
        isActive: user?.isActive ?? true,
      });
    }
  }, [user, isOpen, reset]);

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

  const onSubmit = (data: UserFormData) => {
    onSave(data);
  };

  const toggleSector = (sectorId: string) => {
    const currentSectorIds = sectorIds || [];
    const newSectorIds = currentSectorIds.includes(sectorId)
      ? currentSectorIds.filter(id => id !== sectorId)
      : [...currentSectorIds, sectorId];
    setValue('sectorIds', newSectorIds);
  };

  const toggleDivision = (divisionId: string) => {
    const currentDivisionIds = divisionIds || [];
    const newDivisionIds = currentDivisionIds.includes(divisionId)
      ? currentDivisionIds.filter(id => id !== divisionId)
      : [...currentDivisionIds, divisionId];
    setValue('divisionIds', newDivisionIds);
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-red-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-red-500'
                  }`}
                  placeholder="user@mcmc.gov.my"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  {...register('role')}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.role
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-red-500'
                  }`}
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Azure AD Object ID *
                </label>
                <input
                  type="text"
                  {...register('azureAdObjectId')}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.azureAdObjectId
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-red-500'
                  }`}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
                {errors.azureAdObjectId && (
                  <p className="mt-1 text-xs text-red-600">{errors.azureAdObjectId.message}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
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
                      checked={sectorIds?.includes(sector.id) || false}
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
                      checked={divisionIds?.includes(division.id) || false}
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
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmitting ? 'Saving...' : (user ? 'Save Changes' : 'Create User')}
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

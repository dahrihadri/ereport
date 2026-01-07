'use client';

import { Division } from '@/types';
import { X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { getAllSectors, getAllUsers } from '@/lib/admin-mock-data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { divisionFormSchema, type DivisionFormData } from '@/lib/validations/admin-schemas';

interface DivisionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (divisionData: Partial<Division>) => void;
  division?: Division;
}

// Helper component to reset state when division changes
function DivisionFormContent({ onClose, onSave, division, isOpen }: DivisionFormProps) {
  const sectors = getAllSectors();
  const users = getAllUsers();
  const hods = users.filter((u) => u.role === 'HEAD_OF_DIVISION');

  // Memoize the default sector ID to prevent unnecessary resets
  const defaultSectorId = useMemo(() => sectors[0]?.id || '', [sectors]);

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DivisionFormData>({
    resolver: zodResolver(divisionFormSchema),
    defaultValues: {
      code: division?.code || '',
      name: division?.name || '',
      description: division?.description || '',
      sectorId: division?.sectorId || defaultSectorId,
      headOfDivisionId: division?.hodUserId || '',
    },
  });

  // Reset form when division changes or modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        code: division?.code || '',
        name: division?.name || '',
        description: division?.description || '',
        sectorId: division?.sectorId || defaultSectorId,
        headOfDivisionId: division?.hodUserId || '',
      });
    }
  }, [division, isOpen, reset, defaultSectorId]);

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

  const onSubmit = (data: DivisionFormData) => {
    onSave({
      ...data,
      hodUserId: data.headOfDivisionId || undefined,
      description: data.description || undefined,
    });
  };

  if (!isOpen) return null;

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
            {division ? 'Edit Division' : 'Create New Division'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code *
              </label>
              <input
                type="text"
                {...register('code')}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.code
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-red-500'
                }`}
                placeholder="e.g., DIV-IT-DEV"
              />
              {errors.code && (
                <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
              )}
            </div>

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
                placeholder="e.g., Software Development Division"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-red-500'
                }`}
                rows={3}
                placeholder="Brief description of the division..."
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Sector *
              </label>
              <select
                {...register('sectorId')}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.sectorId
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-red-500'
                }`}
              >
                <option value="">Select a sector</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name} ({sector.code})
                  </option>
                ))}
              </select>
              {errors.sectorId && (
                <p className="mt-1 text-xs text-red-600">{errors.sectorId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Head of Division
              </label>
              <select
                {...register('headOfDivisionId')}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.headOfDivisionId
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-red-500'
                }`}
              >
                <option value="">Not assigned</option>
                {hods.map((hod) => (
                  <option key={hod.id} value={hod.id}>
                    {hod.name} ({hod.email})
                  </option>
                ))}
              </select>
              {errors.headOfDivisionId && (
                <p className="mt-1 text-xs text-red-600">{errors.headOfDivisionId.message}</p>
              )}
              {hods.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No users with &quot;Head of Division&quot; role found
                </p>
              )}
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
                {isSubmitting ? 'Saving...' : (division ? 'Save Changes' : 'Create Division')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default function DivisionForm({ isOpen, onClose, onSave, division }: DivisionFormProps) {
  // Use key prop to reset component state when division changes
  return <DivisionFormContent key={division?.id || 'new'} isOpen={isOpen} onClose={onClose} onSave={onSave} division={division} />;
}

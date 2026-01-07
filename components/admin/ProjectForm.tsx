'use client';

import { Project, ProjectStatus } from '@/types';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllSectors, getAllDivisions, getDivisionsBySectorId } from '@/lib/admin-mock-data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectFormSchema, type ProjectFormData } from '@/lib/validations/admin-schemas';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<Project>) => void;
  project?: Project;
}

// Helper component to reset state when project changes
function ProjectFormContent({ onClose, onSave, project, isOpen }: ProjectFormProps) {
  const sectors = getAllSectors();
  const firstSector = sectors[0];

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      code: project?.code || '',
      name: project?.name || '',
      description: project?.description || '',
      sectorId: project?.sectorId || firstSector?.id || '',
      divisionId: project?.divisionId || '',
      status: (project?.status || 'active') as ProjectStatus,
      startDate: project?.startDate
        ? new Date(project.startDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      endDate: project?.endDate
        ? new Date(project.endDate).toISOString().split('T')[0]
        : '',
    },
  });

  // Watch form values
  const sectorId = watch('sectorId');

  const [availableDivisions, setAvailableDivisions] = useState(
    project?.sectorId
      ? getDivisionsBySectorId(project.sectorId)
      : firstSector
        ? getDivisionsBySectorId(firstSector.id)
        : getAllDivisions()
  );

  // Reset form when project changes or modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        code: project?.code || '',
        name: project?.name || '',
        description: project?.description || '',
        sectorId: project?.sectorId || firstSector?.id || '',
        divisionId: project?.divisionId || '',
        status: (project?.status || 'active') as ProjectStatus,
        startDate: project?.startDate
          ? new Date(project.startDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        endDate: project?.endDate
          ? new Date(project.endDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [project, isOpen, reset, firstSector?.id]);

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

  // Update available divisions when sector changes
  useEffect(() => {
    if (sectorId) {
      setAvailableDivisions(getDivisionsBySectorId(sectorId));
      // Reset division if it doesn't belong to new sector
      const currentDivisionId = watch('divisionId');
      const divisionBelongsToSector = getDivisionsBySectorId(sectorId).some(
        d => d.id === currentDivisionId
      );
      if (!divisionBelongsToSector) {
        setValue('divisionId', '');
      }
    }
  }, [sectorId, setValue, watch]);

  const onSubmit = (data: ProjectFormData) => {
    onSave({
      ...data,
      description: data.description || undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      startDate: new Date(data.startDate),
    });
  };

  if (!isOpen) return null;

  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
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
            {project ? 'Edit Project' : 'Create New Project'}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="e.g., PROJ-2025-001"
                />
                {errors.code && (
                  <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  {...register('status')}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.status
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-red-500'
                  }`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
                )}
              </div>
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
                placeholder="e.g., Digital Transformation Initiative"
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
                placeholder="Brief description of the project..."
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector *
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
                      {sector.name}
                    </option>
                  ))}
                </select>
                {errors.sectorId && (
                  <p className="mt-1 text-xs text-red-600">{errors.sectorId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Division *
                </label>
                <select
                  {...register('divisionId')}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.divisionId
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-red-500'
                  }`}
                  disabled={!sectorId}
                >
                  <option value="">Select a division</option>
                  {availableDivisions.map((division) => (
                    <option key={division.id} value={division.id}>
                      {division.name}
                    </option>
                  ))}
                </select>
                {errors.divisionId && (
                  <p className="mt-1 text-xs text-red-600">{errors.divisionId.message}</p>
                )}
                {!sectorId && (
                  <p className="text-sm text-gray-500 mt-1">Select a sector first</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  {...register('startDate')}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.startDate
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-red-500'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  {...register('endDate')}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.endDate
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-red-500'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>
                )}
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
                {isSubmitting ? 'Saving...' : (project ? 'Save Changes' : 'Create Project')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default function ProjectForm({ isOpen, onClose, onSave, project }: ProjectFormProps) {
  // Use key prop to reset component state when project changes
  return <ProjectFormContent key={project?.id || 'new'} isOpen={isOpen} onClose={onClose} onSave={onSave} project={project} />;
}

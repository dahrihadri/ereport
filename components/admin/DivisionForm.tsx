'use client';

import { Division } from '@/types';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllSectors, getAllUsers } from '@/lib/admin-mock-data';

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

  // Initialize form data from division prop
  const [formData, setFormData] = useState({
    code: division?.code || '',
    name: division?.name || '',
    description: division?.description || '',
    sectorId: division?.sectorId || sectors[0]?.id || '',
    hodUserId: division?.hodUserId || '',
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
    onSave({
      ...formData,
      hodUserId: formData.hodUserId || undefined,
      description: formData.description || undefined,
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., DIV-IT-DEV"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Software Development Division"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Brief description of the division..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Sector *
              </label>
              <select
                value={formData.sectorId}
                onChange={(e) => setFormData({ ...formData, sectorId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select a sector</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name} ({sector.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Head of Division
              </label>
              <select
                value={formData.hodUserId}
                onChange={(e) => setFormData({ ...formData, hodUserId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Not assigned</option>
                {hods.map((hod) => (
                  <option key={hod.id} value={hod.id}>
                    {hod.name} ({hod.email})
                  </option>
                ))}
              </select>
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
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                {division ? 'Save Changes' : 'Create Division'}
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

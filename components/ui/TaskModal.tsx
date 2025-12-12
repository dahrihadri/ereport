'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, CompletionLevel } from '@/types';
import { X, Save, Calendar, User, Mail, Building2, Flag, Activity, Target } from 'lucide-react';
import CompletionLevelBadge from './CompletionLevelBadge';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task | null;
  mode: 'create' | 'edit' | 'view';
}

export default function TaskModal({ isOpen, onClose, onSave, task, mode }: TaskModalProps) {
  const getInitialFormData = (): Partial<Task> => {
    if (task) {
      return task;
    }
    return {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      assignedTo: '',
      assignedToEmail: '',
      department: '',
      startDate: new Date(),
      endDate: new Date(),
      completionLevel: 'not_started',
      tags: [],
    };
  };

  const [formData, setFormData] = useState<Partial<Task>>(getInitialFormData);

  // Update form data when task prop changes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isViewMode = mode === 'view';
  const title = mode === 'create' ? 'Create New Task' : mode === 'edit' ? 'Edit Task' : 'Task Details';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Flag className="w-4 h-4 text-blue-600" />
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isViewMode}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all placeholder:text-gray-400"
              placeholder="Enter task title..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isViewMode}
              required
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 resize-none transition-all placeholder:text-gray-400"
              placeholder="Describe the task in detail..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isViewMode}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isViewMode}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                Assigned To *
              </label>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                disabled={isViewMode}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all placeholder:text-gray-400"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-blue-600" />
                Email *
              </label>
              <input
                type="email"
                name="assignedToEmail"
                value={formData.assignedToEmail}
                onChange={handleChange}
                disabled={isViewMode}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all placeholder:text-gray-400"
                placeholder="email@mcmc.gov.my"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all placeholder:text-gray-400"
              placeholder="e.g. IT Development, Design"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                disabled={isViewMode}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                disabled={isViewMode}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
              <Target className="w-4 h-4 text-blue-600" />
              Completion Level *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {(['not_started', 'started', 'in_progress', 'nearly_complete', 'complete'] as CompletionLevel[]).map((level) => (
                <label
                  key={level}
                  className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all group ${
                    formData.completionLevel === level
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 hover:shadow-md'
                  } ${isViewMode ? 'cursor-not-allowed opacity-75' : ''}`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="radio"
                      name="completionLevel"
                      value={level}
                      checked={formData.completionLevel === level}
                      onChange={handleChange}
                      disabled={isViewMode}
                      className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                    />
                    <div className="flex-1">
                      <CompletionLevelBadge level={level} showIcon={true} />
                    </div>
                  </div>
                  {formData.completionLevel === level && (
                    <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1.5 shadow-lg">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {mode === 'create' ? 'Create Task' : 'Save Changes'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

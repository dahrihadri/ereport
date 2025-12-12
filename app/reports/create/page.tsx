'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/main/Navbar';
import { Report } from '@/types';
import { getUserById, mockProjects, mockDivisions } from '@/lib/mock-data';
import { ArrowLeft, FileText, Save, Send } from 'lucide-react';
import Link from 'next/link';

export default function CreateReportPage() {
  const router = useRouter();
  const currentUser = getUserById('user-1');

  const [formData, setFormData] = useState<Partial<Report>>({
    title: '',
    summary: '',
    objectives: '',
    keyIssues: '',
    statusUpdate: '',
    risks: '',
    recommendations: '',
    priority: 'medium',
    category: 'operational',
    projectId: '',
    divisionId: '',
    createdByUserId: currentUser?.id || 'user-1',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (action: 'draft' | 'submit') => {
    console.log('Saving report:', { ...formData, action });
    // TODO: Implement API call to save report

    // Show success message
    alert(`Report ${action === 'draft' ? 'saved as draft' : 'submitted'} successfully!`);

    // Redirect to reports page
    router.push('/reports');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        user={{
          name: currentUser?.name || 'Ahmad Faizal',
          email: currentUser?.email || 'ahmad.faizal@mcmc.gov.my',
          role: 'DMDD',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">Create New Report</h1>
                <p className="text-sm opacity-90">
                  Fill in the details below to create a new top management report
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6"
        >
          {/* Basic Information Section */}
          <div className="bg-gradient-to-r from-blue-50 to-transparent rounded-xl p-4 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Basic Information
            </h3>

            {/* Project Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project *
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Select a project...</option>
                {mockProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.code} - {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Division Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Division *
              </label>
              <select
                name="divisionId"
                value={formData.divisionId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Select a division...</option>
                {mockDivisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.code} - {division.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Report Title */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
                placeholder="Enter a clear and concise report title..."
              />
            </div>

            {/* Priority and Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="operational">Operational</option>
                  <option value="strategic">Strategic</option>
                  <option value="compliance">Compliance</option>
                  <option value="financial">Financial</option>
                  <option value="technical">Technical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Executive Summary *
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder:text-gray-400"
              placeholder="Provide a concise summary of the report for top management..."
            />
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Objectives
            </label>
            <textarea
              name="objectives"
              value={formData.objectives || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder:text-gray-400"
              placeholder="List the main objectives and goals..."
            />
          </div>

          {/* Status Update */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status Update
            </label>
            <textarea
              name="statusUpdate"
              value={formData.statusUpdate || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder:text-gray-400"
              placeholder="Provide current status and progress updates..."
            />
          </div>

          {/* Key Issues */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Key Issues
            </label>
            <textarea
              name="keyIssues"
              value={formData.keyIssues || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder:text-gray-400"
              placeholder="Describe any challenges, blockers, or issues encountered..."
            />
          </div>

          {/* Risks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Risks
            </label>
            <textarea
              name="risks"
              value={formData.risks || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder:text-gray-400"
              placeholder="Identify potential risks and their impact..."
            />
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recommendations
            </label>
            <textarea
              name="recommendations"
              value={formData.recommendations || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder:text-gray-400"
              placeholder="Provide recommendations and proposed solutions..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <Link
              href="/reports"
              className="w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all font-medium text-center"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('submit')}
              className="w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Report
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

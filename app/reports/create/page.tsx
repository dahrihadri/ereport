'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/main/Navbar';
import { Report, Attachment } from '@/types';
import { getUserById, mockProjects, mockDivisions } from '@/lib/mock-data';
import {
  ArrowLeft,
  FileText,
  Save,
  Send,
  Upload,
  X,
  File,
  Image as ImageIcon,
  Paperclip,
} from 'lucide-react';
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

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadingFiles(prev => [...prev, ...newFiles]);

      // Simulate file upload
      setTimeout(() => {
        const newAttachments: Attachment[] = newFiles.map((file, index) => ({
          id: `att-${Date.now()}-${index}`,
          reportId: 'temp-report-id',
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          filePath: `/uploads/${file.name}`,
          uploadedByUserId: currentUser?.id || 'user-1',
          uploadedAt: new Date(),
        }));

        setAttachments(prev => [...prev, ...newAttachments]);
        setUploadingFiles([]);
      }, 1500);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return ImageIcon;
    return File;
  };

  const handleSave = (action: 'draft' | 'submit') => {
    console.log('Saving report:', { ...formData, action, attachments });
    // TODO: Implement API call to save report with attachments

    // Show success message
    alert(`Report ${action === 'draft' ? 'saved as draft' : 'submitted'} successfully!${attachments.length > 0 ? `\n${attachments.length} file(s) attached.` : ''}`);

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
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

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

          {/* Attachments Section */}
          <div className="bg-gradient-to-r from-purple-50 to-transparent rounded-xl p-4 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-purple-600" />
              Attachments (Optional)
            </h3>

            {/* Upload Area */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-xl p-6 text-center mb-4">
              <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-gray-800 mb-2">Upload Files</h4>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer font-medium">
                <Upload className="w-4 h-4" />
                <span>Choose Files</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
              </label>
              <p className="text-xs text-gray-500 mt-3">
                Supported: Images, PDF, Word, Excel, PowerPoint (Max 10MB each)
              </p>
            </div>

            {/* Uploading Files */}
            {uploadingFiles.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-semibold text-gray-700">Uploading...</h4>
                {uploadingFiles.map((file, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
                    <Upload className="w-5 h-5 text-blue-600 animate-pulse" />
                    <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                    <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Attached Files ({attachments.length})
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {attachments.map((attachment) => {
                    const FileIcon = getFileIcon(attachment.fileType);
                    return (
                      <div
                        key={attachment.id}
                        className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileIcon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {attachment.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(attachment.id)}
                            className="p-1.5 hover:bg-red-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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

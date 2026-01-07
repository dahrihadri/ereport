'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/main/Navbar';
import ReportTimeline from '@/components/reports/ReportTimeline';
import VersionHistory from '@/components/reports/VersionHistory';
import ActivityFeed from '@/components/reports/ActivityFeed';
import { Report, ReportStatusHistory, ReportVersion, Comment, Attachment } from '@/types';
import { getUserById, mockProjects, mockDivisions, mockReportsWithRelations } from '@/lib/mock-data';
import {
  ArrowLeft,
  FileText,
  Save,
  Send,
  Edit,
  AlertCircle,
  Clock,
  History,
  Activity,
  Upload,
  X,
  File,
  Image as ImageIcon,
  Paperclip,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type TabType = 'edit' | 'timeline' | 'versions' | 'activity' | 'attachments';

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const currentUser = getUserById('user-1');

  const [activeTab, setActiveTab] = useState<TabType>('edit');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  // Load existing report data
  const existingReport = useMemo(() => {
    return mockReportsWithRelations.find(r => r.id === reportId) || null;
  }, [reportId]);

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
  });

  const [changeDescription, setChangeDescription] = useState('');

  // Populate form when report data is loaded
  useEffect(() => {
    if (existingReport) {
      setFormData({
        title: existingReport.title,
        summary: existingReport.summary,
        objectives: existingReport.objectives,
        keyIssues: existingReport.keyIssues,
        statusUpdate: existingReport.statusUpdate,
        risks: existingReport.risks,
        recommendations: existingReport.recommendations,
        priority: existingReport.priority,
        category: existingReport.category,
        projectId: existingReport.projectId,
        divisionId: existingReport.divisionId,
      });

      // Load existing attachments
      if (existingReport.attachments) {
        setAttachments(existingReport.attachments);
      }
    }
  }, [existingReport]);

  // Mock data for timeline, versions, and activity
  const mockStatusHistory: ReportStatusHistory[] = existingReport ? [
    {
      id: 'sh-1',
      reportId: existingReport.id,
      fromStatus: 'draft',
      toStatus: 'submitted_to_sector',
      actionByUserId: 'user-1',
      actionAt: new Date('2025-01-05T09:00:00'),
      comment: 'Initial submission for review',
    },
    {
      id: 'sh-2',
      reportId: existingReport.id,
      fromStatus: 'submitted_to_sector',
      toStatus: 'under_review_sector',
      actionByUserId: 'user-3',
      actionAt: new Date('2025-01-06T10:30:00'),
      comment: 'Started reviewing the report',
    },
  ] : [];

  const mockVersions: ReportVersion[] = existingReport ? [
    {
      id: 'v-1',
      reportId: existingReport.id,
      versionNumber: 1,
      content: {
        title: existingReport.title,
        summary: 'Initial draft version',
        objectives: existingReport.objectives,
      },
      createdByUserId: 'user-1',
      createdAt: new Date('2025-01-01T10:00:00'),
      changeDescription: 'Initial version created',
    },
    {
      id: 'v-2',
      reportId: existingReport.id,
      versionNumber: 2,
      content: {
        title: existingReport.title,
        summary: existingReport.summary,
        objectives: existingReport.objectives,
      },
      createdByUserId: 'user-1',
      createdAt: new Date('2025-01-08T11:00:00'),
      changeDescription: 'Updated risk assessment section per feedback',
    },
  ] : [];

  const mockComments: Comment[] = existingReport ? [
    {
      id: 'c-1',
      reportId: existingReport.id,
      userId: 'user-3',
      commentText: 'Please provide more details on the risk assessment section.',
      type: 'review',
      createdAt: new Date('2025-01-07T14:15:00'),
      updatedAt: new Date('2025-01-07T14:15:00'),
    },
  ] : [];

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
          reportId: reportId,
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

  const handleSave = (action: 'save' | 'submit') => {
    if (!changeDescription.trim()) {
      toast.error('Missing Description', {
        description: 'Please provide a description of your changes',
      });
      return;
    }

    // Create new version
    const newVersion: ReportVersion = {
      id: `v-${Date.now()}`,
      reportId: reportId,
      versionNumber: (existingReport?.currentVersion || 0) + 1,
      content: {
        ...formData,
      },
      createdByUserId: currentUser?.id || 'user-1',
      createdAt: new Date(),
      changeDescription: changeDescription,
    };

    console.log('Updating report:', {
      reportId,
      formData,
      action,
      newVersion,
      attachments,
    });

    // TODO: Implement API call to update report, create version, and log activity

    // Show success message
    toast.success(
      action === 'save' ? 'Report Updated!' : 'Report Updated and Submitted!',
      {
        description: `New version ${newVersion.versionNumber} created.`,
        duration: 3000,
      }
    );

    // Redirect to report detail page after a brief delay to show the toast
    setTimeout(() => {
      router.push(`/reports/${reportId}`);
    }, 500);
  };

  if (!existingReport) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          user={{
            name: currentUser?.name || 'User',
            email: currentUser?.email || 'user@mcmc.gov.my',
            role: 'DMDD',
          }}
        />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Report Not Found</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">The report you&apos;re trying to edit doesn&apos;t exist.</p>
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Back to Reports</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'edit' as TabType, label: 'Edit Report', icon: Edit },
    { id: 'timeline' as TabType, label: 'Timeline', icon: Clock },
    { id: 'versions' as TabType, label: 'Versions', icon: History },
    { id: 'activity' as TabType, label: 'Activity', icon: Activity },
    { id: 'attachments' as TabType, label: 'Attachments', icon: Paperclip },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        user={{
          name: currentUser?.name || 'Ahmad Faizal',
          email: currentUser?.email || 'ahmad.faizal@mcmc.gov.my',
          role: 'DMDD',
        }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-blue-600 mb-3 sm:mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Back</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 break-words">Edit Report</h1>
              <p className="text-xs sm:text-sm opacity-90 break-words">
                {existingReport.title}
              </p>
            </div>
          </div>

          {/* Save Buttons - Always Visible */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/20">
            <button
              onClick={() => handleSave('save')}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={() => handleSave('submit')}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Save & Submit</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 mb-4 sm:mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 overflow-hidden">
            <nav className="flex overflow-x-auto scrollbar-hide -mb-px" role="tablist">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={tab.label}
                    className={`group relative flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[70px] sm:min-w-0 ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 transform-gpu ${
                        isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-75'
                      }`}
                    />
                    <span
                      className={`absolute inset-0 bg-gradient-to-b transition-all duration-300 transform-gpu ${
                        isActive
                          ? 'from-blue-50/80 to-white opacity-100'
                          : 'from-transparent to-transparent opacity-0 group-hover:from-blue-50/30 group-hover:to-white/50 group-hover:opacity-100'
                      }`}
                    />
                    <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                        isActive ? 'drop-shadow-sm' : ''
                      }`} />
                    </span>
                    <span className={`relative z-10 hidden sm:inline transition-all duration-300 ${
                      isActive ? 'font-bold' : 'font-semibold'
                    }`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3 sm:p-4 md:p-6">
            {/* Edit Tab */}
            {activeTab === 'edit' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Change Description */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <History className="w-4 h-4 text-yellow-600" />
                    Change Description *
                  </label>
                  <input
                    type="text"
                    value={changeDescription}
                    onChange={(e) => setChangeDescription(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all placeholder:text-gray-400"
                    placeholder="Briefly describe what changes you made in this version..."
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    This will be saved in the version history for tracking changes
                  </p>
                </div>

                {/* Basic Information Section */}
                <div className="bg-gradient-to-r from-blue-50 to-transparent rounded-xl p-4 border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h3>

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
              </motion.div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ReportTimeline statusHistory={mockStatusHistory} />
              </motion.div>
            )}

            {/* Versions Tab */}
            {activeTab === 'versions' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <VersionHistory versions={mockVersions} />
              </motion.div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ActivityFeed
                  statusHistory={mockStatusHistory}
                  comments={mockComments}
                  versions={mockVersions}
                />
              </motion.div>
            )}

            {/* Attachments Tab */}
            {activeTab === 'attachments' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Upload Area */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-xl p-6 sm:p-8 text-center">
                  <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Attachments</h3>
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
                  <div className="space-y-2">
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
                {attachments.length > 0 ? (
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
                            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileIcon className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                  {attachment.fileName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(attachment.fileSize)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
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
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm">No attachments yet</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

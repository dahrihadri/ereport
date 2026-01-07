'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/main/Navbar';
import ReportStatusBadge from '@/components/ui/ReportStatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import ReportTimeline from '@/components/reports/ReportTimeline';
import VersionHistory from '@/components/reports/VersionHistory';
import ActivityFeed from '@/components/reports/ActivityFeed';
import CommentThread from '@/components/reports/CommentThread';
import { ReportWithRelations, ReportStatusHistory, ReportVersion, Comment, CommentType } from '@/types';
import { mockReportsWithRelations, getUserById } from '@/lib/mock-data';
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Building2,
  Flag,
  Edit,
  Send,
  MessageSquare,
  Clock,
  History,
  Activity,
  Paperclip,
  Upload,
  Download,
  File,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'details' | 'timeline' | 'versions' | 'activity' | 'attachments';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabType>('details');

  const currentUser = getUserById('user-1');

  // Load report data using useMemo to avoid setState in effect
  const report = useMemo(() => {
    return mockReportsWithRelations.find(r => r.id === reportId) || null;
  }, [reportId]);

  // Initialize mock comments with threaded structure using useMemo
  const initialComments = useMemo<Comment[]>(() => {
    if (!report) return [];

    return [
      {
        id: 'c-1',
        reportId: report.id,
        userId: 'user-3',
        commentText: 'Please provide more details on the risk assessment section.',
        type: 'review',
        createdAt: new Date('2025-01-07T14:15:00'),
        updatedAt: new Date('2025-01-07T14:15:00'),
      },
      {
        id: 'c-2',
        reportId: report.id,
        userId: 'user-1',
        commentText: 'Updated the risk assessment with detailed analysis.',
        type: 'general',
        parentCommentId: 'c-1', // Reply to c-1
        createdAt: new Date('2025-01-08T11:00:00'),
        updatedAt: new Date('2025-01-08T11:00:00'),
      },
      {
        id: 'c-3',
        reportId: report.id,
        userId: 'user-3',
        commentText: 'Looks good now, approved for the next stage.',
        type: 'approval',
        parentCommentId: 'c-1', // Another reply to c-1
        createdAt: new Date('2025-01-09T09:00:00'),
        updatedAt: new Date('2025-01-09T09:00:00'),
      },
      {
        id: 'c-4',
        reportId: report.id,
        userId: 'user-4',
        commentText: 'Great work on the implementation. The timeline looks realistic.',
        type: 'general',
        createdAt: new Date('2025-01-10T16:00:00'),
        updatedAt: new Date('2025-01-10T16:00:00'),
      },
    ];
  }, [report]);

  const [comments, setComments] = useState<Comment[]>(initialComments);

  // Update comments when report changes (when navigating to a different report)
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Mock data for timeline, versions, and activity
  const mockStatusHistory: ReportStatusHistory[] = report ? [
    {
      id: 'sh-1',
      reportId: report.id,
      fromStatus: 'draft',
      toStatus: 'submitted_to_sector',
      actionByUserId: 'user-1',
      actionAt: new Date('2025-01-05T09:00:00'),
      comment: 'Initial submission for review',
    },
    {
      id: 'sh-2',
      reportId: report.id,
      fromStatus: 'submitted_to_sector',
      toStatus: 'under_review_sector',
      actionByUserId: 'user-3',
      actionAt: new Date('2025-01-06T10:30:00'),
      comment: 'Started reviewing the report',
    },
    {
      id: 'sh-3',
      reportId: report.id,
      fromStatus: 'under_review_sector',
      toStatus: 'returned_for_revision_sector',
      actionByUserId: 'user-3',
      actionAt: new Date('2025-01-07T14:15:00'),
      comment: 'Please provide more details on risk assessment',
    },
    {
      id: 'sh-4',
      reportId: report.id,
      fromStatus: 'returned_for_revision_sector',
      toStatus: 'submitted_to_sector',
      actionByUserId: 'user-1',
      actionAt: new Date('2025-01-08T11:00:00'),
      comment: 'Updated risk assessment section',
    },
  ] : [];

  const mockVersions: ReportVersion[] = report ? [
    {
      id: 'v-1',
      reportId: report.id,
      versionNumber: 1,
      content: {
        title: report.title,
        summary: 'Initial draft version',
        objectives: report.objectives,
      },
      createdByUserId: 'user-1',
      createdAt: new Date('2025-01-01T10:00:00'),
      changeDescription: 'Initial version created',
    },
    {
      id: 'v-2',
      reportId: report.id,
      versionNumber: 2,
      content: {
        title: report.title,
        summary: report.summary,
        objectives: report.objectives,
        risks: 'Added comprehensive risk analysis',
      },
      createdByUserId: 'user-1',
      createdAt: new Date('2025-01-08T11:00:00'),
      changeDescription: 'Updated risk assessment section per feedback',
    },
    {
      id: 'v-3',
      reportId: report.id,
      versionNumber: 3,
      content: {
        title: report.title,
        summary: report.summary,
        objectives: report.objectives,
        risks: report.risks,
      },
      createdByUserId: 'user-1',
      createdAt: new Date('2025-01-10T15:30:00'),
      changeDescription: 'Final review and corrections',
    },
  ] : [];

  // Comment handlers
  const handleAddComment = (text: string, type: CommentType, parentId?: string) => {
    if (!report) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      reportId: report.id,
      userId: currentUser?.id || 'user-1',
      commentText: text,
      type,
      parentCommentId: parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setComments(prev => [...prev, newComment]);
    console.log('Comment added:', newComment);
    // TODO: Implement API call to add comment
  };

  const handleEditComment = (commentId: string, text: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, commentText: text, updatedAt: new Date() }
          : comment
      )
    );
    console.log('Comment edited:', commentId, text);
    // TODO: Implement API call to edit comment
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    console.log('Comment deleted:', commentId);
    // TODO: Implement API call to delete comment
  };

  const handleStatusAction = (action: string) => {
    console.log('Status action:', action);
    // TODO: Implement status change logic
  };

  if (!report) {
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
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Report Not Found</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">The report you&apos;re looking for doesn&apos;t exist.</p>
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
    { id: 'details' as TabType, label: 'Details', icon: FileText },
    { id: 'timeline' as TabType, label: 'Timeline', icon: Clock },
    { id: 'versions' as TabType, label: 'Versions', icon: History },
    { id: 'activity' as TabType, label: 'Activity', icon: Activity },
    { id: 'attachments' as TabType, label: 'Attachments', icon: Paperclip },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        user={{
          name: currentUser?.name || 'User',
          email: currentUser?.email || 'user@mcmc.gov.my',
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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 break-words">{report.title}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm opacity-90">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-semibold truncate">{report.project.code}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate max-w-[150px] sm:max-w-none">{report.division.name}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{report.createdBy.name}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <ReportStatusBadge status={report.currentStatus} />
              <PriorityBadge priority={report.priority} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
            <button
              onClick={() => router.push(`/reports/${report.id}/edit`)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
            >
              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Edit Report</span>
            </button>
            <button
              onClick={() => handleStatusAction('submit')}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Submit for Review</span>
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
                    {/* Active indicator bar */}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 transform-gpu ${
                        isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-75'
                      }`}
                    />

                    {/* Background highlight */}
                    <span
                      className={`absolute inset-0 bg-gradient-to-b transition-all duration-300 transform-gpu ${
                        isActive
                          ? 'from-blue-50/80 to-white opacity-100'
                          : 'from-transparent to-transparent opacity-0 group-hover:from-blue-50/30 group-hover:to-white/50 group-hover:opacity-100'
                      }`}
                    />

                    {/* Icon with animation */}
                    <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                        isActive ? 'drop-shadow-sm' : ''
                      }`} />
                    </span>

                    {/* Label */}
                    <span className={`relative z-10 hidden sm:inline transition-all duration-300 ${
                      isActive ? 'font-bold' : 'font-semibold'
                    }`}>
                      {tab.label}
                    </span>

                    {/* Mobile tooltip on hover - shows label */}
                    <span className="sm:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap" style={{ zIndex: 9999 }}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3 sm:p-4 md:p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                    <span>Executive Summary</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    {report.summary}
                  </p>
                </div>

                {report.objectives && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                      <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <span>Objectives</span>
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 whitespace-pre-wrap">
                      {report.objectives}
                    </p>
                  </div>
                )}

                {report.statusUpdate && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Status Update</h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 whitespace-pre-wrap">
                      {report.statusUpdate}
                    </p>
                  </div>
                )}

                {report.keyIssues && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Key Issues</h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-red-50 border-l-4 border-red-500 rounded-r-lg sm:rounded-r-xl p-3 sm:p-4 whitespace-pre-wrap">
                      {report.keyIssues}
                    </p>
                  </div>
                )}

                {report.risks && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Risks</h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg sm:rounded-r-xl p-3 sm:p-4 whitespace-pre-wrap">
                      {report.risks}
                    </p>
                  </div>
                )}

                {report.recommendations && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Recommendations</h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-green-50 border-l-4 border-green-500 rounded-r-lg sm:rounded-r-xl p-3 sm:p-4 whitespace-pre-wrap">
                      {report.recommendations}
                    </p>
                  </div>
                )}

                {/* Comments Section */}
                <div className="pt-6 border-t border-gray-200">
                  <CommentThread
                    comments={comments}
                    currentUserId={currentUser?.id || 'user-1'}
                    currentUserRole={currentUser?.role || 'HEAD_OF_DIVISION'}
                    onAddComment={handleAddComment}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    showAddForm
                    maxDepth={3}
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
                  comments={comments}
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
                {/* Attachments Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-800">
                        Report Attachments ({report.attachments?.length || 0})
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Attachments List */}
                {report.attachments && report.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {report.attachments.map((attachment) => {
                      const getFileIcon = (fileType: string) => {
                        if (fileType.startsWith('image/')) return ImageIcon;
                        if (fileType.includes('pdf')) return FileText;
                        return File;
                      };

                      const formatFileSize = (bytes: number): string => {
                        if (bytes < 1024) return bytes + ' B';
                        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
                        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
                      };

                      const FileIcon = getFileIcon(attachment.fileType);
                      const uploadedBy = getUserById(attachment.uploadedByUserId);

                      return (
                        <div
                          key={attachment.id}
                          className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all group"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate mb-1">
                                {attachment.fileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(attachment.fileSize)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              <span>{uploadedBy?.name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              // TODO: Implement download
                              console.log('Download:', attachment.fileName);
                            }}
                            className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Paperclip className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm mb-2">No attachments found</p>
                    <p className="text-gray-400 text-xs">
                      Attachments can be added when editing the report
                    </p>
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

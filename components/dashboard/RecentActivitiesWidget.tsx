'use client';

import { useRouter } from 'next/navigation';
import { ReportWithRelations, Comment } from '@/types';
import { Activity, FileText, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'status_change' | 'comment' | 'created';
  reportId: string;
  reportTitle: string;
  userName: string;
  timestamp: Date;
  description: string;
  icon: typeof Activity;
  color: string;
}

interface RecentActivitiesWidgetProps {
  reports: ReportWithRelations[];
  comments?: Comment[];
  limit?: number;
}

export default function RecentActivitiesWidget({ reports, comments = [], limit = 10 }: RecentActivitiesWidgetProps) {
  const router = useRouter();

  // Combine reports and comments into activity items
  const getActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Add report status changes
    reports.forEach(report => {
      activities.push({
        id: `report-${report.id}`,
        type: 'status_change',
        reportId: report.id,
        reportTitle: report.title,
        userName: report.createdBy.name,
        timestamp: report.updatedAt,
        description: `Status: ${getStatusLabel(report.currentStatus)}`,
        icon: getStatusIcon(report.currentStatus),
        color: getStatusColor(report.currentStatus),
      });
    });

    // Add comments
    comments.forEach(comment => {
      const report = reports.find(r => r.id === comment.reportId);
      if (report) {
        activities.push({
          id: `comment-${comment.id}`,
          type: 'comment',
          reportId: comment.reportId,
          reportTitle: report.title,
          userName: 'User', // You'd get this from getUserById in real app
          timestamp: comment.createdAt,
          description: comment.commentText.substring(0, 100) + (comment.commentText.length > 100 ? '...' : ''),
          icon: MessageSquare,
          color: 'text-purple-600 bg-purple-100',
        });
      }
    });

    // Sort by timestamp (newest first)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      draft: 'Draft',
      submitted_to_sector: 'Submitted to Sector',
      under_review_sector: 'Under Review (Sector)',
      returned_for_revision_sector: 'Returned (Sector)',
      approved_by_sector: 'Approved by Sector',
      under_review_dmd: 'Under Review (DMD)',
      returned_for_revision_dmd: 'Returned (DMD)',
      final_approved: 'Final Approved',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('approved')) return CheckCircle;
    if (status.includes('returned')) return XCircle;
    if (status.includes('review')) return Clock;
    return FileText;
  };

  const getStatusColor = (status: string): string => {
    if (status.includes('approved')) return 'text-green-600 bg-green-100';
    if (status.includes('returned')) return 'text-red-600 bg-red-100';
    if (status.includes('review')) return 'text-yellow-600 bg-yellow-100';
    if (status === 'submitted_to_sector') return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const activities = getActivities();

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
            <p className="text-sm text-gray-500">Latest updates</p>
          </div>
        </div>
        <div className="text-center py-8">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No recent activities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
            <p className="text-sm text-gray-500">Latest updates across all reports</p>
          </div>
        </div>
        <div className="bg-blue-100 px-3 py-1.5 rounded-full">
          <span className="text-blue-700 font-bold text-sm">{activities.length}</span>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isLast = index === activities.length - 1;

          return (
            <div key={activity.id} className="relative">
              {/* Vertical Line */}
              {!isLast && (
                <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-200" />
              )}

              {/* Activity Item */}
              <div
                onClick={() => router.push(`/reports/${activity.reportId}`)}
                className="flex gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all group"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${activity.color} flex items-center justify-center relative z-10`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {activity.userName}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-900 font-medium mt-1 line-clamp-1">
                        {activity.reportTitle}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      {activities.length >= limit && (
        <button
          onClick={() => router.push('/reports')}
          className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          View All Activities
        </button>
      )}
    </div>
  );
}

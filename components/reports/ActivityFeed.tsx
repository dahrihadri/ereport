'use client';

import { useState } from 'react';
import { ReportStatusHistory, Comment, ReportVersion } from '@/types';
import { getUserById } from '@/lib/mock-data';
import {
  Activity,
  MessageSquare,
  GitBranch,
  ArrowRight,
  User,
  Clock,
  Filter,
} from 'lucide-react';

interface ActivityFeedProps {
  statusHistory: ReportStatusHistory[];
  comments: Comment[];
  versions: ReportVersion[];
}

type ActivityType = 'status_change' | 'comment' | 'version';
type FilterType = 'all' | ActivityType;

interface ActivityItem {
  id: string;
  type: ActivityType;
  timestamp: Date;
  userId: string;
  data: ReportStatusHistory | Comment | ReportVersion;
}

export default function ActivityFeed({
  statusHistory,
  comments,
  versions,
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  // Combine all activities into a single feed
  const allActivities: ActivityItem[] = [
    ...statusHistory.map(item => ({
      id: item.id,
      type: 'status_change' as ActivityType,
      timestamp: new Date(item.actionAt),
      userId: item.actionByUserId,
      data: item,
    })),
    ...comments.map(item => ({
      id: item.id,
      type: 'comment' as ActivityType,
      timestamp: new Date(item.createdAt),
      userId: item.userId,
      data: item,
    })),
    ...versions.map(item => ({
      id: item.id,
      type: 'version' as ActivityType,
      timestamp: new Date(item.createdAt),
      userId: item.createdByUserId,
      data: item,
    })),
  ];

  // Filter and sort activities
  const filteredActivities = allActivities
    .filter(activity => filter === 'all' || activity.type === filter)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'status_change':
        return { icon: ArrowRight, color: 'bg-blue-500' };
      case 'comment':
        return { icon: MessageSquare, color: 'bg-green-500' };
      case 'version':
        return { icon: GitBranch, color: 'bg-purple-500' };
    }
  };

  const renderActivityContent = (activity: ActivityItem) => {
    const user = getUserById(activity.userId);

    switch (activity.type) {
      case 'status_change': {
        const data = activity.data as ReportStatusHistory;
        return (
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-semibold text-gray-800">
                Status changed by {user?.name || 'Unknown'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm mb-2 bg-gray-50 rounded-lg p-2">
              <span className="px-2 py-1 bg-white rounded text-gray-700 font-medium text-xs">
                {data.fromStatus.replace(/_/g, ' ')}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium text-xs">
                {data.toStatus.replace(/_/g, ' ')}
              </span>
            </div>
            {data.comment && (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2 mt-2">
                {data.comment}
              </p>
            )}
          </div>
        );
      }

      case 'comment': {
        const data = activity.data as Comment;
        return (
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || 'Unknown'} added a comment
              </p>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                {data.type}
              </span>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
              {data.commentText}
            </p>
          </div>
        );
      }

      case 'version': {
        const data = activity.data as ReportVersion;
        return (
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              {user?.name || 'Unknown'} created Version {data.versionNumber}
            </p>
            {data.changeDescription && (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                {data.changeDescription}
              </p>
            )}
          </div>
        );
      }
    }
  };

  if (allActivities.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">No activity history available</p>
      </div>
    );
  }

  const filterOptions: { value: FilterType; label: string; count: number }[] = [
    {
      value: 'all',
      label: 'All Activity',
      count: allActivities.length,
    },
    {
      value: 'status_change',
      label: 'Status Changes',
      count: statusHistory.length,
    },
    {
      value: 'comment',
      label: 'Comments',
      count: comments.length,
    },
    {
      value: 'version',
      label: 'Versions',
      count: versions.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-700">Filter Activity</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === option.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              {option.label}
              <span className="ml-2 opacity-75">({option.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 hidden sm:block" />

        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-sm">No activities found for this filter</p>
            </div>
          ) : (
            filteredActivities.map((activity, index) => {
              const activityConfig = getActivityIcon(activity.type);
              const ActivityIcon = activityConfig.icon;
              const user = getUserById(activity.userId);

              return (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Timeline node */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                        activityConfig.color
                      } ${index === 0 ? 'ring-4 ring-blue-200' : ''}`}
                    >
                      <ActivityIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-4 hover:shadow-lg transition-all">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            <span className="font-medium">{user?.name || 'Unknown'}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{activity.timestamp.toLocaleString()}</span>
                          </div>
                        </div>
                        {index === 0 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            Latest
                          </span>
                        )}
                      </div>

                      {/* Activity Content */}
                      {renderActivityContent(activity)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600 font-medium">Status Changes</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{statusHistory.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600 font-medium">Comments</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{comments.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600 font-medium">Versions</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">{versions.length}</p>
        </div>
      </div>
    </div>
  );
}

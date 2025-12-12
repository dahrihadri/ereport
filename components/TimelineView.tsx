'use client';

import { Task } from '@/types';
import StatusBadge from './StatusBadge';
import PriorityBadge from './ui/PriorityBadge';
import CompletionLevelBadge from './ui/CompletionLevelBadge';
import { Calendar, User, Building2 } from 'lucide-react';

interface TimelineViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function TimelineView({ tasks, onTaskClick }: TimelineViewProps) {
  const sortedTasks = [...tasks].sort((a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateShort = (date: Date) => {
    return new Date(date).toLocaleDateString('en-MY', {
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <div className="relative">
      <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 hidden sm:block" />

      <div className="space-y-4 sm:space-y-6">
        {sortedTasks.map((task, index) => (
          <div key={task.id} className="relative flex gap-3 sm:gap-4">
            <div className="relative flex-shrink-0">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full sm:rounded-2xl flex flex-col items-center justify-center z-10 shadow-lg transition-all duration-300 ${
                task.status === 'completed' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                task.status === 'in_progress' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                task.status === 'on_hold' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                task.status === 'cancelled' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                'bg-gradient-to-br from-gray-300 to-gray-400'
              }`}>
                <span className="text-white font-bold text-sm sm:text-base">
                  {new Date(task.startDate).getDate()}
                </span>
                <span className="text-white text-[10px] sm:text-xs opacity-90 hidden sm:block">
                  {new Date(task.startDate).toLocaleDateString('en-MY', { month: 'short' })}
                </span>
              </div>
            </div>

            <div
              onClick={() => onTaskClick(task)}
              className="flex-1 bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-3 sm:p-5 border-2 border-gray-100 hover:border-blue-300 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {task.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                    {task.description}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate">
                    <span className="font-medium hidden sm:inline">Assigned to: </span>
                    {task.assignedTo}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate">
                    <span className="hidden sm:inline">{formatDate(task.startDate)}</span>
                    <span className="sm:hidden">{formatDateShort(task.startDate)}</span>
                    <span className="mx-1">-</span>
                    <span className="hidden sm:inline">{formatDate(task.endDate)}</span>
                    <span className="sm:hidden">{formatDateShort(task.endDate)}</span>
                  </span>
                </div>
              </div>

              {task.department && (
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-50 to-blue-100 px-2 sm:px-3 py-1 rounded-lg text-xs font-medium text-blue-700 border border-blue-200">
                    {task.department}
                  </span>
                </div>
              )}

              <div className="mt-3 sm:mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">Completion:</span>
                  <CompletionLevelBadge level={task.completionLevel} showIcon={true} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {sortedTasks.length === 0 && (
          <div className="text-center py-12 sm:py-16 text-gray-500">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <p className="text-base sm:text-lg font-semibold mb-1">No tasks found</p>
            <p className="text-sm text-gray-400">Create a new task to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

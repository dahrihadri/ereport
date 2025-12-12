'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BarChart3 } from 'lucide-react';
import { Task } from '@/types';
import CompletionLevelBadge from './CompletionLevelBadge';
import * as React from 'react';

interface CalendarWidgetProps {
  tasks: Task[];
  onDateClick?: (date: Date) => void;
  selectedTask?: Task | null;
}

export default function CalendarWidget({ tasks, onDateClick, selectedTask }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Auto-navigate to selected task's month
  const goToTaskMonth = (task: Task) => {
    const taskDate = new Date(task.startDate);
    setCurrentDate(new Date(taskDate.getFullYear(), taskDate.getMonth(), 1));
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      const checkDate = new Date(date);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);

      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const getTasksForMonth = () => {
    return tasks.filter(task => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      return (
        (startDate >= monthStart && startDate <= monthEnd) ||
        (endDate >= monthStart && endDate <= monthEnd) ||
        (startDate <= monthStart && endDate >= monthEnd)
      );
    });
  };

  const calculateTaskBarPosition = (task: Task) => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const totalDays = daysInMonth(currentDate);

    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);

    taskStart.setHours(0, 0, 0, 0);
    taskEnd.setHours(0, 0, 0, 0);
    monthStart.setHours(0, 0, 0, 0);
    monthEnd.setHours(0, 0, 0, 0);

    const startDay = taskStart < monthStart ? 1 : taskStart.getDate();
    const endDay = taskEnd > monthEnd ? totalDays : taskEnd.getDate();

    const leftPosition = ((startDay - 1) / totalDays) * 100;
    const width = ((endDay - startDay + 1) / totalDays) * 100;

    return { left: `${leftPosition}%`, width: `${width}%` };
  };

  const getColorByPriority = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-blue-500';
      case 'low':
        return 'bg-gray-400';
      default:
        return 'bg-blue-500';
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate total weeks needed
    const totalCells = firstDay + totalDays;
    const totalWeeks = Math.ceil(totalCells / 7);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="border border-gray-100 bg-gray-50/30" />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      const tasksOnDate = getTasksForDate(date);
      const isToday = date.getTime() === today.getTime();
      const hasSelectedTask = selectedTask && tasksOnDate.some(t => t.id === selectedTask.id);

      days.push(
        <div
          key={day}
          className={`border border-gray-200 bg-white hover:bg-gray-50 transition-all relative group ${
            isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
          } ${hasSelectedTask ? 'ring-2 ring-blue-400 ring-inset bg-blue-50/50' : ''}`}
        >
          {/* Date number */}
          <div className="flex items-start justify-between p-1 sm:p-2">
            <span className={`text-xs sm:text-sm font-semibold ${
              isToday
                ? 'bg-blue-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center'
                : hasSelectedTask
                ? 'text-blue-700'
                : 'text-gray-700'
            }`}>
              {day}
            </span>
            {tasksOnDate.length > 0 && (
              <span className="text-[9px] sm:text-[10px] bg-blue-100 text-blue-700 px-1 sm:px-1.5 py-0.5 rounded-full font-semibold">
                {tasksOnDate.length}
              </span>
            )}
          </div>

          {/* Task list with tooltips */}
          <div className="px-1 pb-1 space-y-0.5">
            {tasksOnDate.slice(0, 3).map(task => (
              <button
                key={task.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onDateClick?.(new Date(task.startDate));
                }}
                className={`w-full text-left px-1.5 py-1 rounded-md text-[9px] sm:text-[10px] truncate transition-all shadow-sm hover:shadow-md ${
                  getColorByPriority(task.priority)
                } text-white font-medium relative group/task`}
                title={task.title}
              >
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-white opacity-80 flex-shrink-0"></div>
                  <span className="truncate">{task.title}</span>
                </div>

                {/* Enhanced Tooltip */}
                <div className="hidden group-hover/task:block absolute left-0 top-full mt-1 z-50 w-56 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-2xl border border-gray-700">
                  <div className="font-bold mb-2 text-sm">{task.title}</div>
                  <div className="space-y-1.5 text-gray-300 text-[10px]">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{task.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="capitalize">{task.priority} priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="capitalize">{task.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400 text-[9px] italic">
                    Click to view full details
                  </div>
                </div>
              </button>
            ))}
            {tasksOnDate.length > 3 && (
              <div className="text-[9px] text-gray-500 px-1.5 py-0.5 text-center bg-gray-100 rounded">
                +{tasksOnDate.length - 3} more task{tasksOnDate.length - 3 > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Fill remaining cells to complete the grid
    const remainingCells = (totalWeeks * 7) - totalCells;
    for (let i = 0; i < remainingCells; i++) {
      days.push(<div key={`empty-end-${i}`} className="border border-gray-100 bg-gray-50/30" />);
    }

    return days;
  };

  const renderTimelineView = () => {
    const monthTasks = getTasksForMonth();
    const totalDays = daysInMonth(currentDate);

    return (
      <div className="flex flex-col h-full">
        {/* Day headers */}
        <div className="flex items-center gap-1 px-2 text-xs text-gray-500 flex-shrink-0 mb-3">
          {Array.from({ length: totalDays }, (_, i) => (
            <div key={i} className="flex-1 text-center">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Task bars */}
        <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
          {monthTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No tasks scheduled for this month
            </div>
          ) : (
            monthTasks.map(task => {
              const position = calculateTaskBarPosition(task);
              const isSelected = selectedTask?.id === task.id;
              return (
                <div key={task.id} className={`relative transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 rounded-lg p-2 bg-blue-50' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-xs font-medium truncate flex-1 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                      {task.title}
                    </p>
                    <CompletionLevelBadge level={task.completionLevel} />
                  </div>
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className={`absolute h-full ${getColorByPriority(task.priority)} rounded-lg transition-all cursor-pointer hover:opacity-90 flex items-center px-2 ${isSelected ? 'shadow-lg' : ''}`}
                      style={position}
                      onClick={() => onDateClick?.(new Date(task.startDate))}
                    >
                      <span className="text-xs text-white font-medium truncate">
                        {new Date(task.startDate).getDate()} - {new Date(task.endDate).getDate()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                      {task.assignedTo}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className={`text-xs capitalize ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const upcomingTasks = tasks
    .filter(task => {
      const endDate = new Date(task.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return endDate >= today;
    })
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 3);

  // Auto-navigate when a task is selected
  React.useEffect(() => {
    if (selectedTask) {
      goToTaskMonth(selectedTask);
    }
  }, [selectedTask?.id]);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1 sm:p-1.5 rounded transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white/30 text-white'
                  : 'text-white/70 hover:bg-white/20'
              }`}
              title="Calendar View"
            >
              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1 sm:p-1.5 rounded transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white/30 text-white'
                  : 'text-white/70 hover:bg-white/20'
              }`}
              title="Timeline View"
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {selectedTask && (
              <span className="text-[10px] sm:text-xs text-white/90 bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hidden md:inline">
                {selectedTask.title.substring(0, 20)}...
              </span>
            )}
            <button
              onClick={goToToday}
              className="text-[10px] sm:text-xs text-white bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-all"
            >
              Today
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-0.5 sm:p-1 text-white hover:bg-white/20 rounded-lg transition-all"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <h4 className="text-white font-bold text-sm sm:text-base">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>

          <button
            onClick={nextMonth}
            className="p-0.5 sm:p-1 text-white hover:bg-white/20 rounded-lg transition-all"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 min-h-0 flex flex-col overflow-hidden">
        {viewMode === 'calendar' ? (
          <>
            {/* Day names */}
            <div className="grid grid-cols-7 mb-2 flex-shrink-0 bg-gray-50 rounded-lg">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
                <div key={idx} className="text-center text-[10px] sm:text-xs font-bold text-gray-600 py-2 border-r border-gray-200 last:border-r-0">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.substring(0, 3)}</span>
                </div>
              ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 auto-rows-fr flex-1 overflow-y-auto">
              {renderCalendarDays()}
            </div>
          </>
        ) : (
          renderTimelineView()
        )}
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div className="border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
          <h4 className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-2 uppercase">Upcoming</h4>
          <div className="space-y-1.5 sm:space-y-2">
            {upcomingTasks.map(task => (
              <div
                key={task.id}
                className="flex items-start gap-2 p-1.5 sm:p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                onClick={() => onDateClick?.(new Date(task.startDate))}
              >
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getColorByPriority(task.priority)} mt-1 sm:mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-800 line-clamp-1">{task.title}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    Due: {new Date(task.endDate).toLocaleDateString('en-MY', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

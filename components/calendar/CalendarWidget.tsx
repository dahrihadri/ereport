'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BarChart3, X } from 'lucide-react';
import { Task } from '@/types';
import CompletionLevelBadge from '../ui/CompletionLevelBadge';
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CalendarWidgetProps {
  tasks: Task[];
  onDateClick?: (date: Date) => void;
  selectedTask?: Task | null;
}

export default function CalendarWidget({ tasks, onDateClick, selectedTask }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskSheet, setShowTaskSheet] = useState(false);

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

      const handleDateClick = () => {
        if (tasksOnDate.length > 0) {
          setSelectedDate(date);
          setShowTaskSheet(true);
        }
      };

      days.push(
        <div
          key={day}
          onClick={handleDateClick}
          className={`border border-gray-200 bg-white hover:bg-gray-50 transition-all relative group min-h-[70px] sm:min-h-[80px] md:min-h-[100px] ${
            tasksOnDate.length > 0 ? 'cursor-pointer active:bg-gray-100' : ''
          } ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''} ${hasSelectedTask ? 'ring-2 ring-blue-400 ring-inset bg-blue-50/50' : ''}`}
        >
          {/* Date number */}
          <div className="flex items-start justify-between p-1 sm:p-2">
            <span className={`text-xs sm:text-sm font-semibold ${
              isToday
                ? 'bg-blue-600 text-white w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs'
                : hasSelectedTask
                ? 'text-blue-700'
                : 'text-gray-700'
            }`}>
              {day}
            </span>
            {tasksOnDate.length > 0 && (
              <span className="text-[8px] sm:text-[9px] md:text-[10px] bg-blue-100 text-blue-700 px-1 sm:px-1.5 py-0.5 rounded-full font-semibold">
                {tasksOnDate.length}
              </span>
            )}
          </div>

          {/* Task list - Simple dots on mobile, full on desktop */}
          <div className="px-0.5 sm:px-1 pb-0.5 sm:pb-1 pointer-events-none">
            {/* Mobile: Show only dots */}
            <div className="sm:hidden flex flex-wrap gap-0.5">
              {tasksOnDate.slice(0, 5).map(task => (
                <div
                  key={task.id}
                  className={`w-1.5 h-1.5 rounded-full ${getColorByPriority(task.priority)}`}
                  title={task.title}
                  aria-label={task.title}
                />
              ))}
              {tasksOnDate.length > 5 && (
                <span className="text-[8px] text-gray-500 ml-0.5">+{tasksOnDate.length - 5}</span>
              )}
            </div>

            {/* Desktop: Show task bars */}
            <div className="hidden sm:block space-y-0.5 pointer-events-auto">
              {tasksOnDate.slice(0, 3).map(task => (
                <button
                  key={task.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDateClick?.(new Date(task.startDate));
                  }}
                  className={`w-full text-left px-1.5 py-1 rounded-md text-[9px] md:text-[10px] truncate transition-all shadow-sm hover:shadow-md ${
                    getColorByPriority(task.priority)
                  } text-white font-medium relative group/task`}
                  title={task.title}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-white opacity-80 flex-shrink-0"></div>
                    <span className="truncate">{task.title}</span>
                  </div>

                  {/* Enhanced Tooltip - Desktop only */}
                  <div className="hidden lg:group-hover/task:block absolute left-0 top-full mt-1 z-50 w-56 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-2xl border border-gray-700">
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
                  +{tasksOnDate.length - 3} more
                </div>
              )}
            </div>
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
        {/* Day headers - Hide on very small screens */}
        <div className="hidden sm:flex items-center gap-1 px-2 text-xs text-gray-500 flex-shrink-0 mb-3">
          {Array.from({ length: totalDays }, (_, i) => (
            <div key={i} className="flex-1 text-center text-[9px] sm:text-[10px] md:text-xs">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Task bars */}
        <div className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto min-h-0 px-1">
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
                    <p className={`text-[10px] sm:text-xs font-medium truncate flex-1 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                      {task.title}
                    </p>
                    <div className="hidden sm:block">
                      <CompletionLevelBadge level={task.completionLevel} />
                    </div>
                  </div>
                  <div className="relative h-6 sm:h-8 bg-gray-100 rounded-md sm:rounded-lg overflow-hidden">
                    <div
                      className={`absolute h-full ${getColorByPriority(task.priority)} rounded-md sm:rounded-lg transition-all cursor-pointer hover:opacity-90 touch-manipulation active:scale-[0.98] flex items-center px-1.5 sm:px-2 ${isSelected ? 'shadow-lg' : ''}`}
                      style={position}
                      onClick={() => onDateClick?.(new Date(task.startDate))}
                    >
                      <span className="text-[9px] sm:text-xs text-white font-medium truncate">
                        {new Date(task.startDate).getDate()} - {new Date(task.endDate).getDate()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                    <span className={`text-[9px] sm:text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                      {task.assignedTo}
                    </span>
                    <span className="text-[9px] sm:text-xs text-gray-400">•</span>
                    <span className={`text-[9px] sm:text-xs capitalize ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                      {task.priority}
                    </span>
                    <div className="sm:hidden ml-auto">
                      <CompletionLevelBadge level={task.completionLevel} />
                    </div>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTask?.id]);

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <>
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 sm:p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1 sm:p-1.5 rounded transition-all touch-manipulation active:scale-95 ${
                viewMode === 'calendar'
                  ? 'bg-white/30 text-white'
                  : 'text-white/70 hover:bg-white/20 active:bg-white/30'
              }`}
              title="Calendar View"
              aria-label="Calendar View"
            >
              <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1 sm:p-1.5 rounded transition-all touch-manipulation active:scale-95 ${
                viewMode === 'timeline'
                  ? 'bg-white/30 text-white'
                  : 'text-white/70 hover:bg-white/20 active:bg-white/30'
              }`}
              title="Timeline View"
              aria-label="Timeline View"
            >
              <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            {selectedTask && (
              <span className="text-[10px] sm:text-xs text-white/90 bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hidden lg:inline truncate max-w-[100px] xl:max-w-[150px]">
                {selectedTask.title.substring(0, 20)}...
              </span>
            )}
            <button
              onClick={goToToday}
              className="text-[10px] sm:text-xs text-white bg-white/20 hover:bg-white/30 active:bg-white/40 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-all touch-manipulation active:scale-95"
            >
              Today
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-1 sm:p-1.5 text-white hover:bg-white/20 active:bg-white/30 rounded-lg transition-all touch-manipulation active:scale-95"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <h4 className="text-white font-bold text-xs sm:text-sm md:text-base">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>

          <button
            onClick={nextMonth}
            className="p-1 sm:p-1.5 text-white hover:bg-white/20 active:bg-white/30 rounded-lg transition-all touch-manipulation active:scale-95"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3 md:p-4 flex-1 min-h-0 flex flex-col overflow-hidden">
        {viewMode === 'calendar' ? (
          <>
            {/* Day names */}
            <div className="grid grid-cols-7 mb-1.5 sm:mb-2 flex-shrink-0 bg-gray-50 rounded-md sm:rounded-lg">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
                <div key={idx} className="text-center text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-600 py-1.5 sm:py-2 border-r border-gray-200 last:border-r-0">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.substring(0, 1)}</span>
                </div>
              ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 auto-rows-fr flex-1 overflow-y-auto scrollbar-hide">
              {renderCalendarDays()}
            </div>
          </>
        ) : (
          renderTimelineView()
        )}
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div className="border-t border-gray-200 p-2 sm:p-3 md:p-4 flex-shrink-0">
          <h4 className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-1.5 sm:mb-2 uppercase">Upcoming Deadlines</h4>
          <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
            {upcomingTasks.map(task => (
              <div
                key={task.id}
                className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
                onClick={() => onDateClick?.(new Date(task.startDate))}
              >
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getColorByPriority(task.priority)} mt-0.5 sm:mt-1 md:mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-800 line-clamp-1">{task.title}</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">
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

    {/* Mobile Task Selection Sheet */}
    <AnimatePresence>
      {showTaskSheet && selectedDate && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTaskSheet(false)}
            className="sm:hidden fixed inset-0 bg-black/50 z-50"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="sm:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedDate.toLocaleDateString('en-MY', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
                <p className="text-sm text-gray-500">{selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => setShowTaskSheet(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedDateTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => {
                    onDateClick?.(new Date(task.startDate));
                    setShowTaskSheet(false);
                  }}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 active:border-blue-500 transition-all bg-white shadow-sm active:shadow-md"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getColorByPriority(task.priority)} mt-1 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 mb-1">{task.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{task.assignedTo}</p>

                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          task.priority === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'high'
                            ? 'bg-orange-100 text-orange-700'
                            : task.priority === 'medium'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {task.priority}
                        </span>
                        <CompletionLevelBadge level={task.completionLevel} />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          {new Date(task.startDate).toLocaleDateString('en-MY', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span>→</span>
                        <span>
                          {new Date(task.endDate).toLocaleDateString('en-MY', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-blue-600 font-medium mt-2 flex items-center gap-1">
                    <span>Tap to view details</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}

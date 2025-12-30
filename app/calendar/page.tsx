'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/main/Navbar';
import CalendarWidget from '@/components/calendar/CalendarWidget';
import { Task, ReportStatus, CompletionLevel, TaskStatus, TaskPriority } from '@/types';
import { getUserById, mockReportsWithRelations } from '@/lib/mock-data';

// Helper function to convert ReportStatus to TaskStatus
function reportStatusToTaskStatus(status: ReportStatus): TaskStatus {
  const statusMap: Record<ReportStatus, TaskStatus> = {
    'draft': 'pending',
    'submitted_to_sector': 'in_progress',
    'under_review_sector': 'in_progress',
    'returned_for_revision_sector': 'pending',
    'approved_by_sector': 'in_progress',
    'under_review_dmd': 'in_progress',
    'returned_for_revision_dmd': 'pending',
    'final_approved': 'completed',
    'cancelled': 'cancelled',
  };
  return statusMap[status];
}

// Helper function to convert ReportStatus to CompletionLevel
function reportStatusToCompletionLevel(status: ReportStatus): CompletionLevel {
  const levelMap: Record<ReportStatus, CompletionLevel> = {
    'draft': 'not_started',
    'submitted_to_sector': 'started',
    'under_review_sector': 'in_progress',
    'returned_for_revision_sector': 'started',
    'approved_by_sector': 'nearly_complete',
    'under_review_dmd': 'nearly_complete',
    'returned_for_revision_dmd': 'in_progress',
    'final_approved': 'complete',
    'cancelled': 'not_started',
  };
  return levelMap[status];
}

export default function CalendarPage() {
  const router = useRouter();
  const currentUser = getUserById('user-1');

  // Convert mock reports to tasks for calendar display
  const tasksFromReports = useMemo<Task[]>(() =>
    mockReportsWithRelations.map(report => ({
      id: report.id,
      title: report.title,
      description: report.summary,
      status: reportStatusToTaskStatus(report.currentStatus),
      priority: report.priority as TaskPriority,
      assignedTo: report.createdBy.name,
      assignedToEmail: report.createdBy.email,
      createdBy: report.createdBy.name,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      startDate: report.createdAt,
      endDate: report.submittedAt || report.updatedAt,
      completionLevel: reportStatusToCompletionLevel(report.currentStatus),
      department: report.division.name,
      tags: [report.project.code, report.category],
    }))
  , []);

  const [tasks] = useState<Task[]>(tasksFromReports);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const taskRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleTaskClick = (task: Task) => {
    // Navigate to report detail page
    router.push(`/reports/${task.id}`);
  };

  const handleSidebarTaskClick = (task: Task) => {
    // Highlight task and navigate on double-click
    setHighlightedTaskId(task.id);
    setSelectedTask(task);
  };

  // Scroll to highlighted task
  useEffect(() => {
    if (highlightedTaskId && taskRefs.current[highlightedTaskId]) {
      taskRefs.current[highlightedTaskId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedTaskId]);

  const handleDateClick = (date: Date) => {
    const tasksOnDate = tasks.filter(task => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= startDate && date <= endDate;
    });

    if (tasksOnDate.length > 0 && tasksOnDate[0]) {
      handleTaskClick(tasksOnDate[0]);
    }
  };

  // Filter tasks based on priority, status, and search query
  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.department?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPriority && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        user={{
          name: currentUser?.name || 'Ahmad Faizal',
          email: currentUser?.email || 'ahmad.faizal@mcmc.gov.my',
          role: 'DMDD',
        }}
      />

      <div className="w-full">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 min-h-[calc(100vh-64px)]">

          {/* LEFT SIDE - Calendar */}
          <motion.div
            className="xl:col-span-2 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 flex flex-col gap-4 sm:gap-5 md:gap-6 relative overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Curved edge decoration */}
            <div className="hidden xl:block absolute top-0 right-0 h-full w-1 pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 10 100" preserveAspectRatio="none">
                <path d="M10,0 Q5,50 10,100" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold">Project Calendar</h1>
                      <p className="text-sm opacity-90">View project timelines and task schedules</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-xs opacity-90">Tasks</p>
                  <p className="text-2xl font-bold">{filteredTasks.length}/{tasks.length}</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 flex-shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative sm:col-span-3 lg:col-span-1">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="flex-1 min-h-0">
              <CalendarWidget
                tasks={filteredTasks}
                onDateClick={handleDateClick}
                selectedTask={highlightedTaskId ? filteredTasks.find(t => t.id === highlightedTaskId) || null : null}
              />
            </div>

            {/* Mobile Task List - Only visible on mobile/tablet */}
            <div className="xl:hidden bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4 flex flex-col max-h-96">
              <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Filtered Tasks</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                  {filteredTasks.length}
                </span>
              </div>
              <div className="space-y-2 overflow-y-auto pr-1 scroll-smooth flex-1 min-h-0 -mr-1">
                {filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs sm:text-sm font-medium">No tasks found</p>
                    <p className="text-xs mt-1">Try adjusting filters</p>
                  </div>
                ) : (
                  filteredTasks.map(task => {
                    const isHighlighted = highlightedTaskId === task.id;
                    return (
                      <button
                        key={task.id}
                        ref={(el) => {
                          taskRefs.current[task.id] = el;
                        }}
                        onClick={() => handleSidebarTaskClick(task)}
                        onDoubleClick={() => handleTaskClick(task)}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-lg transition-all border-2 touch-manipulation active:scale-[0.99] ${
                          isHighlighted
                            ? 'bg-blue-50 border-blue-500 shadow-md'
                            : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-blue-200 active:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                          <h4 className={`text-xs sm:text-sm font-medium line-clamp-2 flex-1 ${
                            isHighlighted ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                            {task.title}
                          </h4>
                          <span
                            className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                              task.priority === 'critical'
                                ? 'bg-red-100 text-red-700'
                                : task.priority === 'high'
                                ? 'bg-orange-100 text-orange-700'
                                : task.priority === 'medium'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <p className={`text-[10px] sm:text-xs mb-1.5 sm:mb-2 truncate ${isHighlighted ? 'text-blue-600' : 'text-gray-600'}`}>
                          {task.assignedTo}
                        </p>
                        <div className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs ${isHighlighted ? 'text-blue-600' : 'text-gray-500'}`}>
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
                        {isHighlighted && (
                          <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-blue-600 font-medium">
                            <span className="hidden sm:inline">Click to view in calendar • Double-click for details</span>
                            <span className="sm:hidden">Tap to view • Double-tap details</span>
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - Task List Sidebar - Hidden on mobile */}
          <div className="hidden xl:flex xl:col-span-1 bg-gradient-to-br from-gray-200 to-gray-200 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4 flex flex-col flex-1 min-h-0">
              <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Filtered Tasks</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                  {filteredTasks.length}
                </span>
              </div>
              <div className="space-y-2 overflow-y-auto pr-1 scroll-smooth flex-1 min-h-0 -mr-1">
                {filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs sm:text-sm font-medium">No tasks found</p>
                    <p className="text-xs mt-1">Try adjusting filters</p>
                  </div>
                ) : (
                  filteredTasks.map(task => {
                    const isHighlighted = highlightedTaskId === task.id;
                    return (
                      <button
                        key={task.id}
                        ref={(el) => {
                          taskRefs.current[task.id] = el;
                        }}
                        onClick={() => handleSidebarTaskClick(task)}
                        onDoubleClick={() => handleTaskClick(task)}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-lg transition-all border-2 ${
                          isHighlighted
                            ? 'bg-blue-50 border-blue-500 shadow-md'
                            : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                          <h4 className={`text-xs sm:text-sm font-medium line-clamp-2 flex-1 ${
                            isHighlighted ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                            {task.title}
                          </h4>
                          <span
                            className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                              task.priority === 'critical'
                                ? 'bg-red-100 text-red-700'
                                : task.priority === 'high'
                                ? 'bg-orange-100 text-orange-700'
                                : task.priority === 'medium'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <p className={`text-[10px] sm:text-xs mb-1.5 sm:mb-2 truncate ${isHighlighted ? 'text-blue-600' : 'text-gray-600'}`}>
                          {task.assignedTo}
                        </p>
                        <div className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs ${isHighlighted ? 'text-blue-600' : 'text-gray-500'}`}>
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
                        {isHighlighted && (
                          <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-blue-600 font-medium">
                            <span className="hidden sm:inline">Click to view in calendar • Double-click for details</span>
                            <span className="sm:hidden">Tap to view • Double-tap details</span>
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

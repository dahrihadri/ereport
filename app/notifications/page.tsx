'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NotificationsTable from '@/components/notifications/NotificationsTable';
import FilterButton from '@/components/ui/FilterButton';
import Pagination from '@/components/ui/Pagination';
import { Task } from '@/types';
import { Bell } from 'lucide-react';
import { getUserById, mockReportsWithRelations } from '@/lib/mock-data';

type NotificationType = 'all' | 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  time: string;
  read: boolean;
  reportId?: string;
  details?: {
    reportTitle?: string;
    assignedBy?: string;
    dueDate?: string;
    action?: string;
  };
}

// Generate notifications from actual mock data
const generateMockNotifications = (): Notification[] => {
  const notifs: Notification[] = [];
  const reports = mockReportsWithRelations;

  // Report 1 - Approved
  if (reports[0]) {
    notifs.push({
      id: '1',
      title: 'Report Approved',
      message: `Your report "${reports[0].title}" has been approved by ${reports[0].createdBy.name}`,
      type: 'success',
      time: '5 minutes ago',
      read: false,
      reportId: reports[0].id,
      details: {
        reportTitle: reports[0].title,
        assignedBy: reports[0].createdBy.name,
        action: 'Approved',
      },
    });
  }

  // Report 2 - New Comment
  if (reports[1]) {
    notifs.push({
      id: '2',
      title: 'New Comment',
      message: `${reports[1].createdBy.name} commented on "${reports[1].title}"`,
      type: 'info',
      time: '1 hour ago',
      read: false,
      reportId: reports[1].id,
      details: {
        reportTitle: reports[1].title,
        assignedBy: reports[1].createdBy.name,
        action: 'Commented',
      },
    });
  }

  // Report 5 - Returned for Revision
  if (reports[4]) {
    notifs.push({
      id: '3',
      title: 'Report Returned for Revision',
      message: `Your report "${reports[4].title}" needs revision. Please check the feedback.`,
      type: 'error',
      time: '2 hours ago',
      read: false,
      reportId: reports[4].id,
      details: {
        reportTitle: reports[4].title,
        action: 'Needs Revision',
      },
    });
  }

  // Report 4 - Draft Reminder
  if (reports[3]) {
    notifs.push({
      id: '4',
      title: 'Draft Report Reminder',
      message: `You have a draft report "${reports[3].title}" waiting for submission`,
      type: 'info',
      time: '3 hours ago',
      read: true,
      reportId: reports[3].id,
      details: {
        reportTitle: reports[3].title,
        action: 'Draft Reminder',
      },
    });
  }

  // Report 3 - Awaiting Final Approval
  if (reports[2]) {
    notifs.push({
      id: '5',
      title: 'Report Awaiting Approval',
      message: `Report "${reports[2].title}" is awaiting final approval`,
      type: 'warning',
      time: '5 hours ago',
      read: true,
      reportId: reports[2].id,
      details: {
        reportTitle: reports[2].title,
        action: 'Awaiting Approval',
      },
    });
  }

  // Report 6 - Submitted
  if (reports[5]) {
    notifs.push({
      id: '6',
      title: 'Report Submitted',
      message: `Your report "${reports[5].title}" has been submitted successfully`,
      type: 'success',
      time: '1 day ago',
      read: true,
      reportId: reports[5].id,
      details: {
        reportTitle: reports[5].title,
        action: 'Submitted',
      },
    });
  }

  // Report 7 - Review Required
  if (reports[6]) {
    notifs.push({
      id: '7',
      title: 'Review Required',
      message: `Please review "${reports[6].title}" report`,
      type: 'info',
      time: '1 day ago',
      read: true,
      reportId: reports[6].id,
      details: {
        reportTitle: reports[6].title,
        assignedBy: 'System',
        action: 'Review Required',
      },
    });
  }

  // System notification (no report)
  notifs.push({
    id: '8',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Jan 20, 2025 from 2:00 AM to 4:00 AM',
    type: 'warning',
    time: '2 days ago',
    read: true,
    details: {
      action: 'System Maintenance',
      dueDate: 'Jan 20, 2025',
    },
  });

  // Report 8 - Another Approved
  if (reports[7]) {
    notifs.push({
      id: '9',
      title: 'Report Approved',
      message: `Your report "${reports[7].title}" has been approved by the DMD`,
      type: 'success',
      time: '3 days ago',
      read: true,
      reportId: reports[7].id,
      details: {
        reportTitle: reports[7].title,
        assignedBy: 'DMD',
        action: 'Approved',
      },
    });
  }

  // Report 1 - Comment Reply
  if (reports[0]) {
    notifs.push({
      id: '10',
      title: 'Comment Reply',
      message: `${reports[0].createdBy.name} replied to your comment on "${reports[0].title}"`,
      type: 'info',
      time: '4 days ago',
      read: true,
      reportId: reports[0].id,
      details: {
        reportTitle: reports[0].title,
        assignedBy: reports[0].createdBy.name,
        action: 'Replied',
      },
    });
  }

  return notifs;
};

const mockNotifications: Notification[] = generateMockNotifications();

export default function NotificationsPage() {
  const router = useRouter();
  const currentUser = getUserById('user-1');
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filterType, setFilterType] = useState<NotificationType>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemsPerPage = 5;

  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filterType === 'all' || notification.type === filterType;
    const readMatch = !showUnreadOnly || !notification.read;
    return typeMatch && readMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilter: NotificationType) => {
    setIsAnimating(true);
    setFilterType(newFilter);
    setCurrentPage(1);
    setTimeout(() => setIsAnimating(false), 150);
  };

  const handleUnreadToggle = () => {
    setIsAnimating(true);
    setShowUnreadOnly(!showUnreadOnly);
    setCurrentPage(1);
    setTimeout(() => setIsAnimating(false), 150);
  };

  const handlePageChange = (page: number) => {
    setIsAnimating(true);
    setCurrentPage(page);
    setTimeout(() => setIsAnimating(false), 150);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.reportId) {
      // Navigate to report details page using the actual reportId
      router.push(`/reports/${notification.reportId}`);
    }
  };
  const handleCreateReport = () => {  };
  return (
    <DashboardLayout
      user={{
        name: currentUser?.name || 'Ahmad Faizal',
        email: currentUser?.email || 'ahmad.faizal@mcmc.gov.my',
        role: 'DMDD',
      }}    >
      {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
                      <p className="text-sm opacity-90">Stay updated with your reports and tasks</p>
                    </div>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-xs opacity-90">Unread</p>
                    <p className="text-2xl font-bold">{unreadCount}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 flex-shrink-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    label="All"
                    count={notifications.length}
                    active={filterType === 'all'}
                    color="blue"
                    onClick={() => handleFilterChange('all')}
                  />
                  <FilterButton
                    label="Success"
                    count={notifications.filter(n => n.type === 'success').length}
                    active={filterType === 'success'}
                    color="green"
                    onClick={() => handleFilterChange('success')}
                  />
                  <FilterButton
                    label="Errors"
                    count={notifications.filter(n => n.type === 'error').length}
                    active={filterType === 'error'}
                    color="red"
                    onClick={() => handleFilterChange('error')}
                  />
                  <FilterButton
                    label="Warnings"
                    count={notifications.filter(n => n.type === 'warning').length}
                    active={filterType === 'warning'}
                    color="yellow"
                    onClick={() => handleFilterChange('warning')}
                  />
                  <FilterButton
                    label="Info"
                    count={notifications.filter(n => n.type === 'info').length}
                    active={filterType === 'info'}
                    color="blue"
                    onClick={() => handleFilterChange('info')}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showUnreadOnly}
                      onChange={handleUnreadToggle}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Unread only</span>
                  </label>
                  <button
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            </div>

      {/* Notifications Table */}
      <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {paginatedNotifications.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-1">No notifications found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <NotificationsTable
            notifications={paginatedNotifications}
            onMarkAsRead={markAsRead}
            onNotificationClick={handleNotificationClick}
          />
        )}
      </div>

      {/* Pagination */}
      {filteredNotifications.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredNotifications.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Task Modal */}
    </DashboardLayout>
  );
}

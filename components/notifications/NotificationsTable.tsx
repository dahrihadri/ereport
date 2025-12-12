import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface NotificationDetails {
  reportTitle?: string;
  assignedBy?: string;
  dueDate?: string;
  action?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  time: string;
  read: boolean;
  details?: NotificationDetails;
}

interface NotificationsTableProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onNotificationClick?: (id: string) => void;
}

export default function NotificationsTable({
  notifications,
  onMarkAsRead,
  onNotificationClick,
}: NotificationsTableProps) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeBadgeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleRowClick = (id: string) => {
    console.log('Row clicked:', id);
    onMarkAsRead(id);
    if (onNotificationClick) {
      onNotificationClick(id);
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto touch-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Notification</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <tr
                key={notification.id}
                onClick={() => handleRowClick(notification.id)}
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center">
                    {!notification.read ? (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notification.type)}
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getTypeBadgeColor(notification.type)}`}>
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="max-w-md">
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1 text-xs text-gray-600">
                    {notification.details?.reportTitle && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Report:</span>
                        <span className="text-gray-700">{notification.details.reportTitle}</span>
                      </div>
                    )}
                    {notification.details?.assignedBy && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">By:</span>
                        <span className="text-gray-700">{notification.details.assignedBy}</span>
                      </div>
                    )}
                    {notification.details?.action && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Action:</span>
                        <span className="text-gray-700">{notification.details.action}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {notification.time}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Hidden on desktop */}
      <div className="md:hidden divide-y divide-gray-200 touch-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(notification.id);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRowClick(notification.id);
              }
            }}
            className={`p-4 transition-colors cursor-pointer touch-manipulation select-none active:scale-[0.98] ${
              !notification.read ? 'bg-blue-50/30 active:bg-blue-100/50' : 'hover:bg-gray-50 active:bg-gray-100'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Header with status indicator and type */}
            <div className="flex items-start gap-3 mb-3">
              {/* Status Indicator */}
              <div className="flex-shrink-0 mt-1">
                {!notification.read ? (
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                ) : (
                  <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                )}
              </div>

              {/* Type Badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getNotificationIcon(notification.type)}
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getTypeBadgeColor(notification.type)}`}>
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </span>
                  {!notification.read && (
                    <span className="ml-auto px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      New
                    </span>
                  )}
                </div>

                {/* Title and Message */}
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>

            {/* Details */}
            {(notification.details?.reportTitle || notification.details?.assignedBy || notification.details?.action) && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1.5">
                {notification.details?.reportTitle && (
                  <div className="flex items-start gap-2 text-xs">
                    <span className="font-semibold text-gray-700 whitespace-nowrap">Report:</span>
                    <span className="text-gray-600">{notification.details.reportTitle}</span>
                  </div>
                )}
                {notification.details?.assignedBy && (
                  <div className="flex items-start gap-2 text-xs">
                    <span className="font-semibold text-gray-700 whitespace-nowrap">By:</span>
                    <span className="text-gray-600">{notification.details.assignedBy}</span>
                  </div>
                )}
                {notification.details?.action && (
                  <div className="flex items-start gap-2 text-xs">
                    <span className="font-semibold text-gray-700 whitespace-nowrap">Action:</span>
                    <span className="text-gray-600">{notification.details.action}</span>
                  </div>
                )}
              </div>
            )}

            {/* Time */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{notification.time}</span>
              <span className="text-blue-600 font-medium">Tap to {notification.read ? 'view' : 'mark as read'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

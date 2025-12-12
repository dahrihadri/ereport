import { TaskStatus } from '@/types';

interface StatusBadgeProps {
  status: TaskStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-gray-100 text-gray-700 border-gray-300',
    },
    in_progress: {
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-700 border-blue-300',
    },
    completed: {
      label: 'Completed',
      className: 'bg-green-100 text-green-700 border-green-300',
    },
    on_hold: {
      label: 'On Hold',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-700 border-red-300',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

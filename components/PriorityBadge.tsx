import { TaskPriority } from '@/types';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityConfig = {
    low: {
      label: 'Low',
      className: 'bg-gray-50 text-gray-600 border-gray-200',
    },
    medium: {
      label: 'Medium',
      className: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    high: {
      label: 'High',
      className: 'bg-orange-50 text-orange-600 border-orange-200',
    },
    critical: {
      label: 'Critical',
      className: 'bg-red-50 text-red-600 border-red-200',
    },
  };

  const config = priorityConfig[priority];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

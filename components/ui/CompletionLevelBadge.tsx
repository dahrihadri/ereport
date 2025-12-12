import { CompletionLevel } from '@/types';

interface CompletionLevelBadgeProps {
  level: CompletionLevel;
  showIcon?: boolean;
}

export default function CompletionLevelBadge({ level, showIcon = false }: CompletionLevelBadgeProps) {
  const configs = {
    not_started: {
      label: 'Not Started',
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" opacity="0.3" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
      iconColor: 'text-gray-500',
    },
    started: {
      label: 'Started',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      ),
      iconColor: 'text-yellow-600',
    },
    in_progress: {
      label: 'In Progress',
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V8c0-.55-.45-1-1-1s-1 .45-1 1v4c0 2.21 1.79 4 4 4s4-1.79 4-4V6c0-2.21-1.79-4-4-4-4.41 0-8 3.59-8 8s3.59 8 8 8c.55 0 1 .45 1 1s-.45 1-1 1z" />
        </svg>
      ),
      iconColor: 'text-blue-600',
    },
    nearly_complete: {
      label: 'Nearly Complete',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      iconColor: 'text-indigo-600',
    },
    complete: {
      label: 'Complete',
      color: 'bg-green-100 text-green-700 border-green-300',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      iconColor: 'text-green-600',
    },
  };

  const config = configs[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.color} transition-all`}
    >
      {showIcon && <span className={config.iconColor}>{config.icon}</span>}
      {config.label}
    </span>
  );
}

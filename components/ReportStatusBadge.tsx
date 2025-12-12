import { ReportStatus } from '@/types';
import { getStatusConfig, getStatusColorClasses } from '@/lib/workflow/state-machine';

interface ReportStatusBadgeProps {
  status: ReportStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ReportStatusBadge({
  status,
  showIcon = true,
  size = 'md'
}: ReportStatusBadgeProps) {
  const config = getStatusConfig(status);
  const colors = getStatusColorClasses(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Icon mapping based on status
  const getIcon = () => {
    switch (config.icon) {
      case 'file-text':
        return (
          <svg className={iconSizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" opacity="0.3"/>
            <path d="M14 2v6h6M16 13H8m8 4H8m2-8H8"/>
          </svg>
        );
      case 'send':
        return (
          <svg className={iconSizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        );
      case 'eye':
        return (
          <svg className={iconSizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5z" opacity="0.3"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      case 'arrow-left':
        return (
          <svg className={iconSizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        );
      case 'check-circle':
        return (
          <svg className={iconSizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" opacity="0.3"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        );
      case 'check-circle-2':
        return (
          <svg className={iconSizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        );
      case 'x-circle':
        return (
          <svg className={iconSizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" opacity="0.3"/>
            <path d="M15 9l-6 6M9 9l6 6"/>
          </svg>
        );
      case 'x':
        return (
          <svg className={iconSizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-semibold border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]} transition-all`}
      title={config.description}
    >
      {showIcon && getIcon()}
      {config.label}
    </span>
  );
}

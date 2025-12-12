import { LucideIcon } from 'lucide-react';

interface CompactStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
  subtitle?: string;
}

export default function CompactStatCard({ title, value, icon: Icon, color = 'blue', subtitle }: CompactStatCardProps) {
  const colorClasses = {
    blue: {
      cardBg: 'bg-white',
      border: 'border-l-blue-500',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      valueColor: 'text-gray-900',
      titleColor: 'text-gray-600',
      subtitleBg: 'bg-blue-50',
      subtitleText: 'text-blue-700',
    },
    green: {
      cardBg: 'bg-white',
      border: 'border-l-green-500',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
      valueColor: 'text-gray-900',
      titleColor: 'text-gray-600',
      subtitleBg: 'bg-green-50',
      subtitleText: 'text-green-700',
    },
    yellow: {
      cardBg: 'bg-white',
      border: 'border-l-amber-500',
      iconBg: 'bg-gradient-to-br from-amber-400 to-amber-500',
      valueColor: 'text-gray-900',
      titleColor: 'text-gray-600',
      subtitleBg: 'bg-amber-50',
      subtitleText: 'text-amber-700',
    },
    orange: {
      cardBg: 'bg-white',
      border: 'border-l-orange-500',
      iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      valueColor: 'text-gray-900',
      titleColor: 'text-gray-600',
      subtitleBg: 'bg-orange-50',
      subtitleText: 'text-orange-700',
    },
    red: {
      cardBg: 'bg-white',
      border: 'border-l-rose-500',
      iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
      valueColor: 'text-gray-900',
      titleColor: 'text-gray-600',
      subtitleBg: 'bg-rose-50',
      subtitleText: 'text-rose-700',
    },
    purple: {
      cardBg: 'bg-white',
      border: 'border-l-purple-500',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      valueColor: 'text-gray-900',
      titleColor: 'text-gray-600',
      subtitleBg: 'bg-purple-50',
      subtitleText: 'text-purple-700',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.cardBg} border border-gray-200 ${colors.border} border-l-4 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Icon */}
        <div className={`${colors.iconBg} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${colors.titleColor} mb-0.5 sm:mb-1 truncate`}>
            {title}
          </p>
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <p className={`text-2xl sm:text-3xl font-bold ${colors.valueColor} tabular-nums`}>{value}</p>
            {subtitle && (
              <span className={`${colors.subtitleBg} ${colors.subtitleText} px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold whitespace-nowrap`}>
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

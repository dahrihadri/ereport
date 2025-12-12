import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  subtitle?: string;
  backgroundImage?: string;
}

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle, backgroundImage }: StatCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      border: 'border-blue-300',
      text: 'text-white-100',
      iconBg: 'bg-blue-500',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-500 to-green-600',
      border: 'border-green-300',
      text: 'text-white-600',
      iconBg: 'bg-green-500',
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      border: 'border-yellow-300',
      text: 'text-white-600',
      iconBg: 'bg-yellow-500',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-500 to-red-600',
      border: 'border-red-300',
      text: 'text-red-600',
      iconBg: 'bg-red-500',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      border: 'border-purple-300',
      text: 'text-white-600',
      iconBg: 'bg-purple-500',
    },
  };

  const colors = colorClasses[color];

  // If backgroundImage is provided, use it with a relative container
  if (backgroundImage) {
    return (
      <div
        className={`relative rounded-xl border-2 ${colors.border} p-4 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-opacity-100 cursor-pointer outline outline-0 hover:outline-2 hover:outline-offset-2 ${colors.border.replace('border-', 'hover:outline-')} overflow-hidden`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wide">{title}</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 sm:mt-2 truncate font-mono tabular-nums">{value}</p>
            {subtitle && (
              <p className="text-xs opacity-90 mt-1 text-white">{subtitle}</p>
            )}
          </div>
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border-2 ${colors.bg} ${colors.border} p-4 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-opacity-100 cursor-pointer outline outline-0 hover:outline-2 hover:outline-offset-2 ${colors.border.replace('border-', 'hover:outline-')}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-xs sm:text-sm font-semibold ${colors.text} uppercase tracking-wide`}>{title}</p>
          <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${colors.text} mt-1 sm:mt-2 truncate font-mono tabular-nums`}>{value}</p>
          {subtitle && (
            <p className="text-xs opacity-90 mt-1 text-white-600">{subtitle}</p>
          )}
        </div>
        <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${colors.iconBg} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
      </div>
    </div>
  );
}

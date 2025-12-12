import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  subtitle?: string;
  backgroundImage?: string;
  href?: string;
}

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle, backgroundImage, href }: StatCardProps) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      hoverBg: 'group-hover:from-blue-500 group-hover:to-blue-600',
      iconNormal: 'text-blue-500',
      iconBgNormal: 'bg-blue-50',
      textNormal: 'text-gray-700',
      valueNormal: 'text-gray-900',
      textColor: 'text-white',
      iconColor: 'text-white',
      iconBgColor: 'bg-blue-400',
      iconHover: 'group-hover:text-white',
      iconBgHover: 'group-hover:bg-blue-400',
      textHover: 'group-hover:text-white',
      valueHover: 'group-hover:text-white',
    },
    green: {
      bg: 'from-green-500 to-green-600',
      hoverBg: 'group-hover:from-green-500 group-hover:to-green-600',
      iconNormal: 'text-green-500',
      iconBgNormal: 'bg-green-50',
      textNormal: 'text-gray-700',
      valueNormal: 'text-gray-900',
      textColor: 'text-white',
      iconColor: 'text-white',
      iconBgColor: 'bg-green-400',
      iconHover: 'group-hover:text-white',
      iconBgHover: 'group-hover:bg-green-400',
      textHover: 'group-hover:text-white',
      valueHover: 'group-hover:text-white',
    },
    yellow: {
      bg: 'from-yellow-500 to-yellow-600',
      hoverBg: 'group-hover:from-yellow-500 group-hover:to-yellow-600',
      iconNormal: 'text-yellow-500',
      iconBgNormal: 'bg-yellow-50',
      textNormal: 'text-gray-700',
      valueNormal: 'text-gray-900',
      textColor: 'text-white',
      iconColor: 'text-white',
      iconBgColor: 'bg-yellow-400',
      iconHover: 'group-hover:text-white',
      iconBgHover: 'group-hover:bg-yellow-400',
      textHover: 'group-hover:text-white',
      valueHover: 'group-hover:text-white',
    },
    red: {
      bg: 'from-red-500 to-red-600',
      hoverBg: 'group-hover:from-red-500 group-hover:to-red-600',
      iconNormal: 'text-red-500',
      iconBgNormal: 'bg-red-50',
      textNormal: 'text-gray-700',
      valueNormal: 'text-gray-900',
      textColor: 'text-white',
      iconColor: 'text-white',
      iconBgColor: 'bg-red-400',
      iconHover: 'group-hover:text-white',
      iconBgHover: 'group-hover:bg-red-400',
      textHover: 'group-hover:text-white',
      valueHover: 'group-hover:text-white',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      hoverBg: 'group-hover:from-purple-500 group-hover:to-purple-600',
      iconNormal: 'text-purple-500',
      iconBgNormal: 'bg-purple-50',
      textNormal: 'text-gray-700',
      valueNormal: 'text-gray-900',
      textColor: 'text-white',
      iconColor: 'text-white',
      iconBgColor: 'bg-purple-400',
      iconHover: 'group-hover:text-white',
      iconBgHover: 'group-hover:bg-purple-400',
      textHover: 'group-hover:text-white',
      valueHover: 'group-hover:text-white',
    },
  };

  const colors = colorClasses[color];

  // If backgroundImage is provided, use it with a relative container
  if (backgroundImage) {
    const cardContent = (
      <div
        className={`relative rounded-2xl bg-white ${colors.hoverBg} bg-gradient-to-br p-4 sm:p-6 transition-all duration-300 shadow-md 
    ${href ? 'cursor-pointer group-hover:shadow-2xl' : ''} overflow-hidden`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-300"></div>

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className={`text-xs sm:text-sm font-semibold ${colors.textNormal} ${colors.textHover} uppercase tracking-wide transition-colors duration-300`}>{title}</p>
            <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${colors.valueNormal} ${colors.valueHover} mt-1 sm:mt-2 truncate font-mono tabular-nums transition-colors duration-300`}>{value}</p>
            {subtitle && (
              <p className={`text-xs opacity-75 mt-1 ${colors.textNormal} ${colors.textHover} transition-colors duration-300`}>{subtitle}</p>
            )}
          </div>
          <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${colors.iconBgNormal} ${colors.iconBgHover} flex items-center justify-center transition-all duration-300`}>
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.iconNormal} ${colors.iconHover} transition-colors duration-300`} />
          </div>
        </div>
      </div>
    );

    if (href) {
      return <Link href={href} className="group block">{cardContent}</Link>;
    }
    return cardContent;
  }

  const cardContent = (
    <div className={`rounded-2xl ${href ? 'bg-white' : `bg-gradient-to-br ${colors.bg}`} ${href ? colors.hoverBg : ''} ${href ? 'bg-gradient-to-br' : ''} p-4 sm:p-6 transition-all duration-300 shadow-md
  ${href ? 'group-hover:shadow-2xl cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-xs sm:text-sm font-semibold ${href ? colors.textNormal : colors.textColor} ${href ? colors.textHover : ''} uppercase tracking-wide transition-colors duration-300`}>{title}</p>
          <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${href ? colors.valueNormal : colors.textColor} ${href ? colors.valueHover : ''} mt-1 sm:mt-2 truncate font-mono tabular-nums transition-colors duration-300`}>{value}</p>
          {subtitle && (
            <p className={`text-xs opacity-75 mt-1 ${href ? colors.textNormal : colors.textColor} ${href ? colors.textHover : ''} transition-colors duration-300`}>{subtitle}</p>
          )}
        </div>
        <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${href ? colors.iconBgNormal : colors.iconBgColor} ${href ? colors.iconBgHover : ''} flex items-center justify-center transition-all duration-300`}>
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${href ? colors.iconNormal : colors.iconColor} ${href ? colors.iconHover : ''} transition-colors duration-300`} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="group block">{cardContent}</Link>;
  }
  return cardContent;
}
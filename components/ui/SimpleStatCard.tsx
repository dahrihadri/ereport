import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface SimpleStatCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  subtitle?: string;
  href?: string;
}

export default function SimpleStatCard({ title, value, icon: Icon, color = 'blue', subtitle, href }: SimpleStatCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-white',
      hoverBg: 'group-hover:from-blue-500 group-hover:to-blue-600',
      textNormal: 'text-gray-700',
      valueNormal: 'text-gray-900',
      textHover: 'group-hover:text-white',
      valueHover: 'group-hover:text-white',
      subtitleNormal: 'text-gray-500',
      subtitleHover: 'group-hover:text-white/90',
    },
    green: {
      bg: 'bg-white',
      hoverBg: 'group-hover:from-green-500 group-hover:to-green-600',
      textNormal: 'text-gray-700',
      valueNormal: 'text-gray-900',
      textHover: 'group-hover:text-white',
      valueHover: 'group-hover:text-white',
      subtitleNormal: 'text-gray-500',
      subtitleHover: 'group-hover:text-white/90',
    },
    yellow: {
      bg: 'bg-white',
      hoverBg: 'group-hover:from-yellow-500 group-hover:to-yellow-600',
      textNormal: 'text-gray-700',
      valueNormal: 'text-gray-900',
      textHover: 'group-hover:text-white',
      valueHover: 'group-hover:text-white',
      subtitleNormal: 'text-gray-500',
      subtitleHover: 'group-hover:text-white/90',
    },
    red: {
      bg: 'bg-white',
      hoverBg: 'group-hover:from-red-500 group-hover:to-red-600',
      textNormal: 'text-gray-700',
      valueNormal: 'text-gray-900',
      textHover: 'group-hover:text-white',
      valueHover: 'group-hover:text-white',
      subtitleNormal: 'text-gray-500',
      subtitleHover: 'group-hover:text-white/90',
    },
    purple: {
      bg: 'bg-white',
      hoverBg: 'group-hover:from-purple-500 group-hover:to-purple-600',
      textNormal: 'text-gray-700',
      valueNormal: 'text-gray-900',
      textHover: 'group-hover:text-white',
      valueHover: 'group-hover:text-white',
      subtitleNormal: 'text-gray-500',
      subtitleHover: 'group-hover:text-white/90',
    },
  };

  const colors = colorClasses[color];

  const cardContent = (
    <div className={`rounded-2xl ${colors.bg} ${colors.hoverBg} bg-gradient-to-br p-6 transition-all duration-300 shadow-md
  ${href ? 'group-hover:shadow-xl cursor-pointer' : ''} flex flex-col items-center justify-center text-center h-[150px] w-full relative overflow-hidden`}>
      <p className={`text-sm font-semibold ${colors.textNormal} ${colors.textHover} uppercase tracking-wide transition-colors duration-300 mb-2 line-clamp-1`}>{title}</p>

      {/* Value - hidden on hover if icon exists */}
      <p className={`text-4xl font-bold ${colors.valueNormal} ${colors.valueHover} font-mono tabular-nums transition-all duration-300 my-2 ${Icon ? 'group-hover:opacity-0 group-hover:scale-75' : ''}`}>{value}</p>

      {/* Icon - shown on hover */}
      {Icon && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
          <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
        </div>
      )}

      {subtitle && (
        <p className={`text-xs ${colors.subtitleNormal} ${colors.subtitleHover} transition-colors duration-300 line-clamp-1`}>{subtitle}</p>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="group block">{cardContent}</Link>;
  }
  return cardContent;
}

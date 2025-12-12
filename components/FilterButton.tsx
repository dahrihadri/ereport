interface FilterButtonProps {
  label: string;
  count: number;
  active: boolean;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  onClick: () => void;
}

export default function FilterButton({
  label,
  count,
  active,
  color = 'blue',
  onClick,
}: FilterButtonProps) {
  const colorClasses = {
    blue: {
      active: 'bg-blue-600 text-white shadow-md',
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    green: {
      active: 'bg-green-600 text-white shadow-md',
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    red: {
      active: 'bg-red-600 text-white shadow-md',
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    yellow: {
      active: 'bg-yellow-600 text-white shadow-md',
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
  };

  const classes = active ? colorClasses[color].active : colorClasses[color].inactive;

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${classes}`}
    >
      {label} ({count})
    </button>
  );
}

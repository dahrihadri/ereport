import { LayoutGrid, List } from 'lucide-react';

type ViewType = 'card' | 'table';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onViewChange('card')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
          currentView === 'card'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">Card</span>
      </button>
      <button
        onClick={() => onViewChange('table')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
          currentView === 'table'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">Table</span>
      </button>
    </div>
  );
}

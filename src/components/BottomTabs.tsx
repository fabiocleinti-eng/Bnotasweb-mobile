import { StickyNote, AlertCircle, Star } from 'lucide-react';

interface BottomTabsProps {
  activeTab: 'all' | 'urgent' | 'favorites';
  onTabChange: (tab: 'all' | 'urgent' | 'favorites') => void;
  urgentCount: number;
  favoritesCount: number;
}

export default function BottomTabs({ activeTab, onTabChange, urgentCount, favoritesCount }: BottomTabsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {/* Todas */}
        <button
          onClick={() => onTabChange('all')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors touch-target ${
            activeTab === 'all' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <StickyNote className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Todas</span>
        </button>

        {/* Urgentes */}
        <button
          onClick={() => onTabChange('urgent')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative touch-target ${
            activeTab === 'urgent' ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          <div className="relative">
            <AlertCircle className="w-6 h-6 mb-1" />
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-[bounce_1s_infinite]">
                {urgentCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Urgentes</span>
        </button>

        {/* Favoritas */}
        <button
          onClick={() => onTabChange('favorites')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors touch-target ${
            activeTab === 'favorites' ? 'text-orange-500' : 'text-gray-400'
          }`}
        >
          <div className="relative">
            <Star className={`w-6 h-6 mb-1 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Favoritas</span>
        </button>
      </div>
    </div>
  );
}

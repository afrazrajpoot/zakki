import React from 'react';
import { TabType, TabInfo } from '@/types';
import { Grid, Image, Clock, BarChart } from 'lucide-react';

const tabs: TabInfo[] = [
  {
    id: 'main',
    label: 'Canvas',
    color: 'bg-blue-500',
    icon: <Grid className="w-5 h-5" />
  },
  {
    id: 'gallery',
    label: 'Gallery',
    color: 'bg-purple-500',
    icon: <Image className="w-5 h-5" />
  },
  {
    id: 'history',
    label: 'History',
    color: 'bg-green-500',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'stats',
    label: 'Stats',
    color: 'bg-amber-500',
    icon: <BarChart className="w-5 h-5" />
  }
];

interface VerticalTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const VerticalTabs = ({ activeTab, onTabChange }: VerticalTabsProps) => {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2 bg-gray-800/50 rounded-r-lg z-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            p-3 rounded-lg transition-all duration-200 group flex items-center gap-3
            ${activeTab === tab.id ? tab.color : 'bg-gray-700 hover:bg-gray-600'}
          `}
        >
          {tab.icon}
          <span className={`
            absolute left-full ml-2 px-2 py-1 rounded bg-gray-800 text-white text-sm
            opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
          `}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};
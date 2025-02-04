import React from 'react';
import { FilterOptions } from '../types';
import { Search, Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  darkMode: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, darkMode }) => {
  const inputClasses = `w-full rounded-md ${
    darkMode
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
  } px-4 py-2 border focus:ring-1`;

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow mb-6`}>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className={`absolute left-3 top-2.5 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search logs..."
              className={`pl-10 ${inputClasses}`}
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <select
            className={inputClasses}
            value={filters.level || ''}
            onChange={(e) => onFilterChange({ ...filters, level: e.target.value })}
          >
            <option value="">All Levels</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <input
            type="datetime-local"
            className={inputClasses}
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <input
            type="datetime-local"
            className={inputClasses}
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
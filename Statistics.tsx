import React from 'react';
import { LogStats } from '../types';
import { AlertCircle, Info, AlertTriangle, Bug, BarChart2 } from 'lucide-react';

interface StatisticsProps {
  stats: LogStats;
}

export const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Logs</p>
            <p className="text-2xl font-semibold">{stats.totalEntries}</p>
          </div>
          <BarChart2 className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Errors</p>
            <p className="text-2xl font-semibold text-red-600">{stats.errorCount}</p>
          </div>
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Warnings</p>
            <p className="text-2xl font-semibold text-yellow-600">{stats.warnCount}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Info</p>
            <p className="text-2xl font-semibold text-blue-600">{stats.infoCount}</p>
          </div>
          <Info className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Debug</p>
            <p className="text-2xl font-semibold text-gray-600">{stats.debugCount}</p>
          </div>
          <Bug className="w-8 h-8 text-gray-500" />
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { LogEntry } from '../types';
import { User, Globe } from 'lucide-react';

interface TopEntitiesProps {
  logs: LogEntry[];
}

export const TopEntities: React.FC<TopEntitiesProps> = ({ logs }) => {
  const getTopUsers = () => {
    const userCounts = logs.reduce((acc, log) => {
      if (log.user) {
        acc[log.user] = (acc[log.user] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const getTopIPs = () => {
    const ipCounts = logs.reduce((acc, log) => {
      if (log.ip) {
        acc[log.ip] = (acc[log.ip] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(ipCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">Top Users</h3>
        </div>
        <div className="space-y-2">
          {getTopUsers().map(([user, count]) => (
            <div key={user} className="flex justify-between items-center">
              <span className="text-sm text-gray-200">{user}</span>
              <span className="text-sm text-gray-400">{count} events</span>
            </div>
          ))}
          {getTopUsers().length === 0 && (
            <div className="text-center py-2">
              <span className="text-sm text-gray-400">No user data available</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-white">Top IPs</h3>
        </div>
        <div className="space-y-2">
          {getTopIPs().map(([ip, count]) => (
            <div key={ip} className="flex justify-between items-center">
              <span className="text-sm text-gray-200">{ip}</span>
              <span className="text-sm text-gray-400">{count} events</span>
            </div>
          ))}
          {getTopIPs().length === 0 && (
            <div className="text-center py-2">
              <span className="text-sm text-gray-400">No IP data available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
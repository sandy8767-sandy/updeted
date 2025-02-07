import React from 'react';
import { LogEntry } from '../types';
import { AlertCircle, Info, AlertTriangle, Bug } from 'lucide-react';

interface LogTableProps {
  logs: LogEntry[];
}
export const LogTable = () => {
  // ... component code
}
const levelIcons = {
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  warn: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  debug: <Bug className="w-5 h-5 text-gray-500" />
};

export const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Message</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Source</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {logs.map((log, index) => (
            <tr key={index} className="hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {levelIcons[log.level]}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-200">
                {log.message}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {log.source || '-'}
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                No logs available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

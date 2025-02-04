import React from 'react';
import { Clock, Activity } from 'lucide-react';
import { UserActivity } from '../types';

interface HistoryProps {
  activities: UserActivity[];
  isOpen: boolean;
  onClose: () => void;
}

export const History: React.FC<HistoryProps> = ({ activities, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-white">Activity History</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg"
                >
                  <Activity className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                    {activity.details && (
                      <p className="text-sm text-gray-300 mt-1">
                        {activity.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No activity history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
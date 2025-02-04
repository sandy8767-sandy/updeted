import React from 'react';
import { LogEntry } from '../types';
import { AlertTriangle, Shield, ShieldAlert, AlertCircle } from 'lucide-react';

interface SecurityAlertsProps {
  logs: LogEntry[];
}

export const SecurityAlerts: React.FC<SecurityAlertsProps> = ({ logs }) => {
  const getSecurityAlerts = () => {
    return logs
      .filter(log => {
        const message = log.message?.toLowerCase() || '';
        return (
          log.level === 'error' ||
          message.includes('failed login') ||
          message.includes('suspicious') ||
          message.includes('unauthorized') ||
          message.includes('attack') ||
          message.includes('breach') ||
          message.includes('malware') ||
          (log.status === 'failure' && log.action?.includes('auth'))
        );
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };

  const getAlertIcon = (log: LogEntry) => {
    const message = log.message?.toLowerCase() || '';
    if (message.includes('attack') || message.includes('breach')) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    if (message.includes('suspicious') || message.includes('unauthorized')) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
    return <ShieldAlert className="w-5 h-5 text-orange-500" />;
  };

  const getAlertSeverity = (log: LogEntry) => {
    const message = log.message?.toLowerCase() || '';
    if (message.includes('attack') || message.includes('breach')) {
      return 'bg-red-500';
    }
    if (message.includes('suspicious') || message.includes('unauthorized')) {
      return 'bg-yellow-500';
    }
    return 'bg-orange-500';
  };

  const alerts = getSecurityAlerts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Security Alerts</h3>
        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
          {alerts.length} Active
        </span>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <div className={`p-2 rounded-full bg-gray-800`}>
              {getAlertIcon(alert)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-xs ${getAlertSeverity(alert)} text-white`}>
                  {alert.level.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-medium mt-1">{alert.message}</p>
              {alert.source && (
                <p className="text-xs text-gray-400 mt-1">
                  Source: {alert.source}
                </p>
              )}
              {alert.ip && (
                <p className="text-xs text-gray-400">
                  IP: {alert.ip}
                </p>
              )}
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            <Shield className="w-8 h-8 mx-auto mb-2" />
            <p>No active security alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};
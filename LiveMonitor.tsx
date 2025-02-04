import React, { useEffect, useState } from 'react';
import { Activity, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { LogEntry } from '../types';
import { logWebSocket } from '../utils/websocket';

interface LiveMonitorProps {
  onNewLog: (log: LogEntry) => void;
}

export const LiveMonitor: React.FC<LiveMonitorProps> = ({ onNewLog }) => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    logWebSocket.onMessage((log) => {
      onNewLog(log);
      setLastUpdate(new Date());
    });

    logWebSocket.onStatus(setStatus);

    return () => {
      logWebSocket.disconnect();
    };
  }, [onNewLog]);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-red-500';
      case 'reconnecting':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className={`w-5 h-5 ${getStatusColor()}`} />;
      case 'disconnected':
        return <WifiOff className={`w-5 h-5 ${getStatusColor()}`} />;
      case 'reconnecting':
        return <RefreshCw className={`w-5 h-5 ${getStatusColor()} animate-spin`} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">Live Monitor</h3>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {lastUpdate ? (
            <p>Last update: {lastUpdate.toLocaleTimeString()}</p>
          ) : (
            <p>Waiting for logs...</p>
          )}
        </div>
        <div className="text-sm text-gray-400">
          {status === 'connected' ? (
            <span className="text-green-500">●</span>
          ) : status === 'reconnecting' ? (
            <span className="text-yellow-500 animate-pulse">●</span>
          ) : (
            <span className="text-red-500">●</span>
          )} Connection Status
        </div>
      </div>
    </div>
  );
};
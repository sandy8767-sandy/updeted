import React, { useState, useCallback, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { LogTable } from './components/LogTable';
import { FilterPanel } from './components/FilterPanel';
import { Statistics } from './components/Statistics';
import { EventsChart } from './components/EventsChart';
import { EventsByTypeChart } from './components/EventsByTypeChart';
import { LogonByUserChart } from './components/LogonByUserChart';
import { RulesFiredChart } from './components/RulesFiredChart';
import { SecurityAlerts } from './components/SecurityAlerts';
import { GeographicMap } from './components/GeographicMap';
import { TopEntities } from './components/TopEntities';
import { SettingsModal } from './components/Settings';
import { Login } from './components/Login';
import { ProfileDropdown } from './components/ProfileDropdown';
import { History } from './components/History';
import { Feedback } from './components/Feedback';
import { LiveMonitor } from './components/LiveMonitor';
import { LogEntry, FilterOptions, LogStats, UserSettings, UserProfile, UserActivity } from './types';
import { parseLogFile } from './utils/logParser';
import { LogTable } from './components/LogTable';
function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [stats, setStats] = useState<LogStats>({
    totalEntries: 0,
    errorCount: 0,
    warnCount: 0,
    infoCount: 0,
    debugCount: 0,
    failedLogins: 0,
    avgResponseTime: 0,
    topUsers: [],
    topIPs: []
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: true,
    chartAnimationSpeed: '400',
    enableNotifications: false,
    alertRefreshInterval: 30,
    maxEventsToDisplay: 1000,
    autoRefresh: true
  });

  // Authentication and user-related state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    lastLogin: new Date().toISOString()
  });
  const [activities] = useState<UserActivity[]>([
    {
      id: '1',
      userId: '1',
      action: 'Logged in',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      userId: '1',
      action: 'Uploaded log file',
      timestamp: new Date().toISOString(),
      details: 'system.log (2.5MB)'
    }
  ]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleLogin = (email: string, password: string) => {
    setIsAuthenticated(true);
    setUser({
      id: '1',
      name: 'John Doe',
      email: email,
      role: 'admin',
      lastLogin: new Date().toISOString()
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({
      id: '',
      name: '',
      email: '',
      role: '',
      lastLogin: ''
    });
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedLogs = parseLogFile(content).slice(0, settings.maxEventsToDisplay);
      setLogs(parsedLogs);
      
      const failedLogins = parsedLogs.filter(log => 
        log.message?.toLowerCase().includes('failed login') || false
      ).length;

      const responseTimes = parsedLogs
        .map(log => log.duration || 0)
        .filter(duration => duration > 0);

      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

      const newStats = {
        totalEntries: parsedLogs.length,
        errorCount: parsedLogs.filter(log => log.level === 'error').length,
        warnCount: parsedLogs.filter(log => log.level === 'warn').length,
        infoCount: parsedLogs.filter(log => log.level === 'info').length,
        debugCount: parsedLogs.filter(log => log.level === 'debug').length,
        failedLogins,
        avgResponseTime,
        topUsers: [],
        topIPs: []
      };
      setStats(newStats);

      if (settings.enableNotifications) {
        const errorCount = newStats.errorCount;
        if (errorCount > 0) {
          new Notification('Security Alert', {
            body: `${errorCount} error(s) detected in log file`,
            icon: '/vite.svg'
          });
        }
      }
    };
    reader.readAsText(file);
  }, [settings]);

  const handleNewLog = useCallback((log: LogEntry) => {
    setLogs(prevLogs => {
      const newLogs = [log, ...prevLogs];
      // Keep only the last maxEventsToDisplay logs
      return newLogs.slice(0, settings.maxEventsToDisplay);
    });

    // Update stats when new log arrives
    setStats(prevStats => ({
      ...prevStats,
      totalEntries: prevStats.totalEntries + 1,
      errorCount: log.level === 'error' ? prevStats.errorCount + 1 : prevStats.errorCount,
      warnCount: log.level === 'warn' ? prevStats.warnCount + 1 : prevStats.warnCount,
      infoCount: log.level === 'info' ? prevStats.infoCount + 1 : prevStats.infoCount,
      debugCount: log.level === 'debug' ? prevStats.debugCount + 1 : prevStats.debugCount,
    }));
  }, [settings.maxEventsToDisplay]);

  useEffect(() => {
    if (settings.enableNotifications) {
      Notification.requestPermission();
    }
  }, [settings.enableNotifications]);

  useEffect(() => {
    if (settings.autoRefresh) {
      const interval = setInterval(() => {
        // Refresh data logic here
      }, settings.alertRefreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [settings.autoRefresh, settings.alertRefreshInterval]);

  const filteredLogs = logs.filter(log => {
    if (filters.level && log.level !== filters.level) return false;
    if (filters.search && !log.message?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.startDate && new Date(log.timestamp) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(log.timestamp) > new Date(filters.endDate)) return false;
    if (filters.source && log.source !== filters.source) return false;
    if (filters.user && log.user !== filters.user) return false;
    if (filters.ip && log.ip !== filters.ip) return false;
    if (filters.status && log.status !== filters.status) return false;
    return true;
  });

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`${settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="flex justify-between items-center max-w-[1800px] mx-auto">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">Security Event Manager</h1>
            <nav className="flex space-x-4">
              <a href="#" className="px-3 py-2 rounded-md bg-blue-600 text-white">Dashboard</a>
              <a href="#" className={`px-3 py-2 rounded-md hover:${settings.darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Events</a>
              <a href="#" className={`px-3 py-2 rounded-md hover:${settings.darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Rules</a>
              <a href="#" className={`px-3 py-2 rounded-md hover:${settings.darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Groups</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              Upload Logs
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".log,.txt,.json"
              />
            </label>
            <ProfileDropdown
              user={user}
              onLogout={handleLogout}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
              onOpenHistory={() => setIsHistoryOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Add LiveMonitor at the top */}
          <LiveMonitor onNewLog={handleNewLog} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Events Over Time Chart */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg lg:col-span-2`}>
              <h2 className="text-lg font-semibold mb-4">All Events - Last 12 hours</h2>
              <EventsChart logs={logs} />
            </div>

            {/* Security Alerts */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
              <SecurityAlerts logs={logs} />
            </div>

            {/* Geographic Map */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg lg:col-span-2`}>
              <h2 className="text-lg font-semibold mb-4">Geographic Distribution</h2>
              <GeographicMap logs={logs} />
            </div>

            {/* Top Entities */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
              <TopEntities logs={logs} />
            </div>

            {/* Events by Type Pie Chart */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
              <h2 className="text-lg font-semibold mb-4">All Events by Event Type</h2>
              <EventsByTypeChart stats={stats} />
            </div>

            {/* User Logon Chart */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
              <h2 className="text-lg font-semibold mb-4">User Logon by User</h2>
              <LogonByUserChart logs={logs} />
            </div>

            {/* Rules Fired Chart */}
            <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
              <h2 className="text-lg font-semibold mb-4">Rules Fired by Rule Name</h2>
              <RulesFiredChart logs={logs} />
            </div>
          </div>

          <FilterPanel filters={filters} onFilterChange={setFilters} darkMode={settings.darkMode} />
          
          <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
            <LogTable logs={filteredLogs} />
          </div>
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
      <History
        activities={activities}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
      <Feedback
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={(feedback) => {
          console.log('Feedback submitted:', feedback);
          // Add your feedback handling logic here
        }}
      />
    </div>
  );
}

export default App;

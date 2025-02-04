export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source?: string;
  metadata?: Record<string, any>;
  ip?: string;
  user?: string;
  action?: string;
  status?: 'success' | 'failure';
  duration?: number;
}

export interface LogStats {
  totalEntries: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  debugCount: number;
  failedLogins: number;
  avgResponseTime: number;
  topUsers: Array<{ user: string; count: number }>;
  topIPs: Array<{ ip: string; count: number }>;
}

export interface FilterOptions {
  level?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  source?: string;
  user?: string;
  ip?: string;
  status?: string;
}

export interface UserSettings {
  darkMode: boolean;
  chartAnimationSpeed: '0' | '400' | '1000';
  enableNotifications: boolean;
  alertRefreshInterval: number;
  maxEventsToDisplay: number;
  autoRefresh: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details?: string;
}
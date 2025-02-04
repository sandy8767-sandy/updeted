import { LogEntry } from '../types';

const MOCK_LEVELS = ['info', 'warn', 'error', 'debug'] as const;
const MOCK_SOURCES = ['system', 'auth', 'network', 'database', 'application'];
const MOCK_USERS = ['admin', 'john.doe', 'jane.smith', 'guest'];
const MOCK_IPS = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '192.168.0.10'];

function generateMockLog(): LogEntry {
  const level = MOCK_LEVELS[Math.floor(Math.random() * MOCK_LEVELS.length)];
  const source = MOCK_SOURCES[Math.floor(Math.random() * MOCK_SOURCES.length)];
  const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
  const ip = MOCK_IPS[Math.floor(Math.random() * MOCK_IPS.length)];

  const messages = {
    info: [
      'User logged in successfully',
      'Configuration updated',
      'Backup completed',
      'Service started',
    ],
    warn: [
      'High memory usage detected',
      'Slow query performance',
      'Rate limit approaching',
      'Certificate expiring soon',
    ],
    error: [
      'Failed login attempt',
      'Database connection lost',
      'API request failed',
      'Permission denied',
    ],
    debug: [
      'Cache hit ratio: 85%',
      'Request processing time: 150ms',
      'Connection pool status: 5/10',
      'Memory usage: 75%',
    ],
  };

  return {
    timestamp: new Date().toISOString(),
    level,
    message: messages[level][Math.floor(Math.random() * messages[level].length)],
    source,
    user,
    ip,
    action: 'system_event',
    status: Math.random() > 0.2 ? 'success' : 'failure',
    duration: Math.floor(Math.random() * 1000),
  };
}

class MockWebSocket {
  private callbacks: {
    message: ((log: LogEntry) => void)[];
    status: ((status: 'connected' | 'disconnected' | 'reconnecting') => void)[];
  } = {
    message: [],
    status: [],
  };
  private interval: NodeJS.Timeout | null = null;
  private connected = false;

  constructor() {
    // Simulate initial connection delay
    setTimeout(() => {
      this.connected = true;
      this.notifyStatusChange('connected');
      this.startGeneratingLogs();
    }, 1500);
  }

  private startGeneratingLogs() {
    // Generate a new log every 2-5 seconds
    this.interval = setInterval(() => {
      if (this.connected) {
        const log = generateMockLog();
        this.callbacks.message.forEach(cb => cb(log));
      }
    }, Math.random() * 3000 + 2000);
  }

  public onMessage(callback: (log: LogEntry) => void) {
    this.callbacks.message.push(callback);
  }

  public onStatus(callback: (status: 'connected' | 'disconnected' | 'reconnecting') => void) {
    this.callbacks.status.push(callback);
    // Immediately notify of current status
    callback(this.connected ? 'connected' : 'disconnected');
  }

  private notifyStatusChange(status: 'connected' | 'disconnected' | 'reconnecting') {
    this.callbacks.status.forEach(cb => cb(status));
  }

  public disconnect() {
    this.connected = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.notifyStatusChange('disconnected');
  }
}

export const mockWebSocket = new MockWebSocket();
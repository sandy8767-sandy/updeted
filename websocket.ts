import { LogEntry } from '../types';
import { mockWebSocket } from './mockWebSocket';

// For development, we'll use the mock WebSocket implementation
// In production, this would be replaced with a real WebSocket implementation
export const logWebSocket = mockWebSocket;
import React from 'react';
import { LogEntry } from '../types';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface LogonByUserChartProps {
  logs: LogEntry[];
}

export const LogonByUserChart: React.FC<LogonByUserChartProps> = ({ logs }) => {
  const userLogs = logs.filter(log => {
    const message = log.message?.toLowerCase() || '';
    const action = log.action?.toLowerCase() || '';
    return (
      message.includes('login') ||
      message.includes('logon') ||
      message.includes('authentication') ||
      (action.includes('auth') && log.status === 'success')
    );
  });

  const userCounts = userLogs.reduce((acc, log) => {
    const user = log.user || 'unknown';
    acc[user] = (acc[user] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort users by count and take top 5
  const topUsers = Object.entries(userCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const colors = [
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(16, 185, 129, 0.8)',  // Green
    'rgba(239, 68, 68, 0.8)',   // Red
    'rgba(234, 179, 8, 0.8)',   // Yellow
    'rgba(107, 114, 128, 0.8)', // Gray
  ];

  const data = {
    labels: topUsers.map(([user]) => user),
    datasets: [
      {
        data: topUsers.map(([, count]) => count),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 20,
          font: {
            size: 12
          }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} logins (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="h-[300px]">
      {userLogs.length > 0 ? (
        <Doughnut data={data} options={options} />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          No login data available
        </div>
      )}
    </div>
  );
};
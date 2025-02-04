import React from 'react';
import { LogEntry } from '../types';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RulesFiredChartProps {
  logs: LogEntry[];
}

export const RulesFiredChart: React.FC<RulesFiredChartProps> = ({ logs }) => {
  const ruleLogs = logs.filter(log => {
    const message = log.message?.toLowerCase() || '';
    const action = log.action?.toLowerCase() || '';
    return (
      message.includes('rule') ||
      message.includes('policy') ||
      message.includes('triggered') ||
      message.includes('matched') ||
      action.includes('rule')
    );
  });

  const ruleCounts = ruleLogs.reduce((acc, log) => {
    let ruleName = 'Unknown Rule';
    
    // Try to extract rule name from message or metadata
    const messageMatch = log.message?.match(/rule[:\s]+"?([^"]+)"?/i);
    if (messageMatch) {
      ruleName = messageMatch[1].trim();
    } else if (log.metadata?.ruleName) {
      ruleName = log.metadata.ruleName;
    } else if (log.source) {
      ruleName = log.source;
    }
    
    acc[ruleName] = (acc[ruleName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort rules by count and take top 5
  const topRules = Object.entries(ruleCounts)
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
    labels: topRules.map(([rule]) => rule),
    datasets: [
      {
        data: topRules.map(([, count]) => count),
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
            return `${label}: ${value} times (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="h-[300px]">
      {ruleLogs.length > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          No rules data available
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { LogStats } from '../types';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EventsByTypeChartProps {
  stats: LogStats;
}

export const EventsByTypeChart: React.FC<EventsByTypeChartProps> = ({ stats }) => {
  const data = {
    labels: ['Error', 'Warning', 'Info', 'Debug'],
    datasets: [
      {
        data: [stats.errorCount, stats.warnCount, stats.infoCount, stats.debugCount],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',  // Red
          'rgba(234, 179, 8, 0.8)',  // Yellow
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(107, 114, 128, 0.8)', // Gray
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(234, 179, 8)',
          'rgb(59, 130, 246)',
          'rgb(107, 114, 128)',
        ],
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
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="h-[300px]">
      {stats.totalEntries > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
};
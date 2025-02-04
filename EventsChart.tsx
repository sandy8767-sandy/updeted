import React from 'react';
import { LogEntry } from '../types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EventsChartProps {
  logs: LogEntry[];
}

export const EventsChart: React.FC<EventsChartProps> = ({ logs }) => {
  const last12Hours = [...Array(12)].map((_, i) => {
    const d = new Date();
    d.setHours(d.getHours() - (11 - i));
    return d;
  });

  const data = {
    labels: last12Hours.map(d => d.toLocaleTimeString()),
    datasets: [
      {
        label: 'Events',
        data: last12Hours.map(hour => {
          return logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.getHours() === hour.getHours();
          }).length;
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
        boxPadding: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.9)',
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.9)',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      {logs.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          No event data available
        </div>
      )}
    </div>
  );
};
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface GeographicMapProps {
  logs: LogEntry[];
}

interface Point {
  x: number;
  y: number;
  value: number;
}

export const GeographicMap: React.FC<GeographicMapProps> = ({ logs }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = mapRef.current.clientWidth;
    canvas.height = 300;

    if (!ctx) return;

    // Draw base map
    const drawMap = () => {
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw continents outline (simplified)
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // North America
      ctx.moveTo(canvas.width * 0.1, canvas.height * 0.3);
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.2);
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.4);
      
      // South America
      ctx.moveTo(canvas.width * 0.25, canvas.height * 0.5);
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.7);
      
      // Europe
      ctx.moveTo(canvas.width * 0.45, canvas.height * 0.25);
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.3);
      
      // Africa
      ctx.moveTo(canvas.width * 0.45, canvas.height * 0.4);
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.6);
      
      // Asia
      ctx.moveTo(canvas.width * 0.6, canvas.height * 0.2);
      ctx.lineTo(canvas.width * 0.8, canvas.height * 0.3);
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.5);
      
      ctx.stroke();
    };

    // Draw heatmap points
    const drawHeatmap = (points: Point[]) => {
      points.forEach(point => {
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, 30
        );
        
        gradient.addColorStop(0, `rgba(239, 68, 68, ${Math.min(point.value / 10, 0.7)})`);
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 30, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Generate sample points based on logs
    const generatePoints = () => {
      const points: Point[] = [];
      const ipCounts = new Map<string, number>();
      
      logs.forEach(log => {
        if (log.ip) {
          ipCounts.set(log.ip, (ipCounts.get(log.ip) || 0) + 1);
        }
      });

      ipCounts.forEach((count, ip) => {
        // Generate pseudo-random positions based on IP
        const hash = ip.split('.').reduce((a, b) => a + parseInt(b), 0);
        const x = (hash % 100) / 100 * canvas.width;
        const y = ((hash * 31) % 100) / 100 * canvas.height;
        
        points.push({ x, y, value: count });
      });

      return points;
    };

    drawMap();
    drawHeatmap(generatePoints());

    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(canvas);
  }, [logs]);

  return (
    <div ref={mapRef} className="h-[300px] bg-gray-800 rounded-lg relative">
      <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-75 rounded px-2 py-1 text-xs">
        Event Distribution
      </div>
    </div>
  );
};
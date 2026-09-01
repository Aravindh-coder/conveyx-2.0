import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { SensorDataPacket } from '@shared/types';

interface Props {
  data: SensorDataPacket[];
  metric: 'vibration' | 'vibration_xyz' | 'current' | 'all';
  height?: number;
}

export const TelemetryLineChart: React.FC<Props> = ({ data, metric, height = 280 }) => {
  const chartData = data.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    rms: d.vibration.rms,
    baselineRms: d.vibration.baselineRms,
    x: d.vibration.x,
    y: d.vibration.y,
    z: d.vibration.z,
    current: d.motor.current,
    baselineCurrent: d.motor.baselineCurrent,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 border border-gray-700 p-2.5 rounded-lg font-mono text-xs shadow-xl backdrop-blur-md">
          <p className="text-gray-400 mb-1 text-[10px]">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center space-x-2 my-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-300 capitalize">{entry.name}:</span>
              <span className="text-white font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis dataKey="time" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }} />
          <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />

          {metric === 'vibration' && (
            <>
              <Line type="monotone" dataKey="rms" name="RMS Vibration (g)" stroke="#10B981" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="baselineRms" name="Baseline (1.10g)" stroke="#4B5563" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
            </>
          )}

          {metric === 'vibration_xyz' && (
            <>
              <Line type="monotone" dataKey="x" name="X Axis (g)" stroke="#38BDF8" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="y" name="Y Axis (g)" stroke="#F59E0B" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="z" name="Z Axis (g)" stroke="#A855F7" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="rms" name="RMS Magnitude (g)" stroke="#10B981" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </>
          )}

          {metric === 'current' && (
            <>
              <Line type="monotone" dataKey="current" name="Motor Current (A)" stroke="#06B6D4" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="baselineCurrent" name="Baseline (0.82A)" stroke="#4B5563" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
            </>
          )}

          {metric === 'all' && (
            <>
              <Line type="monotone" dataKey="rms" name="Vibration (g)" stroke="#10B981" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="current" name="Current (A)" stroke="#06B6D4" strokeWidth={2} dot={false} isAnimationActive={false} />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

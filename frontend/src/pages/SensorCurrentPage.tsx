import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { TelemetryLineChart } from '../components/charts/TelemetryLineChart';
import { Zap, AlertTriangle } from 'lucide-react';

export const SensorCurrentPage: React.FC = () => {
  const { packet, history } = useTelemetry();
  const motorCurrent = packet?.motor.current ?? 0;
  const motorBaseline = packet?.motor.baselineCurrent ?? 0;
  const motorPeak = packet?.motor.peakCurrent ?? 0;
  const isOverload = packet?.motor.isOverload ?? false;
  const isStall = packet?.motor.isStall ?? false;

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="ACS712 Current Sensor - Motor Electrical Load Analysis"
        subtitle="Measures DC/AC Motor Current Draw to Detect Mechanical Resistance, Jam & Stall"
        badge={<StatusBadge status={isOverload ? 'WARNING' : 'NORMAL'} size="md" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <span className="text-gray-400 text-xs uppercase block">Live Load Current</span>
          <span className="text-2xl font-bold text-white mt-1 block">{motorCurrent.toFixed(2)} A</span>
          <span className="text-[11px] text-gray-500">ACS712 Output</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <span className="text-gray-400 text-xs uppercase block">Nominal Baseline</span>
          <span className="text-2xl font-bold text-gray-300 mt-1 block">{motorBaseline} A</span>
          <span className="text-[11px] text-gray-500">Unloaded baseline</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <span className="text-gray-400 text-xs uppercase block">Peak Recorded</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">{motorPeak} A</span>
          <span className="text-[11px] text-gray-500">Max in shift</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <span className="text-gray-400 text-xs uppercase block">Overload / Stall</span>
          <span className="text-xl font-bold text-rose-400 mt-1 block">
            {isStall ? 'STALL DETECTED' : isOverload ? 'OVERLOAD' : 'NOMINAL'}
          </span>
          <span className="text-[11px] text-gray-500">Safety threshold 2.2A</span>
        </div>
      </div>


      <div className="glass-panel p-5 rounded-xl border border-gray-800">
        <h3 className="text-xs font-bold text-gray-300 uppercase mb-4">
          Motor Current Load vs Baseline Trend
        </h3>
        <TelemetryLineChart data={history} metric="current" height={300} />
      </div>
    </div>
  );
};

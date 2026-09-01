import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Cpu } from 'lucide-react';
import { clsx } from 'clsx';

export const SensorAlignmentPage: React.FC = () => {
  const { packet } = useTelemetry();
  const leftActive = packet?.alignment.leftSensorActive ?? false;
  const rightActive = packet?.alignment.rightSensorActive ?? false;
  const alignStatus = packet?.alignment.status ?? 'ALIGNED';

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="IR Optical Belt Alignment & Tracking System"
        subtitle="Monitors Physical Belt Drift Left & Right using Dual Optical Reflection Sensors"
        badge={<StatusBadge status={alignStatus} size="md" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={clsx('glass-panel p-6 rounded-xl border flex flex-col justify-between space-y-4', leftActive ? 'border-rose-500 bg-rose-950/20' : 'border-gray-800')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 uppercase">Left IR Alignment Sensor (Pin D2)</span>
            <StatusBadge status={leftActive ? 'MISALIGNED_LEFT' : 'ALIGNED'} size="sm" />
          </div>
          <div className="text-center py-4">
            <span className="text-3xl font-extrabold text-white">
              {leftActive ? 'TRIGGERED (BELT DRIFT LEFT)' : 'BEAM CLEAR (CENTERED)'}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Detects belt edge shifting towards left guide frame.</span>
        </div>

        <div className={clsx('glass-panel p-6 rounded-xl border flex flex-col justify-between space-y-4', rightActive ? 'border-rose-500 bg-rose-950/20' : 'border-gray-800')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 uppercase">Right IR Alignment Sensor (Pin D3)</span>
            <StatusBadge status={rightActive ? 'MISALIGNED_RIGHT' : 'ALIGNED'} size="sm" />
          </div>
          <div className="text-center py-4">
            <span className="text-3xl font-extrabold text-white">
              {rightActive ? 'TRIGGERED (BELT DRIFT RIGHT)' : 'BEAM CLEAR (CENTERED)'}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Detects belt edge shifting towards right guide frame.</span>
        </div>
      </div>
    </div>
  );
};

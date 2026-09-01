import React from 'react';
import { ConveyorGraphic } from './ConveyorGraphic';
import { ControlPanel } from './ControlPanel';
import { useTelemetry } from '../../context/TelemetryContext';
import { StatusBadge } from '../common/StatusBadge';
import { Activity, Zap, Eye, ShieldAlert, Cpu } from 'lucide-react';

export const DigitalTwinCanvas: React.FC = () => {
  const { packet, risk, conveyor, hardwareMode } = useTelemetry();

  const riskLevel = risk?.level ?? 'NORMAL';
  const vibRms = packet?.vibration.rms.toFixed(2) ?? '—';
  const motorCurrent = packet?.motor.current.toFixed(2) ?? '—';
  const alignStatus = packet?.alignment.status ?? 'ALIGNED';
  const isLive = hardwareMode !== 'DISCONNECTED';

  return (
    <div className="space-y-6">
      {/* Conveyor Graphic Diagram */}
      <ConveyorGraphic />

      {/* Control Panel & Sensor Readout Callouts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ControlPanel />
        </div>

        {/* Live Telemetry Node Summary Box */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-gray-400 mb-3 flex items-center justify-between">
              <span>Sensor Nodes Live Telemetry</span>
              <StatusBadge status={riskLevel} size="sm" />
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">MPU6050 Vibration</span>
                </div>
                <span className="text-white font-bold">{vibRms} g RMS</span>
              </div>

              <div className="p-2.5 rounded bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300">ACS712 Motor Current</span>
                </div>
                <span className="text-white font-bold">{motorCurrent} A</span>
              </div>

              <div className="p-2.5 rounded bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span className="text-gray-300">Belt Alignment State</span>
                </div>
                <StatusBadge status={alignStatus} size="sm" />
              </div>

              <div className="p-2.5 rounded bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">Camera Inspection</span>
                </div>
                <span className="text-gray-400 text-[11px]">Future Module Connected</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] font-mono text-gray-500 flex items-center justify-between">
            <span>DIGITAL TWIN STATUS:</span>
            <span className={isLive ? 'text-emerald-400 font-bold' : 'text-gray-500 font-bold'}>
              {isLive ? 'DATA STREAMING' : 'AWAITING DATA'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

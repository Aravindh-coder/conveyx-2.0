import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { HardDrive, Cpu, Radio, Activity, Zap, Eye, CheckCircle2 } from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const { devices } = useTelemetry();

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="Hardware Device & Microcontroller Inventory"
        subtitle="Operational Connection Status of Arduino UNO, ESP32, Sensors & Interlock Actuators"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {devices.map(d => (
          <div key={d.id} className="glass-panel p-5 rounded-xl border border-gray-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={d.status} size="sm" />
                <span className="text-[10px] text-cyan-400 font-bold border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-950">
                  {d.protocol}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white mt-1">{d.name}</h4>
              <span className="text-[10px] text-gray-500">{d.id} • {d.type}</span>
              <p className="text-xs text-gray-400 font-sans mt-2">{d.description}</p>
            </div>

            <div className="pt-3 border-t border-gray-800 space-y-1 text-[11px] text-gray-400">
              <div className="flex justify-between">
                <span>Firmware Version:</span>
                <span className="text-gray-200">{d.firmwareVersion}</span>
              </div>
              {d.ipAddress && (
                <div className="flex justify-between">
                  <span>IP Address:</span>
                  <span className="text-cyan-400">{d.ipAddress}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Packets Received:</span>
                <span className="text-emerald-400 font-bold">{d.packetCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

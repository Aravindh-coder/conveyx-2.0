import React from 'react';
import { Link } from 'react-router-dom';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { SlidersHorizontal, ArrowRight, Activity, Zap, Cpu, Calendar } from 'lucide-react';

export const ConveyorListPage: React.FC = () => {
  const { conveyor, packet, risk } = useTelemetry();
  const riskScore = risk?.score ?? 0;
  const motorCurrent = packet?.motor.current.toFixed(2) ?? '—';
  const vibRms = packet?.vibration.rms.toFixed(2) ?? '—';
  const alignStatus = packet?.alignment.status ?? '—';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Beneficiation Plant Conveyor Systems"
        subtitle="Overview of all operational conveyor belts across iron ore processing lines"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        {/* Primary Prototype Conveyor 01 */}
        <Link
          to={`/conveyor/${conveyor.id}`}
          className="glass-panel glass-panel-hover rounded-xl p-6 border border-gray-800 space-y-4 block group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                  {conveyor.name}
                </h3>
                <span className="text-xs text-gray-500">{conveyor.id} • {conveyor.location}</span>
              </div>
            </div>
            <StatusBadge status={conveyor.status} size="sm" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div className="p-2.5 rounded bg-gray-900 border border-gray-800">
              <span className="text-gray-500 text-[10px] block uppercase">Health</span>
              <span className="text-emerald-400 font-bold text-sm">{conveyor.healthPercent}%</span>
            </div>
            <div className="p-2.5 rounded bg-gray-900 border border-gray-800">
              <span className="text-gray-500 text-[10px] block uppercase">Risk Score</span>
              <span className="text-white font-bold text-sm">{riskScore}/100</span>
            </div>
            <div className="p-2.5 rounded bg-gray-900 border border-gray-800">
              <span className="text-gray-500 text-[10px] block uppercase">Current</span>
              <span className="text-cyan-400 font-bold text-sm">{motorCurrent} A</span>
            </div>
            <div className="p-2.5 rounded bg-gray-900 border border-gray-800">
              <span className="text-gray-500 text-[10px] block uppercase">Vibration</span>
              <span className="text-emerald-400 font-bold text-sm">{vibRms} g</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs text-gray-400">
            <span>Alignment: <strong className="text-white">{alignStatus}</strong></span>
            <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1 font-bold">
              <span>View System Details</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

import React from 'react';
import { clsx } from 'clsx';
import { useTelemetry } from '../../context/TelemetryContext';
import { DemoScenario } from '@shared/types';
import { Play, Activity, AlertTriangle, ShieldAlert, Zap, Radio } from 'lucide-react';

export const DemoScenarioSelector: React.FC = () => {
  const { currentScenario, setScenario, hardwareMode } = useTelemetry();

  const scenarios: Array<{
    id: DemoScenario;
    label: string;
    description: string;
    icon: any;
    color: string;
  }> = [
    {
      id: 'NORMAL',
      label: 'Normal Operation',
      description: 'Belt aligned, nominal vibration (1.2g) & current (0.8A)',
      icon: Play,
      color: 'hover:border-emerald-500/50 hover:bg-emerald-950/30 text-emerald-400'
    },
    {
      id: 'MISALIGNMENT',
      label: 'Belt Misalignment',
      description: 'IR Left sensor triggers. Optical tracking shift detected',
      icon: Activity,
      color: 'hover:border-amber-500/50 hover:bg-amber-950/30 text-amber-400'
    },
    {
      id: 'HIGH_VIBRATION',
      label: 'High Vibration Spike',
      description: 'MPU6050 RMS spikes to 3.4g. Roller bearing anomaly',
      icon: Zap,
      color: 'hover:border-orange-500/50 hover:bg-orange-950/30 text-orange-400'
    },
    {
      id: 'MOTOR_OVERLOAD',
      label: 'Motor Overload Load',
      description: 'ACS712 current surges to 2.5A. Heavy ore resistance',
      icon: AlertTriangle,
      color: 'hover:border-orange-500/50 hover:bg-orange-950/30 text-orange-400'
    },
    {
      id: 'MULTI_SENSOR_ANOMALY',
      label: 'Multi-Sensor Fusion Anomaly',
      description: 'Vibration + Current + Alignment elevated simultaneously',
      icon: Radio,
      color: 'hover:border-rose-500/50 hover:bg-rose-950/30 text-rose-400'
    },
    {
      id: 'CRITICAL_FAILURE',
      label: 'Critical Rupture Risk',
      description: 'Multi-sensor score > 85. Local safety relay trips motor OFF',
      icon: ShieldAlert,
      color: 'hover:border-rose-500/50 hover:bg-rose-950/30 text-rose-400'
    }
  ];

  return (
    <div className="glass-panel rounded-xl p-4 border border-cyan-500/30 bg-cyan-950/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300">
            Telemetry Simulation & Anomaly Testing Suite
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-gray-400">
            Backend Telemetry Stream:
          </span>
          <span className={clsx('text-xs font-mono px-2 py-0.5 rounded border font-semibold',
            hardwareMode === 'LIVE_HARDWARE' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
            hardwareMode === 'SIMULATION' ? 'bg-amber-950 text-amber-400 border-amber-500/40' :
            'bg-gray-900 text-gray-500 border-gray-700'
          )}>
            {hardwareMode === 'LIVE_HARDWARE' ? 'LIVE HARDWARE' :
             hardwareMode === 'SIMULATION' ? 'SIMULATION ACTIVE' : 'NO DATA'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {scenarios.map(sc => {
          const Icon = sc.icon;
          const isActive = currentScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setScenario(sc.id)}
              className={clsx(
                'p-3 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between group relative overflow-hidden',
                isActive
                  ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border-gray-800 bg-gray-900/60 ' + sc.color
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={clsx('w-4 h-4', isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400')} />
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </div>
              <div>
                <span className={clsx('text-xs font-mono font-bold block leading-tight mb-1', isActive ? 'text-cyan-200' : 'text-gray-200')}>
                  {sc.label}
                </span>
                <span className="text-[10px] text-gray-400 line-clamp-2 leading-tight">
                  {sc.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

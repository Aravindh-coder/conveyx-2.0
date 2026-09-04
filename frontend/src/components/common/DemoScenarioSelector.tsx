import React from 'react';
import { clsx } from 'clsx';
import { useTelemetry } from '../../context/TelemetryContext';
import { DemoScenario } from '@shared/types';
import { Play, Activity, AlertTriangle, ShieldAlert, Zap, Radio, Thermometer, Gauge, Eye, WifiOff, RefreshCw } from 'lucide-react';

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
      label: '1. NORMAL',
      description: 'Belt aligned, nominal vibration (1.2g), current (0.8A)',
      icon: Play,
      color: 'hover:border-emerald-500/50 hover:bg-emerald-950/30 text-emerald-400'
    },
    {
      id: 'VIBRATION_WARNING',
      label: '2. VIBRATION',
      description: 'MPU6050 RMS spikes to 3.42g. Bearing wear',
      icon: Activity,
      color: 'hover:border-amber-500/50 hover:bg-amber-950/30 text-amber-400'
    },
    {
      id: 'HIGH_CURRENT',
      label: '3. HIGH CURRENT',
      description: 'ACS712 current surges to 2.48A. Overload',
      icon: Zap,
      color: 'hover:border-amber-500/50 hover:bg-amber-950/30 text-amber-400'
    },
    {
      id: 'TEMPERATURE_WARNING',
      label: '4. TEMP WARNING',
      description: 'DS18B20 temp exceeds 68°C. Roller heating',
      icon: Thermometer,
      color: 'hover:border-amber-500/50 hover:bg-amber-950/30 text-amber-400'
    },
    {
      id: 'RPM_ABNORMAL',
      label: '5. RPM ABNORMAL',
      description: 'A3144 Hall reads speed drop / belt slip',
      icon: Gauge,
      color: 'hover:border-amber-500/50 hover:bg-amber-950/30 text-amber-400'
    },
    {
      id: 'VISION_ANOMALY',
      label: '6. VISION ANOMALY',
      description: 'Camera detects longitudinal tear defect',
      icon: Eye,
      color: 'hover:border-cyan-500/50 hover:bg-cyan-950/30 text-cyan-400'
    },
    {
      id: 'CRITICAL_FAULT',
      label: '7. CRITICAL FAULT',
      description: 'Auto-shutdown + SOS sent + Incident',
      icon: ShieldAlert,
      color: 'hover:border-rose-500/50 hover:bg-rose-950/30 text-rose-400 font-bold'
    },
    {
      id: 'SENSOR_OFFLINE',
      label: '8. OFFLINE',
      description: 'Simulate telemetry signal disconnect',
      icon: WifiOff,
      color: 'hover:border-gray-500/50 hover:bg-gray-900 text-gray-400'
    },
    {
      id: 'RECOVERY',
      label: '9. RECOVERY',
      description: 'Reset system to RUNNING & resolve incidents',
      icon: RefreshCw,
      color: 'hover:border-emerald-500/50 hover:bg-emerald-950/30 text-emerald-300 font-bold'
    }
  ];

  return (
    <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/30 bg-cyan-950/10 space-y-2.5 font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            Enterprise Interactive Fault Injection & Live Benchmark Panel
          </h3>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            DEMO / SIMULATED DATA
          </span>
          <span className={clsx('text-[10px] px-2 py-0.5 rounded border font-bold',
            hardwareMode === 'LIVE_HARDWARE' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
            hardwareMode === 'SIMULATION' ? 'bg-amber-950 text-amber-400 border-amber-500/40' :
            'bg-gray-900 text-gray-500 border-gray-700'
          )}>
            {hardwareMode === 'LIVE_HARDWARE' ? 'LIVE HARDWARE' :
             hardwareMode === 'SIMULATION' ? 'SIMULATION MODE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-2">
        {scenarios.map(sc => {
          const Icon = sc.icon;
          const isActive = currentScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setScenario(sc.id)}
              className={clsx(
                'p-2 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between group min-w-0 overflow-hidden',
                isActive
                  ? 'border-cyan-400 bg-cyan-950/90 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'border-gray-800 bg-gray-950/80 ' + sc.color
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={clsx('w-3.5 h-3.5 shrink-0', isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-cyan-300')} />
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />}
              </div>
              <div className="min-w-0">
                <span className={clsx('text-[10px] font-bold block truncate leading-tight mb-0.5', isActive ? 'text-cyan-200' : 'text-gray-200')} title={sc.label}>
                  {sc.label}
                </span>
                <span className="text-[9px] text-gray-400 line-clamp-2 leading-tight font-sans">
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

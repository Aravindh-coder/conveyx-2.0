import React from 'react';
import { clsx } from 'clsx';
import { Cpu, BarChart2, Layers, ShieldCheck, Bell, PowerOff } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export const PipelineVisualizer: React.FC = () => {
  const { risk, packet, conveyor } = useTelemetry();

  // Graceful no-data states
  const vib = packet?.vibration.rms.toFixed(2) ?? '—';
  const curr = packet?.motor.current.toFixed(2) ?? '—';
  const align = packet?.alignment.status ?? '—';
  const riskScore = risk?.score ?? 0;
  const riskLevel = risk?.level ?? 'NORMAL';
  const vibContrib = risk?.contributors.vibration ?? 0;
  const currContrib = risk?.contributors.current ?? 0;
  const hasData = !!packet;

  const steps = [
    {
      id: 'SENSE',
      title: '1. SENSE',
      desc: 'ESP32 / Raspberry Pi 3B+ / MPU6050 / ACS712',
      active: hasData,
      icon: Cpu,
      statusText: hasData ? `${vib}g | ${curr}A` : 'Awaiting hardware…'
    },
    {
      id: 'ANALYZE',
      title: '2. ANALYZE',
      desc: 'Signal Extraction & Trend Filtering',
      active: hasData,
      icon: BarChart2,
      statusText: hasData ? align : '—'
    },
    {
      id: 'FUSE',
      title: '3. FUSE',
      desc: 'Multi-Sensor Risk Matrix',
      active: hasData,
      icon: Layers,
      statusText: hasData ? `Vib +${vibContrib} | Curr +${currContrib}` : '—'
    },
    {
      id: 'PREDICT',
      title: '4. PREDICT',
      desc: 'Rupture & Damage Failure Risk Score',
      active: hasData,
      icon: ShieldCheck,
      statusText: hasData ? `Risk: ${riskScore}/100 (${riskLevel})` : '—'
    },
    {
      id: 'ALERT',
      title: '5. ALERT',
      desc: 'Control Room Notification',
      active: riskScore > 30,
      icon: Bell,
      statusText: riskScore > 30 ? 'WARNING GENERATED' : 'NOMINAL'
    },
    {
      id: 'PROTECT',
      title: '6. PROTECT',
      desc: 'Local Relay Hardware Cutoff',
      active: conveyor.status === 'EMERGENCY_STOP' || riskLevel === 'CRITICAL',
      icon: PowerOff,
      statusText: conveyor.status === 'EMERGENCY_STOP' ? 'RELAY TRIPPED' : 'SAFETY ARMED'
    }
  ];

  return (
    <div className="glass-panel rounded-xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
          Real-Time Sensor Fusion & Predictive Safety Pipeline
        </h4>
        <span className="text-[11px] font-mono text-cyan-400">Multi-Sensor Fusion Architecture</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((st, i) => {
          const Icon = st.icon;
          const isCritical = st.id === 'PROTECT' && conveyor.status === 'EMERGENCY_STOP';
          return (
            <div
              key={st.id}
              className={clsx(
                'p-3 rounded-lg border flex flex-col justify-between relative transition-all duration-200',
                isCritical
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse'
                  : st.active
                  ? 'bg-gray-900/80 border-cyan-500/40 text-cyan-300'
                  : 'bg-gray-900/30 border-gray-800 text-gray-500'
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={clsx('w-4 h-4', isCritical ? 'text-rose-400' : 'text-cyan-400')} />
                <span className="text-[10px] font-mono text-gray-500">{i + 1}/6</span>
              </div>
              <div>
                <span className="text-xs font-mono font-bold block text-white mb-0.5">{st.title}</span>
                <span className="text-[10px] text-gray-400 block leading-tight mb-2">{st.desc}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/5 block text-center truncate">
                  {st.statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

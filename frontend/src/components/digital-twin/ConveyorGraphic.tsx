import React from 'react';
import { clsx } from 'clsx';
import { useTelemetry } from '../../context/TelemetryContext';

export const ConveyorGraphic: React.FC = () => {
  const { packet, risk, conveyor } = useTelemetry();
  const isRunning = conveyor.status === 'RUNNING';
  const isEmergency = conveyor.status === 'EMERGENCY_STOP';
  const isFault = conveyor.status === 'FAULT';

  // Null-safe sensor state — shows inert/idle values when no hardware data available
  const isLeftMisaligned = packet?.alignment.leftSensorActive ?? false;
  const isRightMisaligned = packet?.alignment.rightSensorActive ?? false;
  const isHighVib = (packet?.vibration.rms ?? 0) > 2.8;
  const isHighCurr = (packet?.motor.isOverload ?? false) || (packet?.motor.isStall ?? false);
  const riskLevel = risk?.level ?? 'NORMAL';
  const motorCurrent = packet?.motor.current.toFixed(2) ?? '—';
  const vibRms = packet?.vibration.rms.toFixed(2) ?? '—';

  // Vertical belt displacement for alignment drift visualization
  const beltYOffset = isLeftMisaligned ? -12 : isRightMisaligned ? 12 : 0;

  return (
    <div className="w-full relative glass-panel rounded-xl p-6 border border-gray-800 bg-gray-950/80 overflow-hidden flex flex-col items-center justify-center">
      {/* Background Status Ambient Glow */}
      <div
        className={clsx(
          'absolute inset-0 opacity-15 pointer-events-none transition-all duration-500',
          isEmergency || isFault || riskLevel === 'CRITICAL'
            ? 'bg-rose-500'
            : riskLevel === 'HIGH_RISK'
            ? 'bg-orange-500'
            : riskLevel === 'WARNING'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        )}
      />

      <div className="w-full flex items-center justify-between mb-4 z-10">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            SYSTEM DIGITAL TWIN: {conveyor.id}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-gray-300">
            5V DC Motor + Belt Assembly
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-gray-400">STATUS:</span>
          <span
            className={clsx(
              'font-bold px-2.5 py-0.5 rounded border',
              isRunning
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                : isEmergency
                ? 'bg-rose-950 text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-gray-800 text-gray-400 border-gray-700'
            )}
          >
            {conveyor.status}
          </span>
        </div>
      </div>

      {/* SVG Canvas Visualization */}
      <div className="w-full max-w-4xl relative py-6">
        <svg viewBox="0 0 900 320" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="50%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>

            <linearGradient id="beltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1F2937" />
              <stop offset="50%" stopColor="#111827" />
              <stop offset="100%" stopColor="#0B0F17" />
            </linearGradient>

            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Frame Base Structure */}
          <rect x="100" y="240" width="700" height="14" rx="4" fill="url(#metalGrad)" stroke="#4B5563" strokeWidth="1" />
          <rect x="180" y="254" width="20" height="40" fill="#1F2937" stroke="#374151" />
          <rect x="440" y="254" width="20" height="40" fill="#1F2937" stroke="#374151" />
          <rect x="700" y="254" width="20" height="40" fill="#1F2937" stroke="#374151" />
          <rect x="150" y="290" width="600" height="10" fill="#111827" />

          {/* Drive Motor Assembly (Left) */}
          <g transform="translate(100, 160)">
            <rect
              x="-40"
              y="-40"
              width="60"
              height="80"
              rx="6"
              fill={isHighCurr ? '#7F1D1D' : '#1E293B'}
              stroke={isHighCurr ? '#EF4444' : '#06B6D4'}
              strokeWidth="2"
            />
            <circle cx="-10" cy="0" r="18" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            {isRunning && (
              <line x1="-10" y1="-14" x2="-10" y2="14" stroke="#38BDF8" strokeWidth="3" className="animate-spin origin-[center_center]" />
            )}
            <text x="-35" y="55" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold">
              ACS712 Motor
            </text>
            <text x="-35" y="68" fill={isHighCurr ? '#F87171' : '#38BDF8'} fontSize="11" fontFamily="monospace" fontWeight="bold">
              {motorCurrent} A
            </text>
          </g>

          {/* Drive Pulley (Left Roller) */}
          <circle cx="160" cy="160" r="45" fill="url(#metalGrad)" stroke="#64748B" strokeWidth="3" />
          <circle cx="160" cy="160" r="12" fill="#0B0F17" stroke="#06B6D4" strokeWidth="2" />

          {/* MPU6050 Vibration Sensor Node (Drive Bearing) */}
          <g transform="translate(160, 100)">
            <circle
              cx="0"
              cy="0"
              r="14"
              fill={isHighVib ? '#991B1B' : '#064E3B'}
              stroke={isHighVib ? '#EF4444' : '#10B981'}
              strokeWidth="2"
              className={isHighVib ? 'animate-ping' : ''}
            />
            <circle cx="0" cy="0" r="8" fill={isHighVib ? '#EF4444' : '#10B981'} />
            <text x="-40" y="-22" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold">
              MPU6050 Vib
            </text>
            <text x="-40" y="-10" fill={isHighVib ? '#F87171' : '#34D399'} fontSize="11" fontFamily="monospace" fontWeight="bold">
              {vibRms}g RMS
            </text>
          </g>

          {/* Tail Pulley (Right Roller) */}
          <circle cx="740" cy="160" r="45" fill="url(#metalGrad)" stroke="#64748B" strokeWidth="3" />
          <circle cx="740" cy="160" r="12" fill="#0B0F17" stroke="#475569" strokeWidth="2" />

          {/* Intermediate Idler Support Rollers */}
          {[280, 400, 520, 640].map((rx, idx) => (
            <g key={idx} transform={`translate(${rx}, 190)`}>
              <circle cx="0" cy="0" r="16" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
            </g>
          ))}

          {/* IR Left & Right Alignment Sensors (Center Belt Zone) */}
          {/* Left IR Sensor (Top Side) */}
          <g transform="translate(450, 80)">
            <rect
              x="-25"
              y="-15"
              width="50"
              height="24"
              rx="4"
              fill={isLeftMisaligned ? '#7F1D1D' : '#1E293B'}
              stroke={isLeftMisaligned ? '#EF4444' : '#3B82F6'}
              strokeWidth="2"
            />
            <text x="-20" y="2" fill={isLeftMisaligned ? '#F87171' : '#60A5FA'} fontSize="10" fontFamily="monospace" fontWeight="bold">
              IR-L {isLeftMisaligned ? 'TRIGGER' : 'CLEAR'}
            </text>
          </g>

          {/* Right IR Sensor (Bottom Side) */}
          <g transform="translate(450, 245)">
            <rect
              x="-25"
              y="-15"
              width="50"
              height="24"
              rx="4"
              fill={isRightMisaligned ? '#7F1D1D' : '#1E293B'}
              stroke={isRightMisaligned ? '#EF4444' : '#3B82F6'}
              strokeWidth="2"
            />
            <text x="-20" y="2" fill={isRightMisaligned ? '#F87171' : '#60A5FA'} fontSize="10" fontFamily="monospace" fontWeight="bold">
              IR-R {isRightMisaligned ? 'TRIGGER' : 'CLEAR'}
            </text>
          </g>

          {/* Conveyor Belt Path (Upper & Lower Strands) */}
          <g transform={`translate(0, ${beltYOffset})`} className="transition-transform duration-300">
            {/* Top Carrying Belt Strand */}
            <rect
              x="160"
              y="112"
              width="580"
              height="16"
              rx="3"
              fill="url(#beltGrad)"
              stroke={isLeftMisaligned || isRightMisaligned ? '#EF4444' : '#475569'}
              strokeWidth="2"
            />

            {/* Belt Splice / Joint Section Callout */}
            <g transform="translate(360, 112)">
              <rect x="0" y="0" width="12" height="16" fill="#F59E0B" opacity="0.8" />
              <text x="-15" y="-12" fill="#FBBF24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Belt Joint / Splice
              </text>
            </g>

            {/* Animated Dashed Motion Overlay */}
            {isRunning && (
              <line
                x1="160"
                y1="120"
                x2="740"
                y2="120"
                stroke="#06B6D4"
                strokeWidth="4"
                className="animate-belt"
              />
            )}

            {/* Bottom Return Belt Strand */}
            <rect
              x="160"
              y="192"
              width="580"
              height="12"
              rx="3"
              fill="url(#beltGrad)"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {isRunning && (
              <line
                x1="740"
                y1="198"
                x2="160"
                y2="198"
                stroke="#0284C7"
                strokeWidth="3"
                className="animate-belt"
              />
            )}
          </g>

          {/* Direction Indicator Arrows */}
          {isRunning && (
            <g transform="translate(450, 120)">
              <polygon points="0,-6 14,0 0,6" fill="#22D3EE" />
              <polygon points="40,-6 54,0 40,6" fill="#22D3EE" />
            </g>
          )}
        </svg>
      </div>

      {/* Sensor Legend & Hardware Semantics Footer */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-800 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className={clsx('w-3 h-3 rounded-full', isHighVib ? 'bg-rose-500 animate-ping' : 'bg-emerald-400')} />
          <span className="text-gray-300">MPU6050: Vibration</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={clsx('w-3 h-3 rounded-full', isHighCurr ? 'bg-rose-500 animate-ping' : 'bg-emerald-400')} />
          <span className="text-gray-300">ACS712: Current Load</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={clsx('w-3 h-3 rounded-full', isLeftMisaligned || isRightMisaligned ? 'bg-amber-500 animate-ping' : 'bg-emerald-400')} />
          <span className="text-gray-300">IR Left/Right: Alignment</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className="text-gray-300">Camera: Future Crack/Tear</span>
        </div>
      </div>
    </div>
  );
};

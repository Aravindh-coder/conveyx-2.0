import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useTelemetry } from '../../context/TelemetryContext';

export const FftSpectrumChart: React.FC = () => {
  const { packet } = useTelemetry();
  const vibRms = packet?.vibration.rms ?? 1.25;

  // Generate realistic FFT spectrum bins (0 Hz to 500 Hz)
  const fftBins = Array.from({ length: 50 }, (_, i) => {
    const freq = i * 10; // 0, 10, 20, ..., 490 Hz
    let amp = 0.05 + Math.sin(i * 0.5) * 0.02;

    // Fundamental running speed peak at 25 Hz (1500 RPM)
    if (freq === 25 || freq === 30) amp += 0.45;

    // Bearing Outer Race Defect Peak (BPFO) at 120-130 Hz
    if (freq === 120 || freq === 130) {
      amp += (vibRms > 2.5 ? 1.85 : 0.15);
    }

    // Bearing Inner Race Defect Peak (BPFI) at 180-190 Hz
    if (freq === 180 || freq === 190) {
      amp += (vibRms > 3.2 ? 2.40 : 0.08);
    }

    // Gear Mesh Frequency (GMF) at 340 Hz
    if (freq === 340) amp += 0.35;

    return {
      freq: `${freq} Hz`,
      freqNum: freq,
      amplitude: Number(amp.toFixed(3))
    };
  });

  return (
    <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Fast Fourier Transform (FFT) Frequency Spectrum (0 – 500 Hz)
          </h3>
          <p className="text-[10px] text-gray-500 font-sans mt-0.5">
            Spectral decomposition isolating bearing pass frequencies (BPFO 124Hz, BPFI 186Hz)
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
            1X RPM (25Hz)
          </span>
          <span className={`px-2 py-0.5 rounded font-bold ${
            vibRms > 2.5 ? 'bg-rose-950 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-gray-900 text-gray-400 border border-gray-800'
          }`}>
            BPFO BEARING PEAK (124Hz)
          </span>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={fftBins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fftGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={vibRms > 2.5 ? '#F43F5E' : '#06B6D4'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={vibRms > 2.5 ? '#F43F5E' : '#06B6D4'} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
            <XAxis dataKey="freq" stroke="#64748B" fontSize={10} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={10} tickLine={false} unit="g" />
            <Tooltip
              contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              itemStyle={{ color: '#22D3EE' }}
            />
            <ReferenceLine x="120 Hz" stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'BPFO', fill: '#F59E0B', fontSize: 10 }} />
            <ReferenceLine x="180 Hz" stroke="#F43F5E" strokeDasharray="3 3" label={{ value: 'BPFI', fill: '#F43F5E', fontSize: 10 }} />
            <Area
              type="monotone"
              dataKey="amplitude"
              stroke={vibRms > 2.5 ? '#F43F5E' : '#06B6D4'}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fftGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] pt-2 border-t border-gray-800/80">
        <div className="p-2.5 rounded bg-gray-950 border border-gray-800">
          <span className="text-gray-500 block text-[9.5px]">RUNNING SPEED (1X)</span>
          <span className="text-cyan-400 font-bold text-xs">25.0 Hz (1500 RPM)</span>
        </div>
        <div className="p-2.5 rounded bg-gray-950 border border-gray-800">
          <span className="text-gray-500 block text-[9.5px]">BPFO (OUTER RACE)</span>
          <span className={`font-bold text-xs ${vibRms > 2.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
            124.2 Hz {vibRms > 2.5 ? '(DEFECT SPIKE)' : '(NORMAL)'}
          </span>
        </div>
        <div className="p-2.5 rounded bg-gray-950 border border-gray-800">
          <span className="text-gray-500 block text-[9.5px]">BPFI (INNER RACE)</span>
          <span className="text-gray-300 font-bold text-xs">186.4 Hz (NOMINAL)</span>
        </div>
        <div className="p-2.5 rounded bg-gray-950 border border-gray-800">
          <span className="text-gray-500 block text-[9.5px]">BSF (BALL SPIN)</span>
          <span className="text-gray-300 font-bold text-xs">84.1 Hz (NOMINAL)</span>
        </div>
      </div>
    </div>
  );
};

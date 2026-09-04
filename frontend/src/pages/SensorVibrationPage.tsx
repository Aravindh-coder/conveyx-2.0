import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { TelemetryLineChart } from '../components/charts/TelemetryLineChart';
import { FftSpectrumChart } from '../components/charts/FftSpectrumChart';
import { Activity, ShieldAlert, CheckCircle2, BarChart2 } from 'lucide-react';

export const SensorVibrationPage: React.FC = () => {
  const { packet, history } = useTelemetry();
  const vibRms = packet?.vibration.rms ?? 0;
  const vibBaseline = packet?.vibration.baselineRms ?? 1.10;
  const isHigh = vibRms > 2.8;

  return (
    <div className="space-y-6 font-mono select-none">
      <PageHeader
        title="MPU6050 Accelerometer - Vibration & Spectral Frequency Analysis"
        subtitle="3-Axis Drive Roller Bearing Vibration Magnitude, RMS Noise & Fast Fourier Transform (FFT)"
        badge={<StatusBadge status={isHigh ? 'WARNING' : 'NORMAL'} size="md" />}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <span className="text-gray-400 text-xs uppercase block">RMS Vibration</span>
          <span className="text-2xl font-bold text-white mt-1 block">{vibRms.toFixed(2)} g</span>
          <span className="text-[11px] text-gray-500">Root Mean Square</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <span className="text-gray-400 text-xs uppercase block">Normal Baseline</span>
          <span className="text-2xl font-bold text-gray-300 mt-1 block">{vibBaseline} g</span>
          <span className="text-[11px] text-gray-500 font-mono">Zero-point baseline</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <span className="text-gray-400 text-xs uppercase block">Anomaly Threshold</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">2.80 g</span>
          <span className="text-[11px] text-gray-500 font-mono">Warning threshold</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <span className="text-gray-400 text-xs uppercase block">Critical Threshold</span>
          <span className="text-2xl font-bold text-rose-400 mt-1 block">4.00 g</span>
          <span className="text-[11px] text-gray-500 font-mono">Trip threshold</span>
        </div>
      </div>

      {/* FFT Frequency Spectrum Chart (Hz vs Amplitude) */}
      <FftSpectrumChart />

      {/* Live Time Series Chart */}
      <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
        <h3 className="text-xs font-bold text-gray-300 uppercase">
          Continuous Time-Domain Acceleration (X, Y, Z Axes & RMS Overlay)
        </h3>
        <TelemetryLineChart data={history} metric="vibration_xyz" height={280} />
      </div>
    </div>
  );
};

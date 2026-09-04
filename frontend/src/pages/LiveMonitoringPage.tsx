import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { TelemetryLineChart } from '../components/charts/TelemetryLineChart';
import { ThermalHeatmapCanvas } from '../components/digital-twin/ThermalHeatmapCanvas';
import { Activity, Zap, Cpu, Wifi, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';
import { clsx } from 'clsx';

export const LiveMonitoringPage: React.FC = () => {
  const { packet, conveyor, hardwareMode, isHardwareConnected, history, currentScenario } = useTelemetry();

  // Null-safe sensor values — shows idle defaults when no hardware data
  const vibX = packet?.vibration.x ?? 0;
  const vibY = packet?.vibration.y ?? 0;
  const vibZ = packet?.vibration.z ?? 0;
  const vibRms = packet?.vibration.rms ?? 0;
  const vibBaseline = packet?.vibration.baselineRms ?? 0;
  const motorCurrent = packet?.motor.current ?? 0;
  const motorBaseline = packet?.motor.baselineCurrent ?? 0;
  const motorPeak = packet?.motor.peakCurrent ?? 0;
  const isOverload = packet?.motor.isOverload ?? false;
  const alignStatus = packet?.alignment.status ?? 'ALIGNED';
  const leftIR = packet?.alignment.leftSensorActive ?? false;
  const rightIR = packet?.alignment.rightSensorActive ?? false;
  const hasData = !!packet;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Real-Time Hardware Sensor Telemetry Monitor"
        subtitle="Live Stream from ESP32 Microcontroller & Raspberry Pi 3B+ Edge Gateway"
        badge={
          <span className={clsx('px-3 py-1 rounded-full font-mono text-xs font-bold border',
            hardwareMode === 'LIVE_HARDWARE' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
            hardwareMode === 'SIMULATION' ? 'bg-amber-950 text-amber-400 border-amber-500/40' :
            'bg-gray-900 text-gray-400 border-gray-700'
          )}>
            {hardwareMode === 'LIVE_HARDWARE' ? 'LIVE HARDWARE STREAM' :
             hardwareMode === 'SIMULATION' ? 'SIMULATION STREAM' : 'NO DATA SOURCE'}
          </span>
        }
      />

      {/* Mode indicator banner */}
      {hardwareMode === 'SIMULATION' && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-bold">SIMULATION ACTIVE:</span>
            <span>Simulating physical sensor outputs for scenario: <strong className="text-white">{currentScenario}</strong></span>
          </div>
          <span className="text-[10px] text-amber-400 uppercase">Synthetic Data — Not Live</span>
        </div>
      )}
      {hardwareMode === 'LIVE_HARDWARE' && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold">HARDWARE CONNECTED:</span>
            <span>Live sensor data stream from ESP32 → Raspberry Pi 3B+ Gateway</span>
          </div>
          <span className="text-[10px] text-emerald-400 uppercase">Real-Time Live Data</span>
        </div>
      )}

      {/* Live Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MPU6050 Vibration Telemetry */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-mono text-xs font-bold text-white uppercase">MPU6050 Accelerometer</h3>
                <span className="text-[10px] text-gray-500 font-mono">I2C Address: 0x68</span>
              </div>
            </div>
            <StatusBadge status={vibRms > 2.8 ? 'WARNING' : 'NORMAL'} size="sm" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 bg-gray-900 rounded border border-gray-800">
              <span className="text-[10px] text-gray-500 block">X-AXIS</span>
              <span className="text-sm font-bold text-white">{vibX} g</span>
            </div>
            <div className="p-2 bg-gray-900 rounded border border-gray-800">
              <span className="text-[10px] text-gray-500 block">Y-AXIS</span>
              <span className="text-sm font-bold text-white">{vibY} g</span>
            </div>
            <div className="p-2 bg-gray-900 rounded border border-gray-800">
              <span className="text-[10px] text-gray-500 block">Z-AXIS</span>
              <span className="text-sm font-bold text-white">{vibZ} g</span>
            </div>
          </div>

          <div className="p-3 bg-gray-900/80 rounded border border-gray-800 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">RMS Vibration Magnitude:</span>
              <span className="text-emerald-400 font-bold">{vibRms.toFixed(2)} g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Normal Baseline:</span>
              <span className="text-gray-500">{vibBaseline} g</span>
            </div>
          </div>
        </div>

        {/* ACS712 Motor Current Telemetry */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-mono text-xs font-bold text-white uppercase">ACS712 Current Sensor</h3>
                <span className="text-[10px] text-gray-500 font-mono">Analog Pin A0</span>
              </div>
            </div>
            <StatusBadge status={isOverload ? 'WARNING' : 'NORMAL'} size="sm" />
          </div>

          <div className="p-4 bg-gray-900/90 rounded border border-gray-800 font-mono text-center">
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Motor Load Current</span>
            <span className="text-3xl font-extrabold text-white block my-1">
              {motorCurrent.toFixed(2)} <span className="text-sm font-normal text-cyan-400">Amperes</span>
            </span>
          </div>

          <div className="p-3 bg-gray-900/80 rounded border border-gray-800 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Baseline Load Current:</span>
              <span className="text-gray-300 font-bold">{motorBaseline} A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Peak Load Current:</span>
              <span className="text-amber-400 font-bold">{motorPeak} A</span>
            </div>
          </div>
        </div>

        {/* IR Alignment Array Telemetry */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-mono text-xs font-bold text-white uppercase">IR Optical Alignment</h3>
                <span className="text-[10px] text-gray-500 font-mono">Pins D2 & D3</span>
              </div>
            </div>
            <StatusBadge status={alignStatus} size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className={clsx('p-3 rounded border text-center', leftIR ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-gray-900 border-gray-800 text-gray-400')}>
              <span className="block font-bold mb-1">Left IR Sensor</span>
              <span className="text-[11px]">{leftIR ? 'TRIGGERED (DRIFT)' : 'CLEAR'}</span>
            </div>

            <div className={clsx('p-3 rounded border text-center', rightIR ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-gray-900 border-gray-800 text-gray-400')}>
              <span className="block font-bold mb-1">Right IR Sensor</span>
              <span className="text-[11px]">{rightIR ? 'TRIGGERED (DRIFT)' : 'CLEAR'}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-900/80 rounded border border-gray-800 font-mono text-xs text-gray-400">
            <span>Tracking State: </span>
            <strong className="text-white uppercase">{alignStatus}</strong>
          </div>
        </div>
      </div>

      {/* Infrared Thermal Heatmap Array */}
      <ThermalHeatmapCanvas />

      {/* Real-time Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-xl border border-gray-800">
          <h3 className="font-mono text-xs font-bold text-gray-300 uppercase mb-4">
            Vibration X, Y, Z & RMS Spectrum
          </h3>
          <TelemetryLineChart data={history} metric="vibration_xyz" height={260} />
        </div>

        <div className="glass-panel p-5 rounded-xl border border-gray-800">
          <h3 className="font-mono text-xs font-bold text-gray-300 uppercase mb-4">
            ACS712 Motor Current Load vs Baseline
          </h3>
          <TelemetryLineChart data={history} metric="current" height={260} />
        </div>
      </div>
    </div>
  );
};

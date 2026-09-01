import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { DemoScenarioSelector } from '../components/common/DemoScenarioSelector';
import { PipelineVisualizer } from '../components/common/PipelineVisualizer';
import { ConveyorGraphic } from '../components/digital-twin/ConveyorGraphic';
import { ControlPanel } from '../components/digital-twin/ControlPanel';
import { PlaySquare, ShieldAlert, Award, ArrowRight, Activity, Zap, Cpu, CheckCircle2 } from 'lucide-react';
import { DemoScenario } from '@shared/types';
import { clsx } from 'clsx';

export const SihJudgeDemoPage: React.FC = () => {
  const { conveyor, packet, risk, currentScenario, setScenario, sendMotorCommand } = useTelemetry();
  const riskScore = risk?.score ?? 0;
  const vibRms = packet?.vibration.rms.toFixed(2) ?? '—';
  const motorCurrent = packet?.motor.current.toFixed(2) ?? '—';
  const alignStatus = packet?.alignment.status ?? '—';

  const scenarios: Array<{ id: DemoScenario; label: string; stepText: string; highlight: string }> = [
    { id: 'NORMAL', label: '1. Normal Operation', stepText: 'Nominal readings. Health 94%. Motor RUNNING.', highlight: 'text-emerald-400' },
    { id: 'MISALIGNMENT', label: '2. Belt Misalignment', stepText: 'IR Left sensor triggers. Belt tracking shift.', highlight: 'text-amber-400' },
    { id: 'HIGH_VIBRATION', label: '3. Bearing Vibration Spike', stepText: 'MPU6050 spikes to 3.4g RMS. Anomaly flagged.', highlight: 'text-orange-400' },
    { id: 'MOTOR_OVERLOAD', label: '4. Motor Resistance Load', stepText: 'ACS712 current reaches 2.5A. Ore jam risk.', highlight: 'text-orange-400' },
    { id: 'MULTI_SENSOR_ANOMALY', label: '5. Multi-Sensor Fusion Risk', stepText: 'Vibration + Current + Alignment elevated. Risk 68.', highlight: 'text-rose-400' },
    { id: 'CRITICAL_FAILURE', label: '6. Critical Trip & E-Stop', stepText: 'Risk > 85. Local Arduino Relay opens. Motor OFF.', highlight: 'text-rose-500 font-extrabold' }
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Enterprise Pitch Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950 via-gray-900 to-blue-950 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500 text-black flex items-center justify-center font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-white">INDUSTRIAL SCENARIO SIMULATION & TEST BENCH</h2>
              <span className="px-2 py-0.5 rounded bg-cyan-500 text-black font-extrabold text-[10px]">ENTERPRISE</span>
            </div>
            <p className="text-xs text-gray-300 font-sans mt-0.5">
              Enterprise testing environment for telemetry validation, sensor fusion & automated hardware safety interlock cutoffs.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-gray-400">Current Test Scenario:</span>
          <span className="px-3 py-1 rounded bg-black border border-cyan-400 text-cyan-300 font-bold uppercase">
            {currentScenario}
          </span>
        </div>
      </div>

      {/* Guided Test Sequence Bar */}
      <div className="glass-panel p-4 rounded-xl border border-gray-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-300 uppercase">Interactive Telemetry Sequence (System Validation)</span>
          <span className="text-cyan-400 text-[11px]">Click any scenario to inject telemetry state</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {scenarios.map(s => (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className={clsx(
                'p-3 rounded-lg border text-left transition-all text-xs flex flex-col justify-between',
                currentScenario === s.id
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 text-gray-300'
              )}
            >
              <span className={clsx('font-bold block mb-1', s.highlight)}>{s.label}</span>
              <span className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{s.stepText}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time KPI Snapshot Header */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel p-3.5 rounded-xl border border-gray-800 text-center">
          <span className="text-gray-400 text-[10px] uppercase block">Conveyor Status</span>
          <span className="text-lg font-extrabold text-white mt-0.5 block">{conveyor.status}</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-gray-800 text-center">
          <span className="text-gray-400 text-[10px] uppercase block">Health Score</span>
          <span className="text-lg font-extrabold text-emerald-400 mt-0.5 block">{conveyor.healthPercent}%</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-gray-800 text-center">
          <span className="text-gray-400 text-[10px] uppercase block">Fused Risk Score</span>
          <span className="text-lg font-extrabold text-amber-400 mt-0.5 block">{riskScore}/100</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-gray-800 text-center">
          <span className="text-gray-400 text-[10px] uppercase block">MPU6050 Vibration</span>
          <span className="text-lg font-extrabold text-white mt-0.5 block">{vibRms} g</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-gray-800 text-center">
          <span className="text-gray-400 text-[10px] uppercase block">ACS712 Current</span>
          <span className="text-lg font-extrabold text-cyan-400 mt-0.5 block">{motorCurrent} A</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-gray-800 text-center">
          <span className="text-gray-400 text-[10px] uppercase block">IR Alignment</span>
          <span className="text-xs font-extrabold text-white mt-1 block uppercase">{alignStatus}</span>
        </div>
      </div>

      {/* 6-Phase Pipeline */}
      <PipelineVisualizer />

      {/* Live Digital Twin Visualization */}
      <ConveyorGraphic />

      {/* Motor Control Actions */}
      <ControlPanel />
    </div>
  );
};

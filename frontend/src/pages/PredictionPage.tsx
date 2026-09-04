import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskScoreGauge } from '../components/charts/RiskScoreGauge';
import { RulFaultTreeWidget } from '../components/common/RulFaultTreeWidget';
import { ShieldCheck, Activity, Zap, Cpu, Eye, AlertTriangle, Thermometer, Gauge, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export const PredictionPage: React.FC = () => {
  const { risk, packet, conveyor, latestVision } = useTelemetry();
  const riskLevel = risk?.level ?? 'NORMAL';
  const riskScore = risk?.score ?? (conveyor.riskScore || 12);
  const riskConfidence = risk?.confidence ?? 92;
  const failureProb = risk?.failureProbability ?? (riskScore / 100);
  const recommendedAction = risk?.recommendedAction ?? 'Continue continuous condition monitoring.';

  // Sensor states calculation
  const vibRms = packet?.vibration.rms ?? conveyor.vibrationRmsG ?? 1.25;
  const vibState = vibRms > 3.0 ? 'CRITICAL' : vibRms > 1.8 ? 'ELEVATED' : 'NORMAL';

  const currentA = packet?.motor.current ?? conveyor.motorCurrentA ?? 0.84;
  const currState = currentA > 2.8 ? 'CRITICAL' : currentA > 1.8 ? 'ELEVATED' : 'NORMAL';

  const tempC = packet?.temperature ?? 38.5;
  const tempState = tempC > 60 ? 'CRITICAL' : tempC > 48 ? 'ELEVATED' : 'NORMAL';

  const rpmState = conveyor.status === 'STOPPED' || conveyor.status === 'EMERGENCY_STOP' ? 'STOPPED' : 'NORMAL';

  const visionCond = latestVision?.detectedCondition ?? 'NORMAL';
  const visionState = visionCond === 'NORMAL' ? 'NORMAL' : 'ANOMALY';

  // Multimodal Correlation Text
  const correlationText = riskScore > 75
    ? "Critical multimodal correlation: Severe vibration spikes (MPU6050) detected concurrently with motor current overload (ACS712) and temperature rise. High probability of mechanical jam or bearing seizure."
    : riskScore > 40
    ? "Vibration increased relative to baseline while motor current remains elevated. Multimodal evidence indicates increased conveyor fault risk."
    : "All sensor feeds correlate within normal operating parameters. Structural and mechanical failure probability remains minimal.";

  return (
    <div className="space-y-6 font-mono select-none">
      <PageHeader
        title="Multimodal Sensor Fusion & Predictive Risk Engine"
        subtitle="Vibration (MPU6050) + Motor Current (ACS712) + Temperature (DS18B20) + RPM (A3144) + Vision"
        badge={<StatusBadge status={riskLevel} size="md" />}
      />

      {/* Prominent Demo Disclaimer Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/30 text-amber-300 text-xs">
        <div className="flex items-center space-x-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span>
            <strong className="font-bold">DEMO / SIMULATED DATA:</strong> Operational prediction model for enterprise evaluation bench. Telemetry correlates sensor feeds for real-time risk assessment.
          </span>
        </div>
      </div>

      {/* RUL & Fault Tree Analysis Widget */}
      <RulFaultTreeWidget />

      {/* Top Grid: Risk Gauge & ML Confidence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RiskScoreGauge risk={risk ?? undefined} />

        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gray-800 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Multi-Sensor Risk Matrix Diagnostics
              </h3>
              <span className="text-[11px] text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/30 font-bold">
                SENSOR FUSION ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-gray-950 rounded border border-gray-800">
                <span className="text-[10px] text-gray-500 block uppercase">Prediction Confidence</span>
                <span className="text-2xl font-bold text-cyan-400 mt-1 block">{riskConfidence}%</span>
              </div>

              <div className="p-3 bg-gray-950 rounded border border-gray-800">
                <span className="text-[10px] text-gray-500 block uppercase">Failure Probability</span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">{(failureProb * 100).toFixed(0)}%</span>
              </div>

              <div className="p-3 bg-gray-950 rounded border border-gray-800">
                <span className="text-[10px] text-gray-500 block uppercase">Safety Interlock Relay</span>
                <span className="text-sm font-bold text-emerald-400 mt-2 block">HARDWARE ARMED</span>
              </div>
            </div>

            {/* Multimodal Correlation Text Box */}
            <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Multimodal Evidence Correlation:</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{correlationText}</p>
            </div>
          </div>

          {/* Recommended Action Card */}
          <div className={clsx('p-4 rounded-xl border space-y-2 text-xs', riskLevel === 'CRITICAL' ? 'bg-rose-950/60 border-rose-500 text-rose-200' : riskLevel === 'HIGH_RISK' ? 'bg-orange-950/60 border-orange-500 text-orange-200' : 'bg-gray-900/90 border-gray-800 text-gray-200')}>
            <div className="flex items-center space-x-2 font-bold uppercase">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Recommended Operational Action:</span>
            </div>
            <p className="leading-relaxed font-sans">{recommendedAction}</p>
          </div>
        </div>
      </div>

      {/* Individual Sensor States Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Individual Sensor State Analysis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
          {/* Vibration */}
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
            <div className="flex justify-between items-center text-gray-400">
              <span className="flex items-center space-x-1.5 font-bold text-gray-300">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Vibration (MPU)</span>
              </span>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                vibState === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-500/40 animate-pulse' :
                vibState === 'ELEVATED' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              }`}>
                {vibState}
              </span>
            </div>
            <p className="text-lg font-bold text-white">{vibRms} g</p>
            <p className="text-[10px] text-gray-500">Baseline: 1.10g RMS</p>
          </div>

          {/* Motor Current */}
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
            <div className="flex justify-between items-center text-gray-400">
              <span className="flex items-center space-x-1.5 font-bold text-gray-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Current (ACS)</span>
              </span>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                currState === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-500/40 animate-pulse' :
                currState === 'ELEVATED' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              }`}>
                {currState}
              </span>
            </div>
            <p className="text-lg font-bold text-white">{currentA} A</p>
            <p className="text-[10px] text-gray-500">Baseline: 0.82A</p>
          </div>

          {/* Temperature */}
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
            <div className="flex justify-between items-center text-gray-400">
              <span className="flex items-center space-x-1.5 font-bold text-gray-300">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span>Temp (DS18B20)</span>
              </span>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                tempState === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-500/40 animate-pulse' :
                tempState === 'ELEVATED' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              }`}>
                {tempState}
              </span>
            </div>
            <p className="text-lg font-bold text-white">{tempC}°C</p>
            <p className="text-[10px] text-gray-500">Normal Range: 35–45°C</p>
          </div>

          {/* RPM */}
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
            <div className="flex justify-between items-center text-gray-400">
              <span className="flex items-center space-x-1.5 font-bold text-gray-300">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span>Speed / RPM (A3144)</span>
              </span>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                rpmState === 'STOPPED' ? 'bg-gray-800 text-gray-400' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              }`}>
                {rpmState}
              </span>
            </div>
            <p className="text-lg font-bold text-white">{rpmState === 'STOPPED' ? '0 RPM' : '1480 RPM'}</p>
            <p className="text-[10px] text-gray-500">Target: 1480 RPM</p>
          </div>

          {/* Vision */}
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
            <div className="flex justify-between items-center text-gray-400">
              <span className="flex items-center space-x-1.5 font-bold text-gray-300">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>AI Vision</span>
              </span>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                visionState === 'ANOMALY' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              }`}>
                {visionState}
              </span>
            </div>
            <p className="text-lg font-bold text-white">{visionCond}</p>
            <p className="text-[10px] text-gray-500">Camera: RTSP Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

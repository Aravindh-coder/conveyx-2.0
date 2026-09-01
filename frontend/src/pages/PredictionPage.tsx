import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskScoreGauge } from '../components/charts/RiskScoreGauge';
import { ShieldCheck, Activity, Zap, Cpu, Eye, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';

export const PredictionPage: React.FC = () => {
  const { risk, packet, conveyor } = useTelemetry();
  const riskLevel = risk?.level ?? 'NORMAL';
  const riskConfidence = risk?.confidence ?? 0;
  const failureProb = risk?.failureProbability ?? 0;
  const recommendedAction = risk?.recommendedAction ?? 'Connect hardware or enable simulation to generate risk data.';

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="Predictive Maintenance & Multi-Sensor Fusion Risk Engine"
        subtitle="Calculates Structural Integrity & Joint Rupture Failure Risk (0–100 Score Matrix)"
        badge={<StatusBadge status={riskLevel} size="md" />}
      />

      {/* Top Grid: Risk Gauge & ML Confidence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RiskScoreGauge risk={risk ?? undefined} />

        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gray-800 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Extensible Predictive Model Diagnostics
              </h3>
              <span className="text-[11px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                Multi-Sensor Fusion Architecture
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-gray-900 rounded border border-gray-800">
                <span className="text-[10px] text-gray-500 block uppercase">Prediction Confidence</span>
                <span className="text-2xl font-bold text-cyan-400 mt-1 block">{riskConfidence}%</span>
              </div>

              <div className="p-3 bg-gray-900 rounded border border-gray-800">
                <span className="text-[10px] text-gray-500 block uppercase">Failure Probability</span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">{(failureProb * 100).toFixed(0)}%</span>
              </div>

              <div className="p-3 bg-gray-900 rounded border border-gray-800">
                <span className="text-[10px] text-gray-500 block uppercase">Safety Interlock</span>
                <span className="text-sm font-bold text-emerald-400 mt-2 block">LOCAL RELAY ARMED</span>
              </div>
            </div>

            {/* Recommended Action Card */}
            <div className={clsx('p-4 rounded-xl border space-y-2', riskLevel === 'CRITICAL' ? 'bg-rose-950/60 border-rose-500 text-rose-200' : riskLevel === 'HIGH_RISK' ? 'bg-orange-950/60 border-orange-500 text-orange-200' : 'bg-gray-900/90 border-gray-800 text-gray-200')}>
              <div className="flex items-center space-x-2 font-bold text-xs uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Recommended Operational Action:</span>
              </div>
              <p className="text-xs leading-relaxed font-sans">{recommendedAction}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-500">
            DISCLAIMER: Sensor evidence is fused mathematically. Model permits drop-in replacement with trained ML classifier.
          </div>
        </div>
      </div>
    </div>
  );
};


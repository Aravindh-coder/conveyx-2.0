import React from 'react';
import { clsx } from 'clsx';
import { RiskEvaluation } from '@shared/types';
import { StatusBadge } from '../common/StatusBadge';

interface Props {
  risk?: RiskEvaluation;
}

export const RiskScoreGauge: React.FC<Props> = ({ risk }) => {
  const score = risk?.score ?? 0;
  const level = risk?.level ?? 'NORMAL';
  const confidence = risk?.confidence ?? 0;
  const failureProbability = risk?.failureProbability ?? 0;
  const contributors = risk?.contributors ?? { vibration: 0, current: 0, alignment: 0, vision: 0 };
  const recommendedAction = risk?.recommendedAction ?? 'Connect hardware or enable simulation to generate risk data.';

  const getScoreColor = (score: number) => {
    if (score >= 76) return 'text-rose-400 border-rose-500 bg-rose-950/20';
    if (score >= 56) return 'text-orange-400 border-orange-500 bg-orange-950/20';
    if (score >= 31) return 'text-amber-400 border-amber-500 bg-amber-950/20';
    return 'text-emerald-400 border-emerald-500 bg-emerald-950/20';
  };

  const getBarColor = (val: number, max: number) => {
    const ratio = val / max;
    if (ratio > 0.7) return 'bg-rose-500';
    if (ratio > 0.4) return 'bg-amber-500';
    return 'bg-cyan-500';
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-gray-800 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase font-bold text-gray-400 tracking-wider">
            Predictive Risk Score Gauge
          </span>
          <StatusBadge status={level} size="sm" />
        </div>

        {/* Big Numeric Risk Indicator */}
        <div className="flex items-center justify-center my-4">
          <div
            className={clsx(
              'w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 relative',
              getScoreColor(score)
            )}
          >
            <span className="text-xs font-mono text-gray-400 uppercase font-semibold">CONVEYOR RISK</span>
            <span className="text-4xl font-extrabold font-mono tracking-tight my-0.5">
              {score}
            </span>
            <span className="text-[11px] font-mono text-gray-400">/ 100</span>
          </div>
        </div>

        {/* Contributor Factor Progress Bars */}
        <div className="space-y-3 mt-6">
          <span className="text-xs font-mono font-semibold text-gray-400 uppercase block">
            Multi-Sensor Risk Contributors
          </span>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-gray-300">MPU6050 Vibration</span>
              <span className="text-gray-400 font-bold">+{contributors.vibration} pts</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={clsx('h-full transition-all duration-300', getBarColor(contributors.vibration, 35))}
                style={{ width: `${(contributors.vibration / 35) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-gray-300">ACS712 Motor Current</span>
              <span className="text-gray-400 font-bold">+{contributors.current} pts</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={clsx('h-full transition-all duration-300', getBarColor(contributors.current, 35))}
                style={{ width: `${(contributors.current / 35) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-gray-300">IR Belt Alignment</span>
              <span className="text-gray-400 font-bold">+{contributors.alignment} pts</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={clsx('h-full transition-all duration-300', getBarColor(contributors.alignment, 25))}
                style={{ width: `${(contributors.alignment / 25) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-gray-300">Camera Vision Model</span>
              <span className="text-gray-400 font-bold">+{contributors.vision} pts</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={clsx('h-full transition-all duration-300', getBarColor(contributors.vision, 20))}
                style={{ width: `${(contributors.vision / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-800 text-[11px] font-mono text-gray-400 flex justify-between">
        <span>MODEL CONFIDENCE:</span>
        <span className="text-cyan-400 font-bold">{confidence}%</span>
      </div>
    </div>
  );
};

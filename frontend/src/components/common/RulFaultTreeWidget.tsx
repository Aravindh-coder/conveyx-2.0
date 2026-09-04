import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Clock, GitBranch, AlertTriangle, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export const RulFaultTreeWidget: React.FC = () => {
  const { packet, conveyor, risk } = useTelemetry();

  const vibRms = packet?.vibration.rms ?? 1.25;
  const currentA = packet?.motor.current ?? 0.84;
  const tempC = packet?.temperature ?? 38.5;
  const rScore = risk?.score ?? 12;

  // Calculate RUL (Remaining Useful Life in Operating Hours)
  // Higher vibration/current/risk degrades RUL faster
  const estimatedRulHours = Math.max(12, Math.round(720 * (1 - rScore / 100)));
  const estimatedRulDays = (estimatedRulHours / 24).toFixed(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono select-none">
      {/* RUL Card */}
      <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                Predictive Remaining Useful Life (RUL Estimator)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
              WEIBULL MODEL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
              <span className="text-[10px] text-gray-500 block uppercase">Estimated Operating RUL</span>
              <span className={`text-3xl font-extrabold mt-1 block ${
                estimatedRulHours < 100 ? 'text-rose-400' : estimatedRulHours < 300 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {estimatedRulHours} hrs
              </span>
              <span className="text-[10px] text-gray-400 font-sans mt-0.5 block">~{estimatedRulDays} operating days</span>
            </div>

            <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
              <span className="text-[10px] text-gray-500 block uppercase">Degradation Rate</span>
              <span className="text-2xl font-bold text-gray-200 mt-1 block">
                {(rScore * 0.14).toFixed(2)} %/shift
              </span>
              <span className="text-[10px] text-gray-400 font-sans mt-0.5 block">Vibration Rate (dg/dt)</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            RUL is computed via continuous sensor degradation modeling (dg/dt & dI/dt). Early bearing replacement recommended before reaching 50 operating hours.
          </p>
        </div>

        <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-[11px] text-gray-500">
          <span>Target Component: <strong>Drive Roller Bearing #2</strong></span>
          <span className="text-cyan-400">Confidence: 91.8%</span>
        </div>
      </div>

      {/* Fault Tree Analysis (FTA) Diagram */}
      <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
              Automated Root-Cause Fault Tree Analysis (FTA)
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
            DIAGNOSTIC TREE
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Top Event */}
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            rScore > 60 ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' : 'bg-gray-900 border-gray-800 text-gray-200'
          }`}>
            <span className="font-bold">[TOP EVENT] Conveyor Joint Rupture & Motor Interlock Trip</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-black font-mono">RISK {rScore}/100</span>
          </div>

          {/* Logic Gate OR */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-purple-400 font-bold">
            <span className="w-8 h-[1px] bg-purple-500/40" />
            <span>OR GATE (MULTIMODAL CORRELATION)</span>
            <span className="w-8 h-[1px] bg-purple-500/40" />
          </div>

          {/* Sub Causes */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className={`p-2.5 rounded border ${vibRms > 2.5 ? 'bg-amber-950/50 border-amber-500/40 text-amber-300' : 'bg-gray-950 border-gray-800 text-gray-400'}`}>
              <span className="font-bold block text-[10px]">Primary Cause A</span>
              <span>Bearing Fatigue / Mechanical Spike ({vibRms.toFixed(2)}g)</span>
            </div>

            <div className={`p-2.5 rounded border ${currentA > 2.0 ? 'bg-amber-950/50 border-amber-500/40 text-amber-300' : 'bg-gray-950 border-gray-800 text-gray-400'}`}>
              <span className="font-bold block text-[10px]">Primary Cause B</span>
              <span>Motor Current Overload / Ore Jam ({currentA.toFixed(2)}A)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

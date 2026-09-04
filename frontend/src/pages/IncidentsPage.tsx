import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { IncidentItem, IncidentStatus } from '@shared/types';
import { AlertOctagon, CheckCircle2, Search, Clock, ShieldAlert, User, PhoneCall, RefreshCw } from 'lucide-react';

const STATUS_STEPS: IncidentStatus[] = ['DETECTED', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED', 'CLOSED'];

export const IncidentsPage: React.FC = () => {
  const { incidents, updateIncidentStatus, setScenario, conveyor } = useTelemetry();
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const activeInc = selectedIncident || incidents[0] || null;

  const handleStatusChange = async (incId: string, newStatus: IncidentStatus) => {
    await updateIncidentStatus(incId, newStatus, resolutionNotes || undefined);
    if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
      setScenario('RECOVERY');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Industrial Incident Management Center"
        subtitle="Full Incident Lifecycle Tracking (DETECTED → ACKNOWLEDGED → INVESTIGATING → RESOLVED → CLOSED)"
        badge={<span className="px-2.5 py-1 rounded bg-rose-950 text-rose-400 font-mono text-xs font-bold border border-rose-500/30">{incidents.length} INCIDENTS LOGGED</span>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="lg:col-span-1 glass-panel rounded-xl p-4 border border-gray-800 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>Incident Queue</span>
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {incidents.length === 0 ? (
              <p className="text-xs font-mono text-gray-500 py-6 text-center">No recorded incidents.</p>
            ) : (
              incidents.map(inc => (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`w-full text-left p-3 rounded-lg border transition-all font-mono space-y-1.5 ${
                    activeInc?.id === inc.id
                      ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                      : 'bg-gray-950/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{inc.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      inc.status === 'DETECTED' ? 'bg-rose-950 text-rose-400 border border-rose-500/30 animate-pulse' :
                      inc.status === 'INVESTIGATING' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-semibold line-clamp-1">{inc.condition}</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1 border-t border-gray-900">
                    <span>{inc.conveyorId} • {inc.siteName}</span>
                    <span>{new Date(inc.timestamp).toLocaleTimeString()}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Selected Incident Detail View */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-5 border border-gray-800 space-y-5">
          {activeInc ? (
            <>
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-mono font-extrabold text-white">{activeInc.id}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-xs font-bold border border-rose-500/40">
                      {activeInc.severity} SEVERITY
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">{activeInc.condition}</p>
                </div>
                <div className="text-right text-xs font-mono text-gray-400">
                  <p>Logged: {new Date(activeInc.timestamp).toLocaleString()}</p>
                  <p className="text-cyan-400">{activeInc.siteName}</p>
                </div>
              </div>

              {/* Lifecycle Progress Bar */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                  Incident Lifecycle State
                </span>
                <div className="grid grid-cols-5 gap-1 font-mono text-[11px] text-center">
                  {STATUS_STEPS.map((st, idx) => {
                    const currentIdx = STATUS_STEPS.indexOf(activeInc.status);
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div
                        key={st}
                        className={`p-2 rounded border transition-all ${
                          isCurrent
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                            : isDone
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                            : 'bg-gray-900/40 text-gray-600 border-gray-800'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3 h-3 mx-auto mb-0.5 text-emerald-400" />}
                        <span>{st}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">HEALTH AT FAILURE</span>
                  <span className="text-rose-400 text-sm font-bold">{activeInc.healthPercentAtDetection}%</span>
                </div>
                <div className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">RISK SCORE</span>
                  <span className="text-rose-400 text-sm font-bold">{activeInc.riskScoreAtDetection}/100</span>
                </div>
                <div className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">AUTO SHUTDOWN</span>
                  <span className="text-emerald-400 text-sm font-bold">{activeInc.autoShutdownTriggered ? 'TRIPPED (RELAY)' : 'MANUAL'}</span>
                </div>
                <div className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">GSM SOS STATUS</span>
                  <span className="text-cyan-400 text-sm font-bold">{activeInc.sosStatus}</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-3 font-mono text-xs">
                <h4 className="font-bold text-gray-200 uppercase tracking-wider">Technician Resolution Controls</h4>
                <div>
                  <label className="text-gray-400 block mb-1">Resolution & Repair Notes</label>
                  <textarea
                    rows={2}
                    value={resolutionNotes}
                    onChange={e => setResolutionNotes(e.target.value)}
                    placeholder="Enter inspection findings, bearing replacement notes, or belt tension adjustments..."
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleStatusChange(activeInc.id, 'ACKNOWLEDGED')}
                    className="px-3.5 py-2 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-all"
                  >
                    ACKNOWLEDGE INCIDENT
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeInc.id, 'INVESTIGATING')}
                    className="px-3.5 py-2 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all"
                  >
                    BEGIN INVESTIGATION
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeInc.id, 'RESOLVED')}
                    className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>RESOLVE & RECOVER CONVEYOR</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs font-mono text-gray-500 py-10 text-center">Select an incident to manage details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

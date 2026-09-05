import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, clearAlerts } = useTelemetry();
  const [filter, setFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL') return true;
    if (filter === 'UNACKNOWLEDGED') return !a.acknowledged;
    return a.severity === filter;
  });

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="Industrial Alert Management Center"
        subtitle="Automated Real-Time Sensor Anomaly & Safety Interlock Notifications"
        actions={
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex space-x-1.5">
              {['ALL', 'UNACKNOWLEDGED', 'CRITICAL', 'HIGH', 'WARNING'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg border transition-all font-bold',
                    filter === f ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {alerts.length > 0 && (
              <button
                onClick={clearAlerts}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold transition-all"
                title="Clear all alerts"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR ALL</span>
              </button>
            )}
          </div>
        }
      />

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-xl text-gray-400 border border-gray-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <span className="text-sm font-bold block text-white">No Active Alerts Found</span>
            <p className="text-xs text-gray-500 mt-1">All sensor telemetry parameters operating within normal safety margins.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={clsx(
                'glass-panel p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all',
                alert.acknowledged ? 'opacity-60 border-gray-800' : 'border-gray-700 bg-gray-900/60'
              )}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <StatusBadge status={alert.severity} size="sm" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-white">{alert.title}</h4>
                    <span className="text-[10px] text-gray-500">{alert.id}</span>
                  </div>
                  <p className="text-xs text-gray-300 font-sans mt-1">{alert.description}</p>
                  <p className="text-[11px] text-emerald-400 mt-1">Action: {alert.recommendedAction}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs">
                <span className="text-gray-500 text-[11px] whitespace-nowrap">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
                {!alert.acknowledged ? (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs"
                  >
                    Acknowledge
                  </button>
                ) : (
                  <span className="text-emerald-400 text-[11px] font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acknowledged ({alert.acknowledgedBy})</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

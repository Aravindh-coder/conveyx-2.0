import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { History, Activity } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events } = useTelemetry();

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="SCADA Operational Event Audit History"
        subtitle="Chronological Log of Hardware Signals, Risk Shifts, Interlock Relay Cutoffs & Operator Actions"
      />

      <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">No events recorded.</div>
          ) : (
            events.map(evt => (
              <div key={evt.id} className="p-3 bg-gray-900/80 rounded-lg border border-gray-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <StatusBadge status={evt.severity} size="sm" />
                  <div>
                    <span className="font-bold text-white block">{evt.message}</span>
                    <span className="text-[10px] text-gray-500">{evt.source} • {evt.eventType}</span>
                  </div>
                </div>
                <span className="text-gray-500 text-[11px] font-mono">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

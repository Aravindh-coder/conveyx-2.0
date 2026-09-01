import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { MaintenanceComponent } from '@shared/types';
import { Wrench, CheckCircle2, AlertTriangle, Calendar, Clock } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const [components, setComponents] = useState<MaintenanceComponent[]>([]);

  useEffect(() => {
    fetch('/api/maintenance')
      .then(res => res.json())
      .then(data => {
        if (data.components) setComponents(data.components);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="Predictive Component Maintenance Schedule"
        subtitle="Monitors Structural Wear & Recommended Inspection Intervals across Conveyor Prototype Parts"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {components.map(c => (
          <div key={c.id} className="glass-panel p-5 rounded-xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center text-cyan-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{c.name}</h4>
                  <span className="text-[10px] text-gray-500">{c.id} • {c.componentType}</span>
                </div>
              </div>
              <StatusBadge status={c.status === 'OPTIMAL' ? 'NORMAL' : 'WARNING'} size="sm" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Component Health:</span>
                <span className="text-emerald-400 font-bold">{c.healthPercent}%</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all"
                  style={{ width: `${c.healthPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-gray-800 text-gray-400">
              <div>
                <span className="block text-gray-500">Last Serviced:</span>
                <span className="text-gray-200 font-bold">{c.lastServicedDate}</span>
              </div>
              <div>
                <span className="block text-gray-500">Next Scheduled:</span>
                <span className="text-amber-400 font-bold">{c.nextScheduledDate}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-sans pt-1 italic">{c.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

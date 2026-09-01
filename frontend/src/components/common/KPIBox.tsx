import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  statusColor?: 'green' | 'yellow' | 'orange' | 'red' | 'cyan' | 'neutral';
  trend?: string;
  badge?: React.ReactNode;
}

export const KPIBox: React.FC<Props> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  statusColor = 'neutral',
  trend,
  badge
}) => {
  const colorMap = {
    green: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/10',
    yellow: 'border-amber-500/30 text-amber-400 bg-amber-950/10',
    orange: 'border-orange-500/30 text-orange-400 bg-orange-950/10',
    red: 'border-rose-500/30 text-rose-400 bg-rose-950/10',
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/10',
    neutral: 'border-gray-800 text-gray-300 bg-gray-900/40'
  };

  const iconBgMap = {
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    neutral: 'bg-gray-800/80 text-gray-400 border-gray-700'
  };

  return (
    <div
      className={clsx(
        'glass-panel rounded-xl p-4 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between',
        colorMap[statusColor]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight text-white">
              {value}
            </span>
            {unit && <span className="text-sm font-medium text-gray-400 font-mono">{unit}</span>}
          </div>
        </div>
        <div className={clsx('p-2.5 rounded-lg border flex items-center justify-center', iconBgMap[statusColor])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
        {subtitle && <span className="text-gray-400 font-mono truncate">{subtitle}</span>}
        {badge ? (
          badge
        ) : trend ? (
          <span className="text-xs font-mono text-gray-400">{trend}</span>
        ) : null}
      </div>
    </div>
  );
};

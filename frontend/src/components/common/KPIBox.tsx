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
    green: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/15 hover:border-emerald-500/50',
    yellow: 'border-amber-500/30 text-amber-400 bg-amber-950/15 hover:border-amber-500/50',
    orange: 'border-orange-500/30 text-orange-400 bg-orange-950/15 hover:border-orange-500/50',
    red: 'border-rose-500/30 text-rose-400 bg-rose-950/15 hover:border-rose-500/50',
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/15 hover:border-cyan-500/50',
    neutral: 'border-gray-800 text-gray-300 bg-gray-900/60 hover:border-gray-700'
  };

  const iconBgMap = {
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    neutral: 'bg-gray-800/80 text-gray-400 border-gray-700'
  };

  const valStr = String(value);
  const isLongVal = valStr.length > 7;

  return (
    <div
      className={clsx(
        'glass-panel rounded-xl p-4 border transition-all duration-200 relative flex flex-col justify-between min-w-[150px]',
        colorMap[statusColor]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-1 whitespace-nowrap overflow-hidden" title={title}>
            {title}
          </span>
          <div className="flex items-baseline space-x-1 min-w-0">
            <span className={clsx(
              'font-mono tracking-tight text-white whitespace-nowrap',
              isLongVal ? 'text-xs sm:text-sm font-bold' : 'text-xl sm:text-2xl font-extrabold'
            )}>
              {value}
            </span>
            {unit && <span className="text-xs font-medium text-gray-400 font-mono shrink-0">{unit}</span>}
          </div>
        </div>
        <div className={clsx('p-2 rounded-lg border flex items-center justify-center shrink-0 ml-1', iconBgMap[statusColor])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono min-w-0">
        {subtitle && <span className="text-gray-400 text-[10px] whitespace-nowrap overflow-hidden" title={subtitle}>{subtitle}</span>}
        {badge ? (
          <div className="shrink-0 ml-auto">{badge}</div>
        ) : trend ? (
          <span className="text-[10px] text-gray-400 shrink-0 ml-auto">{trend}</span>
        ) : null}
      </div>
    </div>
  );
};

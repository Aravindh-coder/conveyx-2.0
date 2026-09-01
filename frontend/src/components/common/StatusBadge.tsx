import React from 'react';
import { clsx } from 'clsx';
import { RiskLevel, MotorState, AlignmentState, SeverityLevel, DeviceState } from '@shared/types';

interface Props {
  status: RiskLevel | MotorState | AlignmentState | SeverityLevel | DeviceState | 'ONLINE' | 'OFFLINE';
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md', showDot = true }) => {
  const getStyle = () => {
    switch (status) {
      case 'RUNNING':
      case 'NORMAL':
      case 'ALIGNED':
      case 'ONLINE':
      case 'CONNECTED':
      case 'INFO':
        return {
          bg: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
          dot: 'bg-emerald-400 animate-pulse',
          glow: 'glow-green'
        };
      case 'WARNING':
      case 'MISALIGNED_LEFT':
      case 'MISALIGNED_RIGHT':
        return {
          bg: 'bg-amber-950/80 text-amber-400 border-amber-500/40',
          dot: 'bg-amber-400 animate-pulse',
          glow: 'glow-yellow'
        };
      case 'HIGH_RISK':
      case 'HIGH':
        return {
          bg: 'bg-orange-950/80 text-orange-400 border-orange-500/40',
          dot: 'bg-orange-400 animate-pulse',
          glow: 'glow-orange'
        };
      case 'CRITICAL':
      case 'FAULT':
      case 'EMERGENCY_STOP':
      case 'OFFLINE':
      case 'DISCONNECTED':
      case 'ERROR':
        return {
          bg: 'bg-rose-950/80 text-rose-400 border-rose-500/40',
          dot: 'bg-rose-400 animate-pulse-fast',
          glow: 'glow-red'
        };
      case 'STOPPED':
        return {
          bg: 'bg-gray-800 text-gray-400 border-gray-600',
          dot: 'bg-gray-400',
          glow: ''
        };
      default:
        return {
          bg: 'bg-gray-800 text-gray-300 border-gray-700',
          dot: 'bg-gray-400',
          glow: ''
        };
    }
  };

  const style = getStyle();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1.5',
    md: 'text-xs px-2.5 py-1 space-x-2 font-medium',
    lg: 'text-sm px-3.5 py-1.5 space-x-2.5 font-semibold'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border font-mono tracking-wide uppercase shadow-sm transition-all',
        style.bg,
        sizeClasses[size]
      )}
    >
      {showDot && (
        <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', style.dot)} />
      )}
      <span>{status.replace(/_/g, ' ')}</span>
    </span>
  );
};

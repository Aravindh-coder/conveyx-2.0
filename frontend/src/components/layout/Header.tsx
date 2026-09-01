import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTelemetry } from '../../context/TelemetryContext';
import { Bell, User, Wifi, WifiOff, ShieldAlert, Clock, ExternalLink, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { conveyor, isSocketConnected, hardwareMode, isHardwareConnected, alerts } = useTelemetry();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  // What badge to show for hardware/data mode
  const modeConfig = () => {
    if (!isSocketConnected) {
      return { icon: WifiOff, label: 'PLATFORM OFFLINE', color: 'text-rose-400', border: 'border-rose-800', bg: 'bg-rose-950' };
    }
    if (hardwareMode === 'LIVE_HARDWARE') {
      return { icon: Wifi, label: 'HARDWARE: LIVE', color: 'text-emerald-400', border: 'border-emerald-800', bg: 'bg-emerald-950' };
    }
    if (hardwareMode === 'SIMULATION') {
      return { icon: Cpu, label: 'SIMULATION MODE', color: 'text-amber-400', border: 'border-amber-800', bg: 'bg-amber-950' };
    }
    return { icon: WifiOff, label: 'NO HARDWARE', color: 'text-gray-400', border: 'border-gray-700', bg: 'bg-gray-900' };
  };

  const mode = modeConfig();
  const ModeIcon = mode.icon;

  return (
    <header className="h-14 bg-[#0B0F17]/90 backdrop-blur-md border-b border-gray-800 px-6 flex items-center justify-between sticky top-0 z-30 font-mono select-none">
      {/* Left: Active Conveyor System Pill */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800 text-xs">
          <span className="text-gray-400">Conveyor:</span>
          <span className="text-cyan-400 font-bold">{conveyor.id}</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-300 font-semibold hidden lg:inline">{conveyor.name}</span>
        </div>

        <Link
          to="/demo"
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-900 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>SCENARIO TEST BENCH</span>
        </Link>
      </div>

      {/* Right: Clock, Hardware Mode Badge, Alerts, Profile */}
      <div className="flex items-center space-x-4 text-xs">
        {/* Live Clock */}
        <div className="hidden lg:flex items-center space-x-1.5 text-gray-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime}</span>
        </div>

        {/* Hardware / Data Mode Badge */}
        <div className={clsx('flex items-center space-x-1.5 px-2.5 py-1 rounded border', mode.bg, mode.border)}>
          {hardwareMode === 'LIVE_HARDWARE' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
          <ModeIcon className={clsx('w-3.5 h-3.5', mode.color)} />
          <span className={clsx('font-bold tracking-wider', mode.color)}>{mode.label}</span>
        </div>

        {/* Alert Notifications */}
        <Link
          to="/alerts"
          className="relative p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 transition-all"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedAlerts > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-black text-[9px] font-extrabold flex items-center justify-center animate-pulse">
              {unacknowledgedAlerts}
            </span>
          )}
        </Link>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-gray-800">
          <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-gray-200 font-bold block text-[11px] leading-tight">{user?.name}</span>
            <span className="text-gray-500 text-[10px] block leading-tight">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

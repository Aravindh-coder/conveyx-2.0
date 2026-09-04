import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTelemetry } from '../../context/TelemetryContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Wifi, WifiOff, Clock, Cpu, PhoneCall, ChevronRight, Activity, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const ROUTE_MAP: Record<string, { label: string; color: string }> = {
  '/dashboard':        { label: 'Dashboard',          color: '#22D3EE' },
  '/live-monitoring':  { label: 'Live Telemetry',     color: '#22D3EE' },
  '/conveyor':         { label: 'Conveyors',           color: '#22D3EE' },
  '/digital-twin':     { label: 'Digital Twin',        color: '#22D3EE' },
  '/demo':             { label: 'Scenario Bench',      color: '#22D3EE' },
  '/prediction':       { label: 'Predictive Engine',   color: '#A78BFA' },
  '/sensors':          { label: 'Sensors Hub',         color: '#34D399' },
  '/sensors/vibration':{ label: 'MPU6050 Vibration',  color: '#34D399' },
  '/sensors/current':  { label: 'ACS712 Motor Load',  color: '#FCD34D' },
  '/sensors/alignment':{ label: 'IR Belt Alignment',  color: '#34D399' },
  '/vision':           { label: 'AI Vision',           color: '#A78BFA' },
  '/incidents':        { label: 'Incidents',           color: '#FB923C' },
  '/sos':              { label: 'SOS Center',          color: '#FB7185' },
  '/alerts':           { label: 'Alert Center',        color: '#FB7185' },
  '/maintenance':      { label: 'Maintenance',         color: '#FCD34D' },
  '/events':           { label: 'Event History',       color: '#94A3B8' },
  '/reports':          { label: 'Reports',             color: '#FCD34D' },
  '/analytics':        { label: 'Analytics',           color: '#94A3B8' },
  '/devices':          { label: 'SmartPods',           color: '#94A3B8' },
  '/company':          { label: 'Company Profile',     color: '#94A3B8' },
  '/onboarding':       { label: 'Setup Wizard',        color: '#22D3EE' },
  '/settings':         { label: 'Settings',            color: '#94A3B8' },
  '/profile':          { label: 'My Profile',          color: '#94A3B8' },
  '/help':             { label: 'Documentation',       color: '#94A3B8' },
};

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { conveyor, isSocketConnected, hardwareMode, alerts, company } = useTelemetry();
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState('');
  const location = useLocation();

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const unread = alerts.filter(a => !a.acknowledged).length;
  const route = ROUTE_MAP[location.pathname] || { label: location.pathname.replace('/', '').toUpperCase(), color: '#94A3B8' };

  const modeBadge = (() => {
    if (!isSocketConnected)             return { label: 'OFFLINE',    color: '#F43F5E', bg: 'rgba(244,63,94,0.1)',    border: 'rgba(244,63,94,0.25)',  Icon: WifiOff };
    if (hardwareMode === 'LIVE_HARDWARE') return { label: 'LIVE',      color: '#10B981', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.25)', Icon: Wifi, pulse: true };
    if (hardwareMode === 'SIMULATION')    return { label: 'SIM',       color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)', Icon: Cpu };
    return                                       { label: 'NO HW',    color: '#475569', bg: 'rgba(71,85,105,0.1)',    border: 'rgba(71,85,105,0.25)',  Icon: WifiOff };
  })();

  return (
    <header
      className="h-[52px] flex items-center justify-between px-5 sticky top-0 z-30 select-none bg-slate-900/90 dark:bg-slate-900/95 border-b border-gray-200 dark:border-white/10 backdrop-blur-xl"
    >
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-[12.5px]">
        <span className="text-slate-600 font-medium hidden sm:inline">ConveyX 2.0</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-700 hidden sm:inline" />
        <span className="font-semibold" style={{ color: route.color }}>
          {route.label}
        </span>

        {/* Site pill */}
        <div className="hidden lg:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-lg text-[11.5px]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-slate-500">{conveyor.id}</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-400">{company?.siteName || 'Plant A'}</span>
        </div>
      </div>

      {/* Right: Status + Actions */}
      <div className="flex items-center gap-2.5">
        {/* Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11.5px] text-slate-500 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-600" />
          {time}
        </div>

        {/* Mode badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold"
          style={{ background: modeBadge.bg, border: `1px solid ${modeBadge.border}`, color: modeBadge.color }}>
          {(modeBadge as any).pulse && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: modeBadge.color }} />}
          <modeBadge.Icon className="w-3.5 h-3.5" />
          {modeBadge.label}
        </div>

        {/* Theme Toggle Switcher */}
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Brighter White Theme'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
          style={{
            background: theme === 'light' ? '#E0F2FE' : 'rgba(255,255,255,0.06)',
            border: theme === 'light' ? '1px solid #7DD3FC' : '1px solid rgba(255,255,255,0.1)',
            color: theme === 'light' ? '#0369A1' : '#F1F5F9'
          }}
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="hidden sm:inline">LIGHT MODE</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              <span className="hidden sm:inline">DARK MODE</span>
            </>
          )}
        </button>

        {/* SOS */}
        <Link to="/sos"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11.5px] font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #E11D48, #9F1239)', boxShadow: '0 2px 12px rgba(225,29,72,0.3)' }}>
          <PhoneCall className="w-3.5 h-3.5" />
          <span>SOS</span>
        </Link>

        {/* Alerts bell */}
        <Link to="/alerts"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-300 transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white animate-pulse"
              style={{ background: '#F43F5E' }}>
              {unread}
            </span>
          )}
        </Link>

        {/* Live indicator */}
        <Link to="/live-monitoring"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition-all"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Live
        </Link>
      </div>
    </header>
  );
};

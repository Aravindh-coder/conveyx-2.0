import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Layers, Cpu, Zap, SlidersHorizontal,
  ShieldCheck, Eye, Bell, Wrench, History, LineChart, HardDrive,
  Settings, HelpCircle, PlaySquare, ShieldAlert, AlertOctagon,
  PhoneCall, FileText, Building2, UserCheck, Sparkles, LogOut, ChevronRight
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { useAuth } from '../../context/AuthContext';

interface NavGroup {
  label: string;
  items: { path: string; label: string; icon: React.ElementType; badge?: string; color?: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Monitoring',
    items: [
      { path: '/dashboard',       label: 'Dashboard',          icon: LayoutDashboard },
      { path: '/live-monitoring', label: 'Live Telemetry',     icon: Activity },
      { path: '/conveyor',        label: 'Conveyors',          icon: SlidersHorizontal },
      { path: '/digital-twin',    label: 'Digital Twin',       icon: Layers },
      { path: '/demo',            label: 'Scenario Bench',     icon: PlaySquare, badge: 'TEST', color: '#06B6D4' },
    ]
  },
  {
    label: 'Sensors & AI',
    items: [
      { path: '/prediction',       label: 'Predictive Engine', icon: ShieldCheck, color: '#8B5CF6' },
      { path: '/sensors',          label: 'Sensors Hub',       icon: Cpu,         color: '#10B981' },
      { path: '/sensors/vibration',label: 'MPU6050 Vibration', icon: Activity,    color: '#10B981' },
      { path: '/sensors/current',  label: 'ACS712 Motor Load', icon: Zap,         color: '#F59E0B' },
      { path: '/sensors/alignment',label: 'IR Belt Alignment', icon: SlidersHorizontal, color: '#10B981' },
      { path: '/vision',           label: 'AI Vision Module',  icon: Eye,         color: '#8B5CF6' },
    ]
  },
  {
    label: 'Incidents',
    items: [
      { path: '/incidents',   label: 'Incidents Log',        icon: AlertOctagon, badge: 'AUTO', color: '#F97316' },
      { path: '/sos',         label: 'SOS Center',           icon: PhoneCall,    badge: 'GSM',  color: '#F43F5E' },
      { path: '/alerts',      label: 'Alert Center',         icon: Bell,         color: '#F43F5E' },
      { path: '/maintenance', label: 'Maintenance',          icon: Wrench,       color: '#F59E0B' },
      { path: '/events',      label: 'Event History',        icon: History },
    ]
  },
  {
    label: 'Reports',
    items: [
      { path: '/reports',    label: 'Compliance Reports', icon: FileText, badge: 'PDF', color: '#F59E0B' },
      { path: '/analytics',  label: 'Analytics',          icon: LineChart },
      { path: '/devices',    label: 'SmartPods',          icon: HardDrive },
      { path: '/company',    label: 'Company Profile',    icon: Building2 },
      { path: '/onboarding', label: 'Setup Wizard',       icon: Sparkles, color: '#06B6D4' },
    ]
  },
  {
    label: 'System',
    items: [
      { path: '/settings', label: 'Settings',       icon: Settings },
      { path: '/profile',  label: 'My Profile',     icon: UserCheck },
      { path: '/help',     label: 'Documentation',  icon: HelpCircle },
    ]
  }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSocketConnected, hardwareMode } = useTelemetry();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  const connectionStatus =
    hardwareMode === 'LIVE_HARDWARE' ? { label: 'Live Hardware', color: '#10B981' } :
    hardwareMode === 'SIMULATION'    ? { label: 'Simulation',    color: '#F59E0B' } :
                                       { label: 'Disconnected',  color: '#475569' };

  return (
    <aside
      className="w-[220px] flex-shrink-0 flex flex-col h-screen sticky top-0 z-40 select-none overflow-hidden"
    >
      {/* ─ Brand ─ */}
      <div className="px-4 py-4 flex items-center gap-2.5 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #06B6D4, #2563EB)', boxShadow: '0 0 15px rgba(6,182,212,0.3)' }}>
          <ShieldAlert className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-[14px] font-bold text-gray-900 dark:text-white tracking-wide leading-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            CONVEY<span style={{ color: '#0284C7' }}>X</span>
            <span className="text-gray-400 dark:text-slate-500 text-[11px] ml-1 font-medium">2.0</span>
          </div>
          <div className="text-[9.5px] text-gray-500 dark:text-slate-600 font-medium tracking-widest mt-0.5 uppercase">Condition Monitor</div>
        </div>
      </div>

      {/* ─ Navigation ─ */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-slate-600">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map(({ path, label, icon: Icon, badge, color }) => {
                const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={() =>
                      `flex items-center justify-between px-2.5 py-[7px] rounded-lg text-[12.5px] font-medium transition-all duration-150 ${
                        isActive
                          ? 'text-cyan-700 dark:text-white font-semibold'
                          : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.03]'
                      }`
                    }
                    style={isActive ? {
                      background: 'rgba(6,182,212,0.12)',
                      border: '1px solid rgba(6,182,212,0.3)',
                    } : { border: '1px solid transparent' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: isActive ? (color || '#22D3EE') : (color ? color + '88' : '#475569') }}
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      <span className="truncate">{label}</span>
                    </div>
                    {badge ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(6,182,212,0.12)',
                          border: '1px solid rgba(6,182,212,0.25)',
                          color: '#22D3EE'
                        }}>
                        {badge}
                      </span>
                    ) : isActive ? (
                      <ChevronRight className="w-3 h-3 text-cyan-400/60 flex-shrink-0" />
                    ) : null}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ─ Footer: Status + User ─ */}
      <div className="px-3 py-3 border-t border-white/[0.05] space-y-3">
        {/* Connection Status */}
        <div className="px-2.5 py-2 rounded-lg space-y-1.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] text-slate-600">Backend</span>
            <span className="flex items-center gap-1.5 text-[10.5px] font-semibold"
              style={{ color: isSocketConnected ? '#10B981' : '#F43F5E' }}>
              <span className="w-1.5 h-1.5 rounded-full"
                style={{ background: isSocketConnected ? '#10B981' : '#F43F5E' }} />
              {isSocketConnected ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] text-slate-600">SmartPod</span>
            <span className="text-[10.5px] font-semibold" style={{ color: connectionStatus.color }}>
              {connectionStatus.label.toUpperCase()}
            </span>
          </div>
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <UserCheck className="w-3.5 h-3.5" style={{ color: '#22D3EE' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-slate-300 truncate">
              {user?.name || 'Operator'}
            </div>
            <div className="text-[10px] text-slate-600 truncate">
              {user?.role || 'Engineer'}
            </div>
          </div>
          <button onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Sign out">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

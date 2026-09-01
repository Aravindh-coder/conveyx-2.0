import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Activity,
  Layers,
  Cpu,
  Zap,
  SlidersHorizontal,
  ShieldCheck,
  Eye,
  Bell,
  Wrench,
  History,
  LineChart,
  HardDrive,
  Settings,
  HelpCircle,
  PlaySquare,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

interface Props {
  collapsed?: boolean;
}

export const Sidebar: React.FC<Props> = ({ collapsed = false }) => {
  const location = useLocation();
  const { isSocketConnected, hardwareMode, isHardwareConnected, localSafetyActive } = useTelemetry();

  const menuGroups = [
    {
      groupName: 'CONTROL & MONITORING',
      items: [
        { path: '/demo', label: 'Scenario Test Bench', icon: PlaySquare, badge: 'TEST BENCH' },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/live-monitoring', label: 'Live Telemetry', icon: Activity },
        { path: '/digital-twin', label: 'Digital Twin', icon: Layers, badge: '3D/2D' },
        { path: '/conveyor', label: 'Conveyors', icon: SlidersHorizontal }
      ]
    },
    {
      groupName: 'SENSORS & PREDICTION',
      items: [
        { path: '/sensors', label: 'Sensors Hub', icon: Cpu },
        { path: '/sensors/vibration', label: 'MPU6050 Vibration', icon: Activity },
        { path: '/sensors/current', label: 'ACS712 Motor Current', icon: Zap },
        { path: '/sensors/alignment', label: 'IR Belt Alignment', icon: SlidersHorizontal },
        { path: '/prediction', label: 'Predictive Risk Engine', icon: ShieldCheck },
        { path: '/vision', label: 'AI Vision Module', icon: Eye }
      ]
    },
    {
      groupName: 'OPERATIONS & LOGS',
      items: [
        { path: '/alerts', label: 'Alert Center', icon: Bell },
        { path: '/maintenance', label: 'Maintenance', icon: Wrench },
        { path: '/events', label: 'Event History', icon: History },
        { path: '/analytics', label: 'Analytics & Reports', icon: LineChart }
      ]
    },
    {
      groupName: 'SYSTEM & HELP',
      items: [
        { path: '/devices', label: 'Hardware Devices', icon: HardDrive },
        { path: '/settings', label: 'System Settings', icon: Settings },
        { path: '/help', label: 'Documentation & Guide', icon: HelpCircle }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-gray-800 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <ShieldAlert className="w-5 h-5 text-black font-extrabold" />
            </div>
            <div>
              <h1 className="text-base font-extrabold font-mono tracking-wider text-white leading-none">
                CONVEY <span className="text-cyan-400">X</span>
              </h1>
              <span className="text-[10px] font-mono text-gray-400 block mt-0.5">Mining Safety Platform</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className="px-3 py-3 overflow-y-auto max-h-[calc(100vh-170px)] space-y-4">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <span className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                {group.groupName}
              </span>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-all duration-150 group',
                          isActive
                            ? 'bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
                        )
                      }
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={clsx('w-4 h-4', isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300')} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                          {item.badge}
                        </span>
                      ) : (
                        isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer Hardware Connection Status – honest state */}
      <div className="p-3 border-t border-gray-800 bg-gray-950/80 font-mono text-[11px] space-y-1.5">
        <div className="flex justify-between items-center text-gray-400">
          <span>Platform:</span>
          <span className={clsx('font-bold flex items-center space-x-1', isSocketConnected ? 'text-emerald-400' : 'text-rose-400')}>
            {isSocketConnected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            <span>{isSocketConnected ? 'ONLINE' : 'OFFLINE'}</span>
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-400">
          <span>Arduino UNO:</span>
          <span className={clsx('font-bold', isHardwareConnected ? 'text-emerald-400' : 'text-gray-500')}>
            {isHardwareConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-400">
          <span>ESP32 Wi-Fi:</span>
          <span className={clsx('font-bold',
            hardwareMode === 'LIVE_HARDWARE' ? 'text-emerald-400' :
            hardwareMode === 'SIMULATION' ? 'text-amber-400' : 'text-gray-500'
          )}>
            {hardwareMode === 'LIVE_HARDWARE' ? 'CONNECTED' :
             hardwareMode === 'SIMULATION' ? 'SIMULATED' : 'DISCONNECTED'}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-400 pt-1 border-t border-gray-800">
          <span>Safety Relay:</span>
          <span className={clsx('font-bold', isHardwareConnected ? 'text-cyan-400' : 'text-gray-500')}>
            {isHardwareConnected ? 'ARMED' : '—'}
          </span>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { useTelemetry } from '../context/TelemetryContext';
import { Activity, Zap, Cpu, Eye, ArrowRight } from 'lucide-react';

export const SensorsHubPage: React.FC = () => {
  const { packet } = useTelemetry();

  const vibRms = packet?.vibration.rms ?? 0;
  const motorCurrent = packet?.motor.current ?? 0;
  const isOverload = packet?.motor.isOverload ?? false;
  const alignStatus = packet?.alignment.status ?? 'ALIGNED';

  const sensors = [
    {
      id: 'MPU6050',
      title: 'Vibration Monitoring (MPU6050)',
      path: '/sensors/vibration',
      icon: Activity,
      desc: '3-axis accelerometer measuring drive roller bearing vibration magnitude & RMS noise.',
      value: `${vibRms.toFixed(2)} g RMS`,
      status: vibRms > 2.8 ? 'WARNING' : 'NORMAL'
    },
    {
      id: 'ACS712',
      title: 'Motor Current / Load (ACS712)',
      path: '/sensors/current',
      icon: Zap,
      desc: 'DC/AC current sensor tracking motor electrical load, mechanical friction & stall.',
      value: `${motorCurrent.toFixed(2)} A`,
      status: isOverload ? 'WARNING' : 'NORMAL'
    },
    {
      id: 'IR_ALIGNMENT',
      title: 'Belt Alignment Tracking (2x IR)',
      path: '/sensors/alignment',
      icon: Cpu,
      desc: 'Optical reflection sensors detecting left/right belt wander and tracking drift.',
      value: alignStatus,
      status: alignStatus === 'ALIGNED' ? 'NORMAL' : 'WARNING'
    },
    {
      id: 'CV_CAMERA',
      title: 'AI Vision Module (Camera)',
      path: '/vision',
      icon: Eye,
      desc: 'Optical inspection camera for surface cracks, rips, splice integrity & edge wear.',
      value: 'CV Stream Active',
      status: 'NORMAL'
    }
  ];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Hardware Sensor Telemetry Hub"
        subtitle="Operational status and semantic mapping of all hardware sensors on CONVEY X"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        {sensors.map(s => {
          const Icon = s.icon;
          return (
            <Link
              key={s.id}
              to={s.path}
              className="glass-panel glass-panel-hover rounded-xl p-6 border border-gray-800 space-y-4 block group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                      {s.title}
                    </h3>
                    <span className="text-xs text-gray-500">{s.id}</span>
                  </div>
                </div>
                <StatusBadge status={s.status as any} size="sm" />
              </div>

              <p className="text-xs text-gray-400 font-sans leading-relaxed">{s.desc}</p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs">
                <span className="text-gray-400">Current Reading: <strong className="text-white">{s.value}</strong></span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1 font-bold">
                  <span>Deep Dive Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { KPIBox } from '../components/common/KPIBox';
import { StatusBadge } from '../components/common/StatusBadge';
import { DemoScenarioSelector } from '../components/common/DemoScenarioSelector';
import { DigitalTwinCanvas } from '../components/digital-twin/DigitalTwinCanvas';
import { TelemetryLineChart } from '../components/charts/TelemetryLineChart';
import { RiskScoreGauge } from '../components/charts/RiskScoreGauge';
import { PipelineVisualizer } from '../components/common/PipelineVisualizer';
import { Activity, Zap, Cpu, ShieldAlert, HeartPulse, Bell, Clock, SlidersHorizontal, WifiOff, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';


export const DashboardPage: React.FC = () => {
  const { conveyor, packet, risk, alerts, history, hardwareMode, isHardwareConnected, enableSimulation } = useTelemetry();
  const isDisconnected = hardwareMode === 'DISCONNECTED';
  const isSimulation = hardwareMode === 'SIMULATION';

  // Null-safe values
  const riskScore = risk?.score ?? 0;
  const riskLevel = risk?.level ?? 'NORMAL';
  const motorCurrent = packet?.motor.current.toFixed(2) ?? '—';
  const motorBaseline = packet?.motor.baselineCurrent ?? 0;
  const isMotorOverload = packet?.motor.isOverload ?? false;
  const vibRms = packet?.vibration.rms.toFixed(2) ?? '—';
  const vibRmsNum = packet?.vibration.rms ?? 0;
  const alignStatus = packet?.alignment.status ?? 'ALIGNED';


  return (
    <div className="space-y-6">

      {/* ─── Hardware Disconnected Warning Banner ─── */}
      {isDisconnected && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 rounded-xl border border-amber-500/30 bg-amber-950/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <div className="flex items-center space-x-3">
            <WifiOff className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-amber-300 font-mono font-bold text-sm tracking-wide">NO HARDWARE CONNECTED</p>
              <p className="text-amber-400/70 text-xs mt-0.5 font-mono">
                Connect your ESP32 gateway to <code className="bg-black/30 px-1 rounded">POST /api/device-data</code> to start live monitoring.
                Or run the simulation engine to explore the platform.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={enableSimulation}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              <span>RUN SIMULATION</span>
            </button>
            <Link
              to="/help"
              className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 font-mono text-xs font-bold transition-all"
            >
              HOW TO CONNECT
            </Link>
          </div>
        </div>
      )}

      {/* Simulation Mode Banner */}
      {isSimulation && (
        <div className="flex items-center justify-between px-4 py-2 rounded-lg border border-amber-500/20 bg-amber-950/20 text-amber-400 font-mono text-xs">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold">SIMULATION MODE ACTIVE</span>
            <span className="text-amber-400/60">— Data is synthetic. Connect real hardware to enable live monitoring.</span>
          </span>
        </div>
      )}

      {/* Scenario Switcher (only relevant when simulation active) */}
      {isSimulation && <DemoScenarioSelector />}

      {/* Page Title Header */}
      <PageHeader
        title="SCADA Mining Control Room Dashboard"
        subtitle={`Real-Time Telemetry & Predictive Safety for ${conveyor.name} (${conveyor.id})`}
        badge={<StatusBadge status={conveyor.status} size="md" />}
        actions={
          <div className="flex space-x-2">
            <Link
              to="/live-monitoring"
              className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 font-mono text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Live Telemetry</span>
            </Link>
            <Link
              to="/demo"
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-extrabold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center space-x-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Scenario Test Bench</span>
            </Link>
          </div>
        }
      />

      {/* 8 Required KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KPIBox
          title="Conveyor Status"
          value={conveyor.status}
          icon={SlidersHorizontal}
          statusColor={conveyor.status === 'RUNNING' ? 'green' : conveyor.status === 'EMERGENCY_STOP' ? 'red' : 'neutral'}
          badge={<StatusBadge status={conveyor.status} size="sm" showDot={false} />}
        />

        <KPIBox
          title="Conveyor Health"
          value={`${conveyor.healthPercent}%`}
          icon={HeartPulse}
          statusColor={conveyor.healthPercent > 80 ? 'green' : conveyor.healthPercent > 50 ? 'yellow' : 'red'}
          subtitle="Structural integrity"
        />

        <KPIBox
          title="Risk Score"
          value={`${riskScore}`}
          unit="/100"
          icon={ShieldAlert}
          statusColor={riskScore < 31 ? 'green' : riskScore < 56 ? 'yellow' : riskScore < 76 ? 'orange' : 'red'}
          badge={<StatusBadge status={riskLevel} size="sm" showDot={false} />}
        />

        <KPIBox
          title="Motor Current"
          value={motorCurrent}
          unit="A"
          icon={Zap}
          statusColor={isMotorOverload ? 'red' : 'cyan'}
          subtitle={`Baseline: ${motorBaseline}A`}
        />

        <KPIBox
          title="Vibration"
          value={vibRms}
          unit="g"
          icon={Activity}
          statusColor={vibRmsNum > 2.8 ? 'red' : vibRmsNum > 1.8 ? 'yellow' : 'green'}
          subtitle="RMS Magnitude"
        />

        <KPIBox
          title="Belt Alignment"
          value={alignStatus}
          icon={Cpu}
          statusColor={alignStatus === 'ALIGNED' ? 'green' : 'yellow'}
          badge={<StatusBadge status={alignStatus} size="sm" showDot={false} />}
        />

        <KPIBox
          title="Active Alerts"
          value={alerts.filter(a => !a.acknowledged).length}
          icon={Bell}
          statusColor={alerts.filter(a => !a.acknowledged).length > 0 ? 'yellow' : 'neutral'}
          subtitle="Unacknowledged"
        />

        <KPIBox
          title="Uptime"
          value={`${conveyor.uptimePercent}%`}
          icon={Clock}
          statusColor="cyan"
          subtitle="Shift reliability"
        />
      </div>

      {/* Main Visual: Interactive Digital Twin Canvas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-gray-300">
            Conveyor System Prototype Digital Twin Visualizer
          </h2>
          <span className="text-xs font-mono text-cyan-400">Live SVG Canvas</span>
        </div>
        <DigitalTwinCanvas />
      </div>

      {/* Real-time Telemetry Graph & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-xl p-5 border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                Real-Time Telemetry Stream (MPU6050 & ACS712)
              </h3>
              <span className="text-[11px] font-mono text-gray-500">Live 1-second interval update feed</span>
            </div>
            <div className="flex space-x-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Vibration (g)
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                Current (A)
              </span>
            </div>
          </div>
          <TelemetryLineChart data={history} metric="all" height={260} />
        </div>

        {/* Risk Gauge */}
        <RiskScoreGauge risk={risk ?? undefined} />
      </div>

      {/* 6-Phase Pipeline Visualizer */}
      <PipelineVisualizer />
    </div>
  );
};

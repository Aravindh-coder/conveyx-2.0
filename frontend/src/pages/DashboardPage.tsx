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
import {
  Activity, Zap, Cpu, ShieldAlert, HeartPulse, Bell, Clock, SlidersHorizontal,
  Wifi, WifiOff, PlayCircle, ArrowUpRight, ArrowDownRight, AlertOctagon,
  CheckCircle2, Radio, Eye, RefreshCw, Terminal, Flame, ArrowRight, ShieldCheck,
  CheckCircle, AlertTriangle, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const {
    conveyor, packet, risk, alerts, incidents, history, hardwareMode,
    isHardwareConnected, enableSimulation, acknowledgeAlert, setScenario
  } = useTelemetry();

  const isDisconnected = hardwareMode === 'DISCONNECTED';
  const isSimulation = hardwareMode === 'SIMULATION';
  const isLive = hardwareMode === 'LIVE_HARDWARE';

  // Sensor telemetry metrics
  const riskScore = risk?.score ?? (conveyor.riskScore || 12);
  const riskLevel = risk?.level ?? 'NORMAL';
  const motorCurrent = packet?.motor.current ?? conveyor.motorCurrentA ?? 0.84;
  const motorBaseline = packet?.motor.baselineCurrent ?? 0.82;
  const isMotorOverload = packet?.motor.isOverload ?? false;

  const vibRms = packet?.vibration.rms ?? conveyor.vibrationRmsG ?? 1.25;
  const vibBaseline = packet?.vibration.baselineRms ?? 1.10;

  const tempC = packet?.temperature ?? 38.5;
  const alignStatus = packet?.alignment.status ?? 'ALIGNED';

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const activeIncidentList = incidents.filter(i => i.status !== 'CLOSED');

  return (
    <div className="space-y-6 font-mono select-none">

      {/* ─── 1. TOP HARDWARE / DEMO STATUS BANNER ─── */}
      {isDisconnected && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <div className="flex items-center space-x-3">
            <WifiOff className="w-6 h-6 text-amber-400 flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-amber-300 font-bold text-xs tracking-wider">HARDWARE DISCONNECTED — NO SENSOR GATEWAY FOUND</p>
              <p className="text-amber-400/80 text-[11px] font-sans mt-0.5">
                Connect your ESP32 / Raspberry Pi 3B+ to <code className="bg-black/40 px-1.5 py-0.5 rounded text-cyan-300">POST http://&lt;IP&gt;:4000/api/device-data</code>, or run simulation mode to demo the platform.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={enableSimulation}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <PlayCircle className="w-4 h-4" />
              <span>ENABLE SIMULATION</span>
            </button>
            <Link
              to="/devices"
              className="px-3.5 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 text-xs font-bold transition-all"
            >
              SETUP GUIDE
            </Link>
          </div>
        </div>
      )}

      {isSimulation && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/30 text-amber-300 text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span>
              <strong className="font-bold uppercase tracking-wider text-amber-400">DEMO / SIMULATED DATA ACTIVE:</strong> Telemetry outputs are synthetically generated for system evaluation.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px]">
            INTERACTIVE BENCH
          </span>
        </div>
      )}

      {isLive && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>
              <strong className="font-bold uppercase tracking-wider text-emerald-400">LIVE HARDWARE CONNECTED:</strong> Real-time streaming from ESP32 & Raspberry Pi 3B+ Edge Gateway.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
            100% HARDWARE HONEST
          </span>
        </div>
      )}

      {/* Interactive Scenario Control Bar (only when in simulation) */}
      {isSimulation && <DemoScenarioSelector />}

      {/* ─── 2. MAIN SCADA DASHBOARD HEADER ─── */}
      <PageHeader
        title="SCADA Condition Monitoring & Predictive Command Center"
        subtitle={`Live Multimodal Sensor Telemetry for ${conveyor.name} (${conveyor.id}) • Primary Crusher Shaft`}
        badge={<StatusBadge status={conveyor.status} size="md" />}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/live-monitoring"
              className="px-3.5 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Live Telemetry</span>
            </Link>
            <Link
              to="/prediction"
              className="px-3.5 py-2 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>AI Predictive Risk</span>
            </Link>
            <Link
              to="/demo"
              className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center space-x-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Scenario Test Bench</span>
            </Link>
          </div>
        }
      />

      {/* ─── 3. TOP HIGH-DENSITY KPI CARDS MATRIX ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <KPIBox
          title="System Status"
          value={conveyor.status}
          icon={SlidersHorizontal}
          statusColor={conveyor.status === 'RUNNING' ? 'green' : conveyor.status === 'EMERGENCY_STOP' ? 'red' : 'neutral'}
          badge={<StatusBadge status={conveyor.status} size="sm" showDot={false} />}
        />

        <KPIBox
          title="Belt Health"
          value={`${conveyor.healthPercent}%`}
          icon={HeartPulse}
          statusColor={conveyor.healthPercent > 80 ? 'green' : conveyor.healthPercent > 50 ? 'yellow' : 'red'}
          subtitle="Structural integrity"
        />

        <KPIBox
          title="AI Risk Index"
          value={`${riskScore}`}
          unit="/100"
          icon={ShieldAlert}
          statusColor={riskScore < 31 ? 'green' : riskScore < 56 ? 'yellow' : riskScore < 76 ? 'orange' : 'red'}
          badge={<StatusBadge status={riskLevel} size="sm" showDot={false} />}
        />

        <KPIBox
          title="Motor Load"
          value={motorCurrent.toFixed(2)}
          unit="A"
          icon={Zap}
          statusColor={isMotorOverload ? 'red' : 'cyan'}
          subtitle={`Baseline: ${motorBaseline}A`}
        />

        <KPIBox
          title="Vibration"
          value={vibRms.toFixed(2)}
          unit="g"
          icon={Activity}
          statusColor={vibRms > 2.8 ? 'red' : vibRms > 1.8 ? 'yellow' : 'green'}
          subtitle="RMS Magnitude"
        />

        <KPIBox
          title="Alignment"
          value={alignStatus}
          icon={Cpu}
          statusColor={alignStatus === 'ALIGNED' ? 'green' : 'yellow'}
          badge={<StatusBadge status={alignStatus} size="sm" showDot={false} />}
        />

        <KPIBox
          title="Open Alerts"
          value={unacknowledgedAlerts.length}
          icon={Bell}
          statusColor={unacknowledgedAlerts.length > 0 ? 'red' : 'green'}
          subtitle="Requires Operator"
        />

        <KPIBox
          title="Uptime"
          value={`${conveyor.uptimePercent}%`}
          icon={Clock}
          statusColor="cyan"
          subtitle="Shift reliability"
        />
      </div>

      {/* ─── 4. DEVICE CONNECTIVITY & LIVE HARDWARE SENSOR HEALTH MATRIX ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-xs">
        {/* Device 1: Raspberry Pi 3B+ Gateway */}
        <div className="glass-panel p-3.5 rounded-xl border border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Raspberry Pi 3B+ Edge</span>
              <span className="text-[10px] text-gray-500">Node.js Gateway • Port 4000</span>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isDisconnected ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isDisconnected ? 'OFFLINE' : 'ONLINE'}
          </span>
        </div>

        {/* Device 2: ESP32 SmartPod */}
        <div className="glass-panel p-3.5 rounded-xl border border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">ESP32 SmartPod Node</span>
              <span className="text-[10px] text-gray-500">Wi-Fi Stream • 1Hz</span>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isDisconnected ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isDisconnected ? 'OFFLINE' : 'STREAMING'}
          </span>
        </div>

        {/* Device 3: MPU6050 Vibration */}
        <div className="glass-panel p-3.5 rounded-xl border border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">MPU6050 Vibration</span>
              <span className="text-[10px] text-gray-500">Drive Roller Bearing</span>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            vibRms > 2.8 ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
          }`}>
            {vibRms > 2.8 ? 'ANOMALY' : 'OK'}
          </span>
        </div>

        {/* Device 4: Safety Interlock Relay */}
        <div className="glass-panel p-3.5 rounded-xl border border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Interlock Relay</span>
              <span className="text-[10px] text-gray-500">Normally Closed cutoff</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            ARMED
          </span>
        </div>
      </div>

      {/* ─── 5. INTERACTIVE DIGITAL TWIN CANVASES ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Interactive Industrial Digital Twin Visualizer</span>
          </h2>
          <span className="text-[11px] text-cyan-400 font-bold">LIVE SVG CANVAS & INTERLOCK STATES</span>
        </div>
        <DigitalTwinCanvas />
      </div>

      {/* ─── 6. REAL-TIME TELEMETRY GRAPH & AI RISK SCORE GAUGE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-xl p-5 border border-gray-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Real-Time Sensor Telemetry Overlay (MPU6050 & ACS712)</span>
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5 font-sans">
                Vibration magnitude RMS (g) and motor load current (A) continuous stream.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                Vibration (g)
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
                Current (A)
              </span>
            </div>
          </div>
          <TelemetryLineChart data={history} metric="all" height={240} />
        </div>

        {/* AI Multimodal Risk Score Gauge */}
        <RiskScoreGauge risk={risk ?? undefined} />
      </div>

      {/* ─── 7. ACTIVE INCIDENTS & RECENT ALERTS FEED GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Active Incidents Log */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Active Incident Queue ({activeIncidentList.length})
              </h3>
            </div>
            <Link to="/incidents" className="text-xs text-cyan-400 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {incidents.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">
                No active incidents recorded. System running within normal parameters.
              </div>
            ) : (
              incidents.slice(0, 3).map(inc => (
                <div key={inc.id} className="p-3 rounded-lg bg-gray-950 border border-gray-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{inc.id} • {inc.conveyorId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-500/30 animate-pulse' :
                      inc.severity === 'HIGH' ? 'bg-orange-950 text-orange-400 border border-orange-500/30' :
                      'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {inc.severity} SEVERITY
                    </span>
                  </div>
                  <p className="text-gray-300 font-sans line-clamp-1">{inc.condition}</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1.5 border-t border-gray-900">
                    <span>Status: <strong className="text-cyan-300">{inc.status}</strong></span>
                    <span>Logged: {new Date(inc.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Real-Time Alerts */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Unacknowledged Alerts ({unacknowledgedAlerts.length})
              </h3>
            </div>
            <Link to="/alerts" className="text-xs text-cyan-400 hover:underline flex items-center space-x-1">
              <span>Alert Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">
                No active alerts in queue.
              </div>
            ) : (
              alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="p-3 rounded-lg bg-gray-950 border border-gray-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${alert.acknowledged ? 'bg-gray-600' : 'bg-rose-400 animate-ping'}`} />
                      {alert.title}
                    </span>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold transition-all"
                      >
                        ACKNOWLEDGE
                      </button>
                    )}
                  </div>
                  <p className="text-gray-400 font-sans text-[11px]">{alert.description}</p>
                  <div className="text-[9.5px] text-gray-500 font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString()} • Sensor: {alert.sensorId}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ─── 8. 6-PHASE INDUSTRIAL PIPELINE VISUALIZER ─── */}
      <PipelineVisualizer />
    </div>
  );
};

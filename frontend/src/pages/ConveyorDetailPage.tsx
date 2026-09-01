import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { DigitalTwinCanvas } from '../components/digital-twin/DigitalTwinCanvas';
import { TelemetryLineChart } from '../components/charts/TelemetryLineChart';
import { SlidersHorizontal, Activity, Zap, Cpu, Calendar, ShieldCheck } from 'lucide-react';

export const ConveyorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { conveyor, packet, risk, history } = useTelemetry();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Conveyor Details: ${conveyor.name} (${id || conveyor.id})`}
        subtitle={`Location: ${conveyor.location}`}
        badge={<StatusBadge status={conveyor.status} size="md" />}
        actions={
          <Link
            to="/conveyor"
            className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 font-mono text-xs font-bold"
          >
            ← Back to All Conveyors
          </Link>
        }
      />

      {/* Main Digital Twin */}
      <DigitalTwinCanvas />

      {/* Historical Telemetry Chart */}
      <div className="glass-panel p-5 rounded-xl border border-gray-800">
        <h3 className="font-mono text-xs font-bold text-gray-300 uppercase mb-4">
          Sensor Telemetry Timeline (Vibration & Motor Current)
        </h3>
        <TelemetryLineChart data={history} metric="all" height={260} />
      </div>
    </div>
  );
};

import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { DigitalTwinCanvas } from '../components/digital-twin/DigitalTwinCanvas';
import { Layers } from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Conveyor System Interactive Digital Twin"
        subtitle="Real-Time 2D SVG Mechanical Twin with Dynamic Belt Movement, Roller Bearings & Glowing Telemetry Nodes"
        badge={
          <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-mono text-xs font-bold flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>DIGITAL TWIN STATUS: LIVE</span>
          </span>
        }
      />

      <DigitalTwinCanvas />
    </div>
  );
};

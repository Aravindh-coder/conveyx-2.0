import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { VisionInspector } from '../components/vision/VisionInspector';
import { Eye } from 'lucide-react';

export const VisionPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Computer Vision Belt Surface & Joint Inspector"
        subtitle="Optical Crack, Longitudinal Rip/Tear, Edge Damage & Vulcanized Splice Rupture Analysis"
        badge={
          <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-400 border border-purple-500/40 font-mono text-xs font-bold flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>VISION AI EXTENSION</span>
          </span>
        }
      />

      <VisionInspector />
    </div>
  );
};

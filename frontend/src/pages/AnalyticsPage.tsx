import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { TelemetryLineChart } from '../components/charts/TelemetryLineChart';
import { LineChart, Download, FileSpreadsheet } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { history } = useTelemetry();

  const exportCSV = () => {
    const headers = 'Timestamp,Device,RMS_Vibration,Motor_Current,Alignment\n';
    const rows = history.map(h => `${h.timestamp},${h.deviceId},${h.vibration.rms},${h.motor.current},${h.alignment.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conveyx_telemetry_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="Predictive Analytics & Report Export Hub"
        subtitle="Historical Sensor Telemetry Correlation & Downtime Analysis"
        actions={
          <div className="flex space-x-2 text-xs">
            <button
              onClick={exportCSV}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Telemetry CSV</span>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-xl border border-gray-800">
          <h3 className="text-xs font-bold text-gray-300 uppercase mb-4">
            Long-term MPU6050 Vibration Spectrum (g)
          </h3>
          <TelemetryLineChart data={history} metric="vibration_xyz" height={280} />
        </div>

        <div className="glass-panel p-5 rounded-xl border border-gray-800">
          <h3 className="text-xs font-bold text-gray-300 uppercase mb-4">
            ACS712 Motor Electrical Load Profile (A)
          </h3>
          <TelemetryLineChart data={history} metric="current" height={280} />
        </div>
      </div>
    </div>
  );
};

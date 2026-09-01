import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { HelpCircle, Cpu, ShieldCheck, Zap, Activity, Radio, CheckCircle2 } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6 font-mono max-w-5xl">
      <PageHeader
        title="CONVEY X System Architecture & Troubleshooting Guide"
        subtitle="Enterprise Technical Operating Guide & System Specifications"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Cpu className="w-5 h-5" />
            <span>Hardware Microcontroller Mapping</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>• <strong>Arduino UNO R3:</strong> Reads analog ACS712 pin A0, MPU6050 I2C 0x68, IR D2/D3. Controls local relay D8.</li>
            <li>• <strong>ESP32 Wi-Fi Gateway:</strong> Receives UART telemetry from Arduino, formats JSON, and emits WebSockets.</li>
            <li>• <strong>Local Interlock Relay:</strong> Normally-Closed relay cutting 5V DC motor power if risk &gt; 85.</li>
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Sensor Semantics Truths</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>• <strong>MPU6050:</strong> Vibration & bearing magnitude only.</li>
            <li>• <strong>ACS712:</strong> Motor current load & mechanical stall only.</li>
            <li>• <strong>IR Sensors:</strong> Physical belt tracking/wander alignment only.</li>
            <li>• <strong>Camera Module:</strong> Visible surface tears, cracks & splice ruptures.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

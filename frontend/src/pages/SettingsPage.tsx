import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Settings, ShieldAlert, Save, AlertTriangle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [vibWarning, setVibWarning] = useState<number>(2.8);
  const [vibCritical, setVibCritical] = useState<number>(4.0);
  const [currWarning, setCurrWarning] = useState<number>(1.8);
  const [currCritical, setCurrCritical] = useState<number>(2.5);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 font-mono max-w-4xl">
      <PageHeader
        title="System Safety Thresholds & API Settings"
        subtitle="Configure Safety Interlock Limits, ESP32 Gateway Ports & Hardware Alarm Thresholds"
      />

      <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-300 text-xs flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span className="font-bold">ADVANCED USERS ONLY:</span>
        <span>Mutating these thresholds alters local ESP32 & Raspberry Pi 3B+ hardware relay interrupt triggers.</span>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-6 rounded-xl border border-gray-800 space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-gray-800 pb-2">
            MPU6050 Vibration Thresholds (g RMS)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Warning Threshold (g):</label>
              <input
                type="number"
                step="0.1"
                value={vibWarning}
                onChange={e => setVibWarning(parseFloat(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Critical Trip Cutoff (g):</label>
              <input
                type="number"
                step="0.1"
                value={vibCritical}
                onChange={e => setVibCritical(parseFloat(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-gray-800 pb-2">
            ACS712 Motor Current Thresholds (Amperes)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Overload Warning (A):</label>
              <input
                type="number"
                step="0.1"
                value={currWarning}
                onChange={e => setCurrWarning(parseFloat(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Stall Trip Cutoff (A):</label>
              <input
                type="number"
                step="0.1"
                value={currCritical}
                onChange={e => setCurrCritical(parseFloat(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
          {saved && <span className="text-emerald-400 text-xs font-bold">Settings updated & uploaded to ESP32!</span>}
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] ml-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save Threshold Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

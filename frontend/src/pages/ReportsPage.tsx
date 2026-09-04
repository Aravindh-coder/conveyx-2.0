import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { FileText, Printer, Calendar, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { conveyor, company, incidents, alerts, events } = useTelemetry();
  const [period, setPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <PageHeader
          title="Fleet Health & Condition Monitoring Reports"
          subtitle="Generate & Print Compliance Reports for Audit & Maintenance Teams"
          actions={
            <div className="flex space-x-2">
              <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-0.5 text-xs font-mono">
                {(['Daily', 'Weekly', 'Monthly'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                      period === p ? 'bg-cyan-500 text-black shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-extrabold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Report</span>
              </button>
            </div>
          }
        />
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-[#0B0F17] print:bg-white print:text-black border border-gray-800 print:border-none rounded-xl p-8 space-y-6 font-mono">
        {/* Report Banner Header */}
        <div className="flex justify-between items-start border-b border-gray-800 print:border-gray-300 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white print:text-black">
              CONVEYX 2.0 — {period.toUpperCase()} INDUSTRIAL HEALTH REPORT
            </h1>
            <p className="text-xs text-cyan-400 print:text-blue-700 font-semibold mt-1">
              Facility: {company?.companyName || 'ABC Cement & Mining Corp'} • {company?.siteName || 'Plant A – Primary Crusher'}
            </p>
          </div>
          <div className="text-right text-xs text-gray-400 print:text-gray-600">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p>Report Period: {period}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-cyan-950 text-cyan-400 print:bg-gray-200 print:text-black rounded text-[10px] font-bold">
              DEMO / SIMULATED DATA
            </span>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-gray-950 print:bg-gray-100 rounded-lg border border-gray-800 print:border-gray-300">
            <span className="text-gray-500 print:text-gray-700 block text-[10px]">TOTAL CONVEYORS</span>
            <span className="text-lg font-bold text-white print:text-black">1 SYSTEM</span>
          </div>
          <div className="p-4 bg-gray-950 print:bg-gray-100 rounded-lg border border-gray-800 print:border-gray-300">
            <span className="text-gray-500 print:text-gray-700 block text-[10px]">CURRENT HEALTH</span>
            <span className={`text-lg font-bold ${conveyor.healthPercent > 80 ? 'text-emerald-400 print:text-green-700' : 'text-rose-400 print:text-red-700'}`}>
              {conveyor.healthPercent}%
            </span>
          </div>
          <div className="p-4 bg-gray-950 print:bg-gray-100 rounded-lg border border-gray-800 print:border-gray-300">
            <span className="text-gray-500 print:text-gray-700 block text-[10px]">INCIDENTS LOGGED</span>
            <span className="text-lg font-bold text-amber-400 print:text-amber-700">{incidents.length}</span>
          </div>
          <div className="p-4 bg-gray-950 print:bg-gray-100 rounded-lg border border-gray-800 print:border-gray-300">
            <span className="text-gray-500 print:text-gray-700 block text-[10px]">SHIFT UPTIME</span>
            <span className="text-lg font-bold text-cyan-400 print:text-blue-700">99.4%</span>
          </div>
        </div>

        {/* Telemetry Summary Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 print:text-black">
            Conveyor Health & Sensor Baseline Summary
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-800 print:border-gray-300 text-gray-500 print:text-gray-700 text-[10px]">
                <th className="py-2">System ID</th>
                <th className="py-2">Conveyor Name</th>
                <th className="py-2">Status</th>
                <th className="py-2">Health</th>
                <th className="py-2">Vibration RMS</th>
                <th className="py-2">Motor Current</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 print:divide-gray-200">
              <tr>
                <td className="py-3 font-bold text-white print:text-black">{conveyor.id}</td>
                <td className="py-3 text-gray-300 print:text-gray-800">{conveyor.name}</td>
                <td className="py-3">
                  <span className="font-bold text-emerald-400 print:text-green-700">{conveyor.status}</span>
                </td>
                <td className="py-3 font-bold text-white print:text-black">{conveyor.healthPercent}%</td>
                <td className="py-3 text-gray-300 print:text-gray-800">{conveyor.vibrationRmsG} g</td>
                <td className="py-3 text-gray-300 print:text-gray-800">{conveyor.motorCurrentA} A</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Incidents Summary Section */}
        <div className="space-y-2 pt-4 border-t border-gray-800 print:border-gray-300">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 print:text-black">
            Recorded Incident Summary
          </h3>
          {incidents.length === 0 ? (
            <p className="text-xs text-gray-500 print:text-gray-600">No incidents recorded during this report window.</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 print:border-gray-300 text-gray-500 print:text-gray-700 text-[10px]">
                  <th className="py-2">Incident ID</th>
                  <th className="py-2">Condition</th>
                  <th className="py-2">Severity</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900 print:divide-gray-200">
                {incidents.map(inc => (
                  <tr key={inc.id}>
                    <td className="py-2 font-bold text-white print:text-black">{inc.id}</td>
                    <td className="py-2 text-gray-300 print:text-gray-800">{inc.condition}</td>
                    <td className="py-2 text-rose-400 print:text-red-700 font-bold">{inc.severity}</td>
                    <td className="py-2 text-amber-400 print:text-amber-700">{inc.status}</td>
                    <td className="py-2 text-gray-400 print:text-gray-600">{inc.resolutionNotes || 'In Progress'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Signatures Footer for Print */}
        <div className="pt-8 border-t border-gray-800 print:border-gray-400 flex justify-between text-xs text-gray-500 print:text-black">
          <div>
            <p>Chief Safety Engineer Signature:</p>
            <p className="mt-8 border-b border-gray-700 print:border-black w-48"></p>
          </div>
          <div>
            <p>Control Room Manager Approval:</p>
            <p className="mt-8 border-b border-gray-700 print:border-black w-48"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

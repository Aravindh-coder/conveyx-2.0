import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { PhoneCall, ShieldAlert, CheckCircle2, AlertTriangle, Send, Radio, MessageSquare } from 'lucide-react';

export const SosPage: React.FC = () => {
  const { sosMessages, triggerSos, company, conveyor } = useTelemetry();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency SOS Dispatch Center"
        subtitle="SIM800L GSM Emergency Alert System & SMS Alert Preview"
        badge={<span className="px-2.5 py-1 rounded bg-rose-950 text-rose-400 font-mono text-xs font-bold border border-rose-500/30">SIM800L GSM DISPATCH ARMED</span>}
        actions={
          <button
            onClick={() => triggerSos('EMERGENCY MANUAL SOS BUTTON PRESSED')}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(225,29,72,0.5)] flex items-center space-x-2 animate-pulse"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>TRIGGER MANUAL SOS ALARM</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info & SIM800L Status */}
        <div className="space-y-4">
          <div className="glass-panel rounded-xl p-4 border border-gray-800 space-y-3 font-mono">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>SIM800L Edge Hardware Gateway</span>
            </h3>
            <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 space-y-1.5 text-xs text-gray-300">
              <div className="flex justify-between"><span>GSM Status:</span><span className="text-emerald-400 font-bold">READY / CONNECTED</span></div>
              <div className="flex justify-between"><span>Signal Strength:</span><span className="text-cyan-400 font-bold">CSQ 28 (-67 dBm)</span></div>
              <div className="flex justify-between"><span>Baud Rate:</span><span className="text-gray-400">9600 bps UART</span></div>
              <div className="flex justify-between"><span>Sim Card:</span><span className="text-gray-400">Industrial SIM (Active)</span></div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-gray-800 space-y-3 font-mono text-xs">
            <h3 className="font-bold uppercase tracking-wider text-gray-300 flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Emergency Dispatch Recipients</span>
            </h3>
            <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 space-y-2">
              <div>
                <span className="text-gray-500 text-[10px] block">PRIMARY ADMINISTRATOR</span>
                <p className="text-white font-bold">{company?.adminName || 'Aravindh (Chief Engineer)'}</p>
                <p className="text-cyan-400">{company?.adminMobile || '+91 98765 43210'}</p>
              </div>
              <div className="pt-2 border-t border-gray-900">
                <span className="text-gray-500 text-[10px] block">EMERGENCY CONTROL ROOM</span>
                <p className="text-white font-bold">{company?.emergencyContactName || 'Safety Control Room'}</p>
                <p className="text-rose-400 font-bold">{company?.emergencyContactMobile || '+91 91234 56789'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live SMS Preview Template Box */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Simulated Emergency SMS Alert Template</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                DEMO / SIMULATED DATA
              </span>
            </div>

            {/* Exact Prompt Formatted SMS Box */}
            <div className="bg-black/90 p-5 rounded-xl border border-rose-500/40 shadow-[0_0_20px_rgba(225,29,72,0.15)] font-mono text-xs text-rose-300 space-y-1 font-semibold leading-relaxed">
              <p className="text-rose-400 font-extrabold tracking-wider">CONVEYX EMERGENCY ALERT</p>
              <p>Company: <span className="text-white">{company?.companyName || 'ABC Cement & Mining Corp'}</span></p>
              <p>Site: <span className="text-white">{company?.siteName || 'Plant A – Primary Crusher'}</span></p>
              <p>Conveyor: <span className="text-white">{conveyor?.id || 'C-01'}</span></p>
              <p>Status: <span className="text-rose-400 font-bold">{conveyor?.riskLevel || 'CRITICAL'}</span></p>
              <p>Detected: <span className="text-amber-300">Abnormal vibration + elevated current</span></p>
              <p>Risk: <span className="text-rose-400 font-bold">{conveyor?.riskScore || 94}/100</span></p>
              <p>Action: <span className="text-emerald-400 font-bold">Conveyor automatically stopped via Interlock Relay</span></p>
              <p>Incident: <span className="text-cyan-400 font-bold">INC-2026-0001</span></p>
              <p className="text-gray-400 pt-1 border-t border-rose-900/50 mt-2">Please inspect the conveyor before restart.</p>
            </div>
            <p className="text-[11px] font-mono text-gray-500 italic">
              Notice: Automatic SMS dispatch triggered by SIM800L module over UART upon 90+ risk score detection.
            </p>
          </div>

          {/* SOS Dispatch Log Table */}
          <div className="glass-panel rounded-xl p-4 border border-gray-800 space-y-3 font-mono text-xs">
            <h3 className="font-bold uppercase tracking-wider text-gray-300">Emergency Alert History Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-[10px] uppercase border-b border-gray-800">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Condition</th>
                    <th className="pb-2">Recipient</th>
                    <th className="pb-2">Delivery State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900">
                  {sosMessages.map(sos => (
                    <tr key={sos.id} className="hover:bg-gray-900/40">
                      <td className="py-2.5 font-bold text-white">{sos.id}</td>
                      <td className="py-2.5 text-gray-400">{new Date(sos.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2.5 text-amber-300">{sos.detectedCondition}</td>
                      <td className="py-2.5 text-cyan-400">{sos.recipientMobile}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-500/30 flex items-center w-max space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{sos.deliveryState}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

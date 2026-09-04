import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { User, ShieldCheck, Key, Mail, Phone, Building } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { company } = useTelemetry();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operator User Profile"
        subtitle="Active Credentials & Industrial Safety Engineer Permissions"
        badge={<span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">CHIEF OPERATOR PERMISSIONS</span>}
      />

      <div className="max-w-2xl glass-panel rounded-xl p-6 border border-gray-800 space-y-6 font-mono text-xs">
        <div className="flex items-center space-x-4 border-b border-gray-800 pb-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-2xl text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            A
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{company?.adminName || 'Aravindh (Chief Engineer)'}</h2>
            <p className="text-cyan-400 font-semibold">{company?.designation || 'Head of Operations & Industrial Safety'}</p>
            <p className="text-gray-500 text-[11px] mt-0.5">{company?.companyName || 'ABC Cement & Mining Corp'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-gray-300 uppercase tracking-wider">Account Information</h3>
          <div className="space-y-2 text-gray-300">
            <div className="flex items-center justify-between p-3 bg-gray-950 rounded-lg border border-gray-800">
              <span className="text-gray-500 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Email Address</span>
              </span>
              <span className="text-white font-bold">{company?.adminEmail || 'admin@abccement.com'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-950 rounded-lg border border-gray-800">
              <span className="text-gray-500 flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Mobile Dispatch Line</span>
              </span>
              <span className="text-emerald-400 font-bold">{company?.adminMobile || '+91 98765 43210'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-950 rounded-lg border border-gray-800">
              <span className="text-gray-500 flex items-center space-x-2">
                <Building className="w-4 h-4 text-amber-400" />
                <span>Assigned Site</span>
              </span>
              <span className="text-white">{company?.siteName || 'Plant A – Primary Crusher'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized SCADA Motor Interlock Access</span>
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Your account holds level-4 authorization to issue remote motor Start/Stop commands, override latched critical faults, and trigger manual SIM800L emergency SMS dispatches.
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Building2, MapPin, UserCheck, PhoneCall, SlidersHorizontal, Cpu, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompanyPage: React.FC = () => {
  const { company, conveyor } = useTelemetry();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization & Site Configuration"
        subtitle="Registered Enterprise Profile, Emergency Contacts & Fleet Units"
        actions={
          <Link
            to="/onboarding"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-extrabold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center space-x-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>Re-Run Setup Wizard</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        {/* Company Info Box */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-3 text-cyan-400 border-b border-gray-800 pb-3">
            <Building2 className="w-6 h-6" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase">Company & Industry</h2>
              <p className="text-[11px] text-gray-500">Corporate entity registration details</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Company Name:</span>
              <span className="text-white font-bold">{company?.companyName || 'ABC Cement & Mining Corp'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Industry:</span>
              <span className="text-cyan-400 font-bold">{company?.industry || 'Mining & Cement'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Company ID:</span>
              <span className="text-gray-400">{company?.companyId || 'COMP-2026-88'}</span>
            </div>
          </div>
        </div>

        {/* Site & Location Box */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-3 text-cyan-400 border-b border-gray-800 pb-3">
            <MapPin className="w-6 h-6" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase">Active Site & Location</h2>
              <p className="text-[11px] text-gray-500">Operational plant and sensor block</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Plant / Site Name:</span>
              <span className="text-white font-bold">{company?.siteName || 'Plant A – Primary Crusher'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Block / Location:</span>
              <span className="text-gray-300">{company?.location || 'Iron Ore Shaft 4, Block B'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Primary Conveyors:</span>
              <span className="text-emerald-400 font-bold">1 System Active</span>
            </div>
          </div>
        </div>

        {/* Admin Contact Box */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-3 text-cyan-400 border-b border-gray-800 pb-3">
            <UserCheck className="w-6 h-6" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase">Chief Safety Administrator</h2>
              <p className="text-[11px] text-gray-500">Designated control room engineer</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Name:</span>
              <span className="text-white font-bold">{company?.adminName || 'Aravindh (Chief Engineer)'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Designation:</span>
              <span className="text-cyan-400">{company?.designation || 'Head of Operations & Safety'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Mobile Line:</span>
              <span className="text-emerald-400 font-bold">{company?.adminMobile || '+91 98765 43210'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-400">{company?.adminEmail || 'admin@abccement.com'}</span>
            </div>
          </div>
        </div>

        {/* Emergency SOS Contact Box */}
        <div className="glass-panel rounded-xl p-5 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-3 text-rose-400 border-b border-gray-800 pb-3">
            <PhoneCall className="w-6 h-6" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase">Emergency SOS Recipient</h2>
              <p className="text-[11px] text-gray-500">SIM800L GSM SMS dispatch recipient</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Recipient Name:</span>
              <span className="text-white font-bold">{company?.emergencyContactName || 'Safety Control Room'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Dispatch Number:</span>
              <span className="text-rose-400 font-bold">{company?.emergencyContactMobile || '+91 91234 56789'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900">
              <span className="text-gray-500">Edge Node SmartPod:</span>
              <span className="text-cyan-400 font-bold">{company?.smartPodId || 'POD-2026-NODE1'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

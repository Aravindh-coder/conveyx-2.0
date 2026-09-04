import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelemetry } from '../context/TelemetryContext';
import { OnboardingData } from '@shared/types';
import { Building2, MapPin, UserCheck, PhoneCall, SlidersHorizontal, Cpu, CheckCircle2, ChevronRight, ChevronLeft, ShieldAlert } from 'lucide-react';

const INDUSTRIES = [
  'Mining',
  'Cement',
  'Steel',
  'Power',
  'Ports & Marine',
  'Manufacturing',
  'Warehousing',
  'Logistics',
  'Food Processing',
  'Automotive',
  'Chemical',
  'Other'
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { submitOnboarding, enableSimulation } = useTelemetry();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<OnboardingData>({
    companyName: 'ABC Mining & Cement Ltd',
    industry: 'Mining',
    companyId: 'COMP-2026-99',
    siteName: 'Plant A – Primary Crusher Line',
    location: 'Iron Ore Shaft 4, Block B',
    adminName: 'Aravindh',
    adminMobile: '+91 98765 43210',
    adminEmail: 'aravindh@abccement.com',
    designation: 'Chief Safety Engineer',
    emergencyContactName: 'Central Control Room',
    emergencyContactMobile: '+91 91234 56789',
    conveyorName: 'C-01 Primary Overland Ore Conveyor',
    conveyorId: 'C-01',
    smartPodId: 'POD-2026-NODE1'
  });

  const handleChange = (field: keyof OnboardingData, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    await submitOnboarding(formData);
    enableSimulation();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-4">
      {/* Top Header */}
      <div className="w-full max-w-2xl mb-6 text-center">
        <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-3">
          <ShieldAlert className="w-4 h-4" />
          <span>CONVEYX 2.0 — ENTERPRISE SETUP WIZARD</span>
        </div>
        <h1 className="text-2xl font-bold font-mono text-white">Facility Onboarding & SmartPod Setup</h1>
        <p className="text-xs font-mono text-gray-400 mt-1">Configure your industrial site, edge gateway, and emergency contacts</p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="w-full max-w-2xl bg-gray-900/80 p-3 rounded-xl border border-gray-800 mb-6 flex justify-between items-center text-xs font-mono">
        {[
          { num: 1, label: 'Company' },
          { num: 2, label: 'Site' },
          { num: 3, label: 'Admin' },
          { num: 4, label: 'Emergency' },
          { num: 5, label: 'Conveyor' },
          { num: 6, label: 'SmartPod' },
          { num: 7, label: 'Complete' }
        ].map(s => (
          <div key={s.num} className="flex flex-col items-center space-y-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step === s.num ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' :
              step > s.num ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-gray-800 text-gray-500'
            }`}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span className={`text-[10px] hidden sm:block ${step === s.num ? 'text-cyan-300 font-bold' : 'text-gray-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Step Container */}
      <div className="w-full max-w-2xl bg-[#0B0F17] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Step 1: Company */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-cyan-400 border-b border-gray-800 pb-3">
              <Building2 className="w-6 h-6" />
              <div>
                <h2 className="text-base font-mono font-bold text-white">Step 1: Company Profile</h2>
                <p className="text-xs font-mono text-gray-400">Enter organization details & primary industrial sector</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={e => handleChange('companyName', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">Industry Sector</label>
              <select
                value={formData.industry}
                onChange={e => handleChange('industry', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
              >
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Site */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-cyan-400 border-b border-gray-800 pb-3">
              <MapPin className="w-6 h-6" />
              <div>
                <h2 className="text-base font-mono font-bold text-white">Step 2: Plant & Site Location</h2>
                <p className="text-xs font-mono text-gray-400">Specify operational plant name and geographical block</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">Site Name</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={e => handleChange('siteName', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">Facility Location / Block</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => handleChange('location', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Administrator */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-cyan-400 border-b border-gray-800 pb-3">
              <UserCheck className="w-6 h-6" />
              <div>
                <h2 className="text-base font-mono font-bold text-white">Step 3: Chief Administrator</h2>
                <p className="text-xs font-mono text-gray-400">Primary engineer receiving critical dashboard alerts</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">Admin Full Name</label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={e => handleChange('adminName', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={e => handleChange('designation', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">Mobile Number (SMS)</label>
                <input
                  type="text"
                  value={formData.adminMobile}
                  onChange={e => handleChange('adminMobile', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">Official Email</label>
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={e => handleChange('adminEmail', e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Emergency Contact */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-cyan-400 border-b border-gray-800 pb-3">
              <PhoneCall className="w-6 h-6" />
              <div>
                <h2 className="text-base font-mono font-bold text-white">Step 4: Emergency SOS Recipient</h2>
                <p className="text-xs font-mono text-gray-400">Target SIM800L GSM emergency dispatch line</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">Emergency Contact / Control Room</label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={e => handleChange('emergencyContactName', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">Emergency Mobile Line (+91 GSM)</label>
              <input
                type="text"
                value={formData.emergencyContactMobile}
                onChange={e => handleChange('emergencyContactMobile', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 5: Conveyor */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-cyan-400 border-b border-gray-800 pb-3">
              <SlidersHorizontal className="w-6 h-6" />
              <div>
                <h2 className="text-base font-mono font-bold text-white">Step 5: Primary Conveyor System</h2>
                <p className="text-xs font-mono text-gray-400">Configure conveyor ID and descriptive system label</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">Conveyor ID</label>
              <input
                type="text"
                value={formData.conveyorId}
                onChange={e => handleChange('conveyorId', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">Conveyor System Name</label>
              <input
                type="text"
                value={formData.conveyorName}
                onChange={e => handleChange('conveyorName', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 6: SmartPod */}
        {step === 6 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-cyan-400 border-b border-gray-800 pb-3">
              <Cpu className="w-6 h-6" />
              <div>
                <h2 className="text-base font-mono font-bold text-white">Step 6: SmartPod Edge Node</h2>
                <p className="text-xs font-mono text-gray-400">Pair Raspberry Pi 3B+ / ESP32 edge telemetry box</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">SmartPod Device ID</label>
              <input
                type="text"
                value={formData.smartPodId}
                onChange={e => handleChange('smartPodId', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-lg text-xs font-mono text-cyan-300 space-y-1">
              <p className="font-bold">Hardware Prototype Specs Paired:</p>
              <p className="text-gray-400">• Raspberry Pi 3B+ Edge Processing Node</p>
              <p className="text-gray-400">• MPU6050 + ACS712 + DS18B20 + A3144 Hall + SIM800L GSM</p>
            </div>
          </div>
        )}

        {/* Step 7: Complete */}
        {step === 7 && (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h2 className="text-lg font-mono font-bold text-white">Onboarding Setup Complete!</h2>
            <p className="text-xs font-mono text-gray-300 max-w-md mx-auto">
              Your site <span className="text-cyan-400 font-bold">{formData.siteName}</span> and conveyor system <span className="text-cyan-400 font-bold">{formData.conveyorName}</span> are now registered.
            </p>
            <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 text-left text-xs font-mono text-gray-400 space-y-1 max-w-md mx-auto">
              <div className="flex justify-between"><span>Company:</span><span className="text-white font-bold">{formData.companyName}</span></div>
              <div className="flex justify-between"><span>Emergency Line:</span><span className="text-emerald-400 font-bold">{formData.emergencyContactMobile}</span></div>
              <div className="flex justify-between"><span>SmartPod Node:</span><span className="text-cyan-400 font-bold">{formData.smartPodId}</span></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 font-mono text-xs font-bold transition-all flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 7 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-extrabold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center space-x-1"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center space-x-2"
            >
              <span>LAUNCH CONTROL ROOM DASHBOARD</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

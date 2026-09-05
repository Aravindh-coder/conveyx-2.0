import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';
import {
  ShieldAlert, Activity, Zap, ArrowRight, PlaySquare, Lock,
  Mail, Eye, EyeOff, CheckCircle, PhoneCall, Radio, Building2,
  UserPlus, LogIn, AlertTriangle, Cpu, ChevronRight, Globe,
  BarChart3, Shield, Waves, Flame, AlertOctagon, XCircle,
  Layers, Wrench, Sparkles, CheckCircle2, Server, Terminal, Smartphone
} from 'lucide-react';

/* ─── Industry Problems Data ─── */
const INDUSTRY_PROBLEMS = [
  {
    title: 'Catastrophic Unplanned Downtime',
    desc: 'Mining & material handling conveyor halts cost up to $50,000/hour in lost production and idle labor.',
    stat: '$50K/hr',
    statLabel: 'Downtime Cost'
  },
  {
    title: 'Undetected Belt Tear Propagation',
    desc: 'Tramp metal or sharp iron ore causes longitudinal belt tears extending hundreds of meters before manual detection.',
    stat: '100m+',
    statLabel: 'Ripped Belt Length'
  },
  {
    title: 'Motor Burnout & Roller Seizure',
    desc: 'Unmonitored drive roller bearing degradation causes friction buildup, current overload spikes, and motor failure.',
    stat: '68%',
    statLabel: 'Motor Failures from Heat'
  },
  {
    title: 'High-Risk Manual Inspections',
    desc: 'Infrequent visual walkthroughs expose technicians to hazardous rotating shaft environments while missing micro-vibrations.',
    stat: 'Periodic',
    statLabel: 'Delayed Monitoring'
  }
];

/* ─── Existing Solutions Limitations ─── */
const EXISTING_LIMITATIONS = [
  {
    solution: 'Traditional SCADA & PLCs',
    limitations: [
      'Extremely high cost & complex installation',
      'No AI or predictive anomaly detection',
      'No automated hardware safety interlock relay',
      'Requires full control room overhaul'
    ]
  },
  {
    solution: 'Manual Visual Walkthroughs',
    limitations: [
      'Reactive — faults detected only after destruction',
      'Subjective human error & safety hazards',
      'Cannot measure internal bearing vibration/current',
      'High labor & downtime inspection costs'
    ]
  },
  {
    solution: 'Single-Metric Sensor Products',
    limitations: [
      'Lacks multi-sensor data fusion (vibration + load + temp)',
      'High false alarm rates from isolated readings',
      'No optical belt alignment tracking',
      'No mobile GSM/SMS emergency dispatch'
    ]
  }
];

/* ─── Our Solution Pillars ─── */
const OUR_SOLUTION_PILLARS = [
  {
    icon: Activity,
    color: '#10B981',
    title: 'Edge-AI Damage Prediction',
    desc: 'Continuous real-time multi-sensor fusion engine predicts failures before belt rupture or bearing seizure occurs.'
  },
  {
    icon: Cpu,
    color: '#06B6D4',
    title: 'Multi-Sensor SmartPod Node',
    desc: 'Compact IP67 enclosure integrating MPU6050 vibration, ACS712 current, DS18B20 temp, and optical IR tracking.'
  },
  {
    icon: AlertOctagon,
    color: '#EF4444',
    title: 'Automated Interlock Safety Relay',
    desc: 'Hardware relay cuts 5V DC motor power instantly upon critical risk trip without waiting for manual intervention.'
  },
  {
    icon: PhoneCall,
    color: '#F59E0B',
    title: 'GSM/SMS Emergency SOS Dispatch',
    desc: 'SIM800L module sends automated SMS emergency alerts directly to site engineers and control room admins.'
  }
];

/* ─── Technical Stack ─── */
const TECH_STACK = [
  {
    category: 'Edge Processing & Compute',
    items: [
      { name: 'Raspberry Pi 3B+', role: 'Edge AI Gateway & OpenCV Inference' },
      { name: 'ESP32 SmartPod MCU', role: 'Sensor Sampling & WiFi/MQTT Stream' },
      { name: 'ADS1115 ADC Module', role: 'High-Precision 16-Bit Analog Conversion' }
    ]
  },
  {
    category: 'Industrial Sensor Array',
    items: [
      { name: 'MPU6050 Accelerometer', role: '3-Axis Drive Bearing Vibration RMS' },
      { name: 'ACS712 Current Sensor', role: '20A Motor Current & Mechanical Stall' },
      { name: 'DS18B20 Thermal Array', role: 'Infrared Thermal Surface Heatmap' },
      { name: 'Optical IR Tracking', role: 'Dual Left/Right Belt Alignment Guides' },
      { name: 'IR Camera Module', role: 'Vision Inspection for Crack & Tear' }
    ]
  },
  {
    category: 'Safety & Emergency Hardware',
    items: [
      { name: 'SIM800L GSM Module', role: 'Direct Cellular SMS Emergency Dispatch' },
      { name: 'Safety Interlock Relay', role: 'Normally-Closed 5V Power Interlock' },
      { name: '5V DC Drive Motor', role: 'Primary Pulley & Belt Testbed Actuator' }
    ]
  },
  {
    category: 'Software & SCADA Web App',
    items: [
      { name: 'React 18 + TypeScript', role: 'Real-Time SCADA Digital Twin UI' },
      { name: 'Node.js + Express', role: 'High-Throughput Telemetry API Gateway' },
      { name: 'Socket.IO WebSockets', role: 'Bi-Directional Telemetry Tick Stream' }
    ]
  }
];

const INDUSTRIES = [
  'Mining & Ore Handling', 'Cement & Aggregate', 'Steel Mills', 'Power Generation',
  'Port Bulk Terminals', 'Logistics & Distribution', 'Chemical Processing'
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enableSimulation, submitOnboarding } = useTelemetry();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);

  // Register fields
  const [regCompany, setRegCompany] = useState('');
  const [regIndustry, setRegIndustry] = useState('Mining');
  const [regSite, setRegSite] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const clearMessages = () => { setError(''); setSuccess(''); };

  /* ─── Handlers ─── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Email and password are required.'); return; }
    clearMessages();
    setIsLoading(true);
    try {
      if (remember) localStorage.setItem('conveyx_email', email);
      await login(email, password);
      setSuccess('Authenticated — redirecting to dashboard…');
      setTimeout(() => { setIsLoading(false); navigate('/dashboard'); }, 500);
    } catch {
      setIsLoading(false);
      setError('Invalid credentials. Use the demo button to explore.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regCompany || !regSite || !regEmail || !regPass || !regName) {
      setError('Please fill all required fields.');
      return;
    }
    clearMessages();
    setIsLoading(true);
    try {
      await submitOnboarding({
        companyName: regCompany,
        industry: regIndustry,
        companyId: `COMP-${Date.now().toString(36).toUpperCase()}`,
        siteName: regSite,
        location: 'Site Alpha',
        adminName: regName,
        adminMobile: regPhone,
        adminEmail: regEmail,
        designation: 'Chief Engineer',
        emergencyContactName: 'Safety Control Room',
        emergencyContactMobile: regPhone,
        conveyorName: 'C-01 Primary Overland Ore Conveyor',
        conveyorId: 'C-01',
        smartPodId: 'POD-2026-NODE1',
      });
      await login(regEmail, regPass);
      enableSimulation();
      setSuccess('Site registered! Opening dashboard…');
      setTimeout(() => { setIsLoading(false); navigate('/dashboard'); }, 600);
    } catch {
      setIsLoading(false);
      setError('Registration failed. Check inputs and try again.');
    }
  };

  const handleDemo = async () => {
    clearMessages();
    setIsLoading(true);
    try { await login('demo.operator@conveyx.io', 'demo-conveyx-2026'); } catch {}
    enableSimulation();
    setSuccess('Demo mode activated — loading simulated telemetry…');
    setTimeout(() => { setIsLoading(false); navigate('/dashboard'); }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0C1322] text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className="relative z-50 border-b border-white/[0.08] bg-black/40 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[64px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10B981, #2563EB)', boxShadow: '0 0 20px rgba(16,185,129,0.35)' }}>
              <ShieldAlert className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[16px] font-extrabold tracking-wide text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                CONVEY<span className="text-emerald-400">X</span>
                <span className="text-slate-400 text-[13px] ml-1 font-medium">2.0</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider -mt-0.5">PREDICT BEFORE IT FAILS</div>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-gray-300">
            <a href="#problems" className="hover:text-emerald-400 transition-colors">Industry Problems</a>
            <a href="#prototype" className="hover:text-emerald-400 transition-colors">Hardware Prototype</a>
            <a href="#solution" className="hover:text-emerald-400 transition-colors">Our Solution</a>
            <a href="#techstack" className="hover:text-emerald-400 transition-colors">Tech Stack</a>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDemo}
              disabled={isLoading}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-300 border border-emerald-500/30 bg-emerald-950/60 hover:bg-emerald-900 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <PlaySquare className="w-4 h-4 text-emerald-400" />
              1-Click Demo
            </button>
            <button
              onClick={() => { setActiveTab('login'); document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO + AUTH ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ─ LEFT: Hero Copy (7 cols) ─ */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-wider text-emerald-300 uppercase"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered Conveyor Belt Damage Prediction & Safety System
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.08] tracking-tight text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Predict Before
                <br />
                <span className="text-gradient-cyan">It Fails.</span>
              </h1>
              <p className="text-[15px] text-slate-300 leading-relaxed max-w-xl font-sans">
                ConveyX 2.0 continuously monitors vibration, current, temperature, speed, and visual condition of industrial conveyor systems using Edge AI to predict failures, prevent unplanned downtime, and enforce safety interlock trips.
              </p>
            </div>

            {/* Workflow Steps Pill Bar */}
            <div className="space-y-3 font-mono">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">HOW IT WORKS: CLOSED-LOOP SAFETY WORKFLOW</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { step: 'SENSE', desc: 'Multi-Sensor Data' },
                  { step: 'ANALYZE', desc: 'Edge AI Anomaly' },
                  { step: 'PREDICT', desc: 'Failure Risk Score' },
                  { step: 'PROTECT', desc: 'Auto Relay Trip' },
                  { step: 'NOTIFY', desc: 'GSM SOS SMS' },
                  { step: 'DASHBOARD', desc: 'Live SCADA Twin' },
                ].map(({ step, desc }) => (
                  <div key={step} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-center">
                    <span className="block text-[11px] font-extrabold text-emerald-400">{step}</span>
                    <span className="text-[9.5px] text-slate-400 leading-tight block mt-0.5 font-sans">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={handleDemo} disabled={isLoading}
                className="btn-primary text-[13px] bg-emerald-600 hover:bg-emerald-500">
                <PlaySquare className="w-4 h-4" />
                Launch Demo Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-ghost text-[13px]">
                <UserPlus className="w-4 h-4" />
                Register Site Account
              </button>
            </div>

            {/* Target Sectors */}
            <div className="pt-3 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 font-mono">Target Industrial Sectors:</div>
              <div className="flex flex-wrap gap-1.5">
                {INDUSTRIES.map((ind) => (
                  <span key={ind}
                    className="px-3 py-1 rounded-lg text-[11px] font-mono font-medium text-slate-300 bg-slate-900 border border-slate-800">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ─ RIGHT: Auth Form Card (5 cols) ─ */}
          <div className="lg:col-span-5">
            <div id="auth-card" className="auth-card p-6 sm:p-8 w-full max-w-[460px] mx-auto">

              {/* Tab Switcher */}
              <div className="flex gap-1 p-1 mb-6 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); clearMessages(); }}
                  className={`tab-btn ${activeTab === 'login' ? 'active' : 'inactive'}`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); clearMessages(); }}
                  className={`tab-btn ${activeTab === 'register' ? 'active' : 'inactive'}`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register Site
                </button>
              </div>

              {/* Demo Mode Action Button */}
              <button
                type="button"
                onClick={handleDemo}
                disabled={isLoading}
                className="w-full mb-5 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 hover:bg-emerald-900 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] font-mono"
              >
                <PlaySquare className="w-4 h-4 text-emerald-400" />
                1-CLICK DEMO BENCH — NO LOGIN NEEDED
              </button>

              {/* Messages */}
              {error && (
                <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl text-xs text-rose-300 bg-rose-950/80 border border-rose-500/40">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 flex items-center gap-2.5 p-3.5 rounded-xl text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-500/40">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {success}
                </div>
              )}

              {/* LOGIN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">
                      Operator Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        name="conveyx_op_email"
                        autoComplete="off"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="input-field pl-10"
                        placeholder="operator@mining.conveyx.io"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        name="conveyx_op_pass"
                        autoComplete="new-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="input-field pl-10 pr-10"
                        placeholder="••••••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary justify-center mt-2 bg-emerald-600 hover:bg-emerald-500"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Authenticating…
                      </span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        Sign In to SCADA Dashboard
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* REGISTER FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3.5" autoComplete="off">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">Company</label>
                      <input type="text" name="reg_company_name" autoComplete="off" value={regCompany} onChange={e => setRegCompany(e.target.value)} required className="input-field" placeholder="Mining Corp" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">Site / Plant</label>
                      <input type="text" name="reg_site_name" autoComplete="off" value={regSite} onChange={e => setRegSite(e.target.value)} required className="input-field" placeholder="Plant A" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">Admin Name</label>
                      <input type="text" name="reg_admin_name" autoComplete="off" value={regName} onChange={e => setRegName(e.target.value)} required className="input-field" placeholder="Aravindh" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">GSM Phone</label>
                      <input type="text" name="reg_gsm_phone" autoComplete="off" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="input-field" placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">Email</label>
                    <input type="email" name="reg_user_email" autoComplete="off" value={regEmail} onChange={e => setRegEmail(e.target.value)} required className="input-field" placeholder="admin@mining.com" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-slate-300 mb-1.5">Password</label>
                    <input type="password" name="reg_user_password" autoComplete="new-password" value={regPass} onChange={e => setRegPass(e.target.value)} required className="input-field" placeholder="••••••••••••" />
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full btn-primary justify-center mt-2 bg-emerald-600 hover:bg-emerald-500">
                    {isLoading ? 'Setting Up...' : 'Register Site & Launch Dashboard'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: INDUSTRY PROBLEMS FACED TODAY ── */}
      <section id="problems" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-500/40 uppercase">
            <AlertTriangle className="w-4 h-4" />
            Industry Vulnerabilities Today
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            The Problems That Industry Faces Now
          </h2>
          <p className="text-slate-400 text-sm font-sans">
            Heavy industries relying on conveyor belts (mining, cement, steel, ports) suffer catastrophic operational bottlenecks due to legacy reactive maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRY_PROBLEMS.map((prob) => (
            <div key={prob.title} className="glass-panel p-6 rounded-2xl border border-rose-500/20 bg-slate-900/80 space-y-4 hover:border-rose-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-rose-400 font-mono">{prob.stat}</span>
                <span className="text-[10px] font-mono text-rose-300 uppercase px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40">{prob.statLabel}</span>
              </div>
              <h3 className="font-bold text-base text-white">{prob.title}</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{prob.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: EXISTING SOLUTIONS & LIMITATIONS ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 uppercase">
            <XCircle className="w-4 h-4" />
            Why Current Systems Fail
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Existing Solutions & Their Limitations
          </h2>
          <p className="text-slate-400 text-sm font-sans">
            Traditional condition monitoring tools are either prohibitively expensive, reactive after damage occurs, or lack automated physical interlock protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXISTING_LIMITATIONS.map((item) => (
            <div key={item.solution} className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-slate-900/80 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <XCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <h3 className="font-bold text-sm text-white font-mono">{item.solution}</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                {item.limitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: OUR SOLUTION (CONVEYX 2.0) ── */}
      <section id="solution" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 uppercase">
            <CheckCircle2 className="w-4 h-4" />
            The ConveyX 2.0 Breakthrough
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Our Next-Gen AI Solution
          </h2>
          <p className="text-slate-400 text-sm font-sans">
            A comprehensive, low-cost retrofit Edge-AI SmartPod ecosystem that senses, predicts, trips safety relays, and dispatches GSM SMS alerts before damage occurs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {OUR_SOLUTION_PILLARS.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-slate-900/90 space-y-4 hover:border-emerald-400 transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}25`, border: `1px solid ${color}60` }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-bold text-base text-white">{title}</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: FINAL HARDWARE PROTOTYPE SHOWCASE (THE USER'S IMAGE) ── */}
      <section id="prototype" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 uppercase">
            <Cpu className="w-4 h-4" />
            Physical Hardware Prototype & System Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ConveyX 2.0 Hardware Prototype
          </h2>
          <p className="text-slate-400 text-sm font-sans">
            Fully functional IP67 Multi-Sensor SmartPod with Edge AI Processing (Raspberry Pi 3B+), ESP32 MCU, GSM Emergency Dispatch, and Interlock Safety Relay.
          </p>
        </div>

        {/* Prototype Image Container */}
        <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-cyan-500/40 bg-slate-950 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
          <img
            src="/conveyx_prototype.jpg"
            alt="ConveyX 2.0 Hardware Prototype & Architecture Infographic"
            className="w-full h-auto rounded-2xl object-cover shadow-2xl border border-slate-800"
          />
        </div>
      </section>

      {/* ── SECTION 5: TECHNICAL STACK ── */}
      <section id="techstack" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-500/40 uppercase">
            <Server className="w-4 h-4" />
            Under The Hood Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Complete Technical Stack
          </h2>
          <p className="text-slate-400 text-sm font-sans">
            Industrial-grade hardware components integrated with high-performance real-time software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TECH_STACK.map((group) => (
            <div key={group.category} className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-4">
              <h3 className="font-mono text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                {group.category}
              </h3>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.name} className="flex items-start justify-between gap-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
                    <span className="font-bold text-white shrink-0">{item.name}</span>
                    <span className="text-slate-400 text-[11px] text-right font-sans">{item.role}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-slate-800 py-8 px-5 sm:px-8 bg-black/60 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10B981, #2563EB)' }}>
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">
              ConveyX 2.0 Industrial Safety
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Enterprise Industrial Conveyor Damage Prediction Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';
import {
  ShieldAlert, Activity, Zap, ArrowRight, PlaySquare, Lock,
  Mail, Eye, EyeOff, CheckCircle, PhoneCall, Radio, Building2,
  UserPlus, LogIn, AlertTriangle, Cpu, ChevronRight, Globe,
  BarChart3, Shield, Waves
} from 'lucide-react';

/* ─── Feature tiles data ─── */
const FEATURES = [
  {
    icon: Activity,
    color: '#10B981',
    title: 'Real-Time Telemetry',
    desc: 'MPU6050 vibration + ACS712 motor current at 1Hz sampling via Edge-AI node.',
  },
  {
    icon: Shield,
    color: '#8B5CF6',
    title: 'Predictive Risk Engine',
    desc: 'ML-powered fault detection with risk matrix scoring before failures occur.',
  },
  {
    icon: PhoneCall,
    color: '#F43F5E',
    title: 'SOS Emergency Dispatch',
    desc: 'SIM800L GSM module triggers SMS alerts to maintenance crew automatically.',
  },
  {
    icon: BarChart3,
    color: '#06B6D4',
    title: 'SCADA Dashboard',
    desc: 'Digital twin visualization, compliance reports, and historical analytics.',
  },
];

const INDUSTRIES = [
  'Mining', 'Cement', 'Steel', 'Power Generation',
  'Port & Marine', 'Manufacturing', 'Logistics', 'Food Processing',
];

const SENSORS = [
  { icon: Waves, color: '#10B981', name: 'MPU6050', sub: '3-axis vibration + bearing RMS' },
  { icon: Zap, color: '#F59E0B', name: 'ACS712', sub: 'Motor current & overload detection' },
  { icon: Radio, color: '#06B6D4', name: 'DS18B20 + A3144', sub: 'Thermal + belt speed / RPM' },
  { icon: PhoneCall, color: '#F43F5E', name: 'SIM800L', sub: 'Hardware SMS emergency dispatch' },
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
  const [email, setEmail] = useState(
    () => localStorage.getItem('conveyx_email') || 'operator@mining.conveyx.io'
  );
  const [password, setPassword] = useState('conveyx-pass');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);

  // Register fields
  const [regCompany, setRegCompany] = useState('ABC Mining Corp');
  const [regIndustry, setRegIndustry] = useState('Mining');
  const [regSite, setRegSite] = useState('Plant A – Crusher');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPhone, setRegPhone] = useState('+91 98765 43210');

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

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-landing text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Floating ambient orbs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb w-[600px] h-[600px] top-[-200px] left-[-150px]"
          style={{ background: 'rgba(6,182,212,0.06)' }} />
        <div className="orb w-[500px] h-[500px] bottom-[-100px] right-[-100px]"
          style={{ background: 'rgba(139,92,246,0.05)', animationDelay: '3s' }} />
        <div className="orb w-[300px] h-[300px] top-[40%] left-[60%]"
          style={{ background: 'rgba(16,185,129,0.04)', animationDelay: '6s' }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="relative z-50 border-b border-white/[0.06] bg-black/30 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06B6D4, #2563EB)', boxShadow: '0 0 20px rgba(6,182,212,0.35)' }}>
              <ShieldAlert className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-wide text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                CONVEY<span style={{ color: '#22D3EE' }}>X</span>
                <span className="text-slate-400 text-[13px] ml-1 font-medium">2.0</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wider -mt-0.5">NEXT-GEN INDUSTRIAL SAFETY</div>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDemo}
              disabled={isLoading}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 border border-white/[0.08] hover:border-white/[0.16] hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <PlaySquare className="w-4 h-4 text-cyan-400" />
              Try Demo
            </button>
            <button
              onClick={() => { setActiveTab('login'); document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #06B6D4, #2563EB)', boxShadow: '0 4px 15px rgba(6,182,212,0.3)' }}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO + AUTH ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ─ LEFT: Hero Copy ─ */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider text-cyan-300 uppercase"
              style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Enterprise Industrial Monitoring Platform
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.08] tracking-tight text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span style={{ color: '#FFFFFF' }}>Predict Before</span>
                <br />
                <span className="text-gradient-multi">It Fails.</span>
              </h1>
              <p className="text-[15px] text-slate-400 leading-relaxed max-w-xl">
                Edge-AI condition monitoring using multimodal sensing — vibration, motor current, thermal, speed — for mining, cement, steel & logistics conveyors.
              </p>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Closed-Loop Emergency Workflow</div>
              <div className="flex gap-1.5 flex-wrap">
                {['SENSE', 'ANALYZE', 'PREDICT', 'PROTECT', 'NOTIFY'].map((step, i) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <div className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {step}
                    </div>
                    {i < 4 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <button onClick={handleDemo} disabled={isLoading}
                className="btn-primary text-[13px]">
                <PlaySquare className="w-4 h-4" />
                Open Demo Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-ghost text-[13px]">
                <UserPlus className="w-4 h-4" />
                Register Your Site
              </button>
            </div>

            {/* Industry Tags */}
            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600">Target Sectors</div>
              <div className="flex flex-wrap gap-1.5">
                {INDUSTRIES.map((ind) => (
                  <span key={ind}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-400"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ─ RIGHT: Auth Card ─ */}
          <div id="auth-card" className="auth-card p-7 sm:p-8 w-full max-w-[460px] mx-auto lg:mx-0 lg:ml-auto">

            {/* Tab Switcher */}
            <div className="flex gap-1 p-1 mb-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
                Register
              </button>
            </div>

            {/* Demo Button */}
            <button
              type="button"
              onClick={handleDemo}
              disabled={isLoading}
              className="w-full mb-5 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[12.5px] font-bold text-cyan-300 transition-all hover:text-cyan-200"
              style={{
                background: 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.25)',
              }}
            >
              <PlaySquare className="w-4 h-4 text-cyan-400" />
              1-Click Demo Mode — No account needed
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                {activeTab === 'login' ? 'or sign in' : 'or create account'}
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl text-[12.5px] text-rose-300"
                style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 flex items-center gap-2.5 p-3.5 rounded-xl text-[12.5px] text-emerald-300"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* ── LOGIN FORM ── */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Operator Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="input-field pl-10"
                      placeholder="operator@mining.conveyx.io"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="input-field pl-10 pr-10"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-cyan-500"
                    />
                    <span className="text-[12px] text-slate-400">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary justify-center mt-1"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating…
                    </span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign In to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11.5px] text-slate-500 pt-1">
                  New site?{' '}
                  <button type="button" onClick={() => { setActiveTab('register'); clearMessages(); }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                    Create an account
                  </button>
                </p>
              </form>
            )}

            {/* ── REGISTER FORM ── */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Company Name <span className="text-rose-400">*</span>
                    </label>
                    <input type="text" value={regCompany} onChange={e => setRegCompany(e.target.value)}
                      required className="input-field" placeholder="ABC Mining Corp" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Industry
                    </label>
                    <select value={regIndustry} onChange={e => setRegIndustry(e.target.value)}
                      className="input-field" style={{ cursor: 'pointer' }}>
                      {['Mining', 'Cement', 'Steel', 'Power', 'Logistics', 'Manufacturing', 'Chemical'].map(i => (
                        <option key={i} value={i} style={{ background: '#0D1220' }}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Site / Plant <span className="text-rose-400">*</span>
                    </label>
                    <input type="text" value={regSite} onChange={e => setRegSite(e.target.value)}
                      required className="input-field" placeholder="Plant A – Crusher" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Admin Name <span className="text-rose-400">*</span>
                    </label>
                    <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                      required className="input-field" placeholder="Full name" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                        required className="input-field pl-10" placeholder="admin@company.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)}
                        required className="input-field pl-10" placeholder="min 8 chars" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Emergency GSM Number
                  </label>
                  <div className="relative">
                    <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                      className="input-field pl-10" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full btn-primary justify-center mt-1">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting up site…
                    </span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Register Site & Open Dashboard
                    </>
                  )}
                </button>

                <p className="text-center text-[11.5px] text-slate-500">
                  Already registered?{' '}
                  <button type="button" onClick={() => { setActiveTab('login'); clearMessages(); }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 border-t border-white/[0.05]">
        <div className="text-center mb-10">
          <div className="section-label mb-2">Platform Capabilities</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            End-to-End Industrial Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass-card glass-card-hover p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="text-[14px] font-bold text-white mb-1.5">{title}</h3>
              <p className="text-[12.5px] text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HARDWARE SPECS ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 border-t border-white/[0.05]">
        <div className="text-center mb-10">
          <div className="section-label mb-2">SmartPod Edge Node</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Raspberry Pi 3B+ Sensor Array
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SENSORS.map(({ icon: Icon, color, name, sub }) => (
            <div key={name} className="glass-card p-5 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-white mb-0.5">{name}</div>
                <div className="text-[12px] text-slate-500">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06B6D4, #2563EB)' }}>
              <ShieldAlert className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[13px] font-bold text-slate-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ConveyX 2.0
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
            <Globe className="w-3.5 h-3.5" />
            Enterprise Industrial Conveyor Safety & Predictive Maintenance Platform
          </div>
        </div>
      </footer>
    </div>
  );
};

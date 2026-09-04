import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';
import { ShieldAlert, Eye, EyeOff, Lock, Mail, ArrowRight, PlaySquare, CheckCircle2, ShieldCheck, Cpu, Activity, Sparkles, Building2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enableSimulation } = useTelemetry();

  // Saved credentials state
  const [email, setEmail] = useState<string>(() => {
    return localStorage.getItem('conveyx_saved_email') || 'operator@mining.conveyx.io';
  });
  const [password, setPassword] = useState<string>('conveyx-secure-pass');
  const [showPass, setShowPass] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter valid email and password credentials.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('conveyx_saved_email', email);
      } else {
        localStorage.removeItem('conveyx_saved_email');
      }

      await login(email, password);
      setSuccessMsg('Authenticated! Redirecting to SCADA Control Room...');
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setIsLoading(false);
      setError('Authentication failed. Check credentials or platform gateway connection.');
    }
  };

  const handleEnterDemoMode = async () => {
    setIsLoading(true);
    try {
      await login('demo.operator@conveyx.io', 'demo-conveyx-2026');
    } catch (e) {}
    enableSimulation();
    setSuccessMsg('Demo Mode Activated! Loading simulated SCADA data...');
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-tech-grid flex items-center justify-center p-4 sm:p-6 selection:bg-cyan-500 selection:text-black">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl border border-cyan-500/20 bg-[#070B12]/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        
        {/* Left Panel: Enterprise Platform Hero & Highlights */}
        <div className="lg:col-span-6 p-8 sm:p-12 bg-gradient-to-br from-cyan-950/50 via-slate-950 to-[#070B12] border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                <ShieldAlert className="w-6 h-6 text-black font-extrabold" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-tech tracking-wider text-white">
                  CONVEY <span className="text-cyan-400">X 2.0</span>
                </h1>
                <span className="text-[11px] font-mono text-cyan-400/80 block">Industrial SCADA Condition Monitoring</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-tech tracking-tight">
              Predictive Damage & Emergency Interlock System
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-3 leading-relaxed">
              Edge-AI multimodal sensing for mining, cement, steel, and heavy logistics conveyor belts. Real-time vibration, current, thermal & optical anomaly detection.
            </p>
          </div>

          {/* Core Feature Pills */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-900/60 border border-gray-800/80">
              <Activity className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <span className="text-white font-bold block">MPU6050 + ACS712 Telemetry</span>
                <span className="text-[10px] text-gray-500">Real-time vibration RMS & motor load current fusion</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-900/60 border border-gray-800/80">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-white font-bold block">Interlock Relay Auto-Shutdown</span>
                <span className="text-[10px] text-gray-500">Hardware safety stop upon critical fault detection</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-900/60 border border-gray-800/80">
              <Cpu className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-white font-bold block">SIM800L Emergency GSM SOS</span>
                <span className="text-[10px] text-gray-500">Instant SMS dispatch to control room emergency line</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-gray-500">
            <span>Enterprise Build v2.1.0</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>GATEWAY ACTIVE</span>
            </span>
          </div>
        </div>

        {/* Right Panel: Professional Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-[#070B12]">
          
          <div>
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider inline-block mb-3">
              CONTROL ROOM AUTHENTICATION
            </span>
            <h3 className="text-2xl font-bold font-tech text-white">Sign In to Dashboard</h3>
            <p className="text-xs text-gray-400 mt-1 font-mono">Select demo access or enter operator credentials</p>
          </div>

          {/* Prominent Instant Demo Button */}
          <button
            type="button"
            onClick={handleEnterDemoMode}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs uppercase font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center justify-center space-x-2"
          >
            <PlaySquare className="w-4 h-4" />
            <span>ENTER DEMO MODE (1-CLICK ACCESS)</span>
          </button>

          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-gray-800"></div>
            <span className="px-3 text-[10px] font-mono text-gray-500 uppercase font-bold">OR LOGIN WITH OPERATOR EMAIL</span>
            <div className="flex-1 border-t border-gray-800"></div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs font-mono text-rose-300">
              {error}
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs font-mono text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-gray-300 block mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                Operator Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-10 pr-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  placeholder="operator@mining.conveyx.io"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 block mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                Password / Security Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2.5 pl-10 pr-10 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center space-x-2 text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded bg-gray-950 border-gray-800 text-cyan-500 focus:ring-0"
                />
                <span>Store Credentials & Remember Session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE & LOG IN'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 text-cyan-400" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

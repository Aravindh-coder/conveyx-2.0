import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, Cpu, Layers, ArrowRight, CheckCircle2, Zap, Eye, PlaySquare, Lock } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-[#0B0F17]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-mono">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <ShieldAlert className="w-5 h-5 text-black font-extrabold" />
            </div>
            <span className="text-lg font-extrabold text-white tracking-wider">
              CONVEY <span className="text-cyan-400">X</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 text-xs font-bold transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/demo"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center space-x-1.5"
            >
              <PlaySquare className="w-4 h-4" />
              <span>Launch Test Bench</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Enterprise Mining Conveyor Health Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold font-mono tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Intelligent Conveyor Belt Joint Rupture & Damage Monitoring System
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-6 font-mono">
          Predict. Protect. Prevent. Real-time multi-sensor fusion, anomaly detection, and automated safety interlock for iron ore mining operations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            to="/demo"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center space-x-2"
          >
            <span>Interactive System Test Bench</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-mono font-bold text-sm border border-gray-700 transition-all flex items-center justify-center space-x-2"
          >
            <span>SCADA Mining Control Room</span>
          </Link>
        </div>
      </section>

      {/* Problem & Architecture Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            Hardware & Physics Architecture
          </h2>
          <h3 className="text-2xl font-extrabold font-mono text-white mt-2">
            Target Problem: Iron Ore Mining Belt Ruptures
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-3">
            <Activity className="w-8 h-8 text-emerald-400" />
            <h4 className="font-mono text-base font-bold text-white">MPU6050 Vibration</h4>
            <p className="text-xs text-gray-400 font-mono">
              3-axis accelerometer measuring drive roller bearing magnitude and RMS noise anomalies.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h4 className="font-mono text-base font-bold text-white">ACS712 Motor Current</h4>
            <p className="text-xs text-gray-400 font-mono">
              Real-time load current monitoring detecting mechanical resistance, belt jam & motor stall.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-3">
            <Cpu className="w-8 h-8 text-amber-400" />
            <h4 className="font-mono text-base font-bold text-white">IR Alignment Array</h4>
            <p className="text-xs text-gray-400 font-mono">
              Optical reflection sensors tracking physical belt wander & misalignment left/right.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-3">
            <Eye className="w-8 h-8 text-purple-400" />
            <h4 className="font-mono text-base font-bold text-white">AI Vision Module</h4>
            <p className="text-xs text-gray-400 font-mono">
              Computer vision camera scanning belt surface for transverse cracks, longitudinal tears & splice rupture.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

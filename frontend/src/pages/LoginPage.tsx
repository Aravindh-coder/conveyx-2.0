import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('operator@mining.conveyx.io');
  const [password, setPassword] = useState<string>('sih2026-secure-pass');
  const [showPass, setShowPass] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setIsLoading(false);
      setError('Invalid credentials or authentication server unreachable.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-6 bg-tech-grid font-mono">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-gray-800 shadow-2xl relative">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <ShieldAlert className="w-7 h-7 text-black font-extrabold" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wider">
            CONVEY <span className="text-cyan-400">X</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Intelligent Conveyor Health & Predictive Safety Platform
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 text-xs text-rose-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="text-gray-300 block mb-1.5 font-bold uppercase tracking-wider">
              Operator Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none"
                placeholder="operator@mining.conveyx.io"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 block mb-1.5 font-bold uppercase tracking-wider">
              Security Authorization Code / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-9 pr-10 text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <label className="flex items-center space-x-2 text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-cyan-500 focus:ring-0"
              />
              <span>Remember SCADA Session</span>
            </label>
            <span className="text-cyan-400 hover:underline cursor-pointer">Reset Credentials</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'AUTHENTICATING SYSTEM...' : 'AUTHENTICATE & LAUNCH CONTROL DASHBOARD'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Quick Demo Login Shortcut Buttons */}
        <div className="mt-8 pt-4 border-t border-gray-800">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2 text-center font-bold">
            Quick Operator Access Presets
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => { setEmail('operator@mining.conveyx.io'); }}
              className="px-2.5 py-1.5 rounded bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-center"
            >
              Chief Operator
            </button>
            <button
              onClick={() => { setEmail('safety@mining.conveyx.io'); }}
              className="px-2.5 py-1.5 rounded bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-center"
            >
              Safety Engineer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

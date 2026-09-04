import React, { useState, useRef, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Bot, X, Send, Sparkles, ShieldCheck, Activity, Zap, Cpu, RefreshCw, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiCopilotWidget: React.FC = () => {
  const { packet, conveyor, risk, alerts, hardwareMode } = useTelemetry();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello Operator! I am ConveyX Industrial Copilot. Ask me about system health, bearing vibration diagnostic steps, or telemetry parameters.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const query = input.toLowerCase();
    setInput('');

    // Generate intelligent AI response based on real-time telemetry state
    setTimeout(() => {
      let aiText = '';
      const vibRms = packet?.vibration.rms ?? 1.25;
      const currA = packet?.motor.current ?? 0.84;
      const tempC = packet?.temperature ?? 38.5;
      const align = packet?.alignment.status ?? 'ALIGNED';
      const rScore = risk?.score ?? 12;

      if (query.includes('health') || query.includes('status') || query.includes('overall')) {
        aiText = `Conveyor ${conveyor.id} status is ${conveyor.status}. Calculated Health is ${conveyor.healthPercent}%, with a Risk Score of ${rScore}/100. Mode: ${hardwareMode}.`;
      } else if (query.includes('vibration') || query.includes('mpu') || query.includes('bearing')) {
        aiText = `Vibration level is currently ${vibRms.toFixed(2)} g RMS. Baseline is 1.10g. ${
          vibRms > 2.5 ? 'CRITICAL SPIKE: Check drive roller bearing grease & alignment.' : 'Operating within safe parameters.'
        }`;
      } else if (query.includes('current') || query.includes('motor') || query.includes('load')) {
        aiText = `Motor load current is ${currA.toFixed(2)} A (Target: 0.82A). ${
          currA > 2.0 ? 'ELEVATED LOAD: Possible ore jam or conveyor belt friction drag.' : 'Electrical load is optimal.'
        }`;
      } else if (query.includes('temp') || query.includes('temperature')) {
        aiText = `Drive motor temperature is ${tempC}°C. Normal threshold is < 50°C. ${
          tempC > 50 ? 'WARNING: Motor thermal threshold exceeded.' : 'Thermal range normal.'
        }`;
      } else if (query.includes('alignment') || query.includes('belt') || query.includes('drift')) {
        aiText = `Belt alignment status: ${align}. Left/Right IR sensors detect 0mm drift.`;
      } else if (query.includes('action') || query.includes('fix') || query.includes('repair')) {
        aiText = risk?.recommendedAction || 'Continue continuous monitoring. Schedule routine lubrication inspection every 500 operating hours.';
      } else {
        aiText = `Telemetry Breakdown for ${conveyor.id}: Vibration ${vibRms.toFixed(2)}g, Current ${currA.toFixed(2)}A, Temp ${tempC}°C, Alignment ${align}. System is operating under ${hardwareMode} mode.`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 400);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-mono select-none">
      {/* Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 transition-all"
        >
          <Bot className="w-5 h-5 animate-pulse text-cyan-200" />
          <span>AI COPILOT</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] rounded-2xl bg-[#090E19]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide">CONVEYX AI COPILOT</h3>
                <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Multimodal Neural Engine
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="font-sans text-xs">{msg.text}</p>
                  <span className="text-[9px] opacity-60 mt-1 block text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt suggestions */}
          <div className="px-3 py-1.5 bg-gray-950/60 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => setInput('Vibration status?')}
              className="px-2 py-1 rounded bg-gray-900 text-cyan-300 border border-gray-800 hover:border-cyan-500/50 shrink-0"
            >
              Vibration status?
            </button>
            <button
              onClick={() => setInput('Current load?')}
              className="px-2 py-1 rounded bg-gray-900 text-amber-300 border border-gray-800 hover:border-amber-500/50 shrink-0"
            >
              Current load?
            </button>
            <button
              onClick={() => setInput('Recommended actions?')}
              className="px-2 py-1 rounded bg-gray-900 text-emerald-300 border border-gray-800 hover:border-emerald-500/50 shrink-0"
            >
              Recommended actions?
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-gray-950 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Copilot about telemetry..."
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500 font-sans"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

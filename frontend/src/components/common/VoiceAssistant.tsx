import React, { useState, useEffect, useRef } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Volume2, VolumeX, Mic, MicOff, Sparkles, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VoiceAssistant: React.FC = () => {
  const { alerts, conveyor, risk, setScenario } = useTelemetry();
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const lastAlertId = useRef<string | null>(null);

  // Audio Announcer for new critical alerts
  useEffect(() => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;

    const latestAlert = alerts[0];
    if (latestAlert && !latestAlert.acknowledged && latestAlert.id !== lastAlertId.current) {
      lastAlertId.current = latestAlert.id;
      if (latestAlert.severity === 'CRITICAL' || latestAlert.severity === 'HIGH') {
        const text = `Attention Operator. Alert detected: ${latestAlert.title}. ${latestAlert.description}.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [alerts, speechEnabled]);

  // Voice Command Handler
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback('Voice Recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening for commands...');
      setFeedback('');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript.toLowerCase();
      setTranscript(text);

      if (event.results[current].isFinal) {
        processCommand(text);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error);
      setIsListening(false);
      setFeedback('Speech recognition ended.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processCommand = (cmd: string) => {
    let speakReply = '';
    if (cmd.includes('dashboard') || cmd.includes('home')) {
      navigate('/dashboard');
      speakReply = 'Opening main control dashboard.';
    } else if (cmd.includes('vibration') || cmd.includes('sensor')) {
      navigate('/sensors/vibration');
      speakReply = 'Navigating to vibration telemetry page.';
    } else if (cmd.includes('alert') || cmd.includes('warning')) {
      navigate('/alerts');
      speakReply = 'Opening Alert Center.';
    } else if (cmd.includes('prediction') || cmd.includes('risk')) {
      navigate('/prediction');
      speakReply = 'Opening Predictive AI Engine.';
    } else if (cmd.includes('incident') || cmd.includes('log')) {
      navigate('/incidents');
      speakReply = 'Navigating to Incident Management.';
    } else if (cmd.includes('stop') || cmd.includes('emergency')) {
      setScenario('CRITICAL_FAILURE');
      speakReply = 'Emergency scenario injected. Interlock safety relay tripped.';
    } else if (cmd.includes('status') || cmd.includes('health')) {
      speakReply = `Conveyor status is ${conveyor.status}. Risk score is ${risk?.score || 12} out of 100.`;
    } else {
      speakReply = `Command recognized: "${cmd}". Available commands: dashboard, alerts, prediction, sensors, status, stop.`;
    }

    setFeedback(speakReply);

    if (speechEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(speakReply);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-5 left-[236px] z-40 flex flex-col gap-2 font-mono select-none">
      {/* Feedback popover */}
      {(transcript || feedback) && (
        <div className="bg-[#0B101D]/95 border border-cyan-500/40 p-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-xl max-w-xs text-xs space-y-1 animate-fade-in">
          {transcript && (
            <div className="flex items-center gap-1.5 text-cyan-300">
              <Mic className="w-3.5 h-3.5 animate-pulse text-rose-400" />
              <span className="truncate">"{transcript}"</span>
            </div>
          )}
          {feedback && <p className="text-gray-300 text-[11px] leading-snug">{feedback}</p>}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSpeechEnabled(!speechEnabled)}
          title={speechEnabled ? 'Mute AI Audio Alerts' : 'Enable AI Audio Alerts'}
          className={`p-2.5 rounded-xl border backdrop-blur-lg transition-all text-xs flex items-center gap-1.5 font-bold ${
            speechEnabled
              ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'bg-gray-900/80 border-gray-800 text-gray-500 hover:text-gray-300'
          }`}
        >
          {speechEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{speechEnabled ? 'VOICE ON' : 'MUTED'}</span>
        </button>

        <button
          onClick={toggleListening}
          title="Speak Voice Command (e.g. 'Status', 'Dashboard', 'Alerts')"
          className={`p-2.5 rounded-xl border backdrop-blur-lg transition-all text-xs flex items-center gap-1.5 font-bold ${
            isListening
              ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
              : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-300'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
          <span className="hidden sm:inline">{isListening ? 'LISTENING…' : 'VOICE CMD'}</span>
        </button>
      </div>
    </div>
  );
};

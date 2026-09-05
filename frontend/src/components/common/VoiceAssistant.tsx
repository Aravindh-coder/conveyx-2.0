import React, { useState, useEffect, useRef } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Volume2, VolumeX, Mic, MicOff, Play, AlertOctagon, Send, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VoiceAssistant: React.FC = () => {
  const { alerts, conveyor, risk, setScenario, sendMotorCommand } = useTelemetry();
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [textCommand, setTextCommand] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const lastAlertId = useRef<string | null>(null);
  const recognitionRef = useRef<any>(null);

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

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  // Voice Command Handler — Foolproof browser handling
  const toggleListening = () => {
    setShowDialog(true);

    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFeedback('Browser mic API unavailable on HTTP/Firefox. Use quick buttons below.');
      return;
    }

    startRecognition(SpeechRecognition);
  };

  const startRecognition = (SpeechRecognition: any) => {
    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening... Speak now!');
        setFeedback('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }

        if (currentTranscript.trim()) {
          setTranscript(currentTranscript);
        }

        const lower = currentTranscript.toLowerCase();
        // Trigger command on detection
        if (
          lower.includes('stop') || lower.includes('start') || lower.includes('halt') ||
          lower.includes('emergency') || lower.includes('dashboard') || lower.includes('alert')
        ) {
          processCommand(currentTranscript);
          stopListening();
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        const knownErrors: Record<string, string> = {
          'network': 'Mic requires HTTPS or localhost. Try allowing mic in browser.',
          'not-allowed': 'Microphone permission denied. Allow mic access in browser.',
          'no-speech': 'No speech detected. Speak clearly or click quick actions.',
          'aborted': 'Voice input cancelled.',
        };
        setFeedback(knownErrors[event.error] ?? `Voice input error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setFeedback(`Could not start mic: ${err?.message || 'Check browser permissions'}`);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
  };

  const processCommand = (rawCmd: string) => {
    const cmd = rawCmd.toLowerCase().trim();
    if (!cmd) return;

    let speakReply = '';

    // Priority 1: Emergency Stop / Stop / Off / Halt
    if (cmd.includes('stop') || cmd.includes('halt') || cmd.includes('emergency') || cmd.includes('off') || cmd.includes('shut down') || cmd.includes('kill')) {
      sendMotorCommand('EMERGENCY_STOP');
      setScenario('CRITICAL_FAILURE');
      speakReply = 'Emergency stop command executed. Motor halted instantly.';
    }
    // Priority 2: Start / Run / On
    else if (cmd.includes('start') || cmd.includes('run') || cmd.includes('on') || cmd.includes('begin') || cmd.includes('launch')) {
      sendMotorCommand('START');
      speakReply = 'Motor start command executed. Conveyor system running.';
    }
    // Navigation & Status
    else if (cmd.includes('dashboard') || cmd.includes('home') || cmd.includes('main')) {
      navigate('/dashboard');
      speakReply = 'Navigating to Main Control Dashboard.';
    } else if (cmd.includes('vibration') || cmd.includes('sensor') || cmd.includes('telemetry')) {
      navigate('/sensors/vibration');
      speakReply = 'Opening Telemetry Sensors.';
    } else if (cmd.includes('alert') || cmd.includes('warning') || cmd.includes('center')) {
      navigate('/alerts');
      speakReply = 'Opening Alert Center.';
    } else if (cmd.includes('prediction') || cmd.includes('predict') || cmd.includes('risk') || cmd.includes('ai')) {
      navigate('/prediction');
      speakReply = 'Opening Predictive AI Engine.';
    } else if (cmd.includes('incident') || cmd.includes('log')) {
      navigate('/incidents');
      speakReply = 'Navigating to Incident Management.';
    } else if (cmd.includes('status') || cmd.includes('health') || cmd.includes('state')) {
      speakReply = `Conveyor status is ${conveyor.status}. Risk score is ${risk?.score || 12} out of 100.`;
    } else {
      speakReply = `Command recognized: "${rawCmd}". Try "start motor", "stop motor", "dashboard", or "alerts".`;
    }

    setFeedback(speakReply);

    if (speechEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(speakReply);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textCommand.trim()) return;
    setTranscript(textCommand);
    processCommand(textCommand);
    setTextCommand('');
  };

  return (
    <div className="fixed bottom-5 left-[236px] z-40 flex flex-col gap-2 font-mono select-none">
      {/* Interactive Command Popover Window */}
      {(showDialog || transcript || feedback) && (
        <div className="bg-[#0B101D]/95 border border-emerald-500/40 p-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.25)] backdrop-blur-xl max-w-sm w-80 text-xs space-y-3 animate-fade-in relative">
          <button
            onClick={() => { setShowDialog(false); setTranscript(''); setFeedback(''); stopListening(); }}
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-gray-200 uppercase tracking-wider">AI Voice & Command Center</span>
          </div>

          {/* Transcript / Status display */}
          <div className="bg-black/60 rounded-xl p-3 border border-gray-800 min-h-[50px] flex flex-col justify-center">
            {isListening ? (
              <div className="flex items-center gap-2 text-emerald-300 font-bold animate-pulse">
                <Mic className="w-4 h-4 text-rose-400" />
                <span>{transcript || 'Listening... Speak now'}</span>
              </div>
            ) : transcript ? (
              <p className="text-emerald-300 font-bold">"{transcript}"</p>
            ) : (
              <p className="text-gray-400 text-[11px]">Click mic to speak, or use quick buttons below.</p>
            )}

            {feedback && <p className="text-emerald-400 font-semibold text-[11px] mt-1 font-sans">{feedback}</p>}
          </div>

          {/* Quick Command Shortcuts */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Quick Voice Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setTranscript('start motor'); processCommand('start motor'); }}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-900 transition-all text-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START MOTOR</span>
              </button>

              <button
                onClick={() => { setTranscript('stop motor'); processCommand('stop motor'); }}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold hover:bg-rose-900 transition-all text-xs"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>STOP MOTOR</span>
              </button>
            </div>
          </div>

          {/* Text Input Fallback */}
          <form onSubmit={handleTextSubmit} className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={textCommand}
              onChange={(e) => setTextCommand(e.target.value)}
              placeholder="Type command ('start', 'stop')..."
              className="bg-black/80 border border-gray-800 focus:border-emerald-500/50 rounded-xl px-3 py-1.5 text-xs text-gray-200 outline-none flex-1 font-mono placeholder:text-gray-600"
            />
            <button
              type="submit"
              className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold border border-emerald-400"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Main Control Bar */}
      <div className="flex items-center gap-2">
        {/* Quick Action: Start Motor */}
        <button
          onClick={() => { setTranscript('start motor'); processCommand('start motor'); setShowDialog(true); }}
          title="Voice Command Shortcut: Start Motor"
          className="px-3 py-2 rounded-xl border border-emerald-500/40 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs flex items-center gap-1.5 backdrop-blur-lg transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>START MOTOR</span>
        </button>

        {/* Quick Action: Stop Motor */}
        <button
          onClick={() => { setTranscript('stop motor'); processCommand('stop motor'); setShowDialog(true); }}
          title="Voice Command Shortcut: Stop Motor"
          className="px-3 py-2 rounded-xl border border-rose-500/40 bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs flex items-center gap-1.5 backdrop-blur-lg transition-all shadow-[0_0_12px_rgba(244,63,94,0.25)] animate-pulse"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>STOP MOTOR</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => setSpeechEnabled(!speechEnabled)}
          title={speechEnabled ? 'Mute Voice Assistant Feedback' : 'Enable Voice Assistant Feedback'}
          className={`p-2.5 rounded-xl border backdrop-blur-lg transition-all text-xs flex items-center gap-1.5 font-bold ${
            speechEnabled
              ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
              : 'bg-gray-900/80 border-gray-800 text-gray-500'
          }`}
        >
          {speechEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Mic Toggle Button */}
        <button
          onClick={toggleListening}
          title="Click to Open Voice & Speech Assistant"
          className={`p-2.5 rounded-xl border backdrop-blur-lg transition-all text-xs flex items-center gap-1.5 font-bold ${
            isListening
              ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
              : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-300'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
          <span className="hidden sm:inline">{isListening ? 'LISTENING…' : 'VOICE CMD'}</span>
        </button>
      </div>
    </div>
  );
};

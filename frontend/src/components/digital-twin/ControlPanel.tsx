import React from 'react';
import { clsx } from 'clsx';
import { Play, Square, AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export const ControlPanel: React.FC = () => {
  const { conveyor, sendMotorCommand, localSafetyActive, risk } = useTelemetry();
  const isRunning = conveyor.status === 'RUNNING';
  const isStopped = conveyor.status === 'STOPPED';
  const isEmergency = conveyor.status === 'EMERGENCY_STOP';

  return (
    <div className="glass-panel rounded-xl p-5 border border-gray-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-gray-300">
            Conveyor Actuator & Interlock Controls
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>LOCAL SAFETY: ACTIVE</span>
          </span>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="bg-gray-900/90 rounded-lg p-3 border border-gray-800 mb-5 text-xs">
          <div className="flex items-start space-x-2 text-gray-300">
            <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Hardware Interlock Safety Architecture:</span>
              <p className="text-gray-400 text-[11px] mt-0.5">
                Commands sent here issue HTTP/WebSocket requests to the ESP32 & local Arduino UNO relay module.
                Local hardware safety logic remains autonomous if Wi-Fi drops out.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Motor Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => sendMotorCommand('START')}
          disabled={isRunning || isEmergency}
          className={clsx(
            'px-4 py-3 rounded-lg border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md',
            isRunning
              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50 cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-500 text-black border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Motor</span>
        </button>

        <button
          onClick={() => sendMotorCommand('STOP')}
          disabled={isStopped || isEmergency}
          className={clsx(
            'px-4 py-3 rounded-lg border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md',
            isStopped
              ? 'bg-gray-800 text-gray-400 border-gray-700 cursor-default'
              : 'bg-amber-600 hover:bg-amber-500 text-black border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          <Square className="w-4 h-4 fill-current" />
          <span>Stop Motor</span>
        </button>

        <button
          onClick={() => sendMotorCommand('EMERGENCY_STOP')}
          className={clsx(
            'px-4 py-3 rounded-lg border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg text-white',
            isEmergency
              ? 'bg-rose-600 border-rose-400 animate-pulse'
              : 'bg-rose-700 hover:bg-rose-600 border-rose-500 shadow-rose-900/40'
          )}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>E-STOP SHUTDOWN</span>
        </button>
      </div>

      {isEmergency && (
        <div className="mt-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 flex items-center justify-between font-mono">
          <span>EMERGENCY STOP SHUTDOWN ACTIVATED</span>
          <button
            onClick={() => sendMotorCommand('STOP')}
            className="px-2.5 py-1 rounded bg-rose-900 hover:bg-rose-800 text-white border border-rose-500 text-[11px]"
          >
            Reset Interlock Relay
          </button>
        </div>
      )}
    </div>
  );
};

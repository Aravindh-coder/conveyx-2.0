import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Camera, Upload, Play, CheckCircle2, AlertTriangle, ShieldAlert, Scan, Eye } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export const VisionInspector: React.FC = () => {
  const { latestVision, triggerVisionScan } = useTelemetry();
  const [selectedCondition, setSelectedCondition] = useState<string>('TEAR');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('HIGH');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(true);

  const handleScan = async () => {
    setIsScanning(true);
    await new Promise(r => setTimeout(r, 800));
    await triggerVisionScan(selectedCondition, selectedSeverity);
    setIsScanning(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Camera Preview Canvas & Bounding Box Overlay */}
      <div className="lg:col-span-2 space-y-4">
        <div className="glass-panel rounded-xl p-4 border border-gray-800 relative bg-black flex flex-col justify-between min-h-[380px] overflow-hidden">
          {/* Header Bar overlay */}
          <div className="flex items-center justify-between z-10 bg-black/60 backdrop-blur-md p-2.5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-2">
              <Camera className={clsx('w-4 h-4', cameraActive ? 'text-emerald-400' : 'text-rose-400')} />
              <span className="text-xs font-mono font-bold text-white uppercase">
                CAM-01 Optical Splice Inspection Stream
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className={clsx('px-2 py-0.5 rounded border', cameraActive ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-rose-950 text-rose-400 border-rose-500/40')}>
                {cameraActive ? 'CAMERA CONNECTED' : 'CAMERA DISCONNECTED'}
              </span>
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px]"
              >
                Toggle Feed
              </button>
            </div>
          </div>

          {/* Video Stream Area or Disconnected Fallback */}
          {cameraActive ? (
            <div className="relative my-4 w-full h-[260px] bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-lg border border-gray-800 flex items-center justify-center overflow-hidden">
              {/* Grid scanner lines */}
              <div className="absolute inset-0 bg-tech-grid opacity-30" />
              
              {/* Animated Scan Line */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#06b6d4] animate-bounce z-20" />
              )}

              {/* Simulated Rubber Belt Surface Diagram with Bounding Boxes */}
              <div className="relative w-4/5 h-44 bg-gray-800/90 rounded border border-gray-700 flex items-center justify-center p-4">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-gray-400">
                  CONVEYOR BELT SURFACE SPLICE ZONE
                </span>
                
                {/* Longitudinal belt texture lines */}
                <div className="w-full h-full border-t border-b border-dashed border-gray-600 flex flex-col justify-around opacity-40">
                  <div className="w-full h-0.5 bg-gray-600" />
                  <div className="w-full h-0.5 bg-gray-600" />
                </div>

                {/* Bounding Box Visualizer Overlay */}
                {latestVision && latestVision.detectedCondition !== 'NORMAL' && (
                  <div className="absolute top-10 left-1/3 w-36 h-20 border-2 border-rose-500 bg-rose-500/10 rounded flex flex-col justify-between p-1 text-[10px] font-mono text-rose-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <div className="flex justify-between items-center bg-rose-950/80 px-1 py-0.5 rounded">
                      <span>{latestVision.detectedCondition}</span>
                      <span>{latestVision.confidencePercent}%</span>
                    </div>
                    <span className="text-[9px] text-rose-200">SEVERITY: {latestVision.severity}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="my-12 flex flex-col items-center justify-center text-center space-y-2 text-gray-400">
              <Camera className="w-12 h-12 text-gray-600" />
              <span className="text-sm font-mono font-bold text-gray-300">Camera module not connected</span>
              <p className="text-xs text-gray-500 max-w-sm">
                Optical CV camera inspection is an extensible future hardware add-on. Connect RTSP camera to activate live stream.
              </p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between z-10 pt-2 border-t border-gray-800 text-xs font-mono">
            <div className="flex space-x-2">
              <button
                disabled={!cameraActive}
                className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-bold flex items-center space-x-1.5"
                onClick={handleScan}
              >
                <Scan className="w-4 h-4" />
                <span>{isScanning ? 'Scanning...' : 'Start Inspection Scan'}</span>
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center space-x-1.5 border border-gray-700">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Test Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Col: Vision Model Parameters & Inspection Result */}
      <div className="glass-panel rounded-xl p-5 border border-gray-800 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-gray-300 mb-4 flex items-center space-x-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span>AI Computer Vision Model Inspector</span>
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-gray-400 block mb-1.5">Simulate Defect Condition:</label>
              <select
                value={selectedCondition}
                onChange={e => setSelectedCondition(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="NORMAL">NORMAL (No Damage)</option>
                <option value="CRACK">Transverse Surface Crack</option>
                <option value="TEAR">Longitudinal Rip / Tear</option>
                <option value="EDGE_DAMAGE">Edge Fraying & Damage</option>
                <option value="JOINT_DAMAGE">Belt Joint / Splice Rupture</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1.5">Simulate Severity Level:</label>
              <select
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            {latestVision && (
              <div className="p-3.5 rounded-lg bg-gray-900/80 border border-gray-700 space-y-2 mt-4">
                <span className="text-gray-400 text-[10px] block uppercase font-bold">Latest Inspection Summary</span>
                <div className="flex justify-between">
                  <span className="text-gray-300">Condition:</span>
                  <span className="text-white font-bold">{latestVision.detectedCondition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Severity:</span>
                  <span className="text-amber-400 font-bold">{latestVision.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Confidence:</span>
                  <span className="text-cyan-400 font-bold">{latestVision.confidencePercent}%</span>
                </div>
                <p className="text-[11px] text-gray-400 pt-2 border-t border-gray-800">
                  {latestVision.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] font-mono text-gray-500">
          ARCHITECTURE: Camera → Frame Extractor → Vision AI → Multi-Sensor Risk Engine
        </div>
      </div>
    </div>
  );
};

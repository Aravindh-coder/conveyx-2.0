import React, { useEffect, useRef } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Flame, Thermometer } from 'lucide-react';

export const ThermalHeatmapCanvas: React.FC = () => {
  const { packet } = useTelemetry();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tempC = packet?.temperature ?? 38.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Draw Conveyor Frame
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, w, h);

      // Belt track gradient
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      
      if (tempC > 60) {
        grad.addColorStop(0, '#1E1B4B');
        grad.addColorStop(0.3, '#7F1D1D');
        grad.addColorStop(0.6, '#DC2626');
        grad.addColorStop(0.85, '#F59E0B');
        grad.addColorStop(1, '#1E1B4B');
      } else if (tempC > 45) {
        grad.addColorStop(0, '#064E3B');
        grad.addColorStop(0.4, '#D97706');
        grad.addColorStop(0.7, '#F59E0B');
        grad.addColorStop(1, '#064E3B');
      } else {
        grad.addColorStop(0, '#064E3B');
        grad.addColorStop(0.5, '#0284C7');
        grad.addColorStop(1, '#064E3B');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(20, 20, w - 40, h - 40);

      // Draw Thermal Heat Grid Nodes
      const time = Date.now() * 0.003;
      const rows = 5;
      const cols = 20;
      const cellW = (w - 40) / cols;
      const cellH = (h - 40) / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const noise = Math.sin(c * 0.4 + time) * Math.cos(r * 0.8 + time);
          const cellTemp = tempC + noise * (tempC > 50 ? 12 : 3);

          const rColor = Math.min(255, Math.max(0, Math.floor((cellTemp - 25) * 6)));
          const bColor = Math.min(255, Math.max(0, Math.floor((65 - cellTemp) * 5)));
          const gColor = Math.min(255, Math.max(0, 180 - Math.abs(cellTemp - 45) * 4));

          ctx.fillStyle = `rgba(${rColor}, ${gColor}, ${bColor}, 0.65)`;
          ctx.fillRect(20 + c * cellW + 1, 20 + r * cellH + 1, cellW - 2, cellH - 2);
        }
      }

      // Border outline
      ctx.strokeStyle = tempC > 50 ? '#EF4444' : '#06B6D4';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrame);
  }, [tempC]);

  return (
    <div className="glass-panel p-4 rounded-xl border border-gray-800 space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className={`w-4 h-4 ${tempC > 50 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Infrared Thermal Heatmap (DS18B20 Surface Array)
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-400">Peak Temp:</span>
          <span className={`px-2 py-0.5 rounded font-bold ${
            tempC > 50 ? 'bg-rose-950 text-rose-400 border border-rose-500/40' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
          }`}>
            {tempC.toFixed(1)}°C
          </span>
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-gray-800 bg-gray-950">
        <canvas ref={canvasRef} width={650} height={120} className="w-full h-auto block" />
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-sky-600 inline-block" />
            <span>Cool (30°C)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
            <span>Optimal (42°C)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-600 inline-block" />
            <span>Hotspot (&gt;55°C)</span>
          </span>
        </div>
        <span>Array Resolution: 100 Sensor Points</span>
      </div>
    </div>
  );
};

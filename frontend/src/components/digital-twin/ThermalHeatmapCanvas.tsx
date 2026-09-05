import React, { useEffect, useRef } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Flame, Thermometer } from 'lucide-react';

export const ThermalHeatmapCanvas: React.FC = () => {
  const { packet, conveyor } = useTelemetry();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const baseTemp = packet?.temperature ?? (conveyor.status === 'RUNNING' ? 44.5 : 32.0);
  const isRunning = conveyor.status === 'RUNNING';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    // Helper: Map temperature to vivid FLIR / Ironbow Thermal Color Scale
    const getThermalColor = (temp: number, alpha = 0.9): string => {
      // Scale temp range: 25°C (Cool Blue) to 75°C (White Hot)
      const normalized = Math.min(1, Math.max(0, (temp - 25) / 50));
      
      // HSL mapping: Blue (220deg) -> Teal (170deg) -> Green (130deg) -> Yellow (50deg) -> Orange/Red (10deg)
      // Reverse hue from 220 to 0
      const hue = Math.max(0, 220 - normalized * 220);
      const saturation = 90;
      const lightness = normalized > 0.85 ? 50 + (normalized - 0.85) * 300 : 35 + normalized * 30;

      return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Dark Industrial Background Frame
      ctx.fillStyle = '#090E17';
      ctx.fillRect(0, 0, w, h);

      const marginX = 16;
      const marginY = 16;
      const gridW = w - marginX * 2;
      const gridH = h - marginY * 2;

      const rows = 5;
      const cols = 20;
      const cellW = gridW / cols;
      const cellH = gridH / rows;

      const time = Date.now() * 0.002;

      // Render 100 Thermal Sensor Points (20 cols x 5 rows)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Spatial heat distribution:
          // Col 0-3: Drive Motor & Drive Roller (Warmer)
          // Col 8-10: Belt Joint / Splice Zone
          // Col 17-19: Tail Pulley Bearing
          let spatialOffset = 0;
          if (c <= 3) spatialOffset += 6.5; // Drive Motor heat zone
          if (c >= 8 && c <= 10) spatialOffset += 3.5; // Splice friction zone
          if (c >= 17) spatialOffset += 4.2; // Tail pulley bearing

          // Vertical center line of belt is slightly warmer
          if (r === 2) spatialOffset += 2.0;

          // Wave Shimmer animation when running
          const wave = isRunning ? Math.sin(c * 0.5 - time * 3) * Math.cos(r * 0.8 + time) * 3.5 : 0;
          const noise = Math.sin(c * 1.2 + r * 2.1 + time * 0.5) * 1.5;

          const cellTemp = Math.max(26, baseTemp + spatialOffset + wave + noise);

          const cellX = marginX + c * cellW;
          const cellY = marginY + r * cellH;

          // Cell Background with thermal color
          ctx.fillStyle = getThermalColor(cellTemp, 0.88);
          ctx.beginPath();
          ctx.roundRect(cellX + 1.5, cellY + 1.5, cellW - 3, cellH - 3, 2);
          ctx.fill();

          // Highlight Hotspot Cells (>55°C) with pulsating red border
          if (cellTemp > 52) {
            ctx.strokeStyle = `rgba(244, 63, 94, ${0.5 + Math.sin(time * 6) * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else {
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Outer Heatmap Array Border
      ctx.strokeStyle = baseTemp > 50 ? '#EF4444' : '#10B981';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(marginX, marginY, gridW, gridH);

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrame);
  }, [baseTemp, isRunning]);

  return (
    <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className={`w-5 h-5 ${baseTemp > 50 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
          <div>
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
              INFRARED THERMAL HEATMAP (DS18B20 SURFACE ARRAY)
            </h3>
            <span className="text-[10px] text-gray-500 font-sans block">
              100-Point Thermal Matrix • Drive Motor, Belt Joint & Pulley Friction Mapping
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-400">Drive Temp:</span>
          <span className={`px-2.5 py-0.5 rounded font-bold ${
            baseTemp > 50 ? 'bg-rose-950 text-rose-400 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
          }`}>
            {baseTemp.toFixed(1)}°C
          </span>
        </div>
      </div>

      {/* Canvas Heatmap Grid Container */}
      <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-[#090E17] shadow-inner p-1">
        <canvas ref={canvasRef} width={750} height={150} className="w-full h-auto block" />
      </div>

      {/* Color Scale Legend & Sensor Resolution */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-300 gap-2 pt-1 border-t border-gray-800/60">
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 font-bold uppercase text-[10px]">Thermal Scale:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-[#0284C7] inline-block shadow" />
            <span>Cool (&lt;32°C)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-[#10B981] inline-block shadow" />
            <span>Normal (38°C)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-[#F59E0B] inline-block shadow" />
            <span>Optimal (46°C)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-[#EF4444] inline-block shadow" />
            <span>Hotspot (&gt;55°C)</span>
          </div>
        </div>

        <span className="text-[10px] text-gray-400 font-mono">Array Resolution: 100 Active Sensor Points (20x5 Grid)</span>
      </div>
    </div>
  );
};

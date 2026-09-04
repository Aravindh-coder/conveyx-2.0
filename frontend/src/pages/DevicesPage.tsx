import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { HardDrive, Cpu, Radio, Activity, Zap, Eye, CheckCircle2, Code2, Wifi, Terminal, Copy, Check, PlaySquare, AlertCircle } from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const { devices, hardwareMode, enableSimulation, disableSimulation, isSocketConnected } = useTelemetry();
  const [copied, setCopied] = useState(false);

  const esp32CodeSnippet = `// ConveyX ESP32 Telemetry Sender (PlatformIO / C++)
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // ESP32 C++ JSON Library

const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_LAPTOP_IP:4000/api/device-data";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<300> doc;
    doc["deviceId"] = "ESP32-SMARTPOD-01";
    doc["conveyorId"] = "CONV-01";
    
    JsonObject vib = doc.createNestedObject("vibration");
    vib["x"] = 0.42; vib["y"] = 0.38; vib["z"] = 1.12; vib["rms"] = 1.25;

    JsonObject motor = doc.createNestedObject("motor");
    motor["current"] = 0.84; motor["baselineCurrent"] = 0.82; motor["isOverload"] = false;

    JsonObject align = doc.createNestedObject("alignment");
    align["status"] = "ALIGNED"; align["leftSensorActive"] = false; align["rightSensorActive"] = false;

    doc["temperature"] = 38.5;
    doc["motorState"] = "RUNNING";

    String jsonStr;
    serializeJson(doc, jsonStr);
    int httpCode = http.POST(jsonStr);
    http.end();
  }
  delay(1000); // 1 Hz Telemetry Stream
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(esp32CodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      <PageHeader
        title="Hardware Devices & ESP32 Microcontroller Gateway"
        subtitle="Live connection status of Raspberry Pi 3B+ Edge Gateway, ESP32 SmartPods, MPU6050, ACS712 & Safety Relays"
        badge={
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            hardwareMode === 'LIVE_HARDWARE' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
            hardwareMode === 'SIMULATION' ? 'bg-amber-950 text-amber-400 border-amber-500/40' :
            'bg-rose-950 text-rose-400 border-rose-500/40'
          }`}>
            {hardwareMode === 'LIVE_HARDWARE' ? 'LIVE HARDWARE CONNECTED' :
             hardwareMode === 'SIMULATION' ? 'DEMO SIMULATION ACTIVE' : 'DISCONNECTED'}
          </span>
        }
      />

      {/* Hardware Connection Explainer Banner */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Why is the platform currently in Simulation Mode?
              </h3>
              <p className="text-xs text-gray-300 font-sans mt-0.5 leading-relaxed">
                When physical hardware nodes (ESP32 / Raspberry Pi 3B+) are not actively transmitting live HTTP JSON packets to port 4000, ConveyX automatically defaults to <strong className="text-amber-400">Simulation Mode</strong> so you can test all UI components, ML risk algorithms, and relay interlocks without physical hardware.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hardwareMode === 'SIMULATION' ? (
              <button
                onClick={disableSimulation}
                className="px-3.5 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all"
              >
                Disable Simulation (Wait for Live ESP32)
              </button>
            ) : (
              <button
                onClick={enableSimulation}
                className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                Enable Demo Simulation
              </button>
            )}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs text-gray-400">
          <span>Backend HTTP Endpoint: <strong className="text-cyan-300">POST http://&lt;YOUR_IP&gt;:4000/api/device-data</strong></span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {isSocketConnected ? 'BACKEND PORT 4000 ACTIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Microcontroller Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {devices.map(d => (
          <div key={d.id} className="glass-panel p-5 rounded-xl border border-gray-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={d.status} size="sm" />
                <span className="text-[10px] text-cyan-400 font-bold border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-950">
                  {d.protocol}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white mt-1">{d.name}</h4>
              <span className="text-[10px] text-gray-500">{d.id} • {d.type}</span>
              <p className="text-xs text-gray-400 font-sans mt-2">{d.description}</p>
            </div>

            <div className="pt-3 border-t border-gray-800 space-y-1 text-[11px] text-gray-400">
              <div className="flex justify-between">
                <span>Firmware Version:</span>
                <span className="text-gray-200">{d.firmwareVersion}</span>
              </div>
              {d.ipAddress && (
                <div className="flex justify-between">
                  <span>IP Address:</span>
                  <span className="text-cyan-400">{d.ipAddress}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Packets Received:</span>
                <span className="text-emerald-400 font-bold">{d.packetCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ESP32 Firmware Code Snippet */}
      <div className="glass-panel p-5 rounded-xl border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase text-white tracking-wider">
              Physical ESP32 Microcontroller C++ Telemetry Code (Upload to Board)
            </h3>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:border-cyan-500 text-xs text-cyan-300 font-bold transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY CODE'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-[#050810] border border-gray-800 text-cyan-300 text-xs overflow-x-auto font-mono leading-relaxed">
          {esp32CodeSnippet}
        </pre>
      </div>
    </div>
  );
};

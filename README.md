<div align="center">

# ⚙️ CONVEY X

### Intelligent Conveyor Belt Joint Rupture & Damage Monitoring System

**Production-grade IoT + AI safety platform for iron ore mining operations.**  
Real-time multi-sensor fusion · Predictive risk scoring · Hardware-honest SCADA UI

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 🎯 Problem Statement

**Enterprise Industrial Safety Challenge**  
> *"Intelligent Monitoring and Prediction of Conveyor Belt Joint Rupture and Damages in Iron Ore Mining Industry"*

Conveyor belt failures in iron ore beneficiation plants cause millions in downtime. CONVEY X provides continuous sensor-based monitoring with predictive risk scoring to prevent joint ruptures, misalignment, and mechanical failures before they occur.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  CONVEY X Platform                      │
├──────────────────┬──────────────────────────────────────┤
│   Hardware Layer │   Software Platform                  │
│                  │                                      │
│  MPU6050 ────────┤──► ESP32 SmartPod ──► Wi-Fi / MQTT    │
│  ACS712  ────────┤          │                           │
│  IR Left ────────┤          ▼                           │
│  IR Right ───────┤     Raspberry Pi 3B+ ──► POST /api/device-data
│  Relay ──────────┤     Edge AI Node         │           │
│  5V Motor ───────┤                 Node.js Backend      │
│                  │                 WebSocket Server     │
│                  │                      │               │
│                  │               React Frontend         │
│                  │               SCADA Dashboard        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Hardware Components

| Component | Role | Interface |
|-----------|------|-----------|
| **Raspberry Pi 3B+** | Edge AI gateway + OpenCV camera inference | MQTT / HTTP (Local Server) |
| **ESP32 Microcontroller** | Telemetry collector & local safety cutoff | Wi-Fi / I2C / Analog |
| **MPU6050** | 3-axis accelerometer — vibration RMS | I2C (0x68) |
| **ACS712 (20A)** | DC/AC motor current — jam/stall detection | Analog A0 |
| **IR Sensor (Left)** | Belt left-edge drift detection | Digital D2 |
| **IR Sensor (Right)** | Belt right-edge drift detection | Digital D3 |
| **Relay Module** | Normally-closed safety interlock | Digital D4 |
| **5V DC Motor** | Drive pulley + belt prototype | PWM |

---

## 🧠 Risk Engine

Multi-sensor fusion scoring model (0–100 risk score):

| Contributor | Max Points | Trigger Condition |
|------------|-----------|-------------------|
| Vibration (MPU6050) | 35 pts | RMS > 2.8g = WARNING; > 4.0g = CRITICAL |
| Motor Current (ACS712) | 35 pts | > 150% baseline = OVERLOAD; > 200% = STALL |
| Belt Alignment (IR) | 25 pts | Left or Right sensor triggered |
| Vision (Camera AI) | 20 pts | Future module — crack/splice detection |

**Risk Levels:** `NORMAL` → `WARNING` → `HIGH_RISK` → `CRITICAL`

---

## 🖥️ Platform Features

- **Real-time SVG Digital Twin** — Live conveyor visualizer with sensor node overlays
- **Hardware-honest Status** — Shows DISCONNECTED until real data arrives; no fake data
- **6-Scenario Test Bench** — Simulate Normal / Misalignment / High Vibration / Motor Overload / Stall / Joint Rupture
- **Predictive Maintenance** — Risk score, failure probability, recommended action
- **Alert Engine** — Severity-classified alerts with acknowledge/resolve
- **Maintenance Scheduler** — Track upcoming service intervals
- **Event Log** — Full timestamped sensor event history
- **Live Charts** — Real-time telemetry sparklines (Recharts)
- **Device Registry** — All hardware nodes with connectivity status

---

## 📡 Hardware Integration (ESP32 Firmware)

Send JSON packets to the backend every 500ms:

```http
POST http://<server-ip>:4000/api/device-data
Content-Type: application/json

{
  "deviceId": "ESP32-001",
  "timestamp": 1725123456789,
  "vibration": { "x": 0.12, "y": 0.08, "z": 9.81 },
  "motor": { "current": 1.45, "rpm": 1420 },
  "alignment": { "leftSensor": false, "rightSensor": false },
  "relay": { "tripped": false }
}
```

The backend automatically transitions from `DISCONNECTED → LIVE_HARDWARE` on first packet.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Start Backend

```bash
cd backend
npm run dev          # Development (ts-node)
# OR
npm run build && npm start   # Production
```
Backend runs on **port 4000**

### 3. Start Frontend

```bash
cd frontend
npm run dev          # Vite dev server
```
Frontend runs on **port 3000** (or 5173)

### 4. Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Supervisor | `admin` | `conveyX@2026` |
| Engineer | `engineer` | `engineer123` |
| Viewer | `viewer` | `viewer123` |

---

## 📁 Project Structure

```
conveyX/
├── backend/                    # Node.js + Express + TypeScript
│   └── src/
│       ├── index.ts            # Server entrypoint
│       ├── config.ts           # Environment config
│       ├── models/db.ts        # In-memory state store
│       ├── routes/api.routes.ts
│       └── services/
│           ├── websocket.service.ts    # Socket.IO + hardware watchdog
│           ├── riskEngine.service.ts   # Multi-sensor fusion scoring
│           ├── alertEngine.service.ts  # Alert lifecycle management
│           └── demoSimulator.service.ts # 6-scenario test bench
│
├── frontend/                   # React 18 + Vite + Tailwind
│   └── src/
│       ├── context/
│       │   ├── TelemetryContext.tsx    # WebSocket client + state
│       │   └── AuthContext.tsx
│       ├── pages/              # 15+ route pages
│       ├── components/
│       │   ├── digital-twin/   # ConveyorGraphic SVG, ControlPanel
│       │   ├── charts/         # RiskScoreGauge, TelemetryLineChart
│       │   ├── common/         # KPIBox, StatusBadge, PipelineVisualizer
│       │   └── layout/         # Header, Sidebar, Layout
│       └── index.css           # SCADA design system tokens
│
└── shared/types.ts             # Shared TypeScript interfaces
```

---

## 🔌 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/device-data` | POST | Receive hardware packet from ESP32 |
| `/api/hardware/status` | GET | Hardware connectivity + device list |
| `/api/hardware/simulate` | POST | Activate simulation mode |
| `/api/hardware/deactivate` | POST | Stop simulation |
| `/api/alerts` | GET | All alerts |
| `/api/alerts/:id/acknowledge` | POST | Acknowledge alert |
| `/api/conveyor/command` | POST | Motor start/stop/emergency |
| `/api/history` | GET | Telemetry history (last 200 pts) |
| `/api/maintenance` | GET/POST | Maintenance schedule |
| `/api/events` | GET | Event log |

---

## 🏅 Built For

> **Smart India Hackathon 2026**  
> Ministry / Organization: Ministry of Mines  
> Problem Category: Hardware  
> Team: CONVEY X

---

## 📄 License

MIT © 2026 CONVEY X Team

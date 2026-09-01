# CONVEY X 🚀
### Enterprise Intelligent Conveyor Belt Joint Rupture & Damage Monitoring System

---

## 📌 Executive Summary & Architecture Overview

**CONVEY X** is a high-grade industrial SCADA monitoring & predictive safety platform engineered for iron ore mining conveyor systems. Built for heavy-duty industrial beneficiation plants, CONVEY X bridges physical microcontrollers (**Arduino UNO R3** + **ESP32 Wi-Fi Gateway**) with a modern web application featuring real-time WebSockets, an explainable **Multi-Sensor Fusion Risk Engine**, and an interactive **2D Digital Twin**.

### Hardware & Sensor Mapping Truth Table
| Hardware Module | Sensor Model | Primary Physical Semantics | Secondary Metric |
| :--- | :--- | :--- | :--- |
| **Drive Bearing Vibration** | MPU6050 Accelerometer / Gyro | 3-Axis Vibration Magnitude (g) | RMS Noise Spectrum |
| **Motor Electrical Load** | ACS712 20A Current Sensor | Motor Amperes (A) vs Baseline | Mechanical Jam / Stall Detection |
| **Belt Tracking Guide** | 2x Optical IR Reflectors | Physical Belt Wander Left/Right | Tracking Misalignment |
| **Local Interlock Relay** | 5V Relay Module (Pin D8) | Normally-Closed Hardware Cutoff | Local Autonomous E-Stop |
| **Optical Surface Inspection** | HD Camera (Extensible Module) | Visible Surface Tears & Cracks | Vulcanized Splice Rupture Scan |

> ⚠️ **Hardware Safety Autonomy**: Local safety logic runs autonomously on the Arduino UNO. If Wi-Fi or backend connection drops out, the local relay module maintains independent capability to cut 5V DC motor power if physical limits are breached.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, Socket.IO-Client
* **Backend**: Node.js, Express, TypeScript, Socket.IO Server, JWT Auth
* **Realtime Telemetry Engine**: Socket.IO WebSockets & HTTP REST API Gateway
* **Testing Suite**: Telemetry Simulation & Anomaly Testing Controller (Normal, Misalignment, High Vibration, Motor Overload, Multi-Sensor Anomaly, Critical Trip)

---

## 📂 Project Folder Structure

```
conveyX/
├── shared/
│   └── types.ts                    # Shared TypeScript interfaces
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                # Express HTTP & WebSocket server
│       ├── config.ts               # Environment variables
│       ├── models/db.ts            # Persistent in-memory data store
│       ├── routes/api.routes.ts    # REST endpoints (auth, sensors, risk, motor, demo)
│       └── services/               # Risk Engine, Alert Engine, Simulation & WebSockets
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── index.css               # Dark SCADA design system
│       ├── App.tsx                 # 21 interactive routes definition
│       ├── context/                # AuthContext & TelemetryContext
│       ├── components/             # Digital Twin, KPI Cards, Pipeline, Vision, Charts
│       └── pages/                  # Landing, Login, Dashboard, Live Monitoring, SihJudgeDemo...
└── README.md
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### 1. Install Backend & Frontend Dependencies

```bash
# Navigate to backend and install
cd backend
npm install

# Navigate to frontend and install
cd ../frontend
npm install
```

### 2. Launch the Platform in Development Mode

Run the Express Backend API & Telemetry Server (Port 4000):
```bash
cd backend
npm run start
```

In a second terminal, launch the Vite React Frontend (Port 3000):
```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:3000` or navigate directly to `http://localhost:3000/demo` for the **Scenario Test Bench**.

---

## 📡 ESP32 Data Format (JSON Payload over HTTP/MQTT)

The Express backend accepts live telemetry packets from the ESP32 gateway at `POST /api/device-data`:

```json
{
  "deviceId": "ESP32-001",
  "conveyorId": "CONV-01",
  "timestamp": "2026-09-01T08:54:57.000Z",
  "vibration": {
    "x": 0.15,
    "y": 0.20,
    "z": 1.08,
    "rms": 1.27,
    "baselineRms": 1.10
  },
  "motor": {
    "current": 0.84,
    "baselineCurrent": 0.82,
    "peakCurrent": 1.05,
    "isOverload": false,
    "isStall": false
  },
  "alignment": {
    "leftSensorActive": false,
    "rightSensorActive": false,
    "status": "ALIGNED"
  },
  "motorState": "RUNNING"
}
```

---

## 📄 License
Enterprise Intelligent Conveyor Health & Safety Platform.

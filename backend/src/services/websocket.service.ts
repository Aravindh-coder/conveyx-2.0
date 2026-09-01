import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { db } from '../models/db.js';
import { generateSimulatedPacket } from './demoSimulator.service.js';
import { evaluateConveyorRisk } from './riskEngine.service.js';
import { checkAndGenerateAlerts } from './alertEngine.service.js';
import { CONFIG } from '../config.js';

let io: SocketIOServer | null = null;
let simulationInterval: NodeJS.Timeout | null = null;
let hardwareTimeoutInterval: NodeJS.Timeout | null = null;

export function initWebSocketServer(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Send a full snapshot immediately on connect – honest hardware state
    socket.emit('telemetry_init', {
      packet: db.sensorHistory.length > 0 ? db.sensorHistory[db.sensorHistory.length - 1] : null,
      risk: null,
      conveyor: db.conveyor,
      currentScenario: db.currentScenario,
      devices: db.devices,
      localSafetyActive: db.localSafetyActive,
      hardwareMode: db.hardwareMode,
      isHardwareConnected: db.isHardwareConnected
    });

    // Client can enable simulation mode manually
    socket.on('enable_simulation', () => {
      db.enableSimulation();
      io?.emit('hardware_mode_changed', { hardwareMode: db.hardwareMode });
      console.log('[WebSocket] Simulation mode enabled by client.');
    });

    socket.on('disable_simulation', () => {
      if (!db.isHardwareConnected) {
        db.hardwareMode = 'DISCONNECTED';
        db.conveyor.status = 'STOPPED';
        db.conveyor.healthPercent = 0;
        io?.emit('hardware_mode_changed', { hardwareMode: db.hardwareMode });
        console.log('[WebSocket] Simulation mode disabled.');
      }
    });

    socket.on('set_scenario', (scenario) => {
      db.currentScenario = scenario;
      if (scenario === 'NORMAL' && db.hardwareMode === 'SIMULATION') {
        db.conveyor.status = 'RUNNING';
      }
      io?.emit('scenario_updated', { scenario: db.currentScenario });
    });

    socket.on('motor_control', ({ action }) => {
      if (action === 'START') db.conveyor.status = 'RUNNING';
      else if (action === 'STOP') db.conveyor.status = 'STOPPED';
      else if (action === 'EMERGENCY_STOP') db.conveyor.status = 'EMERGENCY_STOP';
      io?.emit('conveyor_updated', { conveyor: db.conveyor });
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  // Hardware timeout watchdog – marks devices DISCONNECTED if packets stop
  hardwareTimeoutInterval = setInterval(() => {
    const wasConnected = db.isHardwareConnected;
    db.checkHardwareTimeout();
    if (wasConnected && !db.isHardwareConnected) {
      console.log('[Hardware] No data received for 10s – marking devices DISCONNECTED');
      io?.emit('hardware_mode_changed', {
        hardwareMode: db.hardwareMode,
        devices: db.devices,
        conveyor: db.conveyor
      });
    }
  }, 3000);

  // Simulation tick – only runs when hardwareMode is SIMULATION
  simulationInterval = setInterval(() => {
    if (db.hardwareMode !== 'SIMULATION') return;

    const packet = generateSimulatedPacket();
    const latestVision = db.visionInspections[0];
    const risk = evaluateConveyorRisk(packet, latestVision);

    db.conveyor.riskScore = risk.score;
    db.conveyor.riskLevel = risk.level;

    const { newAlerts, newEvents } = checkAndGenerateAlerts(packet, risk);
    db.conveyor.activeAlertsCount = db.alerts.filter(a => !a.acknowledged).length;

    io?.emit('telemetry_tick', {
      packet,
      risk,
      conveyor: db.conveyor,
      newAlerts,
      newEvents,
      hardwareMode: db.hardwareMode
    });
  }, CONFIG.SIMULATION_INTERVAL_MS);

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

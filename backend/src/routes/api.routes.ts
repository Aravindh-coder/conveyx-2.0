import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../models/db.js';
import { CONFIG } from '../config.js';
import { generateSimulatedPacket } from '../services/demoSimulator.service.js';
import { evaluateConveyorRisk } from '../services/riskEngine.service.js';
import { checkAndGenerateAlerts } from '../services/alertEngine.service.js';
import { getIO } from '../services/websocket.service.js';

const router = Router();

// ==================================================
// AUTHENTICATION ROUTES
// ==================================================
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Industrial Auth Mock
  const token = jwt.sign(
    { email, role: 'CHIEF_OPERATOR', name: 'Industrial Mining Operator' },
    CONFIG.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.json({
    token,
    user: {
      id: 'USR-8821',
      name: 'Mining Control Room Operator',
      email,
      role: 'Chief Safety Engineer',
      facility: 'Iron Ore Beneficiation Plant 04'
    }
  });
});

// ==================================================
// CONVEYOR ROUTES
// ==================================================
router.get('/conveyors', (_req, res) => {
  return res.json({ conveyors: [db.conveyor] });
});

router.get('/conveyors/:id', (req, res) => {
  if (req.params.id === db.conveyor.id || req.params.id === '1') {
    return res.json({ conveyor: db.conveyor });
  }
  return res.status(404).json({ error: 'Conveyor system not found' });
});

// ==================================================
// SENSOR ROUTES
// ==================================================
router.get('/sensors/latest', (_req, res) => {
  const latest = db.sensorHistory.length > 0
    ? db.sensorHistory[db.sensorHistory.length - 1]
    : generateSimulatedPacket();
  return res.json(latest);
});

router.get('/sensors/history', (_req, res) => {
  return res.json({ history: db.sensorHistory });
});

router.get('/sensors/vibration', (_req, res) => {
  const latest = db.sensorHistory[db.sensorHistory.length - 1] || generateSimulatedPacket();
  return res.json({
    sensorId: 'SENSOR-MPU-01',
    vibration: latest.vibration,
    history: db.sensorHistory.map(h => ({ timestamp: h.timestamp, vibration: h.vibration }))
  });
});

router.get('/sensors/current', (_req, res) => {
  const latest = db.sensorHistory[db.sensorHistory.length - 1] || generateSimulatedPacket();
  return res.json({
    sensorId: 'SENSOR-ACS-01',
    motorCurrent: latest.motor,
    history: db.sensorHistory.map(h => ({ timestamp: h.timestamp, motor: h.motor }))
  });
});

router.get('/sensors/alignment', (_req, res) => {
  const latest = db.sensorHistory[db.sensorHistory.length - 1] || generateSimulatedPacket();
  return res.json({
    leftSensorId: 'SENSOR-IR-L',
    rightSensorId: 'SENSOR-IR-R',
    alignment: latest.alignment,
    history: db.sensorHistory.map(h => ({ timestamp: h.timestamp, alignment: h.alignment }))
  });
});

// ==================================================
// RISK ENGINE ROUTE
// ==================================================
router.get('/risk', (_req, res) => {
  const packet = db.sensorHistory[db.sensorHistory.length - 1] || generateSimulatedPacket();
  const vision = db.visionInspections[0];
  const risk = evaluateConveyorRisk(packet, vision);
  return res.json(risk);
});

// ==================================================
// ALERT ROUTES
// ==================================================
router.get('/alerts', (_req, res) => {
  return res.json({ alerts: db.alerts });
});

router.post('/alerts/:id/acknowledge', (req, res) => {
  const alert = db.alerts.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  alert.acknowledged = true;
  alert.acknowledgedBy = 'Operator';
  alert.acknowledgedAt = new Date().toISOString();
  db.conveyor.activeAlertsCount = db.alerts.filter(a => !a.acknowledged).length;

  const io = getIO();
  io?.emit('alerts_updated', { alerts: db.alerts });

  return res.json({ success: true, alert });
});

// ==================================================
// EVENT TIMELINE & MAINTENANCE ROUTES
// ==================================================
router.get('/events', (_req, res) => {
  return res.json({ events: db.events });
});

router.get('/maintenance', (_req, res) => {
  return res.json({ components: db.maintenanceRecords });
});

// ==================================================
// DEVICE MANAGEMENT ROUTES
// ==================================================
router.get('/devices', (_req, res) => {
  return res.json({ devices: db.devices });
});

// ESP32 Telemetry Receiver API – activates hardware mode on first real packet
router.post('/device-data', (req, res) => {
  const packet = req.body;
  if (!packet.deviceId || !packet.vibration || !packet.motor || !packet.alignment) {
    return res.status(400).json({ error: 'Invalid ESP32 telemetry packet format' });
  }

  packet.timestamp = packet.timestamp || new Date().toISOString();
  packet.isSimulated = false;

  const wasAlreadyConnected = db.isHardwareConnected;

  // Activate all devices and switch to LIVE_HARDWARE mode
  db.activateHardware(packet);

  db.sensorHistory.push(packet);
  if (db.sensorHistory.length > 100) db.sensorHistory.shift();

  const risk = evaluateConveyorRisk(packet, db.visionInspections[0]);
  db.conveyor.riskScore = risk.score;
  db.conveyor.riskLevel = risk.level;
  db.conveyor.healthPercent = Math.max(0, 100 - risk.score);

  const { newAlerts, newEvents } = checkAndGenerateAlerts(packet, risk);
  db.conveyor.activeAlertsCount = db.alerts.filter(a => !a.acknowledged).length;

  const io = getIO();

  // If this is first packet after disconnected state, broadcast mode change
  if (!wasAlreadyConnected) {
    console.log(`[Hardware] Live hardware connected: ${packet.deviceId}`);
    io?.emit('hardware_mode_changed', {
      hardwareMode: db.hardwareMode,
      devices: db.devices,
      conveyor: db.conveyor,
      isHardwareConnected: true
    });
  }

  io?.emit('telemetry_tick', {
    packet,
    risk,
    conveyor: db.conveyor,
    newAlerts,
    newEvents,
    hardwareMode: db.hardwareMode
  });

  return res.json({
    success: true,
    status: 'RECEIVED',
    hardwareMode: db.hardwareMode,
    localSafetyActive: db.localSafetyActive
  });
});

// ==================================================
// MOTOR CONTROL ROUTES
// ==================================================
router.post('/motor/start', (_req, res) => {
  db.conveyor.status = 'RUNNING';
  const io = getIO();
  io?.emit('conveyor_updated', { conveyor: db.conveyor });
  return res.json({ success: true, status: db.conveyor.status });
});

router.post('/motor/stop', (_req, res) => {
  db.conveyor.status = 'STOPPED';
  const io = getIO();
  io?.emit('conveyor_updated', { conveyor: db.conveyor });
  return res.json({ success: true, status: db.conveyor.status });
});

router.post('/motor/emergency-stop', (_req, res) => {
  db.conveyor.status = 'EMERGENCY_STOP';
  const io = getIO();
  io?.emit('conveyor_updated', { conveyor: db.conveyor });
  return res.json({ success: true, status: db.conveyor.status });
});

// ==================================================
// VISION MODULE ROUTES
// ==================================================
router.get('/vision/inspections', (_req, res) => {
  return res.json({ inspections: db.visionInspections });
});

router.post('/vision/analyze', (req, res) => {
  const { condition = 'TEAR', severity = 'HIGH' } = req.body;

  const inspection = {
    id: `VIS-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    conveyorId: db.conveyor.id,
    cameraStatus: 'CONNECTED' as const,
    detectedCondition: condition,
    severity: severity,
    confidencePercent: 96.2,
    boundingBoxes: [
      { x: 120, y: 180, width: 85, height: 45, label: `Belt ${condition}` }
    ],
    notes: 'CV Model detected longitudinal crack progression in rubber surface.'
  };

  db.visionInspections.unshift(inspection);
  const io = getIO();
  io?.emit('vision_updated', { inspection });

  return res.json({ success: true, inspection });
});

// ==================================================
// SCENARIO SIMULATION CONTROL
// ==================================================
router.post('/demo/scenario', (req, res) => {
  const { scenario } = req.body;
  if (!scenario) {
    return res.status(400).json({ error: 'Scenario name is required' });
  }

  db.currentScenario = scenario;
  const io = getIO();

  if (scenario === 'NORMAL' || scenario === 'RECOVERY') {
    db.conveyor.status = 'RUNNING';
    db.conveyor.healthPercent = 94;
    db.conveyor.riskScore = 12;
    db.conveyor.riskLevel = 'NORMAL';

    if (scenario === 'RECOVERY') {
      // Mark open incidents as RESOLVED
      db.incidents.forEach(inc => {
        if (inc.status === 'DETECTED' || inc.status === 'INVESTIGATING' || inc.status === 'ACKNOWLEDGED') {
          inc.status = 'RESOLVED';
          inc.resolutionNotes = 'System recovered to NORMAL state following maintenance inspection.';
        }
      });
      db.events.unshift({
        id: `EVT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        conveyorId: db.conveyor.id,
        eventType: 'SYSTEM_RECOVERY',
        severity: 'INFO',
        message: 'System recovered to NORMAL operational parameters. Motor restarted.',
        source: 'Control Room'
      });
    }
  } else if (scenario === 'CRITICAL_FAULT' || scenario === 'CRITICAL_FAILURE') {
    db.conveyor.status = 'EMERGENCY_STOP';
    db.conveyor.healthPercent = 18;
    db.conveyor.riskScore = 94;
    db.conveyor.riskLevel = 'CRITICAL';

    const incId = `INC-2026-${String(db.incidents.length + 1).padStart(4, '0')}`;
    const newInc: any = {
      id: incId,
      conveyorId: db.conveyor.id,
      siteName: db.company.siteName || 'Plant A – Primary Crusher',
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL',
      condition: 'Abnormal vibration (4.65g) + elevated current (3.60A)',
      healthPercentAtDetection: 18,
      riskScoreAtDetection: 94,
      status: 'DETECTED',
      autoShutdownTriggered: true,
      sosStatus: 'SENT',
      assignedTechnician: 'Tech Lead Rajesh K.',
      resolutionNotes: 'Awaiting inspection before motor restart.',
      downtimeMinutes: 12
    };
    db.incidents.unshift(newInc);

    const newSos: any = {
      id: `SOS-2026-${String(db.sosMessages.length + 1).padStart(4, '0')}`,
      timestamp: new Date().toISOString(),
      companyName: db.company.companyName,
      siteName: db.company.siteName,
      conveyorId: db.conveyor.id,
      status: 'CRITICAL',
      detectedCondition: 'Abnormal vibration + elevated current',
      riskScore: 94,
      actionTaken: 'Conveyor automatically stopped via Interlock Relay',
      incidentId: incId,
      deliveryState: 'SENT',
      recipientMobile: db.company.emergencyContactMobile,
      recipientName: db.company.emergencyContactName,
      simulated: true
    };
    db.sosMessages.unshift(newSos);

    db.events.unshift({
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      conveyorId: db.conveyor.id,
      eventType: 'AUTOMATIC_SHUTDOWN',
      severity: 'CRITICAL',
      message: 'AUTOMATIC MOTOR SHUTDOWN: Interlock relay tripped due to critical vibration (4.65g) & current overload (3.60A).',
      source: 'Local Interlock Safety Controller'
    });
  }

  io?.emit('scenario_updated', { scenario: db.currentScenario });
  io?.emit('conveyor_updated', { conveyor: db.conveyor });

  return res.json({
    success: true,
    currentScenario: db.currentScenario,
    conveyor: db.conveyor,
    incidents: db.incidents,
    sosMessages: db.sosMessages
  });
});

// Enable simulation mode (browser-controlled – shows clear SIMULATION badge)
router.post('/simulation/enable', (_req, res) => {
  if (db.isHardwareConnected) {
    return res.status(400).json({ error: 'Live hardware is connected. Simulation mode unavailable.' });
  }
  db.enableSimulation();
  const io = getIO();
  io?.emit('hardware_mode_changed', { hardwareMode: db.hardwareMode });
  return res.json({ success: true, hardwareMode: db.hardwareMode });
});

// Disable simulation mode
router.post('/simulation/disable', (_req, res) => {
  if (!db.isHardwareConnected) {
    db.hardwareMode = 'DISCONNECTED';
    db.conveyor.status = 'STOPPED';
    db.conveyor.healthPercent = 0;
    db.conveyor.motorCurrentA = 0;
    db.conveyor.vibrationRmsG = 0;
    db.conveyor.riskScore = 0;
    db.sensorHistory = [];
  }
  const io = getIO();
  io?.emit('hardware_mode_changed', { hardwareMode: db.hardwareMode, conveyor: db.conveyor });
  return res.json({ success: true, hardwareMode: db.hardwareMode });
});

// ==================================================
// INCIDENTS API
// ==================================================
router.get('/incidents', (_req, res) => {
  return res.json({ incidents: db.incidents });
});

router.post('/incidents/:id/status', (req, res) => {
  const { status, resolutionNotes, technician } = req.body;
  const inc = db.incidents.find(i => i.id === req.params.id);
  if (!inc) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  if (status) inc.status = status;
  if (resolutionNotes) inc.resolutionNotes = resolutionNotes;
  if (technician) inc.assignedTechnician = technician;

  const io = getIO();
  io?.emit('incidents_updated', { incidents: db.incidents });

  return res.json({ success: true, incident: inc });
});

// ==================================================
// SOS CENTER API
// ==================================================
router.get('/sos', (_req, res) => {
  return res.json({
    sosMessages: db.sosMessages,
    adminContact: {
      name: db.company.adminName,
      mobile: db.company.adminMobile,
      email: db.company.adminEmail
    },
    emergencyContact: {
      name: db.company.emergencyContactName,
      mobile: db.company.emergencyContactMobile
    }
  });
});

router.post('/sos/trigger', (req, res) => {
  const { condition = 'MANUAL SOS TRIGGER', severity = 'CRITICAL' } = req.body;
  const sosId = `SOS-2026-${String(db.sosMessages.length + 1).padStart(4, '0')}`;
  const incId = `INC-2026-${String(db.incidents.length + 1).padStart(4, '0')}`;

  const newSos: any = {
    id: sosId,
    timestamp: new Date().toISOString(),
    companyName: db.company.companyName,
    siteName: db.company.siteName,
    conveyorId: db.conveyor.id,
    status: severity,
    detectedCondition: condition,
    riskScore: db.conveyor.riskScore || 94,
    actionTaken: 'Operator Triggered Emergency SOS Alarm',
    incidentId: incId,
    deliveryState: 'SENT',
    recipientMobile: db.company.emergencyContactMobile,
    recipientName: db.company.emergencyContactName,
    simulated: true
  };
  db.sosMessages.unshift(newSos);

  const newInc: any = {
    id: incId,
    conveyorId: db.conveyor.id,
    siteName: db.company.siteName,
    timestamp: new Date().toISOString(),
    severity: 'CRITICAL',
    condition: condition,
    healthPercentAtDetection: db.conveyor.healthPercent,
    riskScoreAtDetection: db.conveyor.riskScore,
    status: 'DETECTED',
    autoShutdownTriggered: false,
    sosStatus: 'SENT',
    assignedTechnician: db.company.adminName,
    resolutionNotes: 'Manual SOS alert issued from Control Room dashboard.',
    downtimeMinutes: 0
  };
  db.incidents.unshift(newInc);

  const io = getIO();
  io?.emit('sos_updated', { sosMessages: db.sosMessages });
  io?.emit('incidents_updated', { incidents: db.incidents });

  return res.json({ success: true, sosMessage: newSos, incident: newInc });
});

// ==================================================
// COMPANY & ONBOARDING API
// ==================================================
router.get('/company', (_req, res) => {
  return res.json({ company: db.company, conveyor: db.conveyor });
});

router.post('/onboarding', (req, res) => {
  const data = req.body;
  if (!data.companyName || !data.siteName) {
    return res.status(400).json({ error: 'Company Name and Site Name are required' });
  }

  db.company = {
    companyName: data.companyName || 'ABC Cement & Mining Corp',
    industry: data.industry || 'Mining',
    companyId: `COMP-2026-${Math.floor(10 + Math.random() * 90)}`,
    siteName: data.siteName || 'Plant A',
    location: data.location || 'Site Alpha',
    adminName: data.adminName || 'Admin User',
    adminMobile: data.adminMobile || '+91 98765 43210',
    adminEmail: data.adminEmail || 'admin@conveyx.io',
    designation: data.designation || 'Chief Safety Engineer',
    emergencyContactName: data.emergencyContactName || 'Emergency Response Team',
    emergencyContactMobile: data.emergencyContactMobile || '+91 91234 56789',
    smartPodId: data.smartPodId || 'POD-2026-NODE1'
  };

  if (data.conveyorName) {
    db.conveyor.name = data.conveyorName;
  }
  if (data.conveyorId) {
    db.conveyor.id = data.conveyorId;
  }

  return res.json({ success: true, company: db.company, conveyor: db.conveyor });
});

// ==================================================
// REPORTS API
// ==================================================
router.get('/reports', (_req, res) => {
  return res.json({
    company: db.company,
    conveyor: db.conveyor,
    incidents: db.incidents,
    alerts: db.alerts,
    events: db.events,
    maintenance: db.maintenanceRecords,
    summary: {
      totalConveyors: 1,
      healthyCount: db.conveyor.riskScore < 35 ? 1 : 0,
      warningCount: db.conveyor.riskScore >= 35 && db.conveyor.riskScore < 75 ? 1 : 0,
      criticalCount: db.conveyor.riskScore >= 75 ? 1 : 0,
      overallUptime: db.conveyor.uptimePercent || 99.4,
      totalIncidents: db.incidents.length,
      unresolvedIncidents: db.incidents.filter(i => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length
    }
  });
});

export default router;

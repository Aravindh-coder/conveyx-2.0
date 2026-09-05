import { SensorDataPacket, RiskEvaluation, AlertItem, EventItem } from '../../../shared/types.js';
import { db } from '../models/db.js';

export function checkAndGenerateAlerts(
  packet: SensorDataPacket,
  risk: RiskEvaluation
): { newAlerts: AlertItem[]; newEvents: EventItem[] } {
  const newAlerts: AlertItem[] = [];
  const newEvents: EventItem[] = [];

  const now = new Date().toISOString();

  // 1. Belt Misalignment Check
  if (packet.alignment.leftSensorActive || packet.alignment.rightSensorActive) {
    const side = packet.alignment.leftSensorActive ? 'Left' : 'Right';
    const alertId = `ALT-ALIGN-${Date.now().toString().slice(-4)}`;
    
    // Avoid spamming duplicate unresolved alignment alerts
    const existingUnacknowledged = db.alerts.find(
      a => a.title.includes('Belt Tracking Misalignment') && !a.acknowledged
    );

    if (!existingUnacknowledged) {
      const alert: AlertItem = {
        id: alertId,
        timestamp: now,
        sensorId: packet.alignment.leftSensorActive ? 'SENSOR-IR-L' : 'SENSOR-IR-R',
        conveyorId: packet.conveyorId,
        severity: 'WARNING',
        title: `Belt Tracking Misalignment (${side} IR Sensor)`,
        description: `Conveyor belt shifted towards ${side} side, triggering optical IR alignment detector.`,
        recommendedAction: `Inspect guide rollers and re-center belt tension frame.`,
        acknowledged: false
      };
      newAlerts.push(alert);
      db.alerts.unshift(alert);

      const event: EventItem = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        conveyorId: packet.conveyorId,
        eventType: 'MISALIGNMENT_DETECTED',
        severity: 'WARNING',
        message: `IR ${side} tracking sensor triggered. Belt out of center.`,
        source: 'IR Sensor Array'
      };
      newEvents.push(event);
      db.events.unshift(event);
    }
  }

  // 2. Vibration Spike Check
  if (packet.vibration.rms > 2.8) {
    const existingVib = db.alerts.find(
      a => a.title.includes('Vibration Magnitude Spike') && !a.acknowledged
    );
    if (!existingVib) {
      const alert: AlertItem = {
        id: `ALT-VIB-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        sensorId: 'SENSOR-MPU-01',
        conveyorId: packet.conveyorId,
        severity: packet.vibration.rms > 3.8 ? 'CRITICAL' : 'HIGH',
        title: 'Abnormal Drive Roller Vibration Magnitude Spike',
        description: `MPU6050 registered RMS vibration of ${packet.vibration.rms.toFixed(2)}g (baseline 1.10g). Potential bearing damage or roller imbalance.`,
        recommendedAction: 'Inspect drive roller bearings and mounting bolts immediately.',
        acknowledged: false
      };
      newAlerts.push(alert);
      db.alerts.unshift(alert);

      const event: EventItem = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        conveyorId: packet.conveyorId,
        eventType: 'HIGH_VIBRATION',
        severity: alert.severity,
        message: `MPU6050 vibration RMS reached ${packet.vibration.rms.toFixed(2)}g.`,
        source: 'MPU6050 Accelerometer'
      };
      newEvents.push(event);
      db.events.unshift(event);
    }
  }

  // 3. Motor Overload / Stall Check
  if (packet.motor.isOverload || packet.motor.isStall) {
    const titleToUse = packet.motor.isStall ? 'Motor Mechanical Stall Detected' : 'Motor Current Overload Above Baseline';
    const existingMotor = db.alerts.find(
      a => (a.title.includes('Motor Current Overload') || a.title.includes('Motor Mechanical Stall') || a.title === titleToUse) && !a.acknowledged
    );
    if (!existingMotor) {
      const alert: AlertItem = {
        id: `ALT-CURR-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        sensorId: 'SENSOR-ACS-01',
        conveyorId: packet.conveyorId,
        severity: packet.motor.isStall ? 'CRITICAL' : 'HIGH',
        title: packet.motor.isStall ? 'Motor Mechanical Stall Detected' : 'Motor Current Overload Above Baseline',
        description: `ACS712 sensor reading ${packet.motor.current.toFixed(2)} A (Baseline 0.82 A). Mechanical resistance elevated.`,
        recommendedAction: 'Check conveyor belt path for iron ore chute blockage or roller seize.',
        acknowledged: false
      };
      newAlerts.push(alert);
      db.alerts.unshift(alert);

      const event: EventItem = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        conveyorId: packet.conveyorId,
        eventType: 'MOTOR_OVERLOAD',
        severity: alert.severity,
        message: `ACS712 current spike to ${packet.motor.current.toFixed(2)}A.`,
        source: 'ACS712 Sensor'
      };
      newEvents.push(event);
      db.events.unshift(event);
    }
  }

  // 4. Critical Risk Emergency Stop Shutdown
  if (risk.level === 'CRITICAL' && packet.motorState === 'RUNNING') {
    packet.motorState = 'EMERGENCY_STOP';
    db.conveyor.status = 'EMERGENCY_STOP';

    const alert: AlertItem = {
      id: `ALT-EMG-${Date.now().toString().slice(-4)}`,
      timestamp: now,
      sensorId: 'ESP32-001',
      conveyorId: packet.conveyorId,
      severity: 'CRITICAL',
      title: 'LOCAL SAFETY RELAY TRIPPED - Emergency Motor Stop Activated',
      description: 'Multi-sensor risk engine exceeded critical threshold (85+). Local ESP32 / Raspberry Pi 3B+ safety interlock opened to prevent belt joint rupture or motor burnout.',
      recommendedAction: 'Perform physical inspection of drive motor, belt splice, and alignment before resetting local relay.',
      acknowledged: false
    };
    newAlerts.push(alert);
    db.alerts.unshift(alert);

    const event: EventItem = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: now,
      conveyorId: packet.conveyorId,
      eventType: 'EMERGENCY_SHUTDOWN',
      severity: 'CRITICAL',
      message: 'Local hardware relay triggered emergency stop.',
      source: 'ESP32 / Pi Hardware Interlock'
    };
    newEvents.push(event);
    db.events.unshift(event);
  }

  // Keep db arrays bounded (max 50 alerts, 100 events)
  if (db.alerts.length > 50) db.alerts = db.alerts.slice(0, 50);
  if (db.events.length > 100) db.events = db.events.slice(0, 100);

  return { newAlerts, newEvents };
}

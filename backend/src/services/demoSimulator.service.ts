import { SensorDataPacket, MotorState, AlignmentState } from '../../../shared/types.js';
import { db } from '../models/db.js';

export function generateSimulatedPacket(): SensorDataPacket {
  const scenario = db.currentScenario;
  const isStopped = db.conveyor.status === 'STOPPED' || db.conveyor.status === 'EMERGENCY_STOP';

  const noise = (amplitude: number) => (Math.random() - 0.5) * amplitude;

  let x = 0.12 + noise(0.04);
  let y = 0.18 + noise(0.04);
  let z = 1.04 + noise(0.05);
  let rms = 1.25 + noise(0.1);
  const baselineRms = 1.10;

  let current = 0.82 + noise(0.04);
  const baselineCurrent = 0.82;
  let peakCurrent = 1.05;
  let isOverload = false;
  let isStall = false;

  let leftIR = false;
  let rightIR = false;
  let alignmentStatus: AlignmentState = 'ALIGNED';
  let motorState: MotorState = db.conveyor.status === 'EMERGENCY_STOP' ? 'EMERGENCY_STOP' : 'RUNNING';

  if (isStopped) {
    x = 0.01 + noise(0.005);
    y = 0.01 + noise(0.005);
    z = 0.98 + noise(0.005);
    rms = 0.15 + noise(0.02);
    current = 0.02;
    peakCurrent = 0.82;
    motorState = db.conveyor.status;
  } else {
    switch (scenario) {
      case 'NORMAL':
      case 'RECOVERY':
        x = 0.15 + noise(0.05);
        y = 0.20 + noise(0.05);
        z = 1.08 + noise(0.06);
        rms = 1.27 + noise(0.12);
        current = 0.84 + noise(0.03);
        break;

      case 'VIBRATION_WARNING':
      case 'HIGH_VIBRATION':
        x = 1.85 + noise(0.35);
        y = 2.10 + noise(0.40);
        z = 2.45 + noise(0.30);
        rms = 3.42 + noise(0.35);
        current = 1.22 + noise(0.08);
        peakCurrent = 1.65;
        break;

      case 'HIGH_CURRENT':
      case 'MOTOR_OVERLOAD':
        x = 0.45 + noise(0.10);
        y = 0.50 + noise(0.10);
        z = 1.40 + noise(0.12);
        rms = 2.15 + noise(0.20);
        current = 2.48 + noise(0.25);
        peakCurrent = 3.10;
        isOverload = true;
        break;

      case 'TEMPERATURE_WARNING':
        x = 0.40 + noise(0.08);
        y = 0.45 + noise(0.08);
        z = 1.30 + noise(0.10);
        rms = 2.05 + noise(0.15);
        current = 1.95 + noise(0.12);
        break;

      case 'RPM_ABNORMAL':
        x = 0.65 + noise(0.15);
        y = 0.85 + noise(0.20);
        z = 1.60 + noise(0.18);
        rms = 2.45 + noise(0.25);
        current = 2.10 + noise(0.18);
        break;

      case 'VISION_ANOMALY':
        x = 0.35 + noise(0.08);
        y = 0.40 + noise(0.08);
        z = 1.15 + noise(0.08);
        rms = 1.55 + noise(0.15);
        current = 1.10 + noise(0.08);
        break;

      case 'MISALIGNMENT':
        x = 0.35 + noise(0.08);
        y = 0.55 + noise(0.10);
        z = 1.25 + noise(0.09);
        rms = 1.85 + noise(0.15);
        current = 1.05 + noise(0.05);
        leftIR = true;
        alignmentStatus = 'MISALIGNED_LEFT';
        break;

      case 'MULTI_SENSOR_ANOMALY':
        x = 1.65 + noise(0.25);
        y = 1.95 + noise(0.30);
        z = 2.20 + noise(0.25);
        rms = 3.25 + noise(0.30);
        current = 2.35 + noise(0.20);
        leftIR = true;
        alignmentStatus = 'MISALIGNED_LEFT';
        isOverload = true;
        break;

      case 'CRITICAL_FAULT':
      case 'CRITICAL_FAILURE':
        x = 2.85 + noise(0.40);
        y = 3.10 + noise(0.50);
        z = 3.45 + noise(0.40);
        rms = 4.65 + noise(0.40);
        current = 3.60 + noise(0.30);
        leftIR = true;
        alignmentStatus = 'FAULT';
        isOverload = true;
        isStall = true;
        motorState = 'FAULT';
        break;

      case 'SENSOR_OFFLINE':
        x = 0;
        y = 0;
        z = 0;
        rms = 0;
        current = 0;
        motorState = 'STOPPED';
        break;
    }
  }

  x = Number(x.toFixed(2));
  y = Number(y.toFixed(2));
  z = Number(z.toFixed(2));
  rms = Number(rms.toFixed(2));
  current = Number(current.toFixed(2));

  const packet: SensorDataPacket = {
    deviceId: 'SIMULATION',
    conveyorId: db.conveyor.id,
    timestamp: new Date().toISOString(),
    vibration: { x, y, z, rms, baselineRms },
    motor: { current, baselineCurrent, peakCurrent, isOverload, isStall },
    alignment: { leftSensorActive: leftIR, rightSensorActive: rightIR, status: alignmentStatus },
    motorState,
    temperature: Number((38.5 + (scenario === 'NORMAL' ? noise(0.5) : Math.random() * 8)).toFixed(1)),
    demoScenario: scenario,
    isSimulated: true
  };

  // Update live conveyor metrics
  db.conveyor.vibrationRmsG = rms;
  db.conveyor.motorCurrentA = current;
  db.conveyor.alignmentStatus = alignmentStatus;
  db.conveyor.status = motorState;
  db.conveyor.healthPercent = Math.max(0, Math.round(100 - (rms / 5) * 35 - (current / 4) * 35));

  db.sensorHistory.push(packet);
  if (db.sensorHistory.length > 100) db.sensorHistory.shift();

  return packet;
}

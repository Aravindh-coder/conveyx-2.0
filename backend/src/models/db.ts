import {
  ConveyorSystem,
  DeviceInfo,
  AlertItem,
  EventItem,
  MaintenanceComponent,
  VisionInspection,
  SensorDataPacket,
  DemoScenario,
  HardwareMode
} from '../../../shared/types.js';

class InMemoryDB {
  public conveyor: ConveyorSystem = {
    id: 'CONV-01',
    name: 'Main Shaft Iron Ore Conveyor',
    location: 'Primary Crusher Feed Line – Shaft 4',
    status: 'STOPPED',
    healthPercent: 0,
    riskScore: 0,
    riskLevel: 'NORMAL',
    beltSpeedMps: 0,
    motorCurrentA: 0,
    vibrationRmsG: 0,
    alignmentStatus: 'ALIGNED',
    activeAlertsCount: 0,
    uptimePercent: 0,
    lastInspectionDate: new Date(Date.now() - 86400000 * 2).toISOString(),
  };

  // Hardware connection tracking
  public hardwareMode: HardwareMode = 'DISCONNECTED';
  public lastHardwarePacketAt: number | null = null;
  public isHardwareConnected: boolean = false;
  public localSafetyActive: boolean = true;

  public currentScenario: DemoScenario = 'NORMAL';

  // All devices start DISCONNECTED until real hardware sends data
  public devices: DeviceInfo[] = [
    {
      id: 'ARDUINO-001',
      name: 'Arduino UNO R3 (Local Safety Controller)',
      type: 'MCU',
      protocol: 'UART',
      status: 'DISCONNECTED',
      lastSeen: 'Never',
      firmwareVersion: '—',
      packetCount: 0,
      description: 'Handles local analog reading & instant hardware relay trigger cutoff.'
    },
    {
      id: 'ESP32-001',
      name: 'ESP32 Wi-Fi Gateway',
      type: 'MCU',
      protocol: 'WIFI',
      status: 'DISCONNECTED',
      lastSeen: 'Never',
      firmwareVersion: '—',
      ipAddress: undefined,
      packetCount: 0,
      description: 'Receives UART packets from Arduino UNO and relays JSON stream to the web platform.'
    },
    {
      id: 'SENSOR-MPU-01',
      name: 'MPU6050 Accelerometer / Gyro (Vibration)',
      type: 'SENSOR',
      protocol: 'I2C',
      status: 'DISCONNECTED',
      lastSeen: 'Never',
      firmwareVersion: '—',
      packetCount: 0,
      description: 'Measures 3-axis vibration magnitude (g) and RMS noise on drive roller bearing.'
    },
    {
      id: 'SENSOR-ACS-01',
      name: 'ACS712 20A Current Sensor (Motor Load)',
      type: 'SENSOR',
      protocol: 'ANALOG',
      status: 'DISCONNECTED',
      lastSeen: 'Never',
      firmwareVersion: '—',
      packetCount: 0,
      description: 'Measures DC motor current draw to detect mechanical jam, overload & stall.'
    },
    {
      id: 'SENSOR-IR-L',
      name: 'Left Belt IR Tracking Sensor',
      type: 'SENSOR',
      protocol: 'DIGITAL',
      status: 'DISCONNECTED',
      lastSeen: 'Never',
      firmwareVersion: '—',
      packetCount: 0,
      description: 'Optical reflection sensor detecting leftward belt drift.'
    },
    {
      id: 'SENSOR-IR-R',
      name: 'Right Belt IR Tracking Sensor',
      type: 'SENSOR',
      protocol: 'DIGITAL',
      status: 'DISCONNECTED',
      lastSeen: 'Never',
      firmwareVersion: '—',
      packetCount: 0,
      description: 'Optical reflection sensor detecting rightward belt drift.'
    },
    {
      id: 'RELAY-01',
      name: 'Safety Interlock Relay Module',
      type: 'RELAY',
      protocol: 'DIGITAL',
      status: 'DISCONNECTED',
      lastSeen: 'Never',
      firmwareVersion: '—',
      packetCount: 0,
      description: 'Normally-closed relay cutting 5V DC motor power upon safety trip.'
    },
    {
      id: 'MOTOR-5V-01',
      name: 'Drive Motor Prototype (5V DC)',
      type: 'ACTUATOR',
      protocol: 'DIGITAL',
      status: 'DISCONNECTED',
      lastSeen: 'Never',
      firmwareVersion: '—',
      packetCount: 0,
      description: 'Drives primary pulley and belt movement.'
    },
    {
      id: 'CAM-VISION-01',
      name: 'Optical Belt Inspection Camera (Future AI Module)',
      type: 'CAMERA',
      protocol: 'RTSP',
      status: 'DISCONNECTED',
      lastSeen: 'Never',
      firmwareVersion: '—',
      ipAddress: undefined,
      packetCount: 0,
      description: 'RTSP HD stream for CV model crack, tear, splice & edge damage detection.'
    }
  ];

  // Activate all devices when real ESP32 hardware connects
  public activateHardware(packet: SensorDataPacket): void {
    const now = new Date().toISOString();
    this.hardwareMode = 'LIVE_HARDWARE';
    this.isHardwareConnected = true;
    this.lastHardwarePacketAt = Date.now();

    // Set all hardware devices to CONNECTED
    this.devices = this.devices.map(d => ({
      ...d,
      status: d.id === 'CAM-VISION-01' ? 'WARNING' : 'CONNECTED',
      lastSeen: now,
      firmwareVersion: d.id === 'ESP32-001' ? 'v1.4.2' :
                       d.id === 'ARDUINO-001' ? 'v2.1.0' : 'N/A',
      ipAddress: d.id === 'ESP32-001' ? (packet as any).ipAddress || '—' : d.ipAddress,
      packetCount: d.packetCount + 1,
    }));

    // Set conveyor to RUNNING with real data
    this.conveyor.status = packet.motorState;
    this.conveyor.motorCurrentA = packet.motor.current;
    this.conveyor.vibrationRmsG = packet.vibration.rms;
    this.conveyor.alignmentStatus = packet.alignment.status;
    this.conveyor.beltSpeedMps = 1.5;
  }

  // Check if hardware has gone stale (no packet in 10 seconds)
  public checkHardwareTimeout(): void {
    if (this.lastHardwarePacketAt && Date.now() - this.lastHardwarePacketAt > 10000) {
      this.hardwareMode = 'DISCONNECTED';
      this.isHardwareConnected = false;
      this.devices = this.devices.map(d => ({
        ...d,
        status: 'DISCONNECTED',
      }));
      this.conveyor.status = 'STOPPED';
    }
  }

  // Enable simulation mode explicitly (not the same as hardware connected)
  public enableSimulation(): void {
    if (this.hardwareMode === 'DISCONNECTED') {
      this.hardwareMode = 'SIMULATION';
      this.conveyor.status = 'RUNNING';
      this.conveyor.healthPercent = 94;
      this.conveyor.motorCurrentA = 0.82;
      this.conveyor.vibrationRmsG = 1.27;
    }
  }

  public sensorHistory: SensorDataPacket[] = [];
  public alerts: AlertItem[] = [];
  public events: EventItem[] = [
    {
      id: 'EVT-0001',
      timestamp: new Date().toISOString(),
      conveyorId: 'CONV-01',
      eventType: 'SYSTEM_START',
      severity: 'INFO',
      message: 'CONVEY X platform initialized. Awaiting hardware connection.',
      source: 'Platform Gateway'
    }
  ];

  public maintenanceRecords: MaintenanceComponent[] = [
    {
      id: 'COMP-01',
      name: '5V Drive Motor',
      componentType: 'MOTOR',
      healthPercent: 91,
      status: 'OPTIMAL',
      lastServicedDate: '2026-08-15',
      nextScheduledDate: '2026-10-15',
      operatingHours: 420,
      notes: 'Awaiting hardware connection for live data.'
    },
    {
      id: 'COMP-02',
      name: 'Drive Roller & Bearing Assembly',
      componentType: 'DRIVE_ROLLER',
      healthPercent: 88,
      status: 'OPTIMAL',
      lastServicedDate: '2026-08-10',
      nextScheduledDate: '2026-10-10',
      operatingHours: 540,
      notes: 'Greased during last maintenance cycle.'
    },
    {
      id: 'COMP-03',
      name: 'Multi-ply Fabric Rubber Belt',
      componentType: 'BELT',
      healthPercent: 82,
      status: 'OPTIMAL',
      lastServicedDate: '2026-07-28',
      nextScheduledDate: '2026-09-28',
      operatingHours: 880,
      notes: 'Slight edge fraying observed during last inspection.'
    },
    {
      id: 'COMP-04',
      name: 'Vulcanized Belt Joint / Splice Zone',
      componentType: 'BELT_JOINT',
      healthPercent: 74,
      status: 'INSPECTION_RECOMMENDED',
      lastServicedDate: '2026-07-15',
      nextScheduledDate: '2026-09-05',
      operatingHours: 920,
      notes: 'Recommended camera vision scan for surface stress cracks.'
    },
    {
      id: 'COMP-05',
      name: 'IR Alignment Optical Guides',
      componentType: 'SENSORS',
      healthPercent: 96,
      status: 'OPTIMAL',
      lastServicedDate: '2026-08-20',
      nextScheduledDate: '2026-11-20',
      operatingHours: 310,
      notes: 'Lenses cleaned of iron ore dust.'
    }
  ];

  public visionInspections: VisionInspection[] = [];
}

export const db = new InMemoryDB();

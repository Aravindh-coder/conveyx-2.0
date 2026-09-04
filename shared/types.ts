export type MotorState = 'RUNNING' | 'STOPPED' | 'FAULT' | 'EMERGENCY_STOP';
export type RiskLevel = 'NORMAL' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL';
export type SeverityLevel = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type DeviceState = 'CONNECTED' | 'DISCONNECTED' | 'WARNING' | 'ERROR';
export type AlignmentState = 'ALIGNED' | 'MISALIGNED_LEFT' | 'MISALIGNED_RIGHT' | 'FAULT';
export type HardwareMode = 'DISCONNECTED' | 'SIMULATION' | 'LIVE_HARDWARE';

export interface VibrationData {
  x: number; // in g
  y: number; // in g
  z: number; // in g
  rms: number; // Root Mean Square vibration magnitude
  baselineRms: number;
}

export interface MotorCurrentData {
  current: number; // Amperes
  baselineCurrent: number;
  peakCurrent: number;
  isOverload: boolean;
  isStall: boolean;
}

export interface BeltAlignmentData {
  leftSensorActive: boolean;  // true = belt triggering left IR sensor (misaligned)
  rightSensorActive: boolean; // true = belt triggering right IR sensor (misaligned)
  status: AlignmentState;
}

export interface SensorDataPacket {
  deviceId: string;
  conveyorId: string;
  timestamp: string;
  vibration: VibrationData;
  motor: MotorCurrentData;
  alignment: BeltAlignmentData;
  motorState: MotorState;
  temperature?: number;
  demoScenario?: string;
  isSimulated?: boolean;
}

export interface RiskContributors {
  vibration: number; // contribution points
  current: number;
  alignment: number;
  vision: number;
}

export interface RiskEvaluation {
  score: number; // 0 to 100
  level: RiskLevel;
  confidence: number; // percentage e.g. 92%
  failureProbability: number; // 0 to 1
  contributors: RiskContributors;
  recommendedAction: string;
  timestamp: string;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  sensorId: string;
  conveyorId: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  recommendedAction: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface EventItem {
  id: string;
  timestamp: string;
  conveyorId: string;
  eventType: string;
  severity: SeverityLevel;
  message: string;
  source: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'MCU' | 'SENSOR' | 'ACTUATOR' | 'CAMERA' | 'RELAY' | 'EDGE_COMPUTE';
  protocol: 'UART' | 'I2C' | 'ANALOG' | 'DIGITAL' | 'WIFI' | 'RTSP' | 'MQTT' | 'HTTP' | 'MQTT / HTTP' | 'WIFI / MQTT';
  status: DeviceState;
  lastSeen: string;
  firmwareVersion: string;
  ipAddress?: string;
  packetCount: number;
  description: string;
}

export interface ConveyorSystem {
  id: string;
  name: string;
  location: string;
  status: MotorState;
  healthPercent: number;
  riskScore: number;
  riskLevel: RiskLevel;
  beltSpeedMps: number;
  motorCurrentA: number;
  vibrationRmsG: number;
  alignmentStatus: AlignmentState;
  activeAlertsCount: number;
  uptimePercent: number;
  lastInspectionDate: string;
}

export interface VisionInspection {
  id: string;
  timestamp: string;
  conveyorId: string;
  cameraStatus: 'CONNECTED' | 'DISCONNECTED' | 'STREAMING' | 'OFFLINE';
  detectedCondition: 'NORMAL' | 'CRACK' | 'TEAR' | 'EDGE_DAMAGE' | 'JOINT_DAMAGE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidencePercent: number;
  boundingBoxes?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  }>;
  imageUrl?: string;
  notes: string;
}

export interface MaintenanceComponent {
  id: string;
  name: string;
  componentType: 'MOTOR' | 'DRIVE_ROLLER' | 'RETURN_ROLLER' | 'BELT' | 'BELT_JOINT' | 'BEARINGS' | 'SENSORS';
  healthPercent: number;
  status: 'OPTIMAL' | 'INSPECTION_RECOMMENDED' | 'REPLACEMENT_NEEDED' | 'CRITICAL_FAULT';
  lastServicedDate: string;
  nextScheduledDate: string;
  operatingHours: number;
  notes: string;
}

export type IncidentStatus = 'DETECTED' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
export type SOSDeliveryState = 'QUEUED' | 'SENDING' | 'SENT' | 'FAILED';

export interface IncidentItem {
  id: string;
  conveyorId: string;
  siteName: string;
  timestamp: string;
  severity: SeverityLevel;
  condition: string;
  healthPercentAtDetection: number;
  riskScoreAtDetection: number;
  status: IncidentStatus;
  autoShutdownTriggered: boolean;
  sosStatus: SOSDeliveryState;
  assignedTechnician?: string;
  resolutionNotes?: string;
  downtimeMinutes?: number;
}

export interface SOSMessageItem {
  id: string;
  timestamp: string;
  companyName: string;
  siteName: string;
  conveyorId: string;
  status: 'CRITICAL' | 'WARNING' | 'NORMAL';
  detectedCondition: string;
  riskScore: number;
  actionTaken: string;
  incidentId: string;
  deliveryState: SOSDeliveryState;
  recipientMobile: string;
  recipientName: string;
  simulated: boolean;
}

export interface CompanyInfo {
  companyName: string;
  industry: string;
  companyId: string;
  siteName: string;
  location: string;
  adminName: string;
  adminMobile: string;
  adminEmail: string;
  designation: string;
  emergencyContactName: string;
  emergencyContactMobile: string;
  smartPodId: string;
}

export interface OnboardingData extends CompanyInfo {
  conveyorName: string;
  conveyorId: string;
}

export type DemoScenario =
  | 'NORMAL'
  | 'VIBRATION_WARNING'
  | 'HIGH_CURRENT'
  | 'TEMPERATURE_WARNING'
  | 'RPM_ABNORMAL'
  | 'VISION_ANOMALY'
  | 'CRITICAL_FAULT'
  | 'SENSOR_OFFLINE'
  | 'RECOVERY'
  | 'MISALIGNMENT'
  | 'HIGH_VIBRATION'
  | 'MOTOR_OVERLOAD'
  | 'MULTI_SENSOR_ANOMALY'
  | 'CRITICAL_FAILURE';


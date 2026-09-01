import { SensorDataPacket, RiskEvaluation, RiskLevel, VisionInspection } from '../../../shared/types.js';

export function evaluateConveyorRisk(
  packet: SensorDataPacket,
  latestVision?: VisionInspection
): RiskEvaluation {
  // 1. Vibration Contribution (Max 35 points)
  // Baseline ~1.1g, Normal up to 1.8g, Warning 1.8g-3.0g, Critical >3.0g
  let vibScore = 0;
  const rms = packet.vibration.rms;
  if (rms <= 1.8) {
    vibScore = Math.max(0, Math.round((rms / 1.8) * 8));
  } else if (rms <= 3.2) {
    vibScore = 8 + Math.round(((rms - 1.8) / (3.2 - 1.8)) * 17); // 8 -> 25
  } else {
    vibScore = 25 + Math.min(10, Math.round(((rms - 3.2) / 2.0) * 10)); // 25 -> 35
  }

  // 2. Motor Current Contribution (Max 35 points)
  // Baseline ~0.8A, Normal up to 1.2A, Warning 1.2A-2.2A, Critical >2.2A or Stall
  let currScore = 0;
  const curr = packet.motor.current;
  if (packet.motor.isStall) {
    currScore = 35;
  } else if (curr <= 1.2) {
    currScore = Math.max(0, Math.round((curr / 1.2) * 6));
  } else if (curr <= 2.2) {
    currScore = 6 + Math.round(((curr - 1.2) / (2.2 - 1.2)) * 19); // 6 -> 25
  } else {
    currScore = 25 + Math.min(10, Math.round(((curr - 2.2) / 1.5) * 10));
  }

  // 3. Belt Alignment Contribution (Max 25 points)
  let alignScore = 0;
  const align = packet.alignment.status;
  if (align === 'MISALIGNED_LEFT' || align === 'MISALIGNED_RIGHT') {
    alignScore = 20;
  } else if (align === 'FAULT') {
    alignScore = 25;
  } else {
    alignScore = 0;
  }

  // 4. Vision Contribution (Max 20 points)
  let visionScore = 0;
  if (latestVision) {
    switch (latestVision.detectedCondition) {
      case 'CRACK':
        visionScore = 10;
        break;
      case 'EDGE_DAMAGE':
        visionScore = 12;
        break;
      case 'TEAR':
        visionScore = 18;
        break;
      case 'JOINT_DAMAGE':
        visionScore = 20;
        break;
      default:
        visionScore = 0;
    }
  }

  // Calculate Total Risk Score (Capped at 100)
  let totalScore = vibScore + currScore + alignScore + visionScore;
  if (packet.motorState === 'EMERGENCY_STOP' || packet.motorState === 'FAULT') {
    totalScore = Math.max(totalScore, 85);
  }
  totalScore = Math.min(100, Math.max(0, totalScore));

  // Determine Risk Level
  let level: RiskLevel = 'NORMAL';
  if (totalScore >= 76) {
    level = 'CRITICAL';
  } else if (totalScore >= 56) {
    level = 'HIGH_RISK';
  } else if (totalScore >= 31) {
    level = 'WARNING';
  } else {
    level = 'NORMAL';
  }

  // Failure Probability estimation (0.0 to 1.0)
  const failureProbability = Number((totalScore / 100).toFixed(2));

  // Recommended Action
  let recommendedAction = 'System operating within normal parameters. Continue standard monitoring.';
  if (level === 'CRITICAL') {
    recommendedAction = 'CRITICAL RISK: Immediate motor shutdown & manual inspection required. Check belt joint splice integrity and guide rollers.';
  } else if (level === 'HIGH_RISK') {
    recommendedAction = 'HIGH RISK: Multi-sensor anomaly detected. Reduce conveyor feed rate and schedule maintenance check within 2 hours.';
  } else if (level === 'WARNING') {
    if (alignScore > 0) {
      recommendedAction = 'WARNING: Belt tracking drift detected by IR sensors. Adjust guide rollers.';
    } else if (vibScore > 10) {
      recommendedAction = 'WARNING: Elevating drive roller vibration magnitude. Check roller bearing lubrication.';
    } else if (currScore > 10) {
      recommendedAction = 'WARNING: Motor current exceeding baseline load. Inspect for mechanical belt friction or ore jam.';
    }
  }

  return {
    score: totalScore,
    level,
    confidence: 94.5,
    failureProbability,
    contributors: {
      vibration: vibScore,
      current: currScore,
      alignment: alignScore,
      vision: visionScore
    },
    recommendedAction,
    timestamp: new Date().toISOString()
  };
}

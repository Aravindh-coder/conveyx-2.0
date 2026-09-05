import joblib
import pandas as pd
import requests
import time

MODEL_FILE = "vibration_model.joblib"
CONVEYX_API = "http://localhost:4000/api/device-data"

print(" Loading Trained Baseline Anomaly Model on Raspberry Pi 3B+...")
payload = joblib.load(MODEL_FILE)
model = payload["model"]
features = payload["features"]
baseline_mean = payload["baseline_mean"]

print(" Model active! Starting live inference loop...")

def predict_vibration_anomaly(vib_x, vib_y, vib_z, vib_rms):
    sample = pd.DataFrame([[vib_x, vib_y, vib_z, vib_rms]], columns=features)
    
    # Predict: 1 = Normal, -1 = Anomaly
    prediction = model.predict(sample)[0]
    
    # Anomaly score: negative values indicate anomaly severity
    score = model.score_samples(sample)[0]
    normalized_risk = max(0, min(100, int((0.5 - score) * 100)))

    return {
        "is_anomaly": bool(prediction == -1),
        "risk_score": normalized_risk,
        "raw_score": float(score)
    }

# Example inference call
if __name__ == "__main__":
    res = predict_vibration_anomaly(0.45, 0.38, 0.98, 1.12)
    print("Sample Normal Test:", res)
    
    res_fault = predict_vibration_anomaly(2.80, 3.10, 1.95, 4.65)
    print("Sample High Vibration Fault Test:", res_fault)

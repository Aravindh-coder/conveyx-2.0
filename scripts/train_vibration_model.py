import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib

DATASET_FILE = "vibration_normal_dataset.csv"
MODEL_OUTPUT = "vibration_model.joblib"

print(" Loading 2k+ Normal Motor Vibration Dataset...")
df = pd.read_csv(DATASET_FILE)

# Extract feature columns (X, Y, Z, RMS)
features = ["vib_x", "vib_y", "vib_z", "vib_rms"]
X_train = df[features]

print(f" Data shape: {X_train.shape}")
print(" Training Isolation Forest Anomaly Detection Model for Raspberry Pi 3B+...")

# IsolationForest trained exclusively on Normal Baseline data
model = IsolationForest(
    n_estimators=100,
    contamination=0.01, # Expecting ~1% noise in baseline
    random_state=42
)
model.fit(X_train)

# Calculate baseline stats for Z-Score thresholding
baseline_mean = X_train.mean().to_dict()
baseline_std = X_train.std().to_dict()

save_payload = {
    "model": model,
    "features": features,
    "baseline_mean": baseline_mean,
    "baseline_std": baseline_std
}

joblib.dump(save_payload, MODEL_OUTPUT)
print(f" Model trained successfully & saved to {MODEL_OUTPUT}!")
print(" Baseline Feature Means:", baseline_mean)

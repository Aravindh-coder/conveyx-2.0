import csv
import time
import requests

# ConveyX 2.0 Backend URL or ESP32 URL
API_URL = "http://localhost:4000/api/sensors/latest"
OUTPUT_CSV = "vibration_normal_dataset.csv"
NUM_SAMPLES = 2000

print(f"📡 Starting Data Collection: Target {NUM_SAMPLES} Normal Vibration Samples...")

fields = ["timestamp", "vib_x", "vib_y", "vib_z", "vib_rms"]

with open(OUTPUT_CSV, mode="w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(fields)
    
    count = 0
    while count < NUM_SAMPLES:
        try:
            res = requests.get(API_URL, timeout=2)
            if res.status_code == 200:
                data = res.json()
                vib = data.get("vibration", {})
                timestamp = data.get("timestamp", time.time())
                
                vib_x = vib.get("x", 0.0)
                vib_y = vib.get("y", 0.0)
                vib_z = vib.get("z", 0.0)
                vib_rms = vib.get("rms", 0.0)

                writer.writerow([timestamp, vib_x, vib_y, vib_z, vib_rms])
                count += 1
                if count % 100 == 0:
                    print(f" Collected {count}/{NUM_SAMPLES} samples...")
        except Exception as e:
            print(f"⚠️ Error fetching sample: {e}")
            
        time.sleep(0.05) # 20 Hz sampling rate

print(f" Data collection complete! Saved {NUM_SAMPLES} samples to {OUTPUT_CSV}")

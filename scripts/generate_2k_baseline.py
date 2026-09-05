import csv
import random
import time

OUTPUT_CSV = "vibration_normal_dataset.csv"
NUM_SAMPLES = 2000

print(f"⚡ Generating {NUM_SAMPLES} Normal Motor Vibration Baseline Data Points...")

fields = ["timestamp", "vib_x", "vib_y", "vib_z", "vib_rms"]

with open(OUTPUT_CSV, mode="w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(fields)
    
    start_time = time.time() - (NUM_SAMPLES * 0.05)
    for i in range(NUM_SAMPLES):
        t = start_time + (i * 0.05)
        # Normal motor baseline vibration (MPU6050 nominal range)
        vib_x = round(random.gauss(0.45, 0.03), 4)
        vib_y = round(random.gauss(0.38, 0.03), 4)
        vib_z = round(random.gauss(0.95, 0.04), 4)
        vib_rms = round((vib_x**2 + vib_y**2 + vib_z**2)**0.5, 4)

        writer.writerow([t, vib_x, vib_y, vib_z, vib_rms])

print(f" Successfully generated 2,000 normal vibration baseline records to {OUTPUT_CSV}!")

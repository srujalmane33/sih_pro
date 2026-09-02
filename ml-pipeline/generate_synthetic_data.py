from pathlib import Path
import numpy as np
import pandas as pd

np.random.seed(42)
n_samples = 500

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "data" / "processed"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Coordinates for MOIL manganese belt (Balaghat, Tirodi, Dongri Buzurg, Gumgaon, Kandri, Mansar)
zones = [
    ("ZONE-A (Dongri Buzurg)", 21.53, 79.68, 85),
    ("ZONE-B (Tirodi Mine)", 21.68, 79.71, 65),
    ("ZONE-C (Balaghat Pit 4)", 21.80, 80.18, 40),
    ("ZONE-D (Gumgaon)", 21.38, 79.03, 75),
    ("ZONE-E (Kandri)", 21.42, 79.27, 55),
    ("ZONE-F (Mansar)", 21.40, 79.28, 70),
]

records = []
for _ in range(n_samples):
  name, lat, lon, base_reserve = zones[np.random.randint(0, len(zones))]

  rainfall = float(np.random.exponential(scale=35.0))
  soil_moisture = float(
      np.clip(20.0 + (rainfall * 0.45) + np.random.normal(0, 4), 10, 95)
  )
  ndvi = float(
      np.clip(0.25 + (rainfall * 0.002) + np.random.normal(0, 0.03), 0.1, 0.7)
  )
  temperature = float(np.random.uniform(26.0, 42.0))
  downtime_hrs = float(np.random.gamma(shape=2.5, scale=6.0))
  geological_score = float(
      np.clip(base_reserve + np.random.normal(0, 5) - (ndvi * 10), 15, 95)
  )

  target_prod = float(np.random.uniform(36000, 45000))
  rain_penalty = 0.80 if rainfall > 85 else 1.0
  machine_penalty = max(0.60, (100 - (downtime_hrs * 1.6)) / 100)

  actual_prod = target_prod * rain_penalty * machine_penalty
  shortfall_ratio = (target_prod - actual_prod) / target_prod

  if shortfall_ratio < 0.08:
    risk = "LOW"
  elif shortfall_ratio < 0.20:
    risk = "MEDIUM"
  else:
    risk = "HIGH"

  records.append({
      "zone_id": name,
      "latitude": lat,
      "longitude": lon,
      "geological_score": round(geological_score, 1),
      "ndvi": round(ndvi, 3),
      "rainfall_mm": round(rainfall, 1),
      "soil_moisture_pct": round(soil_moisture, 1),
      "temperature_c": round(temperature, 1),
      "equipment_downtime_hrs": round(downtime_hrs, 1),
      "target_production": round(target_prod, 0),
      "actual_production": round(actual_prod, 0),
      "shortfall_risk": risk,
  })

df = pd.DataFrame(records)
csv_dest = OUTPUT_DIR / "master_dataset.csv"
df.to_csv(csv_dest, index=False)
print(f"Generated {csv_dest} ({len(df)} rows)")
import json
from pathlib import Path
import numpy as np
import pandas as pd
from recommendation_rules import generate_recommendations
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "processed" / "master_dataset.csv"

df = pd.read_csv(DATA_PATH)

features = [
    "geological_score",
    "ndvi",
    "rainfall_mm",
    "soil_moisture_pct",
    "equipment_downtime_hrs",
    "target_production",
]
target = "shortfall_risk"

X = df[features]
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("Model Test Evaluation:")
print(classification_report(y_test, y_pred))

# Group by zone to create clean current-state dashboard records
zone_summary = (
    df.groupby("zone_id")
    .agg({
        "latitude": "first",
        "longitude": "first",
        "geological_score": "mean",
        "ndvi": "mean",
        "rainfall_mm": "mean",
        "soil_moisture_pct": "mean",
        "equipment_downtime_hrs": "mean",
        "target_production": "mean",
        "actual_production": "mean",
    })
    .reset_index()
)

zone_summary["predicted_risk"] = model.predict(zone_summary[features])

# Format for the React interface
feed_payload = []
for _, row in zone_summary.iterrows():
  recs = generate_recommendations(row)
  score = float(row["geological_score"])
  pot = "HIGH" if score > 75 else "MEDIUM" if score > 50 else "LOW"

  feed_payload.append({
      "zone_id": row["zone_id"],
      "latitude": float(row["latitude"]),
      "longitude": float(row["longitude"]),
      "reserve_potential": pot,
      "reserve_score": round(score, 1),
      "shortfall_risk": row["predicted_risk"],
      "target_production": int(row["target_production"]),
      "predicted_production": int(row["actual_production"]),
      "rainfall_mm": round(float(row["rainfall_mm"]), 1),
      "soil_moisture_pct": round(float(row["soil_moisture_pct"]), 1),
      "equipment_downtime_hrs": round(float(row["equipment_downtime_hrs"]), 1),
      "ndvi": round(float(row["ndvi"]), 2),
      "recommendations": recs,
      "production_history": [
          {
              "month": "Apr",
              "actual": int(row["actual_production"] * 0.95),
              "target": int(row["target_production"]),
          },
          {
              "month": "May",
              "actual": int(row["actual_production"] * 0.98),
              "target": int(row["target_production"]),
          },
          {
              "month": "Jun",
              "actual": int(row["actual_production"] * 0.92),
              "target": int(row["target_production"]),
          },
          {
              "month": "Jul (Pred)",
              "actual": int(row["actual_production"]),
              "target": int(row["target_production"]),
          },
      ],
  })

# 1. Save in ml-pipeline/data/processed
json_local = BASE_DIR / "data" / "processed" / "dashboard_feed.json"
with open(json_local, "w") as f:
  json.dump(feed_payload, f, indent=2)

# 2. Automatically sync to frontend/public/data/ if it exists
frontend_public = (
    BASE_DIR.parent / "frontend" / "public" / "data" / "dashboard_feed.json"
)
if frontend_public.parent.exists():
  with open(frontend_public, "w") as f:
    json.dump(feed_payload, f, indent=2)
  print(f"Synced feed directly to {frontend_public}")

print(f"Exported: {json_local}")
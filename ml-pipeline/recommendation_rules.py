def generate_recommendations(row):
  recs = []

  if row["equipment_downtime_hrs"] > 25:
    recs.append(
        "Critical machine breakdown: Dispatch maintenance unit to pit site."
    )
  elif row["equipment_downtime_hrs"] > 12:
    recs.append("Preventive servicing due on primary haul trucks and loaders.")

  if row["rainfall_mm"] > 90 or row["soil_moisture_pct"] > 75:
    recs.append(
        "Saturated benches detected: Divert haul routes to dry upper benches."
    )

  if row["predicted_risk"] == "HIGH":
    recs.append(
        "Severe shortfall risk: Offset quotas via secondary high-capacity zones."
    )

  if not recs:
    recs.append("Operations nominal. Maintain standard extraction schedules.")

  return recs
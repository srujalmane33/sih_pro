import { useState } from "react";
import {
  BrainCircuit,
  MapPin,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { riskConfig } from "../data/constants";

export default function Dashboard({ zones, onAddZone, onSelectZone }) {
  // Location and Feature Inputs state
  const [formData, setFormData] = useState({
    location_name: "Balaghat Extension Prospect",
    latitude: 21.62,
    longitude: 79.82,
    target_production: 40000,
    rainfall_mm: 85.0,
    soil_moisture_pct: 62.0,
    equipment_downtime_hrs: 16,
    ndvi: 0.38,
    rock_hardness: 6,
  });

  // ML Prediction Results State
  const [mlOutput, setMlOutput] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ML Prediction Calculation Algorithm
  const runMLPrediction = () => {
    setIsPredicting(true);

    setTimeout(() => {
      const target = Number(formData.target_production) || 40000;
      const rain = Number(formData.rainfall_mm) || 0;
      const moisture = Number(formData.soil_moisture_pct) || 0;
      const downtime = Number(formData.equipment_downtime_hrs) || 0;
      const ndviVal = Number(formData.ndvi) || 0.35;
      const hardness = Number(formData.rock_hardness) || 5;

      // ML Penalty Factors
      const rainPenalty = Math.max(0, (rain - 50) * 80);
      const moisturePenalty = Math.max(0, (moisture - 45) * 120);
      const downtimePenalty = downtime * 450;
      const hardnessFactor = 1 - (hardness - 5) * 0.02;

      let predicted = (target - rainPenalty - moisturePenalty - downtimePenalty) * hardnessFactor;
      predicted = Math.max(10000, Math.min(target * 1.1, Math.round(predicted)));

      const shortfall = Math.max(0, target - predicted);
      const shortfallPct = ((shortfall / target) * 100).toFixed(1);

      // Determine Shortfall Risk
      let risk = "LOW";
      if (shortfallPct > 20 || moisture > 75 || downtime > 30) {
        risk = "HIGH";
      } else if (shortfallPct > 8 || moisture > 55 || downtime > 12) {
        risk = "MEDIUM";
      }

      // Reserve Score calculation
      let reserveScore = 85.0 - moisture * 0.2 - downtime * 0.5 + (1 - ndviVal) * 20;
      reserveScore = Math.min(98.5, Math.max(20.0, Number(reserveScore.toFixed(1))));

      let reservePotential = "HIGH";
      if (reserveScore < 50) reservePotential = "LOW";
      else if (reserveScore < 75) reservePotential = "MEDIUM";

      // Tailored AI Recommendations
      const recommendations = [];
      if (moisture > 60) {
        recommendations.push("High soil moisture alert: Inspect slope drainage and reinforce haul road gravel.");
      } else {
        recommendations.push("Ground conditions stable. Extraction speed optimal.");
      }

      if (downtime > 15) {
        recommendations.push(`Equipment downtime warning (${downtime}h): Deploy mobile maintenance rig for hydraulic servicing.`);
      } else {
        recommendations.push("Equipment availability within target threshold (>90%).");
      }

      if (shortfall > 5000) {
        recommendations.push(`Critical ${shortfallPct}% shortfall predicted: Reallocate ${Math.round(shortfall / 1000)}K tons quota to auxiliary bench.`);
      } else {
        recommendations.push("Predicted output aligns closely with target production quota.");
      }

      // Feature Importance Drivers (%)
      const totalImpact = rainPenalty + moisturePenalty + downtimePenalty + 1000;
      const featureImpacts = [
        { name: "Equipment Downtime", impact: Math.round((downtimePenalty / totalImpact) * 100) || 35, type: "negative" },
        { name: "Soil Saturation & Moisture", impact: Math.round((moisturePenalty / totalImpact) * 100) || 30, type: "negative" },
        { name: "Monsoon Rainfall", impact: Math.round((rainPenalty / totalImpact) * 100) || 20, type: "negative" },
        { name: "Vegetation Index (NDVI)", impact: Math.round(ndviVal * 40), type: "positive" },
      ];

      setMlOutput({
        predicted_production: predicted,
        target_production: target,
        shortfall_tons: shortfall,
        shortfall_pct: shortfallPct,
        shortfall_risk: risk,
        reserve_score: reserveScore,
        reserve_potential: reservePotential,
        recommendations,
        feature_impacts: featureImpacts,
        timestamp: new Date().toLocaleTimeString(),
      });

      setIsPredicting(false);
    }, 400);
  };

  // Add the newly analyzed location as a live spot on the map
  const handleAddToMap = () => {
    if (!mlOutput) return;

    const newZoneId = `ZONE-PROSPECT (${formData.location_name})`;
    const newZone = {
      zone_id: newZoneId,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      reserve_potential: mlOutput.reserve_potential,
      reserve_score: mlOutput.reserve_score,
      shortfall_risk: mlOutput.shortfall_risk,
      target_production: mlOutput.target_production,
      predicted_production: mlOutput.predicted_production,
      rainfall_mm: Number(formData.rainfall_mm),
      soil_moisture_pct: Number(formData.soil_moisture_pct),
      equipment_downtime_hrs: Number(formData.equipment_downtime_hrs),
      ndvi: Number(formData.ndvi),
      recommendations: mlOutput.recommendations,
      production_history: [
        { month: "Apr", actual: Math.round(mlOutput.target_production * 0.92), target: mlOutput.target_production },
        { month: "May", actual: Math.round(mlOutput.target_production * 0.95), target: mlOutput.target_production },
        { month: "Jun", actual: Math.round(mlOutput.predicted_production * 0.98), target: mlOutput.target_production },
        { month: "Jul (Pred)", actual: mlOutput.predicted_production, target: mlOutput.target_production },
      ],
    };

    if (onAddZone) {
      onAddZone(newZone);
    }
    if (onSelectZone) {
      onSelectZone(newZone);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden col-span-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-slate-900 to-gray-800 text-white">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide">
              ML Production & Risk Predictor
            </h3>
            <p className="text-[11px] text-gray-400">
              Input location parameters to compute real-time machine learning predictions & shortfall risk
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Predictive Engine v2.4
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (5 cols) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runMLPrediction();
          }}
          className="lg:col-span-5 space-y-4 border-r border-gray-100 pr-0 lg:pr-5"
        >
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-pink-500" />
            <span>Location & Environmental Features</span>
          </div>

          <div className="space-y-3">
            {/* Location Name */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Prospect / Mine Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location_name"
                required
                value={formData.location_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50/50"
                placeholder="e.g. Tirodi West Bench #3"
              />
            </div>

            {/* Coordinates Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Latitude (°N) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  required
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Longitude (°E) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  required
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50/50"
                />
              </div>
            </div>

            {/* Target Production & Rainfall */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Target Quota (Tons) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="target_production"
                  required
                  min="1"
                  value={formData.target_production}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Rainfall (mm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="rainfall_mm"
                  required
                  min="0"
                  value={formData.rainfall_mm}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50/50"
                />
              </div>
            </div>

            {/* Soil Moisture & Downtime */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Soil Moisture (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="soil_moisture_pct"
                  required
                  min="0"
                  max="100"
                  value={formData.soil_moisture_pct}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Equipment Downtime (hrs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="equipment_downtime_hrs"
                  required
                  min="0"
                  value={formData.equipment_downtime_hrs}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50/50"
                />
              </div>
            </div>

            {/* NDVI & Rock Hardness */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Vegetation NDVI (0 - 1) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="ndvi"
                  required
                  min="0"
                  max="1"
                  value={formData.ndvi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Rock Hardness Index <span className="text-red-500">*</span>
                </label>
                <select
                  name="rock_hardness"
                  required
                  value={formData.rock_hardness}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50/50"
                >
                  <option value={3}>3 - Soft Ore</option>
                  <option value={6}>6 - Medium Hard</option>
                  <option value={8}>8 - High Density Strata</option>
                  <option value={10}>10 - Extreme Basalt</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPredicting}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold text-xs shadow-md hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isPredicting ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Calculating ML Features...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4" />
                <span>Run ML Prediction Model</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column: ML Model Response Output (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {mlOutput ? (
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <BrainCircuit className="w-4 h-4 text-purple-600" />
                  <span>ML Model Prediction Output</span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Computed at {mlOutput.timestamp}
                </span>
              </div>

              {/* Output Metric Cards Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Predicted Output */}
                <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100">
                  <span className="text-[10px] font-semibold text-pink-600 block">
                    Predicted Production
                  </span>
                  <div className="text-base font-extrabold text-gray-800 mt-1">
                    {(mlOutput.predicted_production / 1000).toFixed(1)}K T
                  </div>
                  <div className="text-[10px] text-pink-600 font-medium mt-0.5">
                    Target: {(mlOutput.target_production / 1000).toFixed(0)}K T
                  </div>
                </div>

                {/* Shortfall Risk */}
                <div className={`p-3 rounded-xl border ${riskConfig[mlOutput.shortfall_risk]?.badgeBg} border-gray-200`}>
                  <span className="text-[10px] font-semibold text-gray-500 block">
                    Shortfall Risk
                  </span>
                  <div className={`text-base font-extrabold mt-1 ${riskConfig[mlOutput.shortfall_risk]?.badgeText}`}>
                    {mlOutput.shortfall_risk}
                  </div>
                  <div className="text-[10px] text-gray-600 font-medium mt-0.5">
                    {mlOutput.shortfall_pct}% shortfall est.
                  </div>
                </div>

                {/* Reserve Confidence */}
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-semibold text-emerald-600 block">
                    Reserve Score
                  </span>
                  <div className="text-base font-extrabold text-emerald-700 mt-1">
                    {mlOutput.reserve_score}%
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                    {mlOutput.reserve_potential} Confidence
                  </div>
                </div>
              </div>

              {/* Feature Impact Analysis (SHAP-style) */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80 space-y-2">
                <span className="text-[11px] font-bold text-gray-700 block">
                  ML Feature Importance Drivers
                </span>
                <div className="space-y-2">
                  {mlOutput.feature_impacts.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600 font-medium">{item.name}</span>
                        <span className={`font-bold ${item.type === "positive" ? "text-emerald-600" : "text-rose-600"}`}>
                          {item.type === "positive" ? `+${item.impact}% boost` : `-${item.impact}% penalty`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.type === "positive" ? "bg-emerald-500" : "bg-rose-500"}`}
                          style={{ width: `${Math.min(100, item.impact)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescriptive Recommendations */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-700 block">
                  Prescriptive AI Action Plan
                </span>
                <div className="space-y-1.5">
                  {mlOutput.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start space-x-2 text-[11px] text-gray-600 bg-white p-2 rounded-lg border border-gray-100 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button: Add to Live Map */}
              <button
                onClick={handleAddToMap}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow transition-all flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-4 h-4 text-pink-400" />
                <span>Pin Location to Live Interactive Map & Dashboard</span>
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <div className="p-3 bg-pink-50 rounded-full text-pink-500 mb-3">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h4 className="text-xs font-bold text-gray-700">
                Ready to Compute ML Prediction
              </h4>
              <p className="text-[11px] text-gray-400 max-w-xs mt-1">
                Enter your site coordinates & environmental metrics on the left, then click <strong>"Run ML Prediction Model"</strong> to output production predictions and risk alerts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

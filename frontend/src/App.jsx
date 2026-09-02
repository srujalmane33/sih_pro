import { useState } from "react";
import { Map as MapIcon, Layers, FileText, Info, Sparkles, Cpu } from "lucide-react";
import "leaflet/dist/leaflet.css";

import { INITIAL_ZONES, riskConfig } from "./data/constants";
import Navbar from "./components/Navbar";
import ProfileBanner from "./components/ProfileBanner";
import Sidebar from "./components/Sidebar";
import PrescriptiveActions from "./components/PrescriptiveActions";
import KpiCard from "./components/KpiCard";
import ProductionTrend from "./components/ProductionTrend";
import MapPanel from "./components/MapPanel";
import ReserveAnalysis from "./components/ReserveAnalysis";
import MonthlyOutput from "./components/MonthlyOutput";
import TelemetryCard from "./components/TelemetryCard";
import NdviCard from "./components/NdviCard";
import ZoneSummary from "./components/ZoneSummary";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState(INITIAL_ZONES[0]);
  // Map states: "normal" | "minimized" | "maximized" | "closed"
  const [mapMode, setMapMode] = useState("normal");

  const shortfallTons = Math.max(
    0,
    selectedZone.target_production - selectedZone.predicted_production
  );
  const shortfallPct = (
    (shortfallTons / selectedZone.target_production) *
    100
  ).toFixed(1);

  const mapIsMax = mapMode === "maximized";

  const handleAddZone = (newZone) => {
    setZones((prev) => [newZone, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">
      {/* Leaflet CSS Override */}
      <style>{`
        .leaflet-container {
          width: 100% !important;
          height: 100% !important;
          background: #e2e8f0 !important;
        }
      `}</style>

      {/* ─── TOP NAVBAR ─── */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ─── MAIN BODY: Sidebar + Content ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── MAIN CONTENT AREA ── */}
        <main className="flex-1 overflow-y-auto p-5 bg-gray-100">
          {/* If map is maximized, show ONLY the map */}
          {mapIsMax ? (
            <MapPanel
              zones={zones}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              mapMode={mapMode}
              onMapModeChange={setMapMode}
            />
          ) : activeTab === "dashboard" ? (
            /* ── DASHBOARD TAB VIEW ── */
            <div>
              {/* Location & Environmental Features ML Section */}
              <Dashboard
                zones={zones}
                onAddZone={handleAddZone}
                onSelectZone={setSelectedZone}
              />
            </div>
          ) : activeTab === "reports" ? (
            /* ── REPORTS TAB VIEW ── */
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-pink-500" />
                    Analytical Resource Reports
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Historical production trends, telemetry logs, and reserve risk evaluations.
                  </p>
                </div>
                <span className="text-xs bg-pink-50 text-pink-600 border border-pink-200 px-3 py-1.5 rounded-full font-semibold">
                  15 Sites Monitored
                </span>
              </div>

              <div className="grid gap-5 auto-rows-min grid-cols-3">
                <ReserveAnalysis selectedZone={selectedZone} />
                <MonthlyOutput selectedZone={selectedZone} />
                <TelemetryCard selectedZone={selectedZone} />
                <ZoneSummary
                  zones={zones}
                  selectedZone={selectedZone}
                  onSelectZone={setSelectedZone}
                />
                {/* <NdviCard /> */}
              </div>
            </div>
          ) : activeTab === "about" ? (
            /* ── ABOUT TAB VIEW ── */
            <div className="max-w-4xl mx-auto space-y-5 py-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-xl text-white shadow-md">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-800">
                      MANGANAI Platform
                    </h2>
                    <p className="text-xs text-gray-500">
                      AI & Machine Learning Manganese Mineral Reserve Risk Forecaster
                    </p>
                  </div>
                </div>

                <div className="prose text-xs text-gray-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    <strong>MANGANAI</strong> provides real-time geospatial, satellite NDVI, and Machine Learning predictive analytics for manganese extraction sites. The platform aggregates live sensor telemetry, precipitation datasets, and soil saturation parameters to forecast monthly output shortfalls before operational delays occur.
                  </p>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-100">
                      <span className="font-bold text-gray-800 block text-xs">ML Shortfall Risk</span>
                      <span className="text-[11px] text-gray-500">Regression & XGBoost classification algorithms for yield forecasting.</span>
                    </div>
                    <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                      <span className="font-bold text-gray-800 block text-xs">Satellite Telemetry</span>
                      <span className="text-[11px] text-gray-500">NDVI vegetation stress monitoring & bench stability index.</span>
                    </div>
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <span className="font-bold text-gray-800 block text-xs">Prescriptive AI</span>
                      <span className="text-[11px] text-gray-500">Automated operational advice for equipment maintenance & quota shifts.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── HOME TAB VIEW (DEFAULT) ── */
            <div className="grid gap-5 auto-rows-min grid-cols-3">
              {/* ── ROW 1 ── */}
              <PrescriptiveActions selectedZone={selectedZone} />

              <KpiCard
                title="Reserve Potential"
                subtitle={`Confidence: ${selectedZone.reserve_potential}`}
                value={selectedZone.reserve_score}
                footnote="Score Index"
                gradient="bg-gradient-to-br from-pink-500 to-rose-600"
                wavePath="M0,40 C100,80 200,0 400,40 L400,80 L0,80 Z"
              />

              <KpiCard
                title="Est. Shortfall"
                subtitle={`${shortfallPct}% below target`}
                value={
                  shortfallTons > 0
                    ? `-${(shortfallTons / 1000).toFixed(1)}K`
                    : "0"
                }
                unit="T"
                footnote={`Quota: ${(selectedZone.target_production / 1000).toFixed(0)}K T`}
                gradient="bg-gradient-to-br from-cyan-500 to-teal-600"
                wavePath="M0,60 C150,20 250,80 400,30 L400,80 L0,80 Z"
              />

              {/* ── ROW 2: Line Chart + Map ── */}
              <ZoneSummary
                zones={zones}
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
              />

              {mapMode !== "closed" && (
                <MapPanel
                  zones={zones}
                  selectedZone={selectedZone}
                  onSelectZone={setSelectedZone}
                  mapMode={mapMode}
                  onMapModeChange={setMapMode}
                />
              )}

              {/* ── ROW 3 ── */}
              <ReserveAnalysis selectedZone={selectedZone} />
              <MonthlyOutput selectedZone={selectedZone} />
              <TelemetryCard selectedZone={selectedZone} />

              {/* ── ROW 4: ML Predictor + NDVI ── */}
              {/* <Dashboard
                zones={zones}
                onAddZone={handleAddZone}
                onSelectZone={setSelectedZone}
              /> */}
              {/* <NdviCard /> */}
            </div>
          )}

          {/* Floating "Reopen Map" button when map is closed */}
          {mapMode === "closed" && (
            <button
              onClick={() => setMapMode("normal")}
              className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <MapIcon className="w-4 h-4" />
              <span className="text-xs font-semibold">Reopen Map</span>
            </button>
          )}
        </main>
      </div>
    </div>
  );
}


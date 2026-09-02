import { useState } from "react";
import { Map as MapIcon } from "lucide-react";
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

export default function App() {
  const [zones] = useState(INITIAL_ZONES);
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
      <Navbar />

      {/* ─── GRADIENT PROFILE BANNER ─── */}
      {/* <ProfileBanner /> */}

      {/* ─── MAIN BODY: Sidebar + Content ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR ── */}
        {/* <Sidebar
          zones={zones}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
        /> */}

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
          ) : (
            /* ── NORMAL / MINIMIZED / CLOSED GRID ── */
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
              {/* <ProductionTrend
                selectedZone={selectedZone}
                colSpan={mapMode === "closed" ? "col-span-3" : "col-span-2"}
              /> */}

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

              {/* ── ROW 4 ── */}
              <NdviCard />
              <ZoneSummary
                zones={zones}
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
              />
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

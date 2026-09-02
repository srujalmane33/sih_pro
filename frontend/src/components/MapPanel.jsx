import { useRef, useState, useCallback, useEffect, forwardRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import {
  Minus,
  Maximize2,
  Minimize2,
  X,
  Map as MapIcon,
  Expand,
  Shrink,
} from "lucide-react";
import { riskConfig } from "../data/constants";

export default function MapPanel({
  zones,
  selectedZone,
  onSelectZone,
  mapMode,
  onMapModeChange,
}) {
  const mapFullscreenRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const currentRisk = riskConfig[selectedZone.shortfall_risk];

  /* ── Fullscreen API ── */
  const enterFullscreen = useCallback(() => {
    const el = mapFullscreenRef.current;
    if (el) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* ── Shared map content ── */
  const renderMap = (zoomControl = false) => (
    <MapContainer
      center={[21.65, 79.85]}
      zoom={10}
      className="h-full w-full"
      zoomControl={zoomControl}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {zones.map((zone) => {
        const isSelected = selectedZone.zone_id === zone.zone_id;
        return (
          <CircleMarker
            key={zone.zone_id}
            center={[zone.latitude, zone.longitude]}
            radius={isSelected ? 18 : 12}
            fillColor={riskConfig[zone.shortfall_risk].color}
            color={isSelected ? "#ec4899" : "#6b7280"}
            weight={isSelected ? 3 : 1}
            fillOpacity={0.8}
            eventHandlers={{ click: () => onSelectZone(zone) }}
          >
            <Popup>
              <div className="font-sans p-1">
                <div className="font-bold text-xs text-gray-800">
                  {zone.zone_id}
                </div>
                <div className="text-[10px] text-gray-500">
                  Risk: {zone.shortfall_risk}
                </div>
                <div className="text-[10px] text-gray-500">
                  Score: {zone.reserve_score}%
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );

  /* ── Legend ── */
  const renderLegend = (size = "normal") => (
    <div
      className={`absolute bg-white/90 border border-gray-200 rounded-lg z-[1000] pointer-events-none shadow-sm ${
        size === "small"
          ? "bottom-2 right-2 p-2 text-[10px] space-y-1"
          : "bottom-4 right-4 p-3 text-xs space-y-1.5"
      }`}
    >
      {size !== "small" && (
        <span className="font-semibold text-gray-700 block mb-1">
          Shortfall Risk
        </span>
      )}
      <div className="flex items-center space-x-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span className="text-gray-500">Low</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        <span className="text-gray-500">{size === "small" ? "Med" : "Moderate"}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        <span className="text-gray-500">High</span>
      </div>
    </div>
  );

  /* ── MAXIMIZED VIEW (full content area) ── */
  if (mapMode === "maximized") {
    return (
      <div
        ref={mapFullscreenRef}
        className="h-full w-full flex flex-col rounded-xl overflow-hidden shadow-lg bg-white"
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center space-x-2">
            <MapIcon className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-semibold text-gray-700">
              Mine Concession Map
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${currentRisk.badgeBg} ${currentRisk.badgeText}`}
            >
              {selectedZone.shortfall_risk} RISK
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {/* Fullscreen toggle */}
            <button
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              className="p-1.5 rounded-md hover:bg-pink-50 text-gray-400 hover:text-pink-500 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
            >
              {isFullscreen ? (
                <Shrink className="w-4 h-4" />
              ) : (
                <Expand className="w-4 h-4" />
              )}
            </button>
            {/* Restore */}
            <button
              onClick={() => onMapModeChange("normal")}
              className="p-1.5 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
              title="Restore"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            {/* Close */}
            <button
              onClick={() => {
                if (isFullscreen) exitFullscreen();
                onMapModeChange("closed");
              }}
              className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              title="Close Map"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Map body */}
        <div className="flex-1 relative">
          {renderMap(true)}
          {renderLegend("normal")}
        </div>
      </div>
    );
  }

  /* ── NORMAL / MINIMIZED VIEW (card in grid) ── */
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden row-span-2 flex flex-col min-h-0">
      {/* Title bar with window controls */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 shrink-0">
        <div className="flex items-center space-x-2">
          <MapIcon className="w-3.5 h-3.5 text-pink-500" />
          <span className="text-xs font-semibold text-gray-700">Mine Map</span>
        </div>
        <div className="flex items-center space-x-0.5">
          {/* Minimize / Restore */}
          <button
            onClick={() =>
              onMapModeChange(mapMode === "minimized" ? "normal" : "minimized")
            }
            className="p-1 rounded hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors"
            title={mapMode === "minimized" ? "Restore" : "Minimize"}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          {/* Maximize */}
          <button
            onClick={() => onMapModeChange("maximized")}
            className="p-1 rounded hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
            title="Maximize"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          {/* Close */}
          <button
            onClick={() => onMapModeChange("closed")}
            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map body — hidden when minimized */}
      {mapMode !== "minimized" && (
        <div className="flex-1 relative min-h-[200px]">
          {renderMap(false)}
          {renderLegend("small")}
        </div>
      )}
    </div>
  );
}

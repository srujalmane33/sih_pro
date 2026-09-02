import { useRef, useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  Minus,
  Maximize2,
  Minimize2,
  X,
  Map as MapIcon,
  Expand,
  Shrink,
  Radio,
  MapPin,
  Tag,
} from "lucide-react";
import { riskConfig } from "../data/constants";

// Helper function to build custom DivIcons for Leaflet map spots
const createMarkerIcon = (zone, isSelected, spotStyle) => {
  const risk = zone.shortfall_risk;
  const colorMap = {
    LOW: { hex: "#10b981", shadow: "rgba(16, 185, 129, 0.45)" },
    MEDIUM: { hex: "#f59e0b", shadow: "rgba(245, 158, 11, 0.45)" },
    HIGH: { hex: "#ef4444", shadow: "rgba(239, 68, 68, 0.45)" },
  };

  const c = colorMap[risk] || colorMap.LOW;
  const letter = zone.zone_id.match(/ZONE-([A-Z])/)?.[1] || zone.zone_id.charAt(0);
  const name = zone.zone_id.split("(")[1]?.replace(")", "") || zone.zone_id;

  if (spotStyle === "pin") {
    // 3D Teardrop Location Pin
    const width = isSelected ? 34 : 26;
    const height = isSelected ? 44 : 34;
    const html = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s ease;" class="${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-10'}">
        <svg width="${width}" height="${height}" viewBox="0 0 38 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));">
          <path d="M19 0C8.50659 0 0 8.50659 0 19C0 31.4 16.5 46.5 18.2 48C18.6 48.4 19.4 48.4 19.8 48C21.5 46.5 38 31.4 38 19C38 8.50659 29.4934 0 19 0Z" fill="${c.hex}"/>
          <circle cx="19" cy="18" r="12" fill="white"/>
          <text x="19" y="22" text-anchor="middle" font-size="13" font-family="sans-serif" font-weight="900" fill="${c.hex}">${letter}</text>
        </svg>
        ${isSelected ? `<div style="position: absolute; top: -26px; background: #111827; color: #ffffff; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); border: 1px solid #ec4899; white-space: nowrap;">${name}</div>` : ''}
      </div>
    `;
    return L.divIcon({
      className: "custom-leaflet-marker",
      html,
      iconSize: [width, height],
      iconAnchor: [width / 2, height],
      popupAnchor: [0, -height],
    });
  }

  if (spotStyle === "badge") {
    // Glass Badge Pill Style
    const html = `
      <div style="position: relative; display: flex; align-items: center; cursor: pointer; transition: all 0.2s ease;" class="${isSelected ? 'scale-110 z-50' : 'hover:scale-105 z-10'}">
        <div style="display: flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 9999px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border: ${isSelected ? '2px solid #ec4899' : '1px solid #e5e7eb'}; box-shadow: 0 4px 10px rgba(0,0,0,0.15); font-size: 11px; font-weight: 700; color: #1f2937; white-space: nowrap;">
          <span style="width: 8px; height: 8px; border-radius: 9999px; background-color: ${c.hex}; display: inline-block;"></span>
          <span>${letter}: ${name.substring(0, 12)}</span>
        </div>
      </div>
    `;
    return L.divIcon({
      className: "custom-leaflet-marker",
      html,
      iconSize: [120, 30],
      iconAnchor: [60, 15],
      popupAnchor: [0, -15],
    });
  }

  // Default: Radar Pulsing Beacon Spot
  const size = isSelected ? 38 : 28;
  const innerSize = isSelected ? '26px' : '18px';
  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer;" class="${isSelected ? 'z-50' : 'hover:scale-110 z-10'}">
      <!-- Pulsing Outer Aura -->
      <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${c.shadow}; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></span>
      
      <!-- Center Spot Circle -->
      <div style="position: relative; display: flex; align-items: center; justify-content: center; border-radius: 9999px; padding: 2px; background: #ffffff; border: 2px solid ${isSelected ? '#ec4899' : c.hex}; box-shadow: 0 4px 12px ${c.shadow}; transition: all 0.3s ease;">
        <div style="width: ${innerSize}; height: ${innerSize}; border-radius: 9999px; background: linear-gradient(135deg, ${c.hex}, ${c.hex}dd); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 10px; font-weight: 800; font-family: sans-serif;">
          ${letter}
        </div>
      </div>

      ${isSelected ? `<div style="position: absolute; top: -28px; background: #0f172a; color: #ffffff; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 1px solid #ec4899; white-space: nowrap;">${name}</div>` : ''}
    </div>
  `;
  return L.divIcon({
    className: "custom-leaflet-marker",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

export default function MapPanel({
  zones,
  selectedZone,
  onSelectZone,
  mapMode,
  onMapModeChange,
}) {
  const mapFullscreenRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [spotStyle, setSpotStyle] = useState("radar"); // "radar" | "pin" | "badge"
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
    <>
      <style>{`
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      <MapContainer
        center={[21.55, 79.70]}
        zoom={9}
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
          const icon = createMarkerIcon(zone, isSelected, spotStyle);
          return (
            <Marker
              key={zone.zone_id}
              position={[zone.latitude, zone.longitude]}
              icon={icon}
              eventHandlers={{ click: () => onSelectZone(zone) }}
            >
              <Popup>
                <div className="font-sans p-1">
                  <div className="font-bold text-xs text-gray-800">
                    {zone.zone_id}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Risk: <span className="font-semibold text-gray-700">{zone.shortfall_risk}</span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Reserve Score: <span className="font-semibold text-pink-600">{zone.reserve_score}%</span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Target: <span className="font-semibold text-gray-700">{(zone.target_production / 1000).toFixed(0)}K T</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );

  /* ── Spot Style Selector Controls ── */
  const renderStyleSelector = () => (
    <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 space-x-0.5">
      <button
        onClick={() => setSpotStyle("radar")}
        className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center space-x-1 transition-all ${
          spotStyle === "radar"
            ? "bg-white text-pink-600 shadow-xs font-semibold"
            : "text-gray-500 hover:text-gray-700"
        }`}
        title="Radar Pulsing Spot Style"
      >
        <Radio className="w-3 h-3" />
        <span className="hidden sm:inline">Radar</span>
      </button>
      <button
        onClick={() => setSpotStyle("pin")}
        className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center space-x-1 transition-all ${
          spotStyle === "pin"
            ? "bg-white text-pink-600 shadow-xs font-semibold"
            : "text-gray-500 hover:text-gray-700"
        }`}
        title="3D Teardrop Pin Style"
      >
        <MapPin className="w-3 h-3" />
        <span className="hidden sm:inline">Pin</span>
      </button>
      <button
        onClick={() => setSpotStyle("badge")}
        className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center space-x-1 transition-all ${
          spotStyle === "badge"
            ? "bg-white text-pink-600 shadow-xs font-semibold"
            : "text-gray-500 hover:text-gray-700"
        }`}
        title="Glass Pill Badge Style"
      >
        <Tag className="w-3 h-3" />
        <span className="hidden sm:inline">Badge</span>
      </button>
    </div>
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
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <MapIcon className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-semibold text-gray-700">
                Mine Concession Map
              </span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${currentRisk.badgeBg} ${currentRisk.badgeText}`}
            >
              {selectedZone.shortfall_risk} RISK
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Spot style switcher */}
            {renderStyleSelector()}

            <div className="flex items-center space-x-1 border-l border-gray-200 pl-2">
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
      {/* Title bar with window controls & spot style selector */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 shrink-0">
        <div className="flex items-center space-x-2">
          <MapIcon className="w-3.5 h-3.5 text-pink-500" />
          <span className="text-xs font-semibold text-gray-700">Mine Map</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Spot style switcher */}
          {mapMode !== "minimized" && renderStyleSelector()}

          <div className="flex items-center space-x-0.5 border-l border-gray-100 pl-1.5">
            {/* Minimize / Restore */}
            {/* <button
              onClick={() =>
                onMapModeChange(mapMode === "minimized" ? "normal" : "minimized")
              }
              className="p-1 rounded hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors"
              title={mapMode === "minimized" ? "Restore" : "Minimize"}
            >
              <Minus className="w-3.5 h-3.5" />
            </button> */}
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


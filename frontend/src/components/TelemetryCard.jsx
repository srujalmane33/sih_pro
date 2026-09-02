import { Droplet, Layers, Wrench } from "lucide-react";

export default function TelemetryCard({ selectedZone }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">Telemetry</span>
      </div>
      <div className="p-4">
        {/* Big number */}
        <p className="text-3xl font-extrabold text-pink-600 mb-1">
          {(selectedZone.predicted_production / 1000).toFixed(1)}K
        </p>
        <p className="text-[10px] text-gray-400 mb-4">
          Predicted Output (tons)
        </p>

        {/* Progress bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span className="flex items-center space-x-1">
                <Droplet className="w-3 h-3 text-sky-400" />
                <span>Rainfall</span>
              </span>
              <span>{selectedZone.rainfall_mm} mm</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-sky-400 h-1.5 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (selectedZone.rainfall_mm / 150) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span className="flex items-center space-x-1">
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>Soil Moisture</span>
              </span>
              <span>{selectedZone.soil_moisture_pct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-emerald-400 h-1.5 rounded-full transition-all"
                style={{ width: `${selectedZone.soil_moisture_pct}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span className="flex items-center space-x-1">
                <Wrench className="w-3 h-3 text-amber-400" />
                <span>Downtime</span>
              </span>
              <span>{selectedZone.equipment_downtime_hrs} hrs</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (selectedZone.equipment_downtime_hrs / 48) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 mt-4">
          <button className="px-3 py-1.5 text-[10px] font-semibold bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors">
            Configure
          </button>
          <button className="px-3 py-1.5 text-[10px] font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
            Report
          </button>
        </div>
      </div>
    </div>
  );
}

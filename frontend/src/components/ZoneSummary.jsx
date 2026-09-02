import { riskConfig } from "../data/constants";

export default function ZoneSummary({ zones, selectedZone, onSelectZone }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden col-span-2">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">
          Zone Summary
        </span>
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-gray-400">Critical</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-gray-400">Warning</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-gray-400">Normal</span>
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 max-h-[260px] overflow-y-auto pr-1">
          {zones.map((zone) => {
            const r = riskConfig[zone.shortfall_risk];
            const isSelected = selectedZone.zone_id === zone.zone_id;
            const sf = Math.max(
              0,
              zone.target_production - zone.predicted_production
            );
            return (
              <button
                key={zone.zone_id}
                onClick={() => onSelectZone(zone)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "ring-2 ring-pink-400 border-pink-200 bg-pink-50/50"
                    : "border-gray-100 hover:border-pink-200 hover:bg-pink-50/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 truncate">
                    {zone.zone_id.split("(")[1]?.replace(")", "") ||
                      zone.zone_id}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${r.dot}`}></span>
                </div>
                <div className="text-[10px] text-gray-400 space-y-0.5">
                  <div>
                    Reserve:{" "}
                    <span className="text-gray-600 font-medium">
                      {zone.reserve_score}%
                    </span>
                  </div>
                  <div>
                    Shortfall:{" "}
                    <span className="text-gray-600 font-medium">
                      -{(sf / 1000).toFixed(1)}K T
                    </span>
                  </div>
                  <div>
                    Downtime:{" "}
                    <span className="text-gray-600 font-medium">
                      {zone.equipment_downtime_hrs}h
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

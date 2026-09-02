import {
  Home,
  LayoutDashboard,
  MessageSquare,
  CalendarDays,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import { sidebarItems, riskConfig } from "../data/constants";

const iconMap = {
  Home,
  LayoutDashboard,
  MessageSquare,
  CalendarDays,
  Settings,
  CreditCard,
  LogOut,
};

export default function Sidebar({ zones, selectedZone, onSelectZone }) {
  return (
    <aside className="w-52 bg-white border-r border-gray-200 py-4 overflow-y-auto shrink-0 flex flex-col">
      <div className="px-4 mb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Menu
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-2">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={item.label}>
              <button
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? "bg-pink-50 text-pink-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-pink-500"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-4 h-4 ${
                      item.active ? "text-pink-500" : "text-gray-400"
                    }`}
                  />
                )}
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] bg-pink-500 text-white rounded-full px-1.5 py-0.5 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
              {item.sub && item.active && (
                <div className="ml-10 mt-1 space-y-1">
                  {item.sub.map((s, i) => (
                    <div
                      key={i}
                      className="text-xs text-gray-400 hover:text-pink-400 cursor-pointer py-0.5"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Zone selector */}
      <div className="px-3 mt-4 border-t border-gray-100 pt-4">
        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block mb-2">
          Active Zone
        </span>
        {zones.map((zone) => {
          const isSelected = selectedZone.zone_id === zone.zone_id;
          const r = riskConfig[zone.shortfall_risk];
          return (
            <button
              key={zone.zone_id}
              onClick={() => onSelectZone(zone)}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs mb-1 flex items-center justify-between transition-all ${
                isSelected
                  ? "bg-pink-50 text-pink-700 font-semibold ring-1 ring-pink-200"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="truncate">{zone.zone_id.split(" ")[0]}</span>
              <span className={`w-2 h-2 rounded-full ${r.dot}`}></span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

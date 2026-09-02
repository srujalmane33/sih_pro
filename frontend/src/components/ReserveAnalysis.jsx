import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

export default function ReserveAnalysis({ selectedZone }) {
  const radialData = [
    {
      name: "Reserve",
      value: selectedZone.reserve_score,
      fill:
        selectedZone.reserve_potential === "HIGH"
          ? "#e11d48"
          : selectedZone.reserve_potential === "MEDIUM"
          ? "#f59e0b"
          : "#6b7280",
    },
    {
      name: "NDVI",
      value: selectedZone.ndvi * 100,
      fill: "#06b6d4",
    },
    {
      name: "Soil",
      value: selectedZone.soil_moisture_pct,
      fill: "#1e1e1e",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">
          Reserve Analysis
        </span>
      </div>
      <div className="p-4 flex items-center justify-center">
        <div className="relative w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="100%"
              data={radialData}
              startAngle={180}
              endAngle={-180}
              barSize={12}
            >
              <RadialBar
                background={{ fill: "#f1f5f9" }}
                dataKey="value"
                cornerRadius={6}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-extrabold text-gray-800">
              {selectedZone.reserve_score}%
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-3 flex items-center justify-center space-x-4 text-[10px]">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
          <span className="text-gray-500">Reserve</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
          <span className="text-gray-500">NDVI</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-gray-800"></span>
          <span className="text-gray-500">Soil</span>
        </div>
      </div>
    </div>
  );
}

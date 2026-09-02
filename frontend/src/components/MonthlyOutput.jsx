import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function MonthlyOutput({ selectedZone }) {
  const [viewMode, setViewMode] = useState("Month"); // "Day" | "Month" | "Year"

  // Monthly base data
  const monthlyData = selectedZone.production_history || [
    { month: "Apr", actual: 39000, target: 40000 },
    { month: "May", actual: 41000, target: 41000 },
    { month: "Jun", actual: 41500, target: 42000 },
    { month: "Jul (Pred)", actual: 41200, target: 42000 },
  ];

  // Daily output generator (past 7 days) based on target_production / 30
  const targetProd = selectedZone.target_production || 40000;
  const predProd = selectedZone.predicted_production || 38000;

  const dailyTarget = Math.round(targetProd / 30);
  const dailyPredicted = Math.round(predProd / 30);

  const dailyData = [
    { label: "Mon", actual: Math.round(dailyTarget * 0.94), target: dailyTarget },
    { label: "Tue", actual: Math.round(dailyTarget * 1.02), target: dailyTarget },
    { label: "Wed", actual: Math.round(dailyTarget * 0.88), target: dailyTarget },
    { label: "Thu", actual: Math.round(dailyTarget * 0.98), target: dailyTarget },
    { label: "Fri", actual: Math.round(dailyTarget * 1.05), target: dailyTarget },
    { label: "Sat", actual: Math.round(dailyTarget * 0.91), target: dailyTarget },
    { label: "Sun (Today)", actual: dailyPredicted, target: dailyTarget },
  ];

  // Yearly output generator (5 years)
  const annualTarget = targetProd * 12;
  const annualActual = predProd * 12;

  const yearlyData = [
    { label: "2022", actual: Math.round(annualTarget * 0.89), target: Math.round(annualTarget * 0.9) },
    { label: "2023", actual: Math.round(annualTarget * 0.94), target: Math.round(annualTarget * 0.95) },
    { label: "2024", actual: Math.round(annualTarget * 0.98), target: annualTarget },
    { label: "2025", actual: Math.round(annualTarget * 0.96), target: annualTarget },
    { label: "2026 (Pred)", actual: annualActual, target: annualTarget },
  ];

  // Determine active dataset and labels
  let currentData = monthlyData;
  let dataKeyX = "month";
  let titleLabel = "Monthly Output";

  if (viewMode === "Day") {
    currentData = dailyData;
    dataKeyX = "label";
    titleLabel = "Daily Output";
  } else if (viewMode === "Year") {
    currentData = yearlyData;
    dataKeyX = "label";
    titleLabel = "Yearly Output";
  }

  // Format Y-Axis numbers (e.g., 40k)
  const formatYAxis = (val) => {
    if (val >= 100000) return `${(val / 1000).toFixed(0)}k`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">
          {titleLabel}
        </span>
        <div className="flex space-x-1 text-[10px]">
          {["Day", "Month", "Year"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-0.5 rounded transition-all font-medium ${
                viewMode === mode
                  ? "bg-pink-500 text-white font-semibold shadow-xs"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentData}
            margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
          >
            <XAxis
              dataKey={dataKeyX}
              stroke="#9ca3af"
              fontSize={10}
              tickLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              formatter={(value) => [`${value.toLocaleString()} Tons`, ""]}
              contentStyle={{
                backgroundColor: "#fff",
                borderColor: "#e5e7eb",
                borderRadius: "8px",
                fontSize: "11px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Bar
              dataKey="actual"
              fill="#e11d48"
              name="Actual / Predicted"
              radius={[4, 4, 0, 0]}
              barSize={viewMode === "Day" ? 14 : 18}
            />
            <Bar
              dataKey="target"
              fill="#22d3ee"
              name="Target Quota"
              radius={[4, 4, 0, 0]}
              barSize={viewMode === "Day" ? 14 : 18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="px-4 pb-3 flex items-center justify-between text-[10px]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded bg-rose-600"></span>
            <span className="text-gray-500">Actual Output</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded bg-cyan-400"></span>
            <span className="text-gray-500">Target Quota</span>
          </div>
        </div>
        <span className="text-[9px] text-gray-400 font-medium">
          Showing {viewMode}ly Aggregates
        </span>
      </div>
    </div>
  );
}


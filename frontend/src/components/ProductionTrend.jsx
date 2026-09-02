import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ProductionTrend({ selectedZone, colSpan }) {
  const lineData = selectedZone.production_history.map((d) => ({
    ...d,
    actualK: d.actual / 1000,
    targetK: d.target / 1000,
  }));

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${colSpan}`}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">
          Production Trend
        </span>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
          <span className="text-[10px] text-gray-400 mr-3">Actual</span>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
          <span className="text-[10px] text-gray-400">Target</span>
        </div>
      </div>
      <div className="p-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineData}
            margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderColor: "#e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Line
              type="monotone"
              dataKey="actualK"
              stroke="#e11d48"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#e11d48" }}
              name="Actual (K tons)"
            />
            <Line
              type="monotone"
              dataKey="targetK"
              stroke="#22d3ee"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ r: 3, fill: "#22d3ee" }}
              name="Target (K tons)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

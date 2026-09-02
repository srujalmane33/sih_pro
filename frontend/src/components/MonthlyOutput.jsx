import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function MonthlyOutput({ selectedZone }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">
          Monthly Output
        </span>
        <div className="flex space-x-1 text-[10px]">
          <button className="px-2 py-0.5 rounded bg-gray-100 text-gray-500">
            Day
          </button>
          <button className="px-2 py-0.5 rounded bg-pink-500 text-white font-semibold">
            Month
          </button>
          <button className="px-2 py-0.5 rounded bg-gray-100 text-gray-500">
            Year
          </button>
        </div>
      </div>
      <div className="p-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={selectedZone.production_history}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              fontSize={10}
              tickLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
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
              name="Actual"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
            <Bar
              dataKey="target"
              fill="#22d3ee"
              name="Target"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="px-4 pb-3 flex items-center space-x-4 text-[10px]">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded bg-rose-600"></span>
          <span className="text-gray-500">Actual</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded bg-cyan-400"></span>
          <span className="text-gray-500">Target</span>
        </div>
      </div>
    </div>
  );
}

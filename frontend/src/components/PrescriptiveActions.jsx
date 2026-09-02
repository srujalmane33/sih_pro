import { AlertCircle } from "lucide-react";

export default function PrescriptiveActions({ selectedZone }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">
          Prescriptive Actions
        </span>
        <span className="text-[10px] text-gray-400">AI Generated</span>
      </div>
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {selectedZone.recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                idx === 0
                  ? "bg-pink-100"
                  : idx === 1
                  ? "bg-purple-100"
                  : "bg-gray-100"
              }`}
            >
              <AlertCircle
                className={`w-4 h-4 ${
                  idx === 0
                    ? "text-pink-500"
                    : idx === 1
                    ? "text-purple-500"
                    : "text-gray-500"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 leading-relaxed">{rec}</p>
              <span className="text-[10px] text-gray-400 mt-1 block">
                {selectedZone.shortfall_risk === "HIGH" ? "Urgent" : "Advisory"}
              </span>
            </div>
            <button
              className={`text-[10px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                selectedZone.shortfall_risk === "HIGH"
                  ? "bg-red-500 text-white"
                  : "bg-pink-500 text-white"
              }`}
            >
              Action
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

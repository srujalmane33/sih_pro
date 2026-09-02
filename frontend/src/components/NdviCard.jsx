import { riskConfig } from "../data/constants";

export default function NdviCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <p className="text-xs text-gray-500 mb-1">NDVI Vegetation Index</p>
      <p className="text-xs text-gray-400 mb-2">Current zone reading</p>
      <p className="text-xs text-gray-400 mb-2">
        Higher NDVI = denser vegetation cover
      </p>
      <button className="px-3 py-1.5 text-[10px] font-semibold bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors">
        Confirm
      </button>
    </div>
  );
}

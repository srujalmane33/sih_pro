import { ChevronRight } from "lucide-react";

export default function KpiCard({ title, subtitle, value, unit, footnote, gradient, wavePath }) {
  return (
    <div
      className={`${gradient} rounded-xl shadow-sm overflow-hidden relative text-white`}
    >
      <div className="p-4 relative z-10">
        <p className="text-xs text-white/80 font-medium">{title}</p>
        <p className="text-[10px] text-white/60 mt-0.5 mb-3">{subtitle}</p>
        <p className="text-4xl font-extrabold tracking-tight">
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
        <div className="flex items-center mt-2 text-xs">
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white/70">{footnote}</span>
        </div>
      </div>
      {/* Wave SVG */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-20"
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
      >
        <path d={wavePath} fill="white" />
      </svg>
    </div>
  );
}

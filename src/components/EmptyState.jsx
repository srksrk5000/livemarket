import { Activity } from "lucide-react";

export default function EmptyState({ onScan }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
        <Activity className="w-8 h-8 text-emerald-500/60" />
      </div>
      <h2 className="text-lg font-bold text-slate-200 mb-1">NSE AI Momentum Screener</h2>
      <p className="text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">
        Scans NSE stocks for momentum signals — RSI, VWAP, OBV, 20-day breakouts, and volume anomalies.
      </p>
      <button
        onClick={onScan}
        className="px-6 py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
      >
        Start Scanning
      </button>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
        {[
          { label: "RSI", desc: "14-period momentum" },
          { label: "VWAP", desc: "Volume-weighted avg" },
          { label: "OBV", desc: "On-balance volume" },
          { label: "20D Breakout", desc: "Price breakout signal" }
        ].map((item) => (
          <div key={item.label} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
            <div className="text-emerald-400 text-xs font-bold mb-0.5">{item.label}</div>
            <div className="text-slate-500 text-[10px]">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

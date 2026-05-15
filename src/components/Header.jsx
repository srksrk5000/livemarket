import { Activity, Zap } from "lucide-react";

export default function Header({ scanning, onScan, onStop, progress }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-screen-xl mx-auto px-3 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 shrink-0">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-slate-100 leading-tight truncate">
              NSE AI Screener
            </h1>
            <p className="text-[10px] text-slate-500 leading-tight hidden sm:block">
              Momentum · RSI · VWAP · OBV
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {scanning && (
            <span className="text-xs text-slate-400 hidden sm:block">
              {progress.done}/{progress.total}
            </span>
          )}
          <button
            onClick={scanning ? onStop : onScan}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scanning
                ? "bg-rose-500/10 border border-rose-500/40 text-rose-400 hover:bg-rose-500/20"
                : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            }`}
          >
            <Zap className="w-3 h-3" />
            {scanning ? "Stop" : "Scan NSE"}
          </button>
        </div>
      </div>

      {scanning && (
        <div className="h-0.5 bg-slate-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(progress.done / Math.max(progress.total, 1)) * 100}%` }}
          />
        </div>
      )}
    </header>
  );
}

import { Search, X } from "lucide-react";
import { useState } from "react";

export default function CustomAnalyzer({ onScan, scanning }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const symbols = input
      .split(/[\s,]+/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)
      .map((s) => (s.endsWith(".NS") ? s : `${s}.NS`));
    if (symbols.length) onScan(symbols);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-3 py-2 border-b border-slate-800/60">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Custom tickers: TATAMOTORS, WIPRO, ..."
          className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        {input && (
          <button
            type="button"
            onClick={() => setInput("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={!input.trim() || scanning}
        className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/40 text-violet-400 rounded-lg text-xs font-semibold hover:bg-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Analyze
      </button>
    </form>
  );
}

export default function FilterBar({ filter, setFilter, sortBy, setSortBy }) {
  const sorts = [
    { value: "score", label: "Score" },
    { value: "rsi", label: "RSI" },
    { value: "volumeRatio", label: "Volume" },
    { value: "priceUpside", label: "Upside" },
    { value: "changePercent", label: "Change%" }
  ];

  const sectors = ["All", "IT", "Banking", "Finance", "Auto", "Pharma", "Energy", "FMCG", "Metals"];

  return (
    <div className="px-3 py-2 flex flex-wrap gap-2 items-center border-b border-slate-800/60">
      <div className="flex gap-1 flex-wrap">
        {sectors.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s === "All" ? "" : s)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              (s === "All" && !filter) || filter === s
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <span className="text-[11px] text-slate-500">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] rounded px-2 py-0.5 focus:outline-none focus:border-emerald-500"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

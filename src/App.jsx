import { useState, useMemo } from "react";
import Header from "./components/Header.jsx";
import FilterBar from "./components/FilterBar.jsx";
import StockTable from "./components/StockTable.jsx";
import CustomAnalyzer from "./components/CustomAnalyzer.jsx";
import EmptyState from "./components/EmptyState.jsx";
import { useScreener } from "./hooks/useScreener.js";

export default function App() {
  const { results, scanning, progress, errors, runScan, stopScan } = useScreener();
  const [sectorFilter, setSectorFilter] = useState("");
  const [sortBy, setSortBy] = useState("score");

  const displayedStocks = useMemo(() => {
    let list = results;
    if (sectorFilter) {
      list = list.filter((s) => s.sector === sectorFilter);
    }
    return [...list].sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (sortBy === "breakout20") return (bv ? 1 : 0) - (av ? 1 : 0);
      if (sortBy === "obvTrend") {
        const rank = { up: 2, flat: 1, down: 0 };
        return (rank[bv] ?? 1) - (rank[av] ?? 1);
      }
      if (av === null) return 1;
      if (bv === null) return -1;
      return bv - av;
    });
  }, [results, sectorFilter, sortBy]);

  const hasResults = results.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header
        scanning={scanning}
        onScan={() => runScan()}
        onStop={stopScan}
        progress={progress}
      />

      {hasResults && (
        <>
          <FilterBar
            filter={sectorFilter}
            setFilter={setSectorFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <CustomAnalyzer onScan={runScan} scanning={scanning} />
        </>
      )}

      {!hasResults && !scanning && (
        <>
          <CustomAnalyzer onScan={runScan} scanning={scanning} />
          <EmptyState onScan={() => runScan()} />
        </>
      )}

      {(hasResults || scanning) && (
        <main className="flex-1 max-w-screen-xl mx-auto w-full">
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {displayedStocks.length} stocks
              {sectorFilter ? ` · ${sectorFilter}` : ""}
              {scanning ? ` · scanning ${progress.done}/${progress.total}…` : ""}
            </span>
            {errors.length > 0 && (
              <span className="text-[10px] text-rose-400/70">{errors.length} failed</span>
            )}
          </div>

          <StockTable
            stocks={displayedStocks}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {scanning && displayedStocks.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-500">Fetching stock data…</span>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

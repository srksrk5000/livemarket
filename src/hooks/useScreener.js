import { useState, useCallback, useRef } from "react";
import { fetchStockData } from "../utils/yahooFinance.js";
import { NSE_STOCKS } from "../data/nseStocks.js";

const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 800;

export function useScreener() {
  const [results, setResults] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [errors, setErrors] = useState([]);
  const abortRef = useRef(false);

  const runScan = useCallback(async (customSymbols = null) => {
    const stocks = customSymbols
      ? customSymbols.map((s) => ({ symbol: s, name: s, sector: "Custom" }))
      : NSE_STOCKS;

    abortRef.current = false;
    setScanning(true);
    setResults([]);
    setErrors([]);
    setProgress({ done: 0, total: stocks.length });

    const allResults = [];

    for (let i = 0; i < stocks.length; i += BATCH_SIZE) {
      if (abortRef.current) break;

      const batch = stocks.slice(i, i + BATCH_SIZE);
      const settled = await Promise.allSettled(
        batch.map((s) => fetchStockData(s.symbol).then((d) => ({ ...d, name: s.name, sector: s.sector })))
      );

      settled.forEach((r, idx) => {
        if (r.status === "fulfilled") {
          allResults.push(r.value);
          setResults((prev) =>
            [...prev, r.value].sort((a, b) => b.score - a.score || b.priceUpside - a.priceUpside)
          );
        } else {
          setErrors((prev) => [...prev, `${batch[idx].symbol}: ${r.reason?.message}`]);
        }
      });

      setProgress((p) => ({ ...p, done: Math.min(i + BATCH_SIZE, stocks.length) }));

      if (i + BATCH_SIZE < stocks.length) {
        await new Promise((res) => setTimeout(res, BATCH_DELAY_MS));
      }
    }

    setScanning(false);
  }, []);

  const stopScan = useCallback(() => {
    abortRef.current = true;
  }, []);

  return { results, scanning, progress, errors, runScan, stopScan };
}

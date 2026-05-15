import StockRow from "./StockRow.jsx";
import { ArrowUpDown } from "lucide-react";

const COLS = [
  { key: "name", label: "Stock", className: "text-left" },
  { key: "price", label: "Price", className: "text-right" },
  { key: "score", label: "Score", className: "text-center" },
  { key: "rsi", label: "RSI", className: "text-center" },
  { key: "volumeRatio", label: "Vol×", className: "text-center hidden sm:table-cell" },
  { key: "obvTrend", label: "OBV", className: "text-center hidden md:table-cell" },
  { key: "breakout20", label: "20D↑", className: "text-center hidden md:table-cell" },
  { key: "priceUpside", label: "Upside", className: "text-right hidden sm:table-cell" },
  { key: "todayVol", label: "Volume", className: "text-right hidden lg:table-cell" }
];

export default function StockTable({ stocks, sortBy, onSortChange }) {
  if (!stocks.length) return null;

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[320px]">
        <thead>
          <tr className="border-b border-slate-700">
            {COLS.map((col) => (
              <th
                key={col.key}
                onClick={() => col.key !== "name" && onSortChange(col.key)}
                className={`px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider select-none ${col.className} ${
                  col.key !== "name" ? "cursor-pointer hover:text-slate-300" : ""
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.key === sortBy && <ArrowUpDown className="w-2.5 h-2.5" />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <StockRow key={s.symbol} stock={s} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

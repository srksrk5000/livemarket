import { TrendingUp, TrendingDown, Minus, CheckCircle2 } from "lucide-react";

function ScoreBadge({ score }) {
  const color =
    score >= 70
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
      : score >= 45
      ? "text-amber-400 bg-amber-400/10 border-amber-400/30"
      : "text-slate-400 bg-slate-400/10 border-slate-400/20";
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[11px] font-bold ${color}`}>
      {score}
    </span>
  );
}

function RSIBadge({ rsi }) {
  if (rsi === null) return <span className="text-slate-600 text-xs">—</span>;
  const color =
    rsi > 70
      ? "text-rose-400"
      : rsi >= 50
      ? "text-emerald-400"
      : rsi >= 40
      ? "text-amber-400"
      : "text-slate-500";
  return <span className={`text-xs font-mono font-semibold ${color}`}>{rsi}</span>;
}

function OBVIcon({ trend }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
  return <Minus className="w-3.5 h-3.5 text-slate-500" />;
}

function fmt(n, dec = 2) {
  if (n === null || n === undefined) return "—";
  if (Math.abs(n) >= 1e7) return `${(n / 1e7).toFixed(1)}Cr`;
  if (Math.abs(n) >= 1e5) return `${(n / 1e5).toFixed(1)}L`;
  return n.toFixed(dec);
}

export default function StockRow({ stock }) {
  const changePos = stock.changePercent >= 0;

  return (
    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
      <td className="px-3 py-2.5">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-100 leading-tight">
            {stock.symbol.replace(".NS", "")}
          </span>
          <span className="text-[10px] text-slate-500 leading-tight truncate max-w-[90px]">
            {stock.name}
          </span>
        </div>
      </td>

      <td className="px-2 py-2.5 text-right">
        <div className="flex flex-col items-end">
          <span className="text-xs font-mono text-slate-200">
            ₹{fmt(stock.price)}
          </span>
          <span className={`text-[10px] font-semibold ${changePos ? "text-emerald-400" : "text-rose-400"}`}>
            {changePos ? "+" : ""}{fmt(stock.changePercent)}%
          </span>
        </div>
      </td>

      <td className="px-2 py-2.5 text-center">
        <ScoreBadge score={stock.score} />
      </td>

      <td className="px-2 py-2.5 text-center">
        <RSIBadge rsi={stock.rsi} />
      </td>

      <td className="px-2 py-2.5 text-center hidden sm:table-cell">
        <span className={`text-xs font-mono ${stock.volumeRatio >= 2 ? "text-violet-400 font-bold" : stock.volumeRatio >= 1.5 ? "text-amber-400" : "text-slate-400"}`}>
          {fmt(stock.volumeRatio, 1)}x
        </span>
      </td>

      <td className="px-2 py-2.5 text-center hidden md:table-cell">
        <OBVIcon trend={stock.obvTrend} />
      </td>

      <td className="px-2 py-2.5 text-center hidden md:table-cell">
        {stock.breakout20 ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
        ) : (
          <span className="text-slate-700 text-xs">—</span>
        )}
      </td>

      <td className="px-2 py-2.5 text-right hidden sm:table-cell">
        <span className={`text-xs font-mono ${stock.priceUpside > 10 ? "text-emerald-400" : stock.priceUpside > 5 ? "text-amber-400" : "text-slate-400"}`}>
          {fmt(stock.priceUpside)}%
        </span>
      </td>

      <td className="px-2 py-2.5 text-right hidden lg:table-cell">
        <span className="text-[10px] text-slate-400 font-mono">
          {fmt(stock.todayVol)}
        </span>
      </td>
    </tr>
  );
}

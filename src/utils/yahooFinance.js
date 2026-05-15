import {
  calcRSI,
  calcVWAP,
  calcOBV,
  calc20DayBreakout,
  calcAvgVolume,
  calcMomentumScore
} from "../utils/technicals.js";

export async function fetchStockData(symbol) {
  const res = await fetch(`/api/quote?symbol=${symbol}&range=3mo&interval=1d`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  const result = json?.chart?.result?.[0];
  if (!result) throw new Error("No data");

  const { timestamp, indicators } = result;
  const quote = indicators.quote[0];
  const meta = result.meta;

  const closes = quote.close;
  const highs = quote.high;
  const lows = quote.low;
  const volumes = quote.volume;

  const validIdx = closes.map((c, i) => (c != null ? i : -1)).filter((i) => i >= 0);

  const c = validIdx.map((i) => closes[i]);
  const h = validIdx.map((i) => highs[i]);
  const l = validIdx.map((i) => lows[i]);
  const v = validIdx.map((i) => volumes[i]);

  const currentClose = c[c.length - 1];
  const prevClose = c[c.length - 2];
  const rsi = calcRSI(c);
  const vwap = calcVWAP(h, l, c, v);
  const obv = calcOBV(c, v);
  const prevOBV = calcOBV(c.slice(0, -5), v.slice(0, -5));
  const breakout20 = calc20DayBreakout(c, h);
  const avgVol = calcAvgVolume(v);
  const todayVol = v[v.length - 1];
  const volumeRatio = avgVol > 0 ? parseFloat((todayVol / avgVol).toFixed(2)) : 0;

  const high52w = meta.fiftyTwoWeekHigh || Math.max(...h);
  const priceUpside =
    high52w > 0 ? parseFloat((((high52w - currentClose) / currentClose) * 100).toFixed(2)) : 0;

  const changePercent =
    prevClose > 0
      ? parseFloat((((currentClose - prevClose) / prevClose) * 100).toFixed(2))
      : 0;

  const score = calcMomentumScore({
    rsi,
    breakout20,
    volumeRatio,
    vwapAbove: vwap !== null && currentClose > vwap,
    obvTrend: obv - prevOBV,
    priceUpside
  });

  return {
    symbol,
    price: parseFloat(currentClose.toFixed(2)),
    changePercent,
    rsi,
    vwap,
    volumeRatio,
    breakout20,
    obvTrend: obv > prevOBV ? "up" : obv < prevOBV ? "down" : "flat",
    priceUpside,
    score,
    high52w: parseFloat(high52w.toFixed(2)),
    todayVol,
    avgVol: Math.round(avgVol),
    currency: meta.currency || "INR"
  };
}

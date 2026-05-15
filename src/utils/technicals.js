export function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const delta = closes[i] - closes[i - 1];
    if (delta > 0) gains += delta;
    else losses -= delta;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closes.length; i++) {
    const delta = closes[i] - closes[i - 1];
    const gain = delta > 0 ? delta : 0;
    const loss = delta < 0 ? -delta : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return parseFloat((100 - 100 / (1 + rs)).toFixed(2));
}

export function calcVWAP(highs, lows, closes, volumes) {
  let cumTPV = 0;
  let cumVol = 0;
  for (let i = 0; i < closes.length; i++) {
    const tp = (highs[i] + lows[i] + closes[i]) / 3;
    cumTPV += tp * volumes[i];
    cumVol += volumes[i];
  }
  if (cumVol === 0) return null;
  return parseFloat((cumTPV / cumVol).toFixed(2));
}

export function calcOBV(closes, volumes) {
  let obv = 0;
  for (let i = 1; i < closes.length; i++) {
    if (closes[i] > closes[i - 1]) obv += volumes[i];
    else if (closes[i] < closes[i - 1]) obv -= volumes[i];
  }
  return obv;
}

export function calc20DayBreakout(closes, highs) {
  if (closes.length < 20) return false;
  const currentClose = closes[closes.length - 1];
  const prev20Highs = highs.slice(-21, -1);
  const highest = Math.max(...prev20Highs);
  return currentClose > highest;
}

export function calcAvgVolume(volumes, days = 20) {
  const slice = volumes.slice(-days);
  if (!slice.length) return 0;
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

export function calcMomentumScore({
  rsi,
  breakout20,
  volumeRatio,
  vwapAbove,
  obvTrend,
  priceUpside
}) {
  let score = 0;

  if (rsi !== null) {
    if (rsi >= 50 && rsi <= 70) score += 25;
    else if (rsi > 70) score += 15;
    else if (rsi >= 40) score += 10;
  }

  if (breakout20) score += 20;

  if (volumeRatio >= 2) score += 20;
  else if (volumeRatio >= 1.5) score += 12;
  else if (volumeRatio >= 1.2) score += 6;

  if (vwapAbove) score += 15;

  if (obvTrend > 0) score += 10;

  if (priceUpside > 10) score += 10;
  else if (priceUpside > 5) score += 5;

  return Math.min(100, Math.round(score));
}

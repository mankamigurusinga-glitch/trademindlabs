/**
 * Mock AI analysis service.
 *
 * Deterministic, realistic sample analytics for every supported symbol and
 * exchange. Swap `analyzeSymbol` for a live call (see services/ai.service.ts)
 * without touching any UI code — the shape of `AnalysisResult` stays stable.
 */
import type { AnalysisResult, Exchange, RiskLevel } from "@/types";

const BASE: Record<string, { price: number; vol: number }> = {
  BTC: { price: 68412, vol: 0.021 },
  ETH: { price: 3538, vol: 0.026 },
  BNB: { price: 601.4, vol: 0.023 },
  XRP: { price: 0.6142, vol: 0.031 },
  SOL: { price: 172.35, vol: 0.042 },
  DOGE: { price: 0.1284, vol: 0.048 },
  ADA: { price: 0.4471, vol: 0.035 },
  AVAX: { price: 28.64, vol: 0.038 },
  LINK: { price: 17.12, vol: 0.033 },
  SUI: { price: 1.482, vol: 0.052 },
  TON: { price: 6.94, vol: 0.029 },
};

const TRENDS = ["Strong uptrend", "Uptrend", "Range / compression", "Downtrend", "Weak downtrend"];
const MOMENTUM = ["Accelerating", "Steady", "Fading", "Reversing", "Neutral"];

/** Tiny deterministic PRNG so repeated views stay coherent, refresh nudges it. */
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function buildAnalysis(
  symbol: string,
  exchange: Exchange,
  nonce = 0,
): AnalysisResult {
  const base = BASE[symbol] ?? { price: 100, vol: 0.03 };
  const rand = rng(hash(symbol + exchange) + nonce * 7919);

  const drift = (rand() - 0.45) * base.vol;
  const price = +(base.price * (1 + drift)).toFixed(base.price < 5 ? 4 : 2);

  const bullish = Math.round(38 + rand() * 46);
  const bearish = 100 - bullish;
  const volatilityPct = +(base.vol * 100 * (0.7 + rand() * 0.9)).toFixed(2);
  const risk: RiskLevel = volatilityPct > 4 ? "High" : volatilityPct > 2.4 ? "Medium" : "Low";
  const funding = +((rand() - 0.35) * 0.09).toFixed(4);

  const support = +(price * (1 - 0.02 - rand() * 0.03)).toFixed(base.price < 5 ? 4 : 2);
  const resistance = +(price * (1 + 0.02 + rand() * 0.035)).toFixed(base.price < 5 ? 4 : 2);
  const bestCase = +(resistance * (1 + 0.03 + rand() * 0.04)).toFixed(base.price < 5 ? 4 : 2);
  const worstCase = +(support * (1 - 0.03 - rand() * 0.04)).toFixed(base.price < 5 ? 4 : 2);
  const invalidation = +(support * 0.985).toFixed(base.price < 5 ? 4 : 2);

  const trend = TRENDS[Math.floor(rand() * TRENDS.length)];
  const momentum = MOMENTUM[Math.floor(rand() * MOMENTUM.length)];

  const series = Array.from({ length: 24 }, (_, i) => {
    const wobble = (rand() - 0.5) * base.vol * 0.9;
    return {
      t: `${String(i).padStart(2, "0")}:00`,
      price: +(price * (1 + wobble - (12 - i) * 0.0006)).toFixed(base.price < 5 ? 4 : 2),
    };
  });

  const score = Math.round(bullish * 0.7 + (risk === "Low" ? 22 : risk === "Medium" ? 14 : 6));

  return {
    symbol,
    exchange,
    price,
    trend,
    momentum,
    support,
    resistance,
    openInterest: `$${(0.4 + rand() * 6.2).toFixed(2)}B`,
    fundingRate: `${funding > 0 ? "+" : ""}${funding.toFixed(4)}%`,
    volume: `$${(0.8 + rand() * 24).toFixed(1)}B`,
    volatility: `${volatilityPct}% (24h)`,
    riskLevel: risk,
    bullishProbability: bullish,
    bearishProbability: bearish,
    bestCase,
    worstCase,
    invalidation,
    confidence: Math.round(58 + rand() * 38),
    score,
    summary:
      `${symbol} on ${exchange} is in a ${trend.toLowerCase()} with ${momentum.toLowerCase()} momentum. ` +
      `Perp funding at ${funding.toFixed(4)}% and open interest suggest positioning is ` +
      `${funding > 0.04 ? "crowded long — chase risk is elevated" : "balanced, so continuation is still cheap"}. ` +
      `Probability skews ${bullish >= 50 ? "bullish" : "bearish"} at ${bullish}% / ${bearish}%. ` +
      `Structure holds while price stays above ${invalidation}; a close below that invalidates the idea. ` +
      `Risk is rated ${risk.toLowerCase()} — size positions so a stop at invalidation costs no more than 1% of equity.`,
    series,
    updatedAt: new Date().toISOString(),
  };
}

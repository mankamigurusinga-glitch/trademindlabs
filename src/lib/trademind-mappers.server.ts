/**
 * Maps loose n8n workflow payloads onto the app's stable domain shapes.
 * Server-only so response handling never ships to the browser.
 */
import type {
  Alert,
  AnalysisHistoryItem,
  AnalysisResult,
  Exchange,
  RiskLevel,
  Subscription,
} from "@/types";
import { asArray, unwrap } from "./n8n.server";

type Row = Record<string, unknown>;

const pick = (row: Row, keys: string[]): unknown => {
  for (const k of keys) {
    const hit = Object.keys(row).find((rk) => rk.toLowerCase().replace(/[_\s-]/g, "") === k);
    if (hit && row[hit] !== null && row[hit] !== undefined && row[hit] !== "") return row[hit];
  }
  return undefined;
};

const num = (v: unknown, fallback = 0) => {
  const n = typeof v === "string" ? Number(v.replace(/[^0-9.\-]/g, "")) : Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const str = (v: unknown, fallback = "—") =>
  v === undefined || v === null || v === "" ? fallback : String(v);
const pct = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

export function toAnalysisResult(
  payload: unknown,
  symbol: string,
  exchange: Exchange,
): AnalysisResult {
  const row = ((unwrap(payload) ?? {}) as Row) satisfies Row;

  const bullishRaw = pick(row, ["bullishprobability", "bullish", "longprobability"]);
  const bearishRaw = pick(row, ["bearishprobability", "bearish", "shortprobability"]);
  const bullish = bullishRaw !== undefined ? pct(num(bullishRaw)) : 50;
  const bearish = bearishRaw !== undefined ? pct(num(bearishRaw)) : 100 - bullish;

  const riskValue = str(pick(row, ["risklevel", "risk"]), "Medium").toLowerCase();
  const riskLevel: RiskLevel = riskValue.startsWith("h")
    ? "High"
    : riskValue.startsWith("l")
      ? "Low"
      : "Medium";

  const seriesSource = pick(row, ["series", "candles", "history", "pricehistory", "chart"]);
  const series = asArray(seriesSource).map((point, i) => ({
    t: str(pick(point, ["t", "time", "timestamp", "label"]), `${String(i).padStart(2, "0")}:00`),
    price: num(pick(point, ["price", "close", "value", "c"])),
  }));

  return {
    symbol: str(pick(row, ["symbol", "pair", "ticker"]), symbol),
    exchange: (str(pick(row, ["exchange"]), exchange) as Exchange) ?? exchange,
    price: num(pick(row, ["price", "lastprice", "close"])),
    trend: str(pick(row, ["trend"])),
    momentum: str(pick(row, ["momentum"])),
    support: num(pick(row, ["support", "supportlevel"])),
    resistance: num(pick(row, ["resistance", "resistancelevel"])),
    openInterest: str(pick(row, ["openinterest", "oi"])),
    fundingRate: str(pick(row, ["fundingrate", "funding"])),
    volume: str(pick(row, ["volume", "volume24h"])),
    volatility: str(pick(row, ["volatility"])),
    riskLevel,
    bullishProbability: bullish,
    bearishProbability: bearish,
    bestCase: num(pick(row, ["bestcase", "target", "takeprofit"])),
    worstCase: num(pick(row, ["worstcase", "downside"])),
    invalidation: num(pick(row, ["invalidation", "invalidationlevel", "stoploss"])),
    confidence: pct(num(pick(row, ["confidence", "confidencescore"]), 0)),
    score: pct(num(pick(row, ["score", "trademindscore", "aiscore"]), 0)),
    summary: str(
      pick(row, ["summary", "aisummary", "reasoning", "explanation", "text"]),
      "No AI summary was returned for this request.",
    ),
    series,
    updatedAt: str(pick(row, ["updatedat", "timestamp", "generatedat"]), new Date().toISOString()),
  };
}

/** Maps a backend alert onto the same shape the alerts UI already renders. */
export function toAlerts(payload: unknown, userId: string): Alert[] {
  return asArray(payload).map((row, i) => {
    const created = str(pick(row, ["createdat", "created", "timestamp", "time"]), "");
    return {
      id: str(pick(row, ["id", "alertid", "uuid"]), `n8n-${i}`),
      user_id: userId,
      symbol: str(pick(row, ["symbol", "pair", "ticker"]), "BTC"),
      exchange: str(pick(row, ["exchange"]), "Binance"),
      alert_type: str(pick(row, ["alerttype", "type"]), "ai"),
      severity: str(pick(row, ["severity", "level"]), "info").toLowerCase(),
      status: str(pick(row, ["status"]), "active").toLowerCase(),
      title: str(pick(row, ["title", "headline", "name"]), "AI alert"),
      message: (pick(row, ["message", "body", "summary", "reasoning"]) as string | undefined) ?? null,
      score: pick(row, ["score"]) === undefined ? null : num(pick(row, ["score"])),
      is_read: Boolean(pick(row, ["isread", "read"]) ?? false),
      created_at: created && !Number.isNaN(Date.parse(created)) ? created : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } satisfies Alert;
  });
}

/** Maps the `/webhook/subscription` payload onto the account plan shape. */
export function toSubscription(payload: unknown): Subscription {
  const row = (unwrap(payload) ?? {}) as Row;
  const featuresRaw = pick(row, ["features", "benefits", "included"]);
  const features = Array.isArray(featuresRaw)
    ? featuresRaw.map((f) => str(f, "")).filter(Boolean)
    : [];
  const renews = str(pick(row, ["renewsat", "renewal", "currentperiodend", "expiresat"]), "");
  return {
    plan: str(pick(row, ["plan", "tier", "planname"]), "Free"),
    status: str(pick(row, ["status", "state"]), "active").toLowerCase(),
    renewsAt: renews && !Number.isNaN(Date.parse(renews)) ? renews : null,
    analysesUsed: num(pick(row, ["analysesused", "used", "usage"])),
    analysesLimit: num(pick(row, ["analyseslimit", "limit", "quota"]), 0),
    features,
  };
}

/** Maps the `/webhook/history` payload onto the analysis history list. */
export function toHistory(payload: unknown): AnalysisHistoryItem[] {
  return asArray(payload).map((row, i) => {
    const created = str(pick(row, ["createdat", "timestamp", "time", "date"]), "");
    const risk = str(pick(row, ["risklevel", "risk"]), "Medium").toLowerCase();
    return {
      id: str(pick(row, ["id", "analysisid", "uuid"]), `h-${i}`),
      symbol: str(pick(row, ["symbol", "pair", "ticker"]), "BTC"),
      exchange: str(pick(row, ["exchange"]), "Binance"),
      trend: str(pick(row, ["trend"])),
      score: pct(num(pick(row, ["score", "trademindscore", "aiscore"]))),
      riskLevel: (risk.startsWith("h") ? "High" : risk.startsWith("l") ? "Low" : "Medium") as RiskLevel,
      createdAt:
        created && !Number.isNaN(Date.parse(created)) ? created : new Date().toISOString(),
      summary: str(pick(row, ["summary", "aisummary", "reasoning"]), ""),
    } satisfies AnalysisHistoryItem;
  });
}

/** Extracts assistant text from a `/webhook/chat` JSON response. */
export function toChatText(payload: unknown): string {
  const value = unwrap(payload);
  if (typeof value === "string") return value;
  const row = (value ?? {}) as Row;
  const text = pick(row, ["reply", "response", "message", "text", "answer", "content", "output"]);
  return typeof text === "string" && text.trim()
    ? text
    : "The AI backend returned an empty response.";
}

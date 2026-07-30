/**
 * Market data service.
 *
 * Currently backed by deterministic mock data. Each exchange adapter below is a
 * placeholder with the exact signature a live REST integration will use, so the
 * UI never changes when the real endpoints are wired up.
 */
import { buildAnalysis } from "./analysis.mock";
import type { AnalysisResult, Exchange } from "@/types";

export interface Ticker {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: string;
  score: number;
}

const SEED_TICKERS: Ticker[] = [
  { symbol: "BTC", price: 68412, change24h: 2.41, volume24h: "$38.2B", score: 88 },
  { symbol: "ETH", price: 3538, change24h: 1.24, volume24h: "$16.4B", score: 76 },
  { symbol: "SOL", price: 172.35, change24h: 4.62, volume24h: "$5.1B", score: 91 },
  { symbol: "BNB", price: 601.4, change24h: 0.87, volume24h: "$2.2B", score: 71 },
  { symbol: "XRP", price: 0.6142, change24h: -1.12, volume24h: "$1.8B", score: 48 },
  { symbol: "DOGE", price: 0.1284, change24h: -0.91, volume24h: "$1.1B", score: 52 },
  { symbol: "ADA", price: 0.4471, change24h: -0.44, volume24h: "$0.7B", score: 55 },
  { symbol: "AVAX", price: 28.64, change24h: 0.41, volume24h: "$0.6B", score: 68 },
  { symbol: "LINK", price: 17.12, change24h: 3.08, volume24h: "$0.9B", score: 84 },
  { symbol: "SUI", price: 1.482, change24h: 5.24, volume24h: "$0.8B", score: 79 },
  { symbol: "TON", price: 6.94, change24h: -2.05, volume24h: "$0.4B", score: 44 },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchTickers(): Promise<Ticker[]> {
  await wait(350);
  return SEED_TICKERS.map((t) => ({ ...t }));
}

export async function fetchTicker(symbol: string): Promise<Ticker | undefined> {
  const all = await fetchTickers();
  return all.find((t) => t.symbol === symbol);
}

export async function fetchAnalysis(
  symbol: string,
  exchange: Exchange,
  nonce = 0,
): Promise<AnalysisResult> {
  await wait(500);
  return buildAnalysis(symbol, exchange, nonce);
}

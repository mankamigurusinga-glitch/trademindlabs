import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type UserSettings = Tables<"user_settings">;
export type WatchlistItem = Tables<"watchlists">;
export type Alert = Tables<"alerts">;
export type JournalEntry = Tables<"journal_entries">;

export type JournalEntryInsert = TablesInsert<"journal_entries">;
export type JournalEntryUpdate = TablesUpdate<"journal_entries">;

export const EXCHANGES = ["Binance", "Bybit", "OKX"] as const;
export type Exchange = (typeof EXCHANGES)[number];

export const SYMBOLS = [
  "BTC",
  "ETH",
  "BNB",
  "XRP",
  "SOL",
  "DOGE",
  "ADA",
  "AVAX",
  "LINK",
  "SUI",
  "TON",
] as const;
export type Symbol = (typeof SYMBOLS)[number];

export type RiskLevel = "Low" | "Medium" | "High";

export interface AnalysisResult {
  symbol: string;
  exchange: Exchange;
  price: number;
  trend: string;
  momentum: string;
  support: number;
  resistance: number;
  openInterest: string;
  fundingRate: string;
  volume: string;
  volatility: string;
  riskLevel: RiskLevel;
  bullishProbability: number;
  bearishProbability: number;
  bestCase: number;
  worstCase: number;
  invalidation: number;
  confidence: number;
  score: number;
  summary: string;
  series: { t: string; price: number }[];
  updatedAt: string;
}

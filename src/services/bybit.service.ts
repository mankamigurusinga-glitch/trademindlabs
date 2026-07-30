/**
 * Bybit integration placeholder — swap in live v5 API calls later.
 */
import { fetchTickers, type Ticker } from "./market.service";

export const BYBIT_REST_BASE = "https://api.bybit.com";

export const bybitService = {
  /** GET /v5/market/tickers?category=linear */
  async getTickers(): Promise<Ticker[]> {
    return fetchTickers();
  },
  /** GET /v5/market/kline */
  async getKlines(_symbol: string, _interval = "60"): Promise<{ t: string; price: number }[]> {
    return [];
  },
  /** GET /v5/market/funding/history */
  async getFundingRate(_symbol: string): Promise<number | null> {
    return null;
  },
  /** GET /v5/market/open-interest */
  async getOpenInterest(_symbol: string): Promise<number | null> {
    return null;
  },
};

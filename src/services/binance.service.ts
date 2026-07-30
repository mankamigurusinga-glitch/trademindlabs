/**
 * Binance integration placeholder.
 *
 * Replace the bodies below with real REST/WebSocket calls when going live.
 * Keep the return shapes identical so no UI change is required.
 */
import { fetchTickers, type Ticker } from "./market.service";

export const BINANCE_REST_BASE = "https://fapi.binance.com";

export const binanceService = {
  /** GET /fapi/v1/ticker/24hr */
  async getTickers(): Promise<Ticker[]> {
    return fetchTickers();
  },
  /** GET /fapi/v1/klines */
  async getKlines(_symbol: string, _interval = "1h"): Promise<{ t: string; price: number }[]> {
    return [];
  },
  /** GET /fapi/v1/fundingRate */
  async getFundingRate(_symbol: string): Promise<number | null> {
    return null;
  },
  /** GET /fapi/v1/openInterest */
  async getOpenInterest(_symbol: string): Promise<number | null> {
    return null;
  },
};

/**
 * OKX integration placeholder — swap in live v5 API calls later.
 */
import { fetchTickers, type Ticker } from "./market.service";

export const OKX_REST_BASE = "https://www.okx.com";

export const okxService = {
  /** GET /api/v5/market/tickers?instType=SWAP */
  async getTickers(): Promise<Ticker[]> {
    return fetchTickers();
  },
  /** GET /api/v5/market/candles */
  async getKlines(_symbol: string, _bar = "1H"): Promise<{ t: string; price: number }[]> {
    return [];
  },
  /** GET /api/v5/public/funding-rate */
  async getFundingRate(_symbol: string): Promise<number | null> {
    return null;
  },
  /** GET /api/v5/public/open-interest */
  async getOpenInterest(_symbol: string): Promise<number | null> {
    return null;
  },
};

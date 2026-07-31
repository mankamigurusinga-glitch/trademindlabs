/**
 * AI analysis service.
 *
 * Backed by the n8n AI backend through a server function, so the webhook URL
 * and API token never reach the browser. The `AnalysisResult` contract keeps
 * the UI unchanged.
 */
import { getAiAnalysis } from "@/lib/trademind-api.functions";
import type { AnalysisResult, Exchange, Symbol as TradeSymbol } from "@/types";

export const aiService = {
  async analyze(symbol: string, exchange: Exchange, nonce = 0): Promise<AnalysisResult> {
    return getAiAnalysis({
      data: { symbol: symbol as TradeSymbol, exchange, nonce },
    });
  },
};

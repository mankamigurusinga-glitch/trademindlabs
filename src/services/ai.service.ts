/**
 * AI analysis service.
 *
 * Today it returns deterministic mock reasoning. Later this becomes a call to
 * the AI backend; the `AnalysisResult` contract keeps the UI unchanged.
 */
import { fetchAnalysis } from "./market.service";
import type { AnalysisResult, Exchange } from "@/types";

export const aiService = {
  async analyze(symbol: string, exchange: Exchange, nonce = 0): Promise<AnalysisResult> {
    return fetchAnalysis(symbol, exchange, nonce);
  },
  /** Placeholder for the conversational assistant endpoint. */
  async ask(question: string): Promise<string> {
    return (
      `Reading the tape for "${question}". Once the live AI backend is connected this ` +
      `answer will include the score, the reasoning chain and the invalidation level.`
    );
  },
};

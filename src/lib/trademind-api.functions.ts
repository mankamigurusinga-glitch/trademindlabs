/**
 * Server functions for the n8n AI backend.
 *
 * Thin RPC wrappers only — all runtime logic lives in the imported
 * server-only modules.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isN8nConfigured, n8nRequest, N8nError } from "@/lib/n8n.server";
import { toAlerts, toAnalysisResult } from "@/lib/trademind-mappers.server";
import { EXCHANGES, SYMBOLS, type Alert, type AnalysisResult } from "@/types";

const analysisInput = z.object({
  symbol: z.enum(SYMBOLS),
  exchange: z.enum(EXCHANGES),
  nonce: z.number().int().min(0).max(1_000_000).optional(),
});

const alertsInput = z.object({
  symbol: z.string().max(20).optional(),
  exchange: z.string().max(20).optional(),
  limit: z.number().int().min(1).max(200).optional(),
});

export const getAiAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => analysisInput.parse(input))
  .handler(async ({ data, context }): Promise<AnalysisResult> => {
    if (!isN8nConfigured()) {
      throw new Error("The AI backend is not configured yet.");
    }
    const payload = await n8nRequest<unknown>("analysis", {
      method: "POST",
      body: {
        symbol: data.symbol,
        exchange: data.exchange,
        userId: context.userId,
        refresh: data.nonce ?? 0,
      },
    });
    return toAnalysisResult(payload, data.symbol, data.exchange);
  });

/**
 * Alerts come from the AI backend. Alerts the user created in-app still live in
 * the database, so both sources are merged into one feed (newest first).
 */
export const getAlertsFeed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => alertsInput.parse(input ?? {}))
  .handler(async ({ data, context }): Promise<{ alerts: Alert[]; backendError: string | null }> => {
    const { supabase, userId } = context;

    const { data: rows, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load your saved alerts.");

    if (!isN8nConfigured()) {
      return { alerts: rows ?? [], backendError: null };
    }

    try {
      const payload = await n8nRequest<unknown>("alerts", {
        method: "POST",
        body: {
          userId,
          symbol: data.symbol,
          exchange: data.exchange,
          limit: data.limit ?? 50,
        },
      });
      const backend = toAlerts(payload, userId);
      const merged = [...backend, ...(rows ?? [])].sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
      );
      return { alerts: merged, backendError: null };
    } catch (err) {
      return {
        alerts: rows ?? [],
        backendError: err instanceof N8nError ? err.message : "Could not reach the AI backend.",
      };
    }
  });

/** Prepared endpoint: pushes watchlist changes to the backend for monitoring. */
export const syncWatchlistToBackend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        action: z.enum(["add", "remove", "sync"]),
        symbol: z.string().max(20).optional(),
        exchange: z.string().max(20).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: boolean; skipped?: boolean }> => {
    if (!isN8nConfigured()) return { ok: true, skipped: true };
    await n8nRequest<unknown>("watchlist", {
      method: "POST",
      body: { ...data, userId: context.userId },
    });
    return { ok: true };
  });

/** Prepared endpoint: sends journal trades to the backend for AI review. */
export const syncJournalToBackend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        action: z.enum(["create", "update", "delete", "sync"]),
        entryId: z.string().max(64).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: boolean; skipped?: boolean }> => {
    if (!isN8nConfigured()) return { ok: true, skipped: true };
    await n8nRequest<unknown>("journal", {
      method: "POST",
      body: { ...data, userId: context.userId },
    });
    return { ok: true };
  });

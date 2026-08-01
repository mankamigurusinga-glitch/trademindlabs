/**
 * Account-side server functions for the n8n backend
 * (/webhook/login, /register, /profile, /subscription, /history, /settings).
 *
 * Thin RPC wrappers only — runtime logic lives in the server-only modules.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isN8nConfigured, n8nRequest, N8nError } from "@/lib/n8n.server";
import { toHistory, toSubscription } from "@/lib/trademind-mappers.server";
import type { AnalysisHistoryItem, Subscription } from "@/types";

const FREE_PLAN: Subscription = {
  plan: "Free",
  status: "active",
  renewsAt: null,
  analysesUsed: 0,
  analysesLimit: 10,
  features: ["10 AI analyses / month", "Reasoning summaries", "Community alerts"],
};

/** Notifies the backend that a user signed in or signed up (JWT-authenticated). */
export const notifyAuthEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ event: z.enum(["login", "register"]), email: z.string().email().max(200) }).parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: boolean }> => {
    if (!isN8nConfigured()) return { ok: true };
    try {
      await n8nRequest<unknown>(data.event, {
        body: { userId: context.userId, email: data.email },
      });
    } catch {
      // Never block sign-in on a backend hiccup.
      return { ok: false };
    }
    return { ok: true };
  });

/** Current plan + usage. Falls back to the free plan when unavailable. */
export const getSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ subscription: Subscription; backendError: string | null }> => {
    if (!isN8nConfigured()) return { subscription: FREE_PLAN, backendError: null };
    try {
      const payload = await n8nRequest<unknown>("subscription", {
        body: { userId: context.userId },
      });
      return { subscription: toSubscription(payload), backendError: null };
    } catch (err) {
      return {
        subscription: FREE_PLAN,
        backendError: err instanceof N8nError ? err.message : "Could not reach the AI backend.",
      };
    }
  });

/** Past AI analyses for this user. */
export const getAnalysisHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        symbol: z.string().max(20).optional(),
        limit: z.number().int().min(1).max(200).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(
    async ({
      data,
      context,
    }): Promise<{ items: AnalysisHistoryItem[]; backendError: string | null }> => {
      if (!isN8nConfigured()) return { items: [], backendError: null };
      try {
        const payload = await n8nRequest<unknown>("history", {
          body: { userId: context.userId, symbol: data.symbol, limit: data.limit ?? 25 },
        });
        return { items: toHistory(payload), backendError: null };
      } catch (err) {
        return {
          items: [],
          backendError: err instanceof N8nError ? err.message : "Could not reach the AI backend.",
        };
      }
    },
  );

/** Pushes profile changes to the backend so workflows stay in sync. */
export const syncProfileToBackend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        fullName: z.string().max(120).optional(),
        telegramUsername: z.string().max(64).optional(),
        avatarUrl: z.string().url().max(500).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ ok: boolean }> => {
    if (!isN8nConfigured()) return { ok: true };
    try {
      await n8nRequest<unknown>("profile", { body: { userId: context.userId, ...data } });
    } catch {
      return { ok: false };
    }
    return { ok: true };
  });

/** Pushes notification/preference changes to the backend. */
export const syncSettingsToBackend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.record(z.string(), z.unknown()).parse(input ?? {}))
  .handler(async ({ data, context }): Promise<{ ok: boolean }> => {
    if (!isN8nConfigured()) return { ok: true };
    try {
      await n8nRequest<unknown>("settings", { body: { userId: context.userId, settings: data } });
    } catch {
      return { ok: false };
    }
    return { ok: true };
  });

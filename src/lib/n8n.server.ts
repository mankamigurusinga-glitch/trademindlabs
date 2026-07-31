/**
 * Central n8n webhook client (server-only).
 *
 * Every outbound call goes through `n8nRequest`, which POSTs JSON to
 * `${N8N_BASE_URL}/webhook/<endpoint>`. No API key and no REST API is used —
 * n8n Cloud webhooks are public per-workflow URLs.
 *
 * Env vars (read at call time, never at module scope):
 *   N8N_BASE_URL        e.g. https://my.app.n8n.cloud   (required)
 *   N8N_TIMEOUT_MS      optional, defaults to 15000
 *   N8N_RETRIES         optional, defaults to 2 retries on network/5xx
 *   N8N_ANALYSIS_PATH   optional webhook slug, defaults to "trademind-analysis"
 *   N8N_ALERTS_PATH     optional webhook slug, defaults to "trademind-alerts"
 *   N8N_WATCHLIST_PATH  optional webhook slug, defaults to "trademind-watchlist"
 *   N8N_JOURNAL_PATH    optional webhook slug, defaults to "trademind-journal"
 */

export const N8N_ENDPOINTS = {
  analysis: { env: "N8N_ANALYSIS_PATH", fallback: "trademind-analysis" },
  alerts: { env: "N8N_ALERTS_PATH", fallback: "trademind-alerts" },
  watchlist: { env: "N8N_WATCHLIST_PATH", fallback: "trademind-watchlist" },
  journal: { env: "N8N_JOURNAL_PATH", fallback: "trademind-journal" },
} as const;

export type N8nEndpoint = keyof typeof N8N_ENDPOINTS;

export class N8nError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "N8nError";
  }
}

/** True when the backend is configured; lets callers degrade gracefully. */
export function isN8nConfigured(): boolean {
  return !!process.env["N8N_BASE_URL"];
}

/** Builds `${N8N_BASE_URL}/webhook/<slug>`, tolerating trailing slashes. */
export function webhookUrl(endpoint: N8nEndpoint): string {
  const base = process.env["N8N_BASE_URL"];
  if (!base) throw new N8nError("Backend URL is not configured");
  const { env, fallback } = N8N_ENDPOINTS[endpoint];
  const slug = (process.env[env] || fallback).replace(/^\/+|\/+$/g, "");
  const root = base.replace(/\/+$/, "").replace(/\/webhook$/i, "");
  return `${root}/webhook/${slug}`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** POSTs a JSON payload to an n8n webhook and returns the parsed JSON body. */
export async function n8nRequest<T>(
  endpoint: N8nEndpoint,
  init: { body?: unknown } = {},
): Promise<T> {
  const url = webhookUrl(endpoint);
  const timeout = Number(process.env["N8N_TIMEOUT_MS"] ?? 15000);
  const retries = Number(process.env["N8N_RETRIES"] ?? 2);

  let lastError: N8nError = new N8nError("Could not reach the AI backend.");

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { accept: "application/json", "content-type": "application/json" },
        body: JSON.stringify(init.body ?? {}),
        signal: controller.signal,
      });
      const text = await res.text();
      if (!res.ok) {
        // Log provider detail server-side only.
        console.error(`[n8n] ${endpoint} ${res.status}: ${text.slice(0, 500)}`);
        const retryable = res.status >= 500 || res.status === 429;
        lastError = new N8nError(
          res.status === 404
            ? "The AI backend workflow was not found."
            : "The AI backend returned an error.",
          res.status,
        );
        if (retryable && attempt < retries) {
          await sleep(300 * 2 ** attempt);
          continue;
        }
        throw lastError;
      }
      return (text ? JSON.parse(text) : null) as T;
    } catch (error) {
      if (error instanceof N8nError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        lastError = new N8nError("The AI backend timed out.");
      } else {
        console.error(`[n8n] ${endpoint} request failed`, error);
        lastError = new N8nError("Could not reach the AI backend.");
      }
      if (attempt >= retries) throw lastError;
      await sleep(300 * 2 ** attempt);
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError;
}

/* ------------------------------ normalisation ----------------------------- */

/** n8n workflows often wrap output in `{ data }`, `{ body }` or `[ { json } ]`. */
export function unwrap(payload: unknown): unknown {
  let value = payload;
  for (let i = 0; i < 4; i++) {
    if (Array.isArray(value) && value.length === 1) {
      value = value[0];
      continue;
    }
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const key = ["json", "data", "body", "result", "output"].find((k) => k in obj);
      if (key && obj[key] !== null && typeof obj[key] === "object") {
        value = obj[key];
        continue;
      }
    }
    break;
  }
  return value;
}

export function asArray(payload: unknown): Record<string, unknown>[] {
  const value = unwrap(payload);
  if (Array.isArray(value)) {
    return value.map((v) => (unwrap(v) ?? {}) as Record<string, unknown>);
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const k of ["items", "alerts", "rows", "records"]) {
      if (Array.isArray(obj[k])) {
        return (obj[k] as unknown[]).map((v) => (unwrap(v) ?? {}) as Record<string, unknown>);
      }
    }
  }
  return [];
}

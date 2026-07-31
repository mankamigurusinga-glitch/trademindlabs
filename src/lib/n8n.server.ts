/**
 * Central n8n backend client (server-only).
 *
 * All outbound calls to the n8n AI backend go through `n8nRequest`. The base
 * URL, auth token and every endpoint path come from environment variables so
 * nothing is hardcoded and the backend can be re-pointed without a code change.
 *
 * Env vars (read at call time, never at module scope):
 *   N8N_BASE_URL         e.g. https://my.app.n8n.cloud/webhook
 *   N8N_API_KEY          token sent as the auth header
 *   N8N_AUTH_HEADER      optional, defaults to "x-api-key"
 *   N8N_TIMEOUT_MS       optional, defaults to 15000
 *   N8N_ANALYSIS_PATH    optional, defaults to "/trademind/analysis"
 *   N8N_ALERTS_PATH      optional, defaults to "/trademind/alerts"
 *   N8N_WATCHLIST_PATH   optional, defaults to "/trademind/watchlist"
 *   N8N_JOURNAL_PATH     optional, defaults to "/trademind/journal"
 */

export const N8N_ENDPOINTS = {
  analysis: { env: "N8N_ANALYSIS_PATH", fallback: "/trademind/analysis" },
  alerts: { env: "N8N_ALERTS_PATH", fallback: "/trademind/alerts" },
  watchlist: { env: "N8N_WATCHLIST_PATH", fallback: "/trademind/watchlist" },
  journal: { env: "N8N_JOURNAL_PATH", fallback: "/trademind/journal" },
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

function endpointUrl(endpoint: N8nEndpoint, query?: Record<string, string | number | undefined>) {
  const base = process.env["N8N_BASE_URL"];
  if (!base) throw new N8nError("Backend URL is not configured");
  const { env, fallback } = N8N_ENDPOINTS[endpoint];
  const path = process.env[env] ?? fallback;
  const url = new URL(
    path.startsWith("/") ? path : `/${path}`,
    base.endsWith("/") ? base : `${base}/`,
  );
  // Preserve any path prefix in the base URL (e.g. ".../webhook").
  const basePath = new URL(base.endsWith("/") ? base : `${base}/`).pathname.replace(/\/$/, "");
  if (basePath && !url.pathname.startsWith(basePath)) url.pathname = basePath + url.pathname;
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export async function n8nRequest<T>(
  endpoint: N8nEndpoint,
  init: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    query?: Record<string, string | number | undefined>;
    body?: unknown;
  } = {},
): Promise<T> {
  const url = endpointUrl(endpoint, init.query);
  const key = process.env["N8N_API_KEY"];
  const headerName = process.env["N8N_AUTH_HEADER"] || "x-api-key";
  const timeout = Number(process.env["N8N_TIMEOUT_MS"] ?? 15000);

  const headers: Record<string, string> = { accept: "application/json" };
  if (key) headers[headerName] = key;
  if (init.body !== undefined) headers["content-type"] = "application/json";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      method: init.method ?? (init.body !== undefined ? "POST" : "GET"),
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal: controller.signal,
    });
    const text = await res.text();
    if (!res.ok) {
      // Log provider detail server-side only.
      console.error(`[n8n] ${endpoint} ${res.status}: ${text.slice(0, 500)}`);
      throw new N8nError(
        res.status === 404
          ? "The AI backend workflow was not found."
          : "The AI backend returned an error.",
        res.status,
      );
    }
    return (text ? JSON.parse(text) : null) as T;
  } catch (error) {
    if (error instanceof N8nError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new N8nError("The AI backend timed out.");
    }
    console.error(`[n8n] ${endpoint} request failed`, error);
    throw new N8nError("Could not reach the AI backend.");
  } finally {
    clearTimeout(timer);
  }
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

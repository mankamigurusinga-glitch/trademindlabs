/**
 * Streaming chat proxy: POST /api/chat -> n8n `/webhook/chat`.
 *
 * Requires a Supabase bearer token. The webhook URL never reaches the browser.
 * Streams plain text chunks so the UI can render tokens as they arrive; falls
 * back to a single chunk when the webhook answers with JSON.
 */
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const bodySchema = z.object({
  message: z.string().trim().min(1).max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(8000),
      }),
    )
    .max(30)
    .optional(),
  symbol: z.string().max(20).optional(),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!token) return new Response("Unauthorized", { status: 401 });

        const supabase = createClient(
          process.env["SUPABASE_URL"]!,
          process.env["SUPABASE_PUBLISHABLE_KEY"]!,
          { auth: { persistSession: false, autoRefreshToken: false } },
        );
        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (userError || !userData.user) return new Response("Unauthorized", { status: 401 });

        let parsed: z.infer<typeof bodySchema>;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return new Response("Invalid request", { status: 400 });
        }

        const { isN8nConfigured, n8nStream, N8nError } = await import("@/lib/n8n.server");
        if (!isN8nConfigured()) {
          return new Response("The AI backend is not configured yet.", { status: 503 });
        }

        try {
          const upstream = await n8nStream("chat", {
            userId: userData.user.id,
            email: userData.user.email,
            message: parsed.message,
            history: parsed.history ?? [],
            symbol: parsed.symbol,
          });

          const contentType = upstream.headers.get("content-type") ?? "";
          if (contentType.includes("application/json")) {
            const { toChatText } = await import("@/lib/trademind-mappers.server");
            const text = toChatText(await upstream.json());
            return new Response(text, {
              headers: { "content-type": "text/plain; charset=utf-8" },
            });
          }

          return new Response(upstream.body, {
            headers: {
              "content-type": "text/plain; charset=utf-8",
              "cache-control": "no-store",
              "x-accel-buffering": "no",
            },
          });
        } catch (error) {
          const message =
            error instanceof N8nError ? error.message : "Could not reach the AI backend.";
          return new Response(message, { status: 502 });
        }
      },
    },
  },
});

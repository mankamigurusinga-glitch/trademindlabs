/**
 * Client hook for the streaming chat proxy at /api/chat.
 * Keeps history in localStorage so a reload restores the conversation.
 */
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ChatMessage } from "@/types";

const STORAGE_KEY = "trademind.chat.v1";

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    return Array.isArray(parsed) ? parsed.slice(-60) : [];
  } catch {
    return [];
  }
}

const newId = () => `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function useAtlasChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(loadHistory);
  const [status, setStatus] = React.useState<"idle" | "submitted" | "streaming">("idle");
  const [error, setError] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60)));
    } catch {
      /* storage full or unavailable — history is non-critical */
    }
  }, [messages]);

  const run = React.useCallback(async (text: string, history: ChatMessage[]) => {
    setError(null);
    setStatus("submitted");
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const assistantId = newId();
    try {
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        throw new Error("You appear to be offline. Reconnect and try again.");
      }
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Your session expired. Please sign in again.");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          history: history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(
          (await res.text().catch(() => "")) || "The AI backend is not responding right now.",
        );
      }

      setStatus("streaming");
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", createdAt: new Date().toISOString() },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
        );
      }
      if (!acc.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: "_No response was returned._" } : m,
          ),
        );
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content));
    } finally {
      setStatus("idle");
    }
  }, []);

  const send = React.useCallback(
    (text: string) => {
      const clean = text.trim().slice(0, 4000);
      if (!clean) return;
      const userMessage: ChatMessage = {
        id: newId(),
        role: "user",
        content: clean,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => {
        const next = [...prev, userMessage];
        void run(clean, prev);
        return next;
      });
    },
    [run],
  );

  const regenerate = React.useCallback(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === lastUser.id);
      const trimmed = idx >= 0 ? prev.slice(0, idx + 1) : prev;
      void run(lastUser.content, trimmed.slice(0, -1));
      return trimmed;
    });
  }, [messages, run]);

  const stop = React.useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
  }, []);

  const clear = React.useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setStatus("idle");
  }, []);

  return { messages, status, error, send, regenerate, stop, clear };
}

import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bot, Loader2, RefreshCw, Send, Sparkles, Square, Trash2, WifiOff } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Panel } from "@/components/app/common";
import { CopyButton, Markdown } from "@/components/app/Markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAtlasChat } from "@/hooks/use-atlas-chat";
import { cn } from "@/lib/utils";

const title = "Atlas AI Chat — TradeMind AI";
const description =
  "Ask Atlas AI about any crypto futures setup and get reasoning, probabilities and risk management in plain language.";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Explain the current BTC funding rate in simple terms.",
  "Is SOL showing a bullish continuation or exhaustion?",
  "How should I size a 5x ETH long with 1% account risk?",
  "What invalidates a long on XRP right now?",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: `${i * 140}ms` }}
        />
      ))}
    </div>
  );
}

function ChatPage() {
  const { messages, status, error, send, regenerate, stop, clear } = useAtlasChat();
  const [input, setInput] = React.useState("");
  const [online, setOnline] = React.useState(true);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const busy = status !== "idle";

  React.useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  React.useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy]);

  function submit(text = input) {
    if (!text.trim() || busy) return;
    send(text);
    setInput("");
  }

  return (
    <AppShell title="Atlas AI" subtitle="Reasoning-first crypto futures assistant">
      <Panel className="flex h-[calc(100vh-13rem)] min-h-[30rem] flex-col p-0">
        <header className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--gradient-brand)]">
              <Sparkles className="h-4 w-4 text-background" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Atlas AI</p>
              <p className="truncate text-xs text-muted-foreground">
                {online ? "Connected to your AI backend" : "Offline — reconnect to continue"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground">
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear
              </Button>
            )}
          </div>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 && (
            <div className="mx-auto max-w-lg space-y-6 py-8 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary/60">
                <Bot className="h-6 w-6 text-primary" />
              </span>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-semibold">
                  What setup should we break down?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Atlas explains reasoning, probability and risk — never blind buy or sell calls.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submit(s)}
                    className="glass-card rounded-xl px-3 py-3 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const isLast = i === messages.length - 1;
            return (
              <div
                key={m.id}
                className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
              >
                {!isUser && (
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-secondary/70">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </span>
                )}
                <div className={cn("min-w-0 max-w-[85%] space-y-2", isUser && "text-right")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-left",
                      isUser
                        ? "bg-primary/12 text-foreground"
                        : "glass-card text-muted-foreground",
                    )}
                  >
                    {isUser ? (
                      <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    ) : m.content ? (
                      <Markdown content={m.content} />
                    ) : (
                      <TypingIndicator />
                    )}
                  </div>
                  {!isUser && m.content && (
                    <div className="flex items-center gap-1">
                      <CopyButton value={m.content} />
                      {isLast && !busy && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={regenerate}
                          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Atlas is thinking…
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <footer className="border-t border-border/60 px-4 py-4 sm:px-6">
          {!online && (
            <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <WifiOff className="h-3.5 w-3.5" /> You are offline.
            </p>
          )}
          <div className="flex items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              rows={1}
              maxLength={4000}
              placeholder="Ask about a symbol, setup or risk plan…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              className="max-h-40 min-h-11 resize-none"
            />
            {busy ? (
              <Button type="button" variant="secondary" onClick={stop} aria-label="Stop response">
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => submit()}
                disabled={!input.trim() || !online}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-[0.7rem] text-muted-foreground">
            Atlas gives educational analysis, not financial advice.
          </p>
        </footer>
      </Panel>
    </AppShell>
  );
}

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  ArrowUpRight,
  Bell,
  Bookmark,
  CalendarClock,
  Lightbulb,
  PieChart as PieIcon,
  Plus,
  SendHorizontal,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/landing/ui";
import { Card } from "./Widgets";
import { chatSeed, portfolio, upcomingEvents } from "./data";

export function AtlasAssistant() {
  const [messages, setMessages] = React.useState(chatSeed);
  const [input, setInput] = React.useState("");

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [
      ...m,
      { role: "user" as const, text: q },
      {
        role: "assistant" as const,
        text: "Reading the live tape for that now — I'll come back with the score, the reasoning and the invalidation level in a moment.",
      },
    ]);
    setInput("");
  }

  return (
    <Reveal>
      <Card title="Atlas AI Assistant" icon={Sparkles}>
        <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                m.role === "assistant"
                  ? "border border-border/70 bg-secondary/35 text-muted-foreground"
                  : "ml-auto bg-primary/15 text-foreground",
              )}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["Why is SOL strong?", "Is BTC risky now?", "Explain funding"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-[0.7rem] text-muted-foreground transition-colors duration-300 hover:border-primary/35 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Atlas about any pair…"
            className="h-11 min-w-0 rounded-full border border-border bg-secondary/40 px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40"
          />
          <button
            type="submit"
            aria-label="Send"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </form>
      </Card>
    </Reveal>
  );
}

export function AISummary() {
  return (
    <Reveal>
      <Card title="Today's AI Summary" icon={Zap}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Risk appetite is improving. BTC holds above $68K with spot ETF inflows for a fourth
          session, while perp funding stays under 0.05% — the move is not leverage-driven yet.
          Altcoin strength is concentrated in SOL and LINK; meme pairs are unwinding.
        </p>
        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
          {[
            "11 pairs score above 80 — the most in nine days",
            "Volatility compresses into the 14:30 UTC CPI print",
            "Long liquidations cluster 3.8% below spot on majors",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="min-w-0">{t}</span>
            </li>
          ))}
        </ul>
      </Card>
    </Reveal>
  );
}

export function TradingTip() {
  return (
    <Reveal>
      <Card title="Trading Tip" icon={Lightbulb}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Size your position from your invalidation level, not from your conviction. If the setup
          fails at a 2% move, risking 1% of the account means a position of half your equity — not
          the whole of it.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Bookmark className="h-3.5 w-3.5 text-primary" />
          Academy · Risk Management, lesson 4
        </div>
      </Card>
    </Reveal>
  );
}

export function UpcomingEvents() {
  return (
    <Reveal>
      <Card title="Upcoming Economic Events" icon={CalendarClock}>
        <ul className="space-y-3">
          {upcomingEvents.map((e) => (
            <li
              key={e.label}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{e.label}</p>
                <p className="truncate text-xs text-muted-foreground">{e.when}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-medium",
                  e.impact === "High"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {e.impact}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </Reveal>
  );
}

export function PortfolioSummary() {
  return (
    <Reveal>
      <Card title="Portfolio Summary" icon={Wallet}>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="font-display text-2xl font-semibold tabular-nums">{portfolio.total}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
              <ArrowUpRight className="h-3 w-3" />
              {portfolio.change} today
            </p>
          </div>
          <div className="h-20 w-20 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolio.allocation}
                  dataKey="value"
                  innerRadius={26}
                  outerRadius={38}
                  paddingAngle={3}
                  stroke="none"
                  animationDuration={1200}
                >
                  {portfolio.allocation.map((a) => (
                    <Cell key={a.name} fill={a.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.16 0.012 285 / 0.95)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number, n: string) => [`${v}%`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {portfolio.allocation.map((a) => (
            <li key={a.name} className="flex items-center gap-2 text-xs">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: a.color }}
              />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{a.name}</span>
              <span className="shrink-0 tabular-nums">{a.value}%</span>
            </li>
          ))}
        </ul>
      </Card>
    </Reveal>
  );
}

const quickActions = [
  { label: "New analysis", icon: Sparkles },
  { label: "Add to watchlist", icon: Plus },
  { label: "Create alert", icon: Bell },
  { label: "Allocation report", icon: PieIcon },
];

export function QuickActions() {
  return (
    <Reveal>
      <Card title="Quick Actions" icon={Zap}>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((a) => (
            <button
              key={a.label}
              type="button"
              className="group flex flex-col items-start gap-2 rounded-2xl border border-border/70 bg-secondary/25 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35"
            >
              <a.icon className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium leading-snug">{a.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </Reveal>
  );
}

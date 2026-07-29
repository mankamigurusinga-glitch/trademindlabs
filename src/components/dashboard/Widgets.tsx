import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  ExternalLink,
  Flame,
  Gauge,
  Newspaper,
  ShieldAlert,
  Sparkles,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/landing/ui";
import {
  alerts,
  calendar,
  heatmap,
  highRisk,
  marketSeries,
  news,
  opportunities,
  rankings,
  statCards,
} from "./data";

/* ---------------------------------- shell --------------------------------- */

export function Card({
  title,
  icon: Icon,
  action,
  className,
  children,
}: {
  title?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("glass-card glass-sheen lift overflow-hidden p-5 sm:p-6", className)}>
      {title && (
        <header className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" />}
            <h2 className="truncate font-display text-[0.95rem] font-semibold">{title}</h2>
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

function Delta({ value, positive }: { value: string; positive: boolean }) {
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
        positive ? "bg-primary/12 text-primary" : "bg-destructive/15 text-destructive",
      )}
    >
      <Icon className="h-3 w-3" />
      {value}
    </span>
  );
}

const chartTooltip = {
  contentStyle: {
    background: "oklch(0.16 0.012 285 / 0.95)",
    border: "1px solid oklch(1 0 0 / 0.1)",
    borderRadius: 14,
    fontSize: 12,
    backdropFilter: "blur(12px)",
  },
  labelStyle: { color: "oklch(0.72 0.02 260)", marginBottom: 4 },
  itemStyle: { color: "oklch(0.98 0 0)" },
} as const;

/* --------------------------------- widgets -------------------------------- */

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((s, i) => (
        <Reveal key={s.key} delay={i * 70}>
          <article className="glass-card glass-sheen lift h-full p-5">
            <p className="truncate text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {s.label}
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
              <p className="font-display text-2xl font-semibold tabular-nums">
                {s.value}
              </p>
              <Delta value={s.change} positive={s.positive} />
            </div>
            <div className="mt-3 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.spark.map((v, idx) => ({ idx, v }))}>
                  <defs>
                    <linearGradient id={`sp-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={s.positive ? "var(--emerald)" : "var(--destructive)"}
                        stopOpacity={0.4}
                      />
                      <stop offset="100%" stopColor="transparent" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={s.positive ? "var(--emerald)" : "var(--destructive)"}
                    strokeWidth={1.8}
                    fill={`url(#sp-${s.key})`}
                    isAnimationActive
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 truncate text-xs text-muted-foreground">{s.sub}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function MarketOverview() {
  const [range, setRange] = React.useState("24H");
  return (
    <Reveal>
      <Card
        title="Market Overview"
        icon={Gauge}
        action={
          <div className="flex shrink-0 gap-1 rounded-full border border-border bg-secondary/30 p-1">
            {["24H", "7D", "30D"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300",
                  range === r
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-display text-3xl font-semibold tabular-nums">$68,412</span>
            <Delta value="+2.41%" positive />
            <span className="text-xs text-muted-foreground">BTC · Perpetual · {range}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground sm:justify-end">
            <span>
              ETH <span className="font-semibold text-foreground tabular-nums">$3,538</span>
            </span>
            <span>
              Funding <span className="font-semibold text-primary tabular-nums">0.042%</span>
            </span>
          </div>
        </div>

        <div className="mt-6 h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={marketSeries} margin={{ left: -18, right: 4, top: 4 }}>
              <defs>
                <linearGradient id="mo-btc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--emerald)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--emerald)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis
                dataKey="t"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "oklch(0.66 0.02 260)", fontSize: 11 }}
              />
              <YAxis
                domain={["dataMin - 400", "dataMax + 300"]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "oklch(0.66 0.02 260)", fontSize: 11 }}
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              />
              <Tooltip {...chartTooltip} formatter={(v: number) => [`$${v.toLocaleString()}`, "BTC"]} />
              <Area
                type="monotone"
                dataKey="btc"
                stroke="var(--emerald)"
                strokeWidth={2.2}
                fill="url(#mo-btc)"
                animationDuration={1400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketSeries} margin={{ left: -18, right: 4 }}>
              <XAxis dataKey="t" hide />
              <YAxis hide />
              <Tooltip {...chartTooltip} formatter={(v: number) => [`$${v}B`, "Volume"]} />
              <Bar dataKey="vol" radius={[4, 4, 0, 0]} fill="var(--electric)" fillOpacity={0.35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </Reveal>
  );
}

export function TopOpportunities() {
  return (
    <Reveal>
      <Card title="Top Opportunities" icon={Trophy}>
        <ul className="space-y-3">
          {opportunities.map((o) => (
            <li
              key={o.pair}
              className="rounded-2xl border border-border/70 bg-secondary/25 p-4 transition-colors duration-300 hover:border-primary/30"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/12 font-display text-xs font-semibold text-primary">
                    {o.score}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{o.pair}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {o.bias} · Confidence {o.conf}% · Risk {o.risk}
                    </p>
                  </div>
                </div>
                <Delta value={o.change} positive />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{o.note}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-[var(--gradient-brand)] transition-[width] duration-1000"
                  style={{ width: `${o.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </Reveal>
  );
}

export function HighRiskCoins() {
  return (
    <Reveal>
      <Card title="High Risk Coins" icon={ShieldAlert}>
        <ul className="space-y-3">
          {highRisk.map((h) => (
            <li
              key={h.pair}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/[0.06] p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{h.pair}</p>
                <p className="truncate text-xs text-muted-foreground">{h.reason}</p>
              </div>
              <div className="shrink-0 text-right">
                <Delta value={h.change} positive={false} />
                <p className="mt-1 text-[0.7rem] text-muted-foreground tabular-nums">
                  Score {h.score}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </Reveal>
  );
}

const toneStyles = {
  positive: "border-primary/30 text-primary",
  warning: "border-[oklch(0.8_0.15_90)]/35 text-[oklch(0.83_0.15_90)]",
  neutral: "border-border text-muted-foreground",
  negative: "border-destructive/35 text-destructive",
} as const;

export function LatestAlerts() {
  return (
    <Reveal>
      <Card title="Latest AI Alerts" icon={AlertTriangle}>
        <ol className="relative space-y-4 pl-5">
          <span className="absolute left-1.5 top-2 bottom-2 w-px bg-border" />
          {alerts.map((a) => (
            <li key={a.title} className="relative">
              <span
                className={cn(
                  "absolute -left-[1.05rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-background",
                  toneStyles[a.tone],
                )}
                style={{ borderColor: "currentColor" }}
              />
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <p className="min-w-0 text-sm font-medium">{a.title}</p>
                <span className="shrink-0 text-[0.7rem] text-muted-foreground">{a.time}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.body}</p>
            </li>
          ))}
        </ol>
      </Card>
    </Reveal>
  );
}

export function ScoreRankings() {
  return (
    <Reveal>
      <Card title="TradeMind Score Rankings" icon={Sparkles}>
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
                <th className="pb-3 pl-1 font-medium">Pair</th>
                <th className="pb-3 font-medium">Score</th>
                <th className="pb-3 font-medium">Confidence</th>
                <th className="pb-3 font-medium">Read</th>
                <th className="pb-3 pr-1 text-right font-medium">24h</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((r) => (
                <tr key={r.pair} className="border-t border-border/70">
                  <td className="py-3 pl-1 font-medium">{r.pair}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 tabular-nums">{r.score}</span>
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <span
                          className="block h-full rounded-full bg-[var(--gradient-brand)]"
                          style={{ width: `${r.score}%` }}
                        />
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground tabular-nums">{r.conf}%</td>
                  <td className="py-3 text-muted-foreground">{r.trend}</td>
                  <td className="py-3 pr-1 text-right">
                    <Delta value={r.change} positive={!r.change.startsWith("-")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Reveal>
  );
}

export function OpportunityMeter() {
  const value = 74;
  const segments = 28;
  const filled = Math.round((value / 100) * segments);
  return (
    <Reveal>
      <Card title="Opportunity Meter" icon={Flame}>
        <p className="text-xs leading-relaxed text-muted-foreground">
          How many high-quality setups the AI currently sees across 218 tracked pairs.
        </p>
        <div className="mt-6 flex items-end gap-1.5">
          {Array.from({ length: segments }).map((_, i) => (
            <span
              key={i}
              className="flex-1 rounded-full transition-all duration-700"
              style={{
                height: `${18 + (i / segments) * 44}px`,
                background:
                  i < filled
                    ? `color-mix(in oklab, var(--emerald) ${45 + (i / segments) * 55}%, var(--electric))`
                    : "oklch(1 0 0 / 0.07)",
                transitionDelay: `${i * 25}ms`,
              }}
            />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <p className="font-display text-3xl font-semibold tabular-nums">{value}/100</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Opportunity-rich · 11 setups scoring above 80
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Risk-on
          </span>
        </div>
      </Card>
    </Reveal>
  );
}

function heatColor(chg: number) {
  const mag = Math.min(Math.abs(chg) / 6, 1);
  return chg >= 0
    ? `color-mix(in oklab, var(--emerald) ${12 + mag * 60}%, transparent)`
    : `color-mix(in oklab, var(--destructive) ${12 + mag * 60}%, transparent)`;
}

export function Heatmap() {
  return (
    <Reveal>
      <Card title="Market Heatmap" icon={Gauge}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {heatmap.map((h) => (
            <div
              key={h.sym}
              className="rounded-xl border border-border/60 p-3 transition-transform duration-300 hover:scale-[1.04]"
              style={{ background: heatColor(h.chg) }}
            >
              <p className="truncate text-xs font-semibold">{h.sym}</p>
              <p className="mt-1 text-xs tabular-nums text-foreground/85">
                {h.chg > 0 ? "+" : ""}
                {h.chg.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </Card>
    </Reveal>
  );
}

export function EconomicCalendar() {
  return (
    <Reveal>
      <Card title="Economic Calendar" icon={CalendarClock}>
        <ul className="space-y-3">
          {calendar.map((c) => (
            <li
              key={c.event}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/70 bg-secondary/25 p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.event}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.time} · Forecast {c.forecast} · Previous {c.prev}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-medium",
                  c.impact === "High"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {c.impact}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </Reveal>
  );
}

export function CryptoNews() {
  return (
    <Reveal>
      <Card title="Latest Crypto News" icon={Newspaper}>
        <ul className="space-y-3">
          {news.map((n) => (
            <li key={n.title}>
              <a
                href="#"
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/70 bg-secondary/25 p-4 transition-colors duration-300 hover:border-primary/30"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium group-hover:text-primary">
                    {n.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {n.source} · {n.time} · {n.tag}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </Reveal>
  );
}

export function MiniTrendChart() {
  return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={marketSeries}>
          <Line
            type="monotone"
            dataKey="eth"
            stroke="var(--electric)"
            strokeWidth={2}
            dot={false}
          />
          <Tooltip {...chartTooltip} formatter={(v: number) => [`$${v}`, "ETH"]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export { Cell };

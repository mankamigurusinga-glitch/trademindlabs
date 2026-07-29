import {
  Bell,
  BookOpen,
  Brain,
  Gauge,
  LineChart,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Action, Section, SectionLabel } from "./ui";

const features = [
  {
    icon: Brain,
    title: "AI Trade Analysis",
    body: "AI explains every opportunity instead of simply giving signals.",
  },
  {
    icon: Gauge,
    title: "TradeMind Score",
    body: "A proprietary score from 0–100 measuring market quality.",
  },
  {
    icon: LineChart,
    title: "Institutional Insights",
    body: "Professional market analysis using multiple indicators.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    body: "Receive alerts only when high-quality opportunities appear.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    body: "Ask AI questions about any cryptocurrency.",
  },
  {
    icon: BookOpen,
    title: "Trading Academy",
    body: "Learn while you trade.",
  },
];

export function Features() {
  return (
    <Section id="features">
      <div className="max-w-2xl">
        <SectionLabel>Features</SectionLabel>
        <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
          Everything you need to understand the market
        </h2>
        <p className="mt-4 text-muted-foreground">
          Six tools working together to turn raw derivatives data into an explanation you can act
          on.
        </p>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <article
            key={f.title}
            className="glass-card group p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary transition-colors group-hover:bg-primary/20">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-6 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

const steps = [
  {
    title: "Choose a cryptocurrency",
    body: "Pick any major futures pair — BTC, ETH, SOL and 200+ more.",
  },
  {
    title: "TradeMind AI runs the analysis",
    body: "Technical indicators, derivatives data and market sentiment are processed together.",
  },
  {
    title: "Receive your TradeMind Score",
    body: "A 0–100 score with a written AI explanation, confidence level and risk profile.",
  },
  {
    title: "Trade with better understanding",
    body: "Enter, wait or skip — with the reasoning behind the decision in plain language.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <div className="max-w-2xl">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">From market noise to clarity</h2>
      </div>
      <ol className="relative mt-14 space-y-4 border-l border-border pl-8 sm:pl-12">
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="absolute -left-8 top-6 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-border bg-surface-2 text-xs font-semibold text-primary sm:-left-12">
              {i + 1}
            </span>
            <div className="glass-card p-6 transition-colors hover:border-primary/25 sm:p-7">
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const metrics = [
  { label: "Status", value: "Strong Bullish", tone: "text-primary" },
  { label: "Confidence", value: "92%", tone: "text-electric" },
  { label: "Risk", value: "Low", tone: "text-primary" },
];

export function LiveDemo() {
  return (
    <Section id="demo">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
        <div>
          <SectionLabel>Live analysis</SectionLabel>
          <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
            See exactly what the AI sees
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every card pairs a score with the reasoning behind it — open interest, funding rate,
            momentum and the levels that matter right now.
          </p>
        </div>

        <div className="glass-card relative overflow-hidden p-7 sm:p-9">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-25 blur-3xl"
            style={{ background: "var(--gradient-brand)" }}
          />
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                ₿
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold">BTCUSDT</p>
                <p className="text-xs text-muted-foreground">Perpetual · 4H timeframe</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Live
            </span>
          </div>

          <div className="mt-8 flex items-end gap-3">
            <p className="font-display text-6xl font-semibold leading-none text-gradient">91</p>
            <p className="pb-1.5 text-sm text-muted-foreground">/ 100 TradeMind Score</p>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[91%] rounded-full" style={{ background: "var(--gradient-brand)" }} />
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-border bg-secondary/30 p-4">
                <dt className="text-xs text-muted-foreground">{m.label}</dt>
                <dd className={`mt-1 text-sm font-semibold ${m.tone}`}>{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-2xl border border-border bg-secondary/20 p-5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              AI Summary
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              Momentum remains positive with increasing Open Interest and healthy Funding Rate.
              Watch the resistance level before entering new positions.
            </p>
          </div>

          <Action className="mt-7 w-full" size="lg">
            View Full Analysis
            <ArrowRight className="h-4 w-4" />
          </Action>
        </div>
      </div>
    </Section>
  );
}

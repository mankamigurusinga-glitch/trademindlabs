import {
  Bell,
  BookOpen,
  Brain,
  Gauge,
  LineChart,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Action, Reveal, ScoreRing, Section, SectionHeading } from "./ui";

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
      <SectionHeading
        label="Features"
        title="Everything you need to understand the market"
        body="Six tools working together to turn raw derivatives data into an explanation you can act on."
      />
      <div className="mt-18 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 90}>
            <article className="glass-card glass-sheen lift group h-full p-8 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary transition-colors duration-500 group-hover:bg-primary/20">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-8 text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          </Reveal>
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
      <SectionHeading label="How it works" title="From market noise to clarity" />
      <ol className="relative mt-18 space-y-5 border-l border-border pl-8 sm:pl-14">
        {steps.map((s, i) => (
          <Reveal key={s.title} as="li" delay={i * 90} className="relative">
            <span className="absolute -left-8 top-8 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border border-border bg-surface-2 text-xs font-semibold text-primary backdrop-blur-xl sm:-left-14">
              {i + 1}
            </span>
            <div className="glass-card glass-sheen lift p-8 sm:p-10">
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </Reveal>
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
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20">
        <SectionHeading
          label="Live analysis"
          title="See exactly what the AI sees"
          body="Every card pairs a score with the reasoning behind it — open interest, funding rate, momentum and the levels that matter right now."
        />

        <Reveal delay={120}>
          <div className="glass-card glass-sheen relative overflow-hidden p-8 sm:p-11">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full opacity-25 blur-[70px]"
              style={{ background: "var(--gradient-brand)" }}
            />
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  ₿
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold">BTCUSDT</p>
                  <p className="text-xs text-muted-foreground">Perpetual · 4H timeframe</p>
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
                Live
              </span>
            </div>

            <div className="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10">
              <ScoreRing value={91} size={188} />
              <dl className="grid w-full flex-1 gap-3">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-secondary/25 px-5 py-4"
                  >
                    <dt className="truncate text-xs text-muted-foreground">{m.label}</dt>
                    <dd className={`shrink-0 text-sm font-semibold ${m.tone}`}>{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8 rounded-3xl border border-border bg-secondary/20 p-6">
              <p className="text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                AI Summary
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                Momentum remains positive with increasing Open Interest and healthy Funding Rate.
                Watch the resistance level before entering new positions.
              </p>
            </div>

            <Action className="mt-8 w-full" size="lg" href="/auth">
              View Full Analysis
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/action:translate-x-1" />
            </Action>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

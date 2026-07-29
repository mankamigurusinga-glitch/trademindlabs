import { Activity, ArrowUpRight, Check, Minus, Quote, X } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./ui";

/* ------------------------------- Live market ------------------------------ */

const markets = [
  { pair: "BTCUSDT", price: "67,842.30", change: "+1.87%", up: true, score: 91, oi: "29.4B" },
  { pair: "ETHUSDT", price: "3,142.18", change: "+2.35%", up: true, score: 84, oi: "12.1B" },
  { pair: "SOLUSDT", price: "154.87", change: "+3.41%", up: true, score: 78, oi: "3.9B" },
  { pair: "XRPUSDT", price: "0.5218", change: "-0.94%", up: false, score: 46, oi: "1.2B" },
  { pair: "AVAXUSDT", price: "27.64", change: "-1.28%", up: false, score: 39, oi: "742M" },
];

export function LiveMarketStatus() {
  return (
    <Section id="market">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-end">
        <SectionHeading
          label="Live market status"
          title="The market, scored in real time"
          body="TradeMind continuously re-scores every pair as derivatives data shifts. Quality first — not constant signals."
        />
        <Reveal
          delay={100}
          className="flex items-center gap-3 rounded-full border border-border bg-secondary/25 px-5 py-3 text-sm text-muted-foreground backdrop-blur-xl lg:justify-self-end"
        >
          <span className="pulse-dot h-2 w-2 rounded-full bg-primary" />
          Market regime: <span className="font-medium text-foreground">Risk-on</span>
          <span className="hidden text-muted-foreground/50 sm:inline">·</span>
          <span className="hidden sm:inline">Updated 4s ago</span>
        </Reveal>
      </div>

      <Reveal delay={120} className="glass-card glass-sheen mt-14 overflow-hidden">
        <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_1fr_1.4fr] gap-4 border-b border-border px-7 py-4 text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase md:grid">
          <span>Pair</span>
          <span>Last price</span>
          <span>24h</span>
          <span>Open interest</span>
          <span>TradeMind Score</span>
        </div>
        <ul>
          {markets.map((m) => (
            <li
              key={m.pair}
              className="grid grid-cols-2 items-center gap-x-4 gap-y-3 border-b border-border/60 px-6 py-5 transition-colors last:border-0 hover:bg-secondary/25 md:grid-cols-[1.2fr_1fr_0.8fr_1fr_1.4fr] md:gap-4 md:px-7"
            >
              <span className="min-w-0 truncate font-display text-sm font-semibold">{m.pair}</span>
              <span className="text-right text-sm tabular-nums md:text-left">{m.price}</span>
              <span
                className={`text-sm tabular-nums ${m.up ? "text-primary" : "text-destructive"}`}
              >
                {m.change}
              </span>
              <span className="text-right text-sm tabular-nums text-muted-foreground md:text-left">
                {m.oi}
              </span>
              <div className="col-span-2 flex items-center gap-3 md:col-span-1">
                <div className="h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${m.score}%`,
                      background:
                        m.score >= 70 ? "var(--gradient-brand)" : "color-mix(in oklab, var(--muted-foreground) 70%, transparent)",
                    }}
                  />
                </div>
                <span className="w-8 shrink-0 text-sm font-medium tabular-nums">{m.score}</span>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
      <p className="mt-6 text-xs text-muted-foreground/70">
        Illustrative market data shown for demonstration.
      </p>
    </Section>
  );
}

/* ------------------------------ Testimonials ------------------------------ */

const testimonials = [
  {
    quote:
      "I stopped chasing calls from Telegram groups. Seeing why a setup scores 88 — funding, open interest, the levels — changed how I size positions.",
    name: "Marco Ferreira",
    role: "Futures trader, 3 years",
    initials: "MF",
  },
  {
    quote:
      "The risk section is what sold me. It tells me when a trade is technically valid but not worth the drawdown, and it's usually right to wait.",
    name: "Aisha Rahman",
    role: "Part-time swing trader",
    initials: "AR",
  },
  {
    quote:
      "As a beginner I finally understand the vocabulary. Every analysis reads like a mentor explaining the chart instead of shouting an entry.",
    name: "Daniel Okafor",
    role: "New to derivatives",
    initials: "DO",
  },
  {
    quote:
      "Alerts are rare, which is the point. I get two or three a week and each one comes with reasoning I can verify myself.",
    name: "Lena Hoffmann",
    role: "Quant-curious retail trader",
    initials: "LH",
  },
];

export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading
        label="Testimonials"
        title="Traders who wanted reasons, not calls"
        align="center"
      />
      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 90}>
            <article className="glass-card glass-sheen lift h-full p-8 sm:p-10">
              <Quote className="h-5 w-5 text-primary/70" />
              <p className="mt-6 text-pretty text-base leading-relaxed text-foreground/90">
                “{t.quote}”
              </p>
              <div className="mt-8 flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-secondary/50 text-xs font-semibold text-primary">
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------- Comparison ------------------------------- */

const rows = [
  { label: "Explains the reasoning behind every call", tm: true, sig: false },
  { label: "Risk and invalidation defined before entry", tm: true, sig: "partial" },
  { label: "Consistent 0–100 quality score across pairs", tm: true, sig: false },
  { label: "Derivatives data: funding, OI, liquidations", tm: true, sig: false },
  { label: "Alerts only on high-quality setups", tm: true, sig: false },
  { label: "Teaches you to read the market yourself", tm: true, sig: false },
  { label: "No hype, no performance screenshots", tm: true, sig: false },
];

function Cell({ state }: { state: boolean | "partial" }) {
  if (state === true)
    return (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">
        <Check className="h-4 w-4" />
      </span>
    );
  if (state === "partial")
    return (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Minus className="h-4 w-4" />
      </span>
    );
  return (
    <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-muted-foreground/60">
      <X className="h-4 w-4" />
    </span>
  );
}

export function Comparison() {
  return (
    <Section id="comparison">
      <SectionHeading
        label="The difference"
        title="Not another signal group"
        body="Signal groups sell certainty. TradeMind AI gives you the analysis, the probability and the risk — then lets you decide."
      />

      <Reveal delay={120} className="glass-card glass-sheen mt-16 overflow-hidden">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-border px-6 py-6 sm:px-9">
          <span className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Capability
          </span>
          <span className="flex w-24 shrink-0 items-center justify-center gap-1.5 text-center text-xs font-semibold text-primary sm:w-32">
            <Activity className="h-3.5 w-3.5" /> TradeMind
          </span>
          <span className="w-24 shrink-0 text-center text-xs text-muted-foreground sm:w-32">
            Signal groups
          </span>
        </div>
        <ul>
          {rows.map((r) => (
            <li
              key={r.label}
              className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-border/60 px-6 py-5 transition-colors last:border-0 hover:bg-secondary/20 sm:px-9"
            >
              <span className="text-sm text-foreground/90">{r.label}</span>
              <span className="flex w-24 justify-center sm:w-32">
                <Cell state={r.tm} />
              </span>
              <span className="flex w-24 justify-center sm:w-32">
                <Cell state={r.sig as boolean | "partial"} />
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={200} className="mt-8">
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUpRight className="h-4 w-4 text-primary" />
          Every TradeMind analysis is auditable — you can check each input yourself.
        </p>
      </Reveal>
    </Section>
  );
}

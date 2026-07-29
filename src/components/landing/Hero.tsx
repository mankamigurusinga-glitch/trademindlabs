import { Play, ShieldCheck, Sparkles } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard-v2.jpg";
import { Action, Reveal } from "./ui";

const stats = [
  { value: "0–100", label: "TradeMind Score" },
  { value: "200+", label: "Futures pairs" },
  { value: "24/7", label: "Market monitoring" },
  { value: "18", label: "Data signals fused" },
];

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-8 md:pb-32 md:pt-48"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="mx-auto w-full max-w-6xl">
        <div className="reveal mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-4 py-2 text-xs text-muted-foreground backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Transparent AI analysis for crypto futures
          </span>
          <h1 className="mt-8 text-balance text-[3.25rem] font-semibold leading-[0.98] sm:text-7xl md:text-[5.75rem] lg:text-[6.5rem]">
            Trade Smarter
            <br className="hidden sm:block" /> <span className="text-gradient">with AI</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-xl sm:leading-relaxed">
            Understand the crypto market before you trade. TradeMind AI analyzes market data,
            explains every opportunity, and helps traders make informed decisions using transparent
            AI analysis.
          </p>
          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Action size="lg" className="w-full sm:w-auto">
              Start Free
            </Action>
            <Action variant="ghostline" size="lg" className="w-full sm:w-auto">
              <Play className="h-4 w-4" />
              Watch Demo
            </Action>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            No card required · Educational analysis, not financial advice
          </p>
        </div>

        <div className="reveal relative mt-20 md:mt-28" style={{ animationDelay: "160ms" }}>
          <div
            aria-hidden
            className="absolute -inset-x-16 -top-16 bottom-16 -z-10 rounded-[4rem] opacity-40 blur-[90px]"
            style={{ background: "var(--gradient-brand)" }}
          />
          <div className="glass-card glass-sheen overflow-hidden p-1.5 sm:p-2.5">
            <img
              src={heroDashboard}
              alt="TradeMind AI dashboard: BTC/USDT chart with liquidation heatmap, funding rate, AI reasoning panel and a TradeMind Score of 91"
              width={1920}
              height={1200}
              className="w-full rounded-[calc(var(--radius-3xl)-0.4rem)]"
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border/60 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="bg-background/60 backdrop-blur-xl">
              <div className="px-5 py-8 text-center">
                <p className="font-display text-2xl font-semibold sm:text-3xl">{s.value}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const partners = [
  "Binance Futures",
  "Bybit",
  "OKX",
  "Coinbase Advanced",
  "Kraken Pro",
  "Deribit",
  "Bitget",
  "Hyperliquid",
];

export function SocialProof() {
  return (
    <section className="overflow-hidden px-5 py-20 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <h2 className="text-center text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
            Built for the Next Generation of Crypto Traders
          </h2>
        </Reveal>
      </div>
      <div className="relative mt-12 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track flex w-max gap-3">
          {[...partners, ...partners].map((p, i) => (
            <div
              key={`${p}-${i}`}
              className="flex h-16 w-48 shrink-0 items-center justify-center rounded-2xl border border-border bg-secondary/20 px-4 text-center text-xs font-medium text-muted-foreground backdrop-blur-xl"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground/70">
        Exchange integrations on the roadmap. Logos shown as future partners.
      </p>
    </section>
  );
}

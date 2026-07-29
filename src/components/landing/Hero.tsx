import { Play, ShieldCheck, Sparkles } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import { Action } from "./ui";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 md:pb-24 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="mx-auto w-full max-w-6xl">
        <div className="reveal mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Transparent AI analysis for crypto futures
          </span>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] sm:text-6xl md:text-7xl">
            Trade Smarter <span className="text-gradient">with AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Understand the crypto market before you trade. TradeMind AI analyzes market data,
            explains every opportunity, and helps traders make informed decisions using transparent
            AI analysis.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Action size="lg" className="w-full sm:w-auto">
              Start Free
            </Action>
            <Action variant="ghostline" size="lg" className="w-full sm:w-auto">
              <Play className="h-4 w-4" />
              Watch Demo
            </Action>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            No card required · Educational analysis, not financial advice
          </p>
        </div>

        <div className="reveal relative mt-16 md:mt-20" style={{ animationDelay: "120ms" }}>
          <div
            aria-hidden
            className="absolute -inset-x-10 -top-10 bottom-10 -z-10 rounded-[3rem] opacity-40 blur-3xl"
            style={{ background: "var(--gradient-brand)" }}
          />
          <div className="glass-card overflow-hidden p-1.5 sm:p-2">
            <img
              src={heroDashboard}
              alt="TradeMind AI dashboard showing BTC/USDT chart, AI analysis and TradeMind Score of 91"
              width={1600}
              height={1104}
              className="w-full rounded-[calc(var(--radius-2xl)-0.35rem)]"
            />
          </div>
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
];

export function SocialProof() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Built for the Next Generation of Crypto Traders
        </h2>
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            <div
              key={p}
              className="flex h-16 items-center justify-center rounded-2xl border border-border bg-secondary/25 px-3 text-center text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {p}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          Exchange integrations on the roadmap. Logos shown as future partners.
        </p>
      </div>
    </section>
  );
}

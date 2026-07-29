import { Check, Eye, GraduationCap, Landmark, ShieldAlert } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Action, Reveal, Section, SectionHeading } from "./ui";

const reasons = [
  { icon: Eye, title: "Transparent AI", body: "Every analysis explains why." },
  { icon: ShieldAlert, title: "Risk First", body: "Understand risk before entering a trade." },
  {
    icon: GraduationCap,
    title: "Built for Beginners",
    body: "Professional analysis in simple language.",
  },
  {
    icon: Landmark,
    title: "Institutional Quality",
    body: "Professional market insights powered by AI.",
  },
];

export function WhyTradeMind() {
  return (
    <Section id="why">
      <SectionHeading label="Why TradeMind AI" title="Built on reasoning, not on hype" />
      <div className="mt-18 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r, i) => (
          <Reveal key={r.title} delay={i * 90}>
            <article className="glass-card glass-sheen lift h-full p-8 sm:p-9">
              <r.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-8 text-xl font-semibold">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const plans = [
  {
    name: "Free",
    price: "$0",
    note: "Forever",
    desc: "Learn how AI analysis works.",
    features: ["3 analyses per day", "TradeMind Score on BTC & ETH", "Trading Academy basics"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$39",
    note: "per month",
    desc: "For active futures traders.",
    features: [
      "Unlimited AI analyses",
      "200+ futures pairs",
      "Real-time high-quality alerts",
      "AI Chat Assistant",
    ],
    cta: "Start 7-Day Trial",
    featured: true,
  },
  {
    name: "Elite",
    price: "$99",
    note: "per month",
    desc: "Institutional depth and speed.",
    features: [
      "Everything in Pro",
      "Derivatives & order-flow deep dive",
      "Custom alert conditions",
      "Priority support",
    ],
    cta: "Talk to Us",
    featured: false,
  },
];

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        label="Pricing"
        title="Simple plans, serious analysis"
        align="center"
      />
      <div className="mt-18 grid gap-4 lg:grid-cols-3 lg:items-center">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 100} className="h-full">
            <article
              className={`glass-card glass-sheen relative flex h-full flex-col p-9 sm:p-10 ${
                p.featured ? "border-primary/35 shadow-[var(--shadow-glow)] lg:scale-[1.04]" : "lift"
              }`}
            >
              {p.featured && (
                <span className="absolute right-7 top-8 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                  Recommended
                </span>
              )}
              <h3 className="font-display text-lg font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-9 flex items-end gap-2">
                <span className="font-display text-5xl font-semibold">{p.price}</span>
                <span className="pb-1.5 text-xs text-muted-foreground">{p.note}</span>
              </div>
              <ul className="mt-9 space-y-3.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Action
                variant={p.featured ? "primary" : "ghostline"}
                size="lg"
                className="mt-10 w-full"
              >
                {p.cta}
              </Action>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200} className="mt-12 text-center">
        <Action variant="quiet" size="md">
          See Full Pricing →
        </Action>
      </Reveal>
    </Section>
  );
}

const faqs = [
  {
    q: "What is TradeMind AI?",
    a: "TradeMind AI is an AI-powered crypto futures analysis platform. Instead of pushing buy or sell signals, it studies market data and explains each opportunity — the reasoning, the probability, the confidence level and the risk involved.",
  },
  {
    q: "How does TradeMind Score work?",
    a: "The score runs from 0 to 100 and measures market quality for a given pair and timeframe. It blends technical indicators, derivatives data such as open interest and funding rate, volatility and market sentiment into one number, always shown alongside the explanation behind it.",
  },
  {
    q: "Is this financial advice?",
    a: "No. TradeMind AI is an educational and analytical tool. It never manages funds or places trades for you, and every decision remains yours. Crypto futures carry substantial risk.",
  },
  {
    q: "Can beginners use it?",
    a: "Yes — that is who we built it for. Every analysis is written in plain language, risk is explained before entry, and the Trading Academy teaches the concepts behind each indicator as you go.",
  },
  {
    q: "Does it support multiple exchanges?",
    a: "TradeMind AI aggregates market and derivatives data across major venues including Binance Futures, Bybit, OKX and Deribit, so your analysis reflects the whole market rather than one order book.",
  },
];

export function FAQ() {
  return (
    <Section id="faq">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <SectionHeading label="FAQ" title="Questions, answered" />
        <Reveal delay={100}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-border">
                <AccordionTrigger className="py-6 text-left font-display text-base font-medium hover:no-underline sm:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-7 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}

export function FinalCTA() {
  return (
    <Section className="relative">
      <Reveal>
        <div className="glass-card glass-sheen relative overflow-hidden px-6 py-24 text-center sm:px-16 sm:py-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-40"
            style={{ background: "var(--gradient-hero)" }}
          />
          <h2 className="text-balance text-4xl font-semibold leading-[1.02] sm:text-6xl md:text-7xl">
            Ready to Trade Smarter?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-muted-foreground sm:text-lg">
            Join traders who want to understand the market before taking a position.
          </p>
          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Action size="lg" className="w-full sm:w-auto">
              Start Free
            </Action>
            <Action variant="ghostline" size="lg" className="w-full sm:w-auto">
              Watch Demo
            </Action>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

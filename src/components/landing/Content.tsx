import { Check, Eye, GraduationCap, Landmark, ShieldAlert } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Action, Section, SectionLabel } from "./ui";

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
      <div className="max-w-2xl">
        <SectionLabel>Why TradeMind AI</SectionLabel>
        <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
          Built on reasoning, not on hype
        </h2>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <article key={r.title} className="glass-card p-7 transition-all hover:-translate-y-1">
            <r.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-6 text-lg font-semibold">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
          </article>
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
      <div className="max-w-2xl">
        <SectionLabel>Pricing</SectionLabel>
        <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">Simple plans, serious analysis</h2>
      </div>
      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.name}
            className={`glass-card relative flex flex-col p-8 ${p.featured ? "border-primary/35 lg:-mt-4 lg:mb-[-1rem]" : ""}`}
          >
            {p.featured && (
              <span className="absolute right-6 top-6 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                Recommended
              </span>
            )}
            <h3 className="font-display text-lg font-semibold">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <div className="mt-7 flex items-end gap-2">
              <span className="font-display text-4xl font-semibold">{p.price}</span>
              <span className="pb-1 text-xs text-muted-foreground">{p.note}</span>
            </div>
            <ul className="mt-7 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Action
              variant={p.featured ? "primary" : "ghostline"}
              size="lg"
              className="mt-9 w-full"
            >
              {p.cta}
            </Action>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Action variant="quiet" size="md">
          See Full Pricing →
        </Action>
      </div>
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
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">Questions, answered</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-border">
              <AccordionTrigger className="text-left font-display text-base font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

export function FinalCTA() {
  return (
    <Section className="relative">
      <div className="glass-card relative overflow-hidden px-6 py-20 text-center sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
          style={{ background: "var(--gradient-hero)" }}
        />
        <h2 className="text-balance text-4xl font-semibold sm:text-6xl">Ready to Trade Smarter?</h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          Join traders who want to understand the market before taking a position.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Action size="lg" className="w-full sm:w-auto">
            Start Free
          </Action>
          <Action variant="ghostline" size="lg" className="w-full sm:w-auto">
            Watch Demo
          </Action>
        </div>
      </div>
    </Section>
  );
}

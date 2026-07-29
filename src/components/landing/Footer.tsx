import { Github, Linkedin, Send, Twitter } from "lucide-react";

const columns = [
  { title: "Product", links: ["Features", "Pricing", "How It Works", "Trading Academy"] },
  { title: "Company", links: ["About", "Contact", "Careers", "Blog"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Risk Disclosure"] },
];

const socials = [
  { icon: Twitter, label: "X" },
  { icon: Send, label: "Telegram" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Github, label: "GitHub" },
];

export function Footer() {
  return (
    <footer id="contact" className="hairline px-5 py-16 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 17l5-6 4 4 5-8 4 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-display text-base font-semibold">TradeMind AI</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Transparent AI analysis for crypto futures. Understand the market before you trade.
          </p>
          <a
            href="mailto:hello@trademind.ai"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            hello@trademind.ai
          </a>
          <div className="mt-6 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#contact"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {c.title}
              </p>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#home"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 flex w-full max-w-6xl flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} TradeMind AI. All rights reserved.</p>
        <p>Crypto futures involve significant risk. Analysis is educational, not financial advice.</p>
      </div>
    </footer>
  );
}

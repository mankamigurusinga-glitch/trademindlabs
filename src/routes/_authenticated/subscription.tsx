import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, CreditCard, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, ListSkeleton, Panel } from "@/components/app/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-backend-data";

const title = "Subscription — TradeMind AI";
const description =
  "Review your TradeMind AI plan, monthly AI analysis usage, renewal date and included features.";

export const Route = createFileRoute("/_authenticated/subscription")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SubscriptionPage,
});

const PLANS = [
  {
    name: "Free",
    price: "$0",
    blurb: "Learn the reasoning framework.",
    features: ["10 AI analyses / month", "Reasoning summaries", "Community alerts"],
  },
  {
    name: "Pro",
    price: "$39",
    blurb: "For active futures traders.",
    features: [
      "500 AI analyses / month",
      "Atlas AI chat",
      "Real-time alert center",
      "Trading journal analytics",
    ],
    highlight: true,
  },
  {
    name: "Elite",
    price: "$99",
    blurb: "Desk-grade coverage.",
    features: [
      "Unlimited AI analyses",
      "Priority backend queue",
      "Telegram alert delivery",
      "Portfolio risk reviews",
    ],
  },
];

function SubscriptionPage() {
  const { data, isLoading } = useSubscription();
  const sub = data?.subscription;
  const used = sub?.analysesUsed ?? 0;
  const limit = sub?.analysesLimit ?? 0;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <AppShell title="Subscription" subtitle="Plan, usage and billing status">
      {data?.backendError && (
        <p className="mb-4 rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">
          Showing your default plan — {data.backendError}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Current plan" icon={CreditCard}>
          {isLoading ? (
            <ListSkeleton rows={3} />
          ) : sub ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-3xl font-semibold">{sub.plan}</span>
                <Badge variant={sub.status === "active" ? "default" : "secondary"}>
                  {sub.status}
                </Badge>
                {sub.renewsAt && (
                  <span className="text-xs text-muted-foreground">
                    Renews {new Date(sub.renewsAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>AI analyses this month</span>
                  <span className="font-medium text-foreground">
                    {used}
                    {limit > 0 ? ` / ${limit}` : ""}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-[var(--gradient-brand)] transition-[width] duration-700"
                    style={{ width: `${limit > 0 ? pct : 100}%` }}
                  />
                </div>
              </div>

              {sub.features.length > 0 && (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {sub.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to="/chat">
                    <Sparkles className="mr-2 h-4 w-4" /> Open Atlas AI
                  </Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/analysis">
                    Run an analysis <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={CreditCard}
              title="No plan information"
              body="Your subscription details will appear once the backend responds."
            />
          )}
        </Panel>

        <Panel title="Upgrade options" icon={Zap}>
          <div className="space-y-3">
            {PLANS.map((plan) => {
              const current = sub?.plan?.toLowerCase() === plan.name.toLowerCase();
              return (
                <div
                  key={plan.name}
                  className={
                    "rounded-2xl border p-4 transition-colors " +
                    (plan.highlight ? "border-primary/40 bg-primary/5" : "border-border/70")
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-sm font-semibold">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{plan.price}</span>/mo
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{plan.blurb}</p>
                  <ul className="mt-3 space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    variant={current ? "secondary" : plan.highlight ? "default" : "outline"}
                    className="mt-4 w-full"
                    disabled={current}
                  >
                    {current ? "Current plan" : `Choose ${plan.name}`}
                  </Button>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

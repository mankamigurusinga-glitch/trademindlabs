import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bell,
  BookOpen,
  LineChart as LineIcon,
  Sparkles,
  Star,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, ListSkeleton, Metric, Panel } from "@/components/app/common";
import {
  CryptoNews,
  EconomicCalendar,
  Heatmap,
  HighRiskCoins,
  MarketOverview,
  OpportunityMeter,
  ScoreRankings,
  StatCards,
  TopOpportunities,
} from "@/components/dashboard/Widgets";
import {
  AISummary,
  AtlasAssistant,
  TradingTip,
  UpcomingEvents,
} from "@/components/dashboard/Rail";
import { useAlerts, useJournal, useWatchlist } from "@/hooks/use-app-data";
import { computeJournalStats, formatMoney } from "@/lib/journal-stats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const title = "Dashboard — TradeMind AI";
const description =
  "Your AI crypto futures workspace: portfolio overview, market data, AI signal summary, alerts, performance, watchlist and journal in one place.";

export const Route = createFileRoute("/_authenticated/dashboard")({
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
  component: DashboardPage,
});

function PortfolioOverview() {
  const { data, isLoading } = useJournal();
  const stats = computeJournalStats(data ?? []);

  return (
    <Panel title="Portfolio overview" icon={Wallet}>
      {isLoading ? (
        <ListSkeleton rows={2} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric
            label="Net P&L"
            value={formatMoney(stats.netPnl)}
            tone={stats.netPnl >= 0 ? "positive" : "negative"}
          />
          <Metric label="Win rate" value={`${stats.winRate}%`} />
          <Metric label="Closed trades" value={stats.closed} />
          <Metric label="Open positions" value={stats.open} />
        </div>
      )}
    </Panel>
  );
}

function PerformanceChart() {
  const { data } = useJournal();
  const stats = computeJournalStats(data ?? []);

  return (
    <Panel title="Trading performance" icon={TrendingUp}>
      {stats.equityCurve.length < 2 ? (
        <EmptyState
          icon={LineIcon}
          title="Not enough closed trades yet"
          body="Log at least two closed trades in the journal to see your equity curve."
          action={
            <Button asChild size="sm" variant="outline">
              <Link to="/journal">Open journal</Link>
            </Button>
          }
        />
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.equityCurve}>
              <defs>
                <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} width={48} fontSize={11} />
              <RTooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#equityFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}

function WatchlistPreview() {
  const { data, isLoading } = useWatchlist();
  const items = (data ?? []).slice(0, 5);

  return (
    <Panel
      title="Watchlist"
      icon={Star}
      action={
        <Button asChild size="sm" variant="ghost">
          <Link to="/watchlist">Manage</Link>
        </Button>
      }
    >
      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Your watchlist is empty"
          body="Add the pairs you track so scores and alerts stay one tap away."
          action={
            <Button asChild size="sm">
              <Link to="/watchlist">Add symbols</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {items.map((w) => (
            <li
              key={w.id}
              className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/25 px-3.5 py-2.5 text-sm"
            >
              <span className="font-medium">{w.symbol}</span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                {w.is_favorite && <Star className="h-3.5 w-3.5 text-primary" />}
                {w.exchange}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function JournalPreview() {
  const { data, isLoading } = useJournal();
  const items = (data ?? []).slice(0, 5);

  return (
    <Panel
      title="Recent trades"
      icon={BookOpen}
      action={
        <Button asChild size="sm" variant="ghost">
          <Link to="/journal">Open journal</Link>
        </Button>
      }
    >
      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No trades logged yet"
          body="Record entries, exits and reasoning to build your performance history."
          action={
            <Button asChild size="sm">
              <Link to="/journal">Add a trade</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {items.map((t) => {
            const pnl = Number(t.pnl ?? 0);
            return (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/25 px-3.5 py-2.5 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="font-medium">{t.symbol}</span>
                  <Badge variant="outline" className="text-[0.65rem] uppercase">
                    {t.side}
                  </Badge>
                </span>
                <span
                  className={
                    pnl >= 0 ? "text-sm text-primary" : "text-sm text-destructive"
                  }
                >
                  {t.pnl === null ? "open" : formatMoney(pnl)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function RecentAlerts() {
  const { data, isLoading } = useAlerts();
  const items = (data ?? []).slice(0, 5);

  return (
    <Panel
      title="Recent alerts"
      icon={Bell}
      action={
        <Button asChild size="sm" variant="ghost">
          <Link to="/alerts">Alert center</Link>
        </Button>
      }
    >
      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No alerts yet"
          body="Create an alert to be notified when a setup crosses your score threshold."
          action={
            <Button asChild size="sm">
              <Link to="/alerts">Create alert</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {items.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-border/70 bg-secondary/25 px-3.5 py-3 text-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate font-medium">{a.title}</span>
                <Badge variant="outline" className="shrink-0 text-[0.65rem] uppercase">
                  {a.symbol}
                </Badge>
              </div>
              {a.message && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.message}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function QuickActions() {
  const actions = [
    { label: "Run AI analysis", to: "/analysis" as const, icon: Sparkles },
    { label: "Log a trade", to: "/journal" as const, icon: BookOpen },
    { label: "Add to watchlist", to: "/watchlist" as const, icon: Star },
    { label: "Alert settings", to: "/settings" as const, icon: Bell },
  ];

  return (
    <Panel title="Quick actions" icon={Zap}>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((a) => (
          <Button key={a.label} asChild variant="outline" className="h-auto justify-start py-3">
            <Link to={a.to}>
              <a.icon className="mr-2 h-4 w-4 text-primary" />
              <span className="text-xs">{a.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </Panel>
  );
}

function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="Markets open · AI scores refreshed moments ago">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-6">
        <div className="min-w-0 space-y-5 xl:space-y-6">
          <PortfolioOverview />
          <StatCards />
          <MarketOverview />
          <div className="grid gap-5 lg:grid-cols-2 xl:gap-6">
            <PerformanceChart />
            <RecentAlerts />
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:gap-6">
            <WatchlistPreview />
            <JournalPreview />
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:gap-6">
            <TopOpportunities />
            <HighRiskCoins />
          </div>
          <ScoreRankings />
          <OpportunityMeter />
          <Heatmap />
          <div className="grid gap-5 lg:grid-cols-2 xl:gap-6">
            <EconomicCalendar />
            <CryptoNews />
          </div>
        </div>
        <div className="min-w-0 space-y-5 xl:space-y-6">
          <AtlasAssistant />
          <AISummary />
          <QuickActions />
          <TradingTip />
          <UpcomingEvents />
        </div>
      </div>
    </AppShell>
  );
}

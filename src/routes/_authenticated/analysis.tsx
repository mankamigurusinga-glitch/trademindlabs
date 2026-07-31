import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Gauge, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { Metric, Panel } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { aiService } from "@/services/ai.service";
import { EXCHANGES, SYMBOLS, type Exchange } from "@/types";

const title = "AI Analysis — TradeMind AI";
const description =
  "Full AI breakdown for BTC, ETH, SOL and more across Binance, Bybit and OKX: trend, momentum, funding, probability, risk and invalidation.";

export const Route = createFileRoute("/_authenticated/analysis")({
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
  component: AnalysisPage,
});

function AnalysisPage() {
  const [symbol, setSymbol] = React.useState<string>("BTC");
  const [exchange, setExchange] = React.useState<Exchange>("Binance");
  const [nonce, setNonce] = React.useState(0);

  const { data, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["analysis", symbol, exchange, nonce],
    queryFn: () => aiService.analyze(symbol, exchange, nonce),
    retry: 1,
  });


  return (
    <AppShell title="AI Analysis" subtitle="Reasoning, probability and risk for every setup">
      <Panel>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={symbol} onValueChange={setSymbol}>
            <SelectTrigger className="w-32" aria-label="Symbol">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SYMBOLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={exchange} onValueChange={(v) => setExchange(v as Exchange)}>
            <SelectTrigger className="w-36" aria-label="Exchange">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXCHANGES.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setNonce((n) => n + 1)}
            disabled={isFetching}
            className="ml-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </Panel>

      {!data ? (
        <div className="space-y-5">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      ) : (
        <>
          <Panel title={`${data.symbol} · ${data.exchange}`} icon={Activity}>
            <div className="flex flex-wrap items-end gap-4">
              <p className="font-display text-3xl font-semibold sm:text-4xl">
                ${data.price.toLocaleString()}
              </p>
              <Badge variant="outline">Score {data.score}</Badge>
              <Badge variant="outline">Confidence {data.confidence}%</Badge>
              <Badge
                variant="outline"
                className={
                  data.riskLevel === "High"
                    ? "border-destructive/50 text-destructive"
                    : data.riskLevel === "Medium"
                      ? "border-border"
                      : "border-primary/50 text-primary"
                }
              >
                Risk {data.riskLevel}
              </Badge>
            </div>

            <div className="mt-5 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.series}>
                  <defs>
                    <linearGradient id="analysisFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tickLine={false} axisLine={false} fontSize={11} minTickGap={24} />
                  <YAxis
                    domain={["auto", "auto"]}
                    tickLine={false}
                    axisLine={false}
                    width={56}
                    fontSize={11}
                  />
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
                    dataKey="price"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#analysisFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Market structure" icon={TrendingUp}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Trend" value={data.trend} />
              <Metric label="Momentum" value={data.momentum} />
              <Metric label="Support" value={data.support} />
              <Metric label="Resistance" value={data.resistance} />
              <Metric label="Open interest" value={data.openInterest} />
              <Metric label="Funding rate" value={data.fundingRate} />
              <Metric label="Volume (24h)" value={data.volume} />
              <Metric label="Volatility" value={data.volatility} />
            </div>
          </Panel>

          <Panel title="Probability & scenarios" icon={Gauge}>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                  <span>Bullish {data.bullishProbability}%</span>
                  <span>Bearish {data.bearishProbability}%</span>
                </div>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-[var(--gradient-brand)]"
                    style={{ width: `${data.bullishProbability}%` }}
                  />
                  <div className="h-full flex-1 bg-destructive/70" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Metric label="Best case" value={data.bestCase} tone="positive" />
                <Metric label="Worst case" value={data.worstCase} tone="negative" />
                <Metric label="Invalidation" value={data.invalidation} />
              </div>
            </div>
          </Panel>

          <Panel title="AI summary" icon={Sparkles}>
            <p className="text-sm leading-relaxed text-muted-foreground">{data.summary}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Generated {new Date(data.updatedAt).toLocaleTimeString()} · sample data for
              demonstration, not financial advice.
            </p>
          </Panel>
        </>
      )}
    </AppShell>
  );
}

import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, ListSkeleton, Panel } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWatchlist, useWatchlistMutations } from "@/hooks/use-app-data";
import { EXCHANGES, SYMBOLS } from "@/types";
import { cn } from "@/lib/utils";

const title = "Watchlist — TradeMind AI";
const description =
  "Track your favourite crypto futures pairs with quick-access cards, favourites and per-exchange coverage.";

export const Route = createFileRoute("/_authenticated/watchlist")({
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
  component: WatchlistPage,
});

function WatchlistPage() {
  const { data, isLoading } = useWatchlist();
  const { add, toggleFavorite, remove } = useWatchlistMutations();
  const [symbol, setSymbol] = React.useState("BTC");
  const [exchange, setExchange] = React.useState("Binance");
  const items = data ?? [];

  async function addSymbol() {
    if (items.some((i) => i.symbol === symbol && i.exchange === exchange)) {
      toast.error("Already in your watchlist.");
      return;
    }
    await add.mutateAsync({ symbol, exchange });
    toast.success(`${symbol} added`);
  }

  return (
    <AppShell title="Watchlist" subtitle="The pairs you care about, always one tap away">
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
          <Select value={exchange} onValueChange={setExchange}>
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
          <Button onClick={addSymbol} disabled={add.isPending}>
            <Plus className="mr-2 h-4 w-4" /> Add symbol
          </Button>
        </div>
      </Panel>

      <Panel title={`Tracked pairs (${items.length})`} icon={Star}>
        {isLoading ? (
          <ListSkeleton />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Star}
            title="Nothing tracked yet"
            body="Add a symbol above to build your quick-access watchlist."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((w) => (
              <div
                key={w.id}
                className="glass-card lift rounded-2xl px-4 py-4 transition-transform"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-base font-semibold">{w.symbol}</p>
                    <p className="text-xs text-muted-foreground">{w.exchange}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={w.is_favorite ? "Unfavourite" : "Favourite"}
                      onClick={() =>
                        toggleFavorite.mutate({ id: w.id, value: !w.is_favorite })
                      }
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          w.is_favorite ? "fill-primary text-primary" : "text-muted-foreground",
                        )}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove ${w.symbol}`}
                      onClick={() => remove.mutate(w.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </AppShell>
  );
}

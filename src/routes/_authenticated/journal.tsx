import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, ListSkeleton, Metric, Panel } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJournal, useJournalMutations } from "@/hooks/use-app-data";
import { computeJournalStats, formatMoney } from "@/lib/journal-stats";
import { SYMBOLS, type JournalEntry } from "@/types";

const title = "Trading Journal — TradeMind AI";
const description =
  "Log entries, exits, leverage and reasoning, then track win rate, net P&L and performance over time.";

export const Route = createFileRoute("/_authenticated/journal")({
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
  component: JournalPage,
});

const empty = {
  symbol: "BTC",
  side: "long",
  entry_price: "",
  exit_price: "",
  quantity: "",
  leverage: "1",
  pnl: "",
  notes: "",
};

function TradeDialog({ entry, trigger }: { entry?: JournalEntry; trigger: React.ReactNode }) {
  const { create, update } = useJournalMutations();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(
    entry
      ? {
          symbol: entry.symbol,
          side: entry.side,
          entry_price: String(entry.entry_price ?? ""),
          exit_price: String(entry.exit_price ?? ""),
          quantity: String(entry.quantity ?? ""),
          leverage: String(entry.leverage ?? 1),
          pnl: String(entry.pnl ?? ""),
          notes: entry.notes ?? "",
        }
      : empty,
  );

  async function submit() {
    const entryPrice = Number(form.entry_price);
    if (!entryPrice) {
      toast.error("Entry price is required.");
      return;
    }
    const payload = {
      symbol: form.symbol,
      side: form.side,
      entry_price: entryPrice,
      exit_price: form.exit_price ? Number(form.exit_price) : null,
      quantity: form.quantity ? Number(form.quantity) : null,
      leverage: Number(form.leverage) || 1,
      pnl: form.pnl ? Number(form.pnl) : null,
      notes: form.notes.trim().slice(0, 1000) || null,
      status: form.exit_price ? "closed" : "open",
    };
    if (entry) await update.mutateAsync({ id: entry.id, patch: payload });
    else await create.mutateAsync(payload);
    toast.success(entry ? "Trade updated" : "Trade added");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit trade" : "Add trade"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Symbol</Label>
            <Select value={form.symbol} onValueChange={(v) => setForm({ ...form, symbol: v })}>
              <SelectTrigger>
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
          </div>
          <div className="space-y-2">
            <Label>Side</Label>
            <Select value={form.side} onValueChange={(v) => setForm({ ...form, side: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="short">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(
            [
              ["entry_price", "Entry price"],
              ["exit_price", "Exit price"],
              ["quantity", "Quantity"],
              ["leverage", "Leverage"],
              ["pnl", "Realised P&L"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="number"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="col-span-2 space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              maxLength={1000}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Why did you take this trade?"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={create.isPending || update.isPending}>
            Save trade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function JournalPage() {
  const { data, isLoading } = useJournal();
  const { remove } = useJournalMutations();
  const entries = data ?? [];
  const stats = computeJournalStats(entries);

  return (
    <AppShell title="Trading Journal" subtitle="Every trade, every lesson, measured">
      <Panel title="Statistics" icon={BookOpen}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric
            label="Net P&L"
            value={formatMoney(stats.netPnl)}
            tone={stats.netPnl >= 0 ? "positive" : "negative"}
          />
          <Metric label="Win rate" value={`${stats.winRate}%`} />
          <Metric label="Best trade" value={formatMoney(stats.bestTrade)} tone="positive" />
          <Metric label="Worst trade" value={formatMoney(stats.worstTrade)} tone="negative" />
        </div>
      </Panel>

      <Panel
        title={`Trades (${entries.length})`}
        action={
          <TradeDialog
            trigger={
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add trade
              </Button>
            }
          />
        }
      >
        {isLoading ? (
          <ListSkeleton />
        ) : entries.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No trades yet"
            body="Add your first trade to start building performance statistics."
          />
        ) : (
          <ul className="space-y-3">
            {entries.map((t) => {
              const pnl = Number(t.pnl ?? 0);
              return (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3"
                >
                  <span className="font-medium">{t.symbol}</span>
                  <Badge variant="outline" className="text-[0.65rem] uppercase">
                    {t.side}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Entry {t.entry_price} · {t.leverage}x · {t.status}
                  </span>
                  <span
                    className={`ml-auto text-sm ${pnl >= 0 ? "text-primary" : "text-destructive"}`}
                  >
                    {t.pnl === null ? "—" : formatMoney(pnl)}
                  </span>
                  <TradeDialog
                    entry={t}
                    trigger={
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    }
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => remove.mutate(t.id)}
                    aria-label={`Delete ${t.symbol} trade`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </AppShell>
  );
}

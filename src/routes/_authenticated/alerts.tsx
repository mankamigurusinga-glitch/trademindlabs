import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, ErrorState, ListSkeleton, Panel } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useAlertMutations, useAlerts, useSettings, useUpdateSettings } from "@/hooks/use-app-data";
import { EXCHANGES, SYMBOLS, type Alert } from "@/types";

const title = "Alert Center — TradeMind AI";
const description =
  "Manage active AI alerts and history, filter by symbol and exchange, and tune your notification preferences.";

export const Route = createFileRoute("/_authenticated/alerts")({
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
  component: AlertsPage,
});

function CreateAlertDialog() {
  const { create } = useAlertMutations();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    symbol: "BTC",
    exchange: "Binance",
    severity: "info",
    title: "",
    message: "",
    score: "80",
  });

  async function submit() {
    if (form.title.trim().length < 3) {
      toast.error("Give the alert a short title.");
      return;
    }
    await create.mutateAsync({
      symbol: form.symbol,
      exchange: form.exchange,
      severity: form.severity,
      title: form.title.trim().slice(0, 120),
      message: form.message.trim().slice(0, 500) || null,
      score: Number(form.score) || null,
    });
    toast.success("Alert created");
    setOpen(false);
    setForm((f) => ({ ...f, title: "", message: "" }));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> New alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create alert</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Symbol</Label>
              <Select
                value={form.symbol}
                onValueChange={(v) => setForm({ ...form, symbol: v })}
              >
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
              <Label>Exchange</Label>
              <Select
                value={form.exchange}
                onValueChange={(v) => setForm({ ...form, exchange: v })}
              >
                <SelectTrigger>
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
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alert-title">Title</Label>
            <Input
              id="alert-title"
              value={form.title}
              maxLength={120}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="SOL score crosses 90"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alert-message">Notes</Label>
            <Textarea
              id="alert-message"
              value={form.message}
              maxLength={500}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="What should trigger this alert?"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="alert-score">Score threshold</Label>
              <Input
                id="alert-score"
                type="number"
                min={0}
                max={100}
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select
                value={form.severity}
                onValueChange={(v) => setForm({ ...form, severity: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["info", "warning", "critical"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={create.isPending}>
            Create alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AlertRow({ alert }: { alert: Alert }) {
  const { update, remove } = useAlertMutations();
  const [open, setOpen] = React.useState(false);

  return (
    <li className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{alert.title}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(alert.created_at).toLocaleString()}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <Badge variant="outline" className="text-[0.65rem] uppercase">
            {alert.symbol}
          </Badge>
          <Badge variant="outline" className="text-[0.65rem] uppercase">
            {alert.exchange}
          </Badge>
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-3 border-t border-border/60 pt-3">
          {alert.message && <p className="text-sm text-muted-foreground">{alert.message}</p>}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>Severity: {alert.severity}</span>
            {alert.score !== null && <span>Score threshold: {alert.score}</span>}
            <span>Status: {alert.status}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                update.mutate({
                  id: alert.id,
                  patch: { status: alert.status === "active" ? "archived" : "active" },
                })
              }
            >
              {alert.status === "active" ? "Archive" : "Reactivate"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => update.mutate({ id: alert.id, patch: { is_read: !alert.is_read } })}
            >
              Mark {alert.is_read ? "unread" : "read"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => remove.mutate(alert.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}

function NotificationSettings() {
  const { data } = useSettings();
  const update = useUpdateSettings();

  const rows = [
    { key: "email_notifications" as const, label: "Email notifications" },
    { key: "push_notifications" as const, label: "Push notifications" },
    { key: "telegram_notifications" as const, label: "Telegram notifications" },
  ];

  return (
    <Panel title="Notification settings" icon={Bell}>
      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r.key}
            className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/25 px-4 py-3"
          >
            <Label htmlFor={r.key} className="text-sm">
              {r.label}
            </Label>
            <Switch
              id={r.key}
              checked={!!data?.[r.key]}
              onCheckedChange={(v) => update.mutate({ [r.key]: v })}
            />
          </div>
        ))}
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/25 px-4 py-3">
          <Label htmlFor="min-score" className="text-sm">
            Minimum score to notify
          </Label>
          <Input
            id="min-score"
            type="number"
            min={0}
            max={100}
            className="w-24"
            defaultValue={data?.min_alert_score ?? 70}
            onBlur={(e) => update.mutate({ min_alert_score: Number(e.target.value) || 70 })}
          />
        </div>
      </div>
    </Panel>
  );
}

function AlertsPage() {
  const { data, isLoading, isError } = useAlerts();
  const [q, setQ] = React.useState("");
  const [symbol, setSymbol] = React.useState("all");
  const [exchange, setExchange] = React.useState("all");

  const filtered = (data ?? []).filter((a) => {
    const matchesQuery =
      !q ||
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      (a.message ?? "").toLowerCase().includes(q.toLowerCase());
    return (
      matchesQuery &&
      (symbol === "all" || a.symbol === symbol) &&
      (exchange === "all" || a.exchange === exchange)
    );
  });

  const active = filtered.filter((a) => a.status === "active");
  const history = filtered.filter((a) => a.status !== "active");

  function renderList(items: Alert[], emptyLabel: string) {
    if (isLoading) return <ListSkeleton />;
    if (isError) return <ErrorState />;
    if (items.length === 0)
      return <EmptyState icon={Bell} title={emptyLabel} body="Alerts you create appear here." />;
    return (
      <ul className="space-y-3">
        {items.map((a) => (
          <AlertRow key={a.id} alert={a} />
        ))}
      </ul>
    );
  }

  return (
    <AppShell title="Alert Center" subtitle="Everything the AI flagged, in one feed">
      <Panel>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative flex min-w-[12rem] flex-1 items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search alerts"
              className="pl-9"
              aria-label="Search alerts"
            />
          </label>
          <Select value={symbol} onValueChange={setSymbol}>
            <SelectTrigger className="w-32" aria-label="Filter by symbol">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All symbols</SelectItem>
              {SYMBOLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={exchange} onValueChange={setExchange}>
            <SelectTrigger className="w-36" aria-label="Filter by exchange">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All exchanges</SelectItem>
              {EXCHANGES.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CreateAlertDialog />
        </div>
      </Panel>

      <Panel>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="history">History ({history.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-5">
            {renderList(active, "No active alerts")}
          </TabsContent>
          <TabsContent value="history" className="mt-5">
            {renderList(history, "No archived alerts")}
          </TabsContent>
        </Tabs>
      </Panel>

      <NotificationSettings />
    </AppShell>
  );
}

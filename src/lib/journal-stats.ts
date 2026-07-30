import type { JournalEntry } from "@/types";

export interface JournalStats {
  total: number;
  closed: number;
  open: number;
  wins: number;
  losses: number;
  winRate: number;
  netPnl: number;
  avgWin: number;
  avgLoss: number;
  bestTrade: number;
  worstTrade: number;
  equityCurve: { label: string; equity: number }[];
}

export function computeJournalStats(entries: JournalEntry[]): JournalStats {
  const closed = entries.filter((e) => e.status === "closed" && e.pnl !== null);
  const pnls = closed.map((e) => Number(e.pnl ?? 0));
  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);
  const netPnl = pnls.reduce((a, b) => a + b, 0);

  const ordered = [...closed].sort(
    (a, b) => new Date(a.opened_at).getTime() - new Date(b.opened_at).getTime(),
  );
  let running = 0;
  const equityCurve = ordered.map((e, i) => {
    running += Number(e.pnl ?? 0);
    return { label: `${i + 1}`, equity: +running.toFixed(2) };
  });

  return {
    total: entries.length,
    closed: closed.length,
    open: entries.filter((e) => e.status === "open").length,
    wins: wins.length,
    losses: losses.length,
    winRate: closed.length ? Math.round((wins.length / closed.length) * 100) : 0,
    netPnl: +netPnl.toFixed(2),
    avgWin: wins.length ? +(wins.reduce((a, b) => a + b, 0) / wins.length).toFixed(2) : 0,
    avgLoss: losses.length ? +(losses.reduce((a, b) => a + b, 0) / losses.length).toFixed(2) : 0,
    bestTrade: pnls.length ? +Math.max(...pnls).toFixed(2) : 0,
    worstTrade: pnls.length ? +Math.min(...pnls).toFixed(2) : 0,
    equityCurve,
  };
}

export function formatMoney(value: number) {
  const sign = value < 0 ? "-" : value > 0 ? "+" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

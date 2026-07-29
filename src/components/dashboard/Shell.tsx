import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  BookOpen,
  Briefcase,
  LayoutDashboard,
  LineChart,
  Menu,
  Search,
  Settings,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Market", icon: LineChart },
  { label: "Watchlist", icon: Star },
  { label: "Alerts", icon: Bell, badge: "4" },
  { label: "Portfolio", icon: Briefcase },
  { label: "Atlas AI", icon: Sparkles },
  { label: "Academy", icon: BookOpen },
  { label: "Settings", icon: Settings },
];

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8 px-4 py-6">
      <Link to="/" className="flex items-center gap-2.5 px-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--gradient-brand)]">
          <Activity className="h-4.5 w-4.5 text-background" strokeWidth={2.4} />
        </span>
        <span className="font-display text-[0.95rem] font-semibold tracking-tight">
          TradeMind AI
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              item.active
                ? "bg-secondary/60 text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)]"
                : "text-muted-foreground hover:translate-x-0.5 hover:bg-secondary/35 hover:text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "h-4.5 w-4.5 shrink-0 transition-colors",
                item.active ? "text-primary" : "text-muted-foreground group-hover:text-primary",
              )}
            />
            <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
            {item.badge && (
              <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                {item.badge}
              </span>
            )}
            {item.active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
          </button>
        ))}
      </nav>

      <div className="glass-card glass-sheen rounded-2xl p-4">
        <p className="text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Pro plan
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">217</span> of 500 AI analyses used
          this month.
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-[43%] rounded-full bg-[var(--gradient-brand)]" />
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({
  main,
  rail,
}: {
  main: React.ReactNode;
  rail: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "var(--gradient-ambient, none)" }}
      />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border/70 bg-surface/40 backdrop-blur-2xl lg:block">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-[17rem] border-r border-border bg-surface/95 backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-5 grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarBody onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 bg-background/70 px-4 py-3 backdrop-blur-2xl sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
          <div className="hidden min-w-0 lg:block">
            <h1 className="truncate font-display text-lg font-semibold">Dashboard</h1>
            <p className="truncate text-xs text-muted-foreground">
              Wednesday, 29 July · Markets open · Data delayed 5s
            </p>
          </div>
          <label className="relative flex min-w-0 items-center lg:hidden">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search pairs"
              className="h-10 w-full rounded-full border border-border bg-secondary/40 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40"
            />
          </label>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <label className="relative hidden items-center lg:flex">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search BTC, SOL, ETH…"
                className="h-10 w-56 rounded-full border border-border bg-secondary/40 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 xl:w-64"
              />
            </label>
            <span className="hidden items-center gap-2 rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-primary/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Live
            </span>
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--gradient-brand)] text-sm font-semibold text-background">
              MK
            </span>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-5 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-6 xl:py-8">
          <main className="min-w-0 space-y-5 xl:space-y-6">{main}</main>
          <div className="min-w-0 space-y-5 xl:space-y-6">{rail}</div>
        </div>
      </div>
    </div>
  );
}

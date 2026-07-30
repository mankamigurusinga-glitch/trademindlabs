import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Bell,
  BookOpen,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  Star,
  User as UserIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-app-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "AI Analysis", icon: Sparkles, to: "/analysis" },
  { label: "Alerts", icon: Bell, to: "/alerts" },
  { label: "Journal", icon: BookOpen, to: "/journal" },
  { label: "Watchlist", icon: Star, to: "/watchlist" },
  { label: "Portfolio", icon: Briefcase, to: "/journal" },
  { label: "Settings", icon: Settings, to: "/settings" },
] as const;

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
        {navItems.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                active
                  ? "bg-secondary/60 text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)]"
                  : "text-muted-foreground hover:translate-x-0.5 hover:bg-secondary/35 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                )}
              />
              <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
              {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
            </Link>
          );
        })}
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

function UserMenu() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const label = profile?.full_name || user?.email || "Trader";
  const initials = label
    .replace(/@.*/, "")
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[var(--gradient-brand)] text-sm font-semibold text-background"
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
        ) : (
          (initials || "TM")
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <UserIcon className="mr-2 h-4 w-4" /> Profile & settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/alerts">
            <Bell className="mr-2 h-4 w-4" /> Alert center
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
  rail,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  rail?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "var(--gradient-ambient, none)" }}
      />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border/70 bg-surface/40 backdrop-blur-2xl lg:block">
        <SidebarBody />
      </aside>

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
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-semibold sm:text-lg">{title}</h1>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <label className="relative hidden items-center lg:flex">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                aria-label="Search markets"
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
            <UserMenu />
          </div>
        </header>

        <div
          className={cn(
            "mx-auto grid max-w-[1600px] grid-cols-1 gap-5 px-4 py-6 sm:px-6 xl:gap-6 xl:py-8",
            rail && "xl:grid-cols-[minmax(0,1fr)_22rem]",
          )}
        >
          <main className="min-w-0 space-y-5 xl:space-y-6">{children}</main>
          {rail && <div className="min-w-0 space-y-5 xl:space-y-6">{rail}</div>}
        </div>
      </div>
    </div>
  );
}

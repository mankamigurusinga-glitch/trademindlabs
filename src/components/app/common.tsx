import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function Panel({
  title,
  icon: Icon,
  action,
  className,
  children,
}: {
  title?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("glass-card glass-sheen overflow-hidden p-5 sm:p-6", className)}>
      {title && (
        <header className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-sm font-semibold sm:text-base">
            {Icon && <Icon className="h-4 w-4 text-primary" />}
            {title}
          </h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/80 px-6 py-12 text-center">
      {Icon && (
        <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary/50">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </span>
      )}
      <p className="font-display text-sm font-semibold">{title}</p>
      {body && <p className="max-w-sm text-sm text-muted-foreground">{body}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-6 text-center text-sm text-destructive">
      {message ?? "Something went wrong loading this data. Please try again."}
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone?: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/25 px-4 py-3">
      <p className="text-[0.68rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 font-display text-base font-semibold sm:text-lg",
          tone === "positive" && "text-[var(--emerald,oklch(0.78_0.16_160))]",
          tone === "negative" && "text-destructive",
        )}
      >
        {value}
      </p>
    </div>
  );
}

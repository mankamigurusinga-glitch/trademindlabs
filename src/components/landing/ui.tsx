import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";

export const actionVariants = cva(
  "group/action relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium whitespace-nowrap transition-[transform,box-shadow,background-color,color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_oklch(1_0_0/0.08),0_28px_60px_-24px_color-mix(in_oklab,var(--emerald)_70%,transparent)]",
        ghostline:
          "border border-border bg-secondary/30 text-foreground backdrop-blur-xl hover:-translate-y-0.5 hover:border-primary/35 hover:bg-secondary/60",
        quiet: "text-muted-foreground hover:text-foreground",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionVariants> {
  asChild?: boolean;
}

export function Action({
  className,
  variant,
  size,
  asChild,
  children,
  ...props
}: ActionProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(actionVariants({ variant, size }), className)} {...props}>
      <>
        {/* Sweeping light pass on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 -translate-x-full bg-[linear-gradient(100deg,transparent,oklch(1_0_0/0.22),transparent)] transition-transform duration-700 ease-out group-hover/action:translate-x-full"
        />
        {children}
      </>
    </Comp>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-3.5 py-1.5 text-[0.7rem] font-medium tracking-[0.18em] text-muted-foreground uppercase backdrop-blur-xl">
      {children}
    </span>
  );
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("px-5 py-28 sm:px-8 md:py-40", className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-[6px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  label,
  title,
  body,
  align = "left",
}: {
  label: string;
  title: React.ReactNode;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <SectionLabel>{label}</SectionLabel>
      <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.04] sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {body && (
        <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {body}
        </p>
      )}
    </Reveal>
  );
}

/** Premium circular TradeMind Score widget. */
export function ScoreRing({
  value,
  size = 200,
  label = "TradeMind Score",
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.3);
  const stroke = size * 0.055;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - (shown ? value : 0) / 100);

  return (
    <div ref={ref} className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id="score-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--emerald)" />
            <stop offset="55%" stopColor="var(--electric)" />
            <stop offset="100%" stopColor="var(--purple)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke="oklch(1 0 0 / 0.07)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="url(#score-ring)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-5xl font-semibold leading-none tabular-nums">
          {value}
        </span>
        <span className="mt-1.5 text-xs text-muted-foreground">/ 100</span>
        <span className="mt-2 max-w-[7rem] text-center text-[0.65rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

export const actionVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 hover:-translate-y-0.5",
        ghostline:
          "border border-border bg-secondary/40 text-foreground backdrop-blur hover:bg-secondary/70 hover:-translate-y-0.5",
        quiet: "text-muted-foreground hover:text-foreground",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base",
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

export function Action({ className, variant, size, asChild, ...props }: ActionProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(actionVariants({ variant, size }), className)} {...props} />;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
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
    <section id={id} className={cn("px-5 py-24 sm:px-8 md:py-32", className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

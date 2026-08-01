import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked */
        }
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export { CopyButton };

/** Markdown renderer tuned for the dark theme, with copyable code blocks. */
export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={cn(
        "space-y-3 text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-foreground",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="text-muted-foreground">{children}</p>,
          h1: ({ children }) => (
            <h3 className="font-display text-base font-semibold text-foreground">{children}</h3>
          ),
          h2: ({ children }) => (
            <h4 className="font-display text-[0.95rem] font-semibold text-foreground">{children}</h4>
          ),
          h3: ({ children }) => (
            <h5 className="text-sm font-semibold text-foreground">{children}</h5>
          ),
          ul: ({ children }) => <ul className="space-y-1 text-muted-foreground">{children}</ul>,
          ol: ({ children }) => (
            <ol className="space-y-1 text-muted-foreground [&_li]:list-decimal">{children}</ol>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full text-left text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border/70 px-3 py-2 font-medium text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/40 px-3 py-2 text-muted-foreground">{children}</td>
          ),
          code: ({ className: cls, children }) => {
            const text = String(children ?? "").replace(/\n$/, "");
            if (!cls && !text.includes("\n")) {
              return (
                <code className="rounded bg-secondary/70 px-1.5 py-0.5 font-mono text-[0.8rem] text-foreground">
                  {text}
                </code>
              );
            }
            return (
              <span className="block overflow-hidden rounded-xl border border-border/70 bg-secondary/40">
                <span className="flex items-center justify-between border-b border-border/60 px-3 py-1.5">
                  <span className="text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
                    {cls?.replace("language-", "") || "code"}
                  </span>
                  <CopyButton value={text} />
                </span>
                <code className="block overflow-x-auto p-3 font-mono text-[0.78rem] whitespace-pre text-foreground">
                  {text}
                </code>
              </span>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

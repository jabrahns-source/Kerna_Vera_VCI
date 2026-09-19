import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { truncateHash } from "@/lib/qreg/format";

export function HashLine({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <span className="w-24 shrink-0 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground/90">
        {value}
      </code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

export function HashShort({ value }: { value: string }) {
  return (
    <code className="font-mono text-[11px] text-muted-foreground">{truncateHash(value, 6)}</code>
  );
}

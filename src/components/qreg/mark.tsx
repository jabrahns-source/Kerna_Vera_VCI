import { cn } from "@/lib/utils";

export function KernaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-foreground", className)}
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="3.5"
        width="25"
        height="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M11 9v14M11 16L21 9.5M11 16l10 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

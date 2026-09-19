import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] uppercase",
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-muted-foreground",
        green: "border-transparent bg-gate-green/15 text-gate-green",
        yellow: "border-transparent bg-gate-yellow/15 text-gate-yellow",
        black: "border-transparent bg-gate-black/15 text-gate-black",
        error: "border-transparent bg-gate-error/15 text-gate-error",
        outline: "border-border text-muted-foreground",
        paper: "border-transparent bg-primary text-primary-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

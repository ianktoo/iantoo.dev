import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border font-mono text-xs px-2 py-0.5 transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-border)] text-[var(--color-primary)] bg-[var(--color-surface)]",
        bright:
          "border-[var(--color-accent)] text-[var(--color-accent-text)] bg-[var(--color-accent)]",
        muted:
          "border-transparent text-[var(--color-muted)] bg-transparent",
        danger:
          "border-[var(--color-danger)] text-[var(--color-danger)] bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

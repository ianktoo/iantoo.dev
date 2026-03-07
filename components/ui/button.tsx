"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-sm font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-40 cursor-pointer border",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-border-bright)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] hover:border-[var(--color-accent)] hover:shadow-[0_0_12px_var(--color-primary-glow)]",
        ghost:
          "border-transparent text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-border)]",
        destructive:
          "border-[var(--color-danger)] text-[var(--color-danger)] bg-transparent hover:bg-[var(--color-danger)] hover:text-white",
        muted:
          "border-[var(--color-border)] text-[var(--color-muted)] bg-[var(--color-surface)] hover:border-[var(--color-border-bright)] hover:text-[var(--color-primary)]",
        solid:
          "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-text)] hover:opacity-90",
      },
      size: {
        sm: "h-7 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

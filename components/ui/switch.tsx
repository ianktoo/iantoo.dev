"use client";
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center border border-[var(--color-border)] transition-all focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:shadow-[0_0_6px_var(--color-primary-glow)] data-[state=unchecked]:bg-transparent data-[state=checked]:bg-[var(--color-primary)]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-3 w-3 bg-[var(--color-bg)] shadow-lg transition-transform data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-[2px]"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

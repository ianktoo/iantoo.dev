import { cn } from "@/lib/utils";

export function BlinkingCursor({ className }: { className?: string }) {
  return <span className={cn("cursor-blink", className)} aria-hidden />;
}

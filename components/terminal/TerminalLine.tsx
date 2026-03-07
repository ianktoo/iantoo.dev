import { cn } from "@/lib/utils";

interface TerminalLineProps {
  prompt?: string;
  children?: React.ReactNode;
  className?: string;
  dim?: boolean;
}

export function TerminalLine({
  prompt = "$ ",
  children,
  className,
  dim = false,
}: TerminalLineProps) {
  return (
    <div className={cn("flex gap-1 font-mono text-sm leading-relaxed", className)}>
      {prompt && (
        <span className="text-[var(--color-muted)] select-none shrink-0">{prompt}</span>
      )}
      <span className={cn(dim ? "text-[var(--color-muted)]" : "text-[var(--color-primary)]")}>
        {children}
      </span>
    </div>
  );
}

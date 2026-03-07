import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export function TerminalWindow({
  title,
  children,
  className,
  contentClassName,
  noPadding = false,
}: TerminalWindowProps) {
  return (
    <div className={cn("terminal-border transition-all duration-200", className)}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-elevated)]">
        {/* Window control dots */}
        <div className="flex gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-danger)] opacity-70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-warning)] opacity-70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary-dim)] opacity-70" />
        </div>
        {title && (
          <span className="text-xs font-mono text-[var(--color-muted)] ml-2">{title}</span>
        )}
      </div>
      {/* Content */}
      <div className={cn(!noPadding && "p-4", contentClassName)}>{children}</div>
    </div>
  );
}

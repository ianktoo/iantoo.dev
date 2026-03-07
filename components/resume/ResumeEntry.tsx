import { Badge } from "@/components/ui/badge";
import { parseTags } from "@/lib/utils";
import type { ResumeEntry as ResumeEntryType } from "@/db/schema";

export function ResumeEntry({ entry }: { entry: ResumeEntryType }) {
  const tags = parseTags(entry.tags);

  return (
    <div className="pl-4 border-l border-[var(--color-border)] hover:border-[var(--color-border-bright)] transition-colors py-1 group">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-mono font-semibold text-[var(--color-primary)] text-sm group-hover:glow-text transition-all">
            {entry.title}
          </h4>
          {entry.subtitle && (
            <p className="text-xs text-[var(--color-muted)] mt-0.5">{entry.subtitle}</p>
          )}
        </div>
        {entry.dateRange && (
          <span className="text-xs font-mono text-[var(--color-muted)] shrink-0">
            {entry.dateRange}
          </span>
        )}
      </div>

      {entry.description && (
        <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
          {entry.description}
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="default" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

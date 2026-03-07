import { TerminalLine } from "@/components/terminal/TerminalLine";
import { ResumeEntry } from "./ResumeEntry";
import type { ResumeSection as ResumeSectionType, ResumeEntry as ResumeEntryType } from "@/db/schema";

interface ResumeSectionProps {
  section: ResumeSectionType;
  entries: ResumeEntryType[];
}

export function ResumeSection({ section, entries }: ResumeSectionProps) {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      <TerminalLine prompt=">" className="text-sm font-semibold mb-2">
        {section.title.toLowerCase()}
      </TerminalLine>
      <div className="space-y-4 ml-4">
        {entries.map((entry) => (
          <ResumeEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

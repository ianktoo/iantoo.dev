import type { Metadata } from "next";
import { db } from "@/db";
import { resumeSections, resumeEntries, siteConfig } from "@/db/schema";
import { asc } from "drizzle-orm";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { ResumeSection } from "@/components/resume/ResumeSection";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Resume",
  description: "Ian's live resume — experience, education, and skills.",
};

export default async function ResumePage() {
  const [sections, entries, configs] = await Promise.all([
    db.select().from(resumeSections).orderBy(asc(resumeSections.sortOrder)),
    db.select().from(resumeEntries).orderBy(asc(resumeEntries.sortOrder)),
    db.select().from(siteConfig),
  ]);

  const config = Object.fromEntries(configs.map((c) => [c.key, c.value ?? ""]));
  const hireOpen = config.hire_status === "open";

  return (
    <PageContainer>
      <Section>
        <TerminalWindow title="~/resume.md">
          {/* Header */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <TerminalLine prompt="$">
                <span className="glow-text font-bold text-lg">
                  {config.site_title || "Ian"}
                </span>
              </TerminalLine>
              <Badge variant={hireOpen ? "bright" : "muted"}>
                {hireOpen ? "available for hire" : "not available"}
              </Badge>
            </div>
            {config.bio && (
              <TerminalLine prompt="#" dim className="text-xs max-w-xl">
                {config.bio}
              </TerminalLine>
            )}
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section) => {
              const sectionEntries = entries.filter((e) => e.sectionId === section.id);
              return (
                <ResumeSection
                  key={section.id}
                  section={section}
                  entries={sectionEntries}
                />
              );
            })}
          </div>

          {sections.length === 0 && (
            <TerminalLine prompt=">" dim>
              resume not populated yet. check back soon.
            </TerminalLine>
          )}
        </TerminalWindow>
      </Section>
    </PageContainer>
  );
}

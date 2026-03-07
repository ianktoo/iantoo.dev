import type { Metadata } from "next";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

export const metadata: Metadata = {
  title: "Projects",
  description: "Apps, tools, and experiments built by Ian.",
};

export default async function ProjectsPage() {
  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "active"))
    .orderBy(asc(projects.sortOrder));

  return (
    <PageContainer>
      <Section>
        <TerminalLine prompt=">" className="text-xs mb-2 text-[var(--color-muted)]">
          ls ~/projects
        </TerminalLine>
        <TerminalWindow title="~/projects" className="mb-8">
          <p className="text-xs text-[var(--color-muted)]">
            {allProjects.length} project{allProjects.length !== 1 ? "s" : ""} found. click a card for details.
          </p>
        </TerminalWindow>
        <ProjectGrid projects={allProjects} showFilters />
      </Section>
    </PageContainer>
  );
}

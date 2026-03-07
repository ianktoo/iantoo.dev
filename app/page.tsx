import { db } from "@/db";
import { siteConfig, projects, socials } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { TypewriterText } from "@/components/terminal/TypewriterText";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { SocialGrid } from "@/components/socials/SocialGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
  const [configs, featuredProjects, allSocials] = await Promise.all([
    db.select().from(siteConfig),
    db.select().from(projects)
      .where(eq(projects.status, "active"))
      .orderBy(asc(projects.sortOrder))
      .limit(3),
    db.select().from(socials)
      .where(eq(socials.visible, true))
      .orderBy(asc(socials.sortOrder)),
  ]);

  const config = Object.fromEntries(configs.map((c) => [c.key, c.value ?? ""]));

  const typewriterLines = [
    config.tagline || "Building things that matter.",
    config.bio?.slice(0, 60) || "Developer. Builder. Tinkerer.",
    "available for interesting work.",
    `> ${config.hire_status === "open" ? "hire_status: OPEN" : "hire_status: closed"}`,
  ];

  return (
    <PageContainer>
      <Section>
        <TerminalWindow title="~/iantoo.dev" className="max-w-2xl">
          <div className="space-y-3 font-mono">
            <TerminalLine prompt="whoami">
              <span className="glow-text font-bold">{config.site_title || "iantoo"}</span>
            </TerminalLine>
            <TerminalLine prompt="$">
              <TypewriterText lines={typewriterLines} speed={45} pauseMs={2500} />
            </TerminalLine>
            {config.bio && (
              <TerminalLine prompt="#" dim>
                {config.bio}
              </TerminalLine>
            )}
            <div className="pt-2 flex gap-3 flex-wrap">
              <Button asChild variant="default" size="sm">
                <Link href="/projects">{">"} view projects</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/resume">cat resume.md</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/book">book a call</Link>
              </Button>
            </div>
          </div>
        </TerminalWindow>
      </Section>

      {allSocials.length > 0 && (
        <Section>
          <TerminalLine prompt=">" className="text-xs mb-4">socials</TerminalLine>
          <SocialGrid socials={allSocials} />
        </Section>
      )}

      {featuredProjects.length > 0 && (
        <Section>
          <div className="flex items-center justify-between mb-6">
            <TerminalLine prompt=">" className="text-xs">featured projects</TerminalLine>
            <Button asChild variant="ghost" size="sm">
              <Link href="/projects">view all</Link>
            </Button>
          </div>
          <ProjectGrid projects={featuredProjects} showFilters={false} />
        </Section>
      )}
    </PageContainer>
  );
}

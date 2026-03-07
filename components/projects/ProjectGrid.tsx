"use client";
import { useState, useMemo } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";
import { parseTags } from "@/lib/utils";
import type { Project } from "@/db/schema";

interface ProjectGridProps {
  projects: Project[];
  showFilters?: boolean;
}

export function ProjectGrid({ projects, showFilters = true }: ProjectGridProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => parseTags(p.tags)))).sort(),
    [projects]
  );

  const filtered = useMemo(
    () =>
      activeTag
        ? projects.filter((p) => parseTags(p.tags).includes(activeTag))
        : projects,
    [projects, activeTag]
  );

  if (projects.length === 0) {
    return (
      <div className="text-[var(--color-muted)] font-mono text-sm py-8">
        <span className="text-[var(--color-muted)]">$ </span>
        <span>ls projects/ — no entries found.</span>
      </div>
    );
  }

  return (
    <div>
      {showFilters && (
        <ProjectFilters tags={allTags} active={activeTag} onChange={setActiveTag} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

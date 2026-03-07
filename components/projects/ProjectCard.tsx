"use client";
import { useState } from "react";
import { ExternalLink, Github, Code } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectModal } from "./ProjectModal";
import { parseTags, truncate } from "@/lib/utils";
import type { Project } from "@/db/schema";

export function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const tags = parseTags(project.tags);

  return (
    <>
      <Card
        className="cursor-pointer group hover:border-[var(--color-border-bright)] hover:shadow-[0_0_16px_var(--color-primary-glow)] transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
        onClick={() => setOpen(true)}
      >
        <CardHeader>
          <div className="flex items-start gap-3">
            {project.iconUrl ? (
              <img
                src={project.iconUrl}
                alt={project.title}
                className="w-8 h-8 border border-[var(--color-border)] object-cover"
              />
            ) : (
              <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]">
                <Code size={14} />
              </div>
            )}
            <CardTitle className="group-hover:glow-text transition-all">
              {project.title}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            {truncate(project.description, 120)}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="default" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
              {tags.length > 4 && (
                <Badge variant="muted" className="text-[10px]">
                  +{tags.length - 4}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter onClick={(e) => e.stopPropagation()}>
          {project.githubUrl && (
            <Button variant="ghost" size="icon" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub">
                <Github size={14} />
              </a>
            </Button>
          )}
          {project.url && (
            <Button variant="ghost" size="icon" asChild>
              <a href={project.url} target="_blank" rel="noopener noreferrer" title="Live site">
                <ExternalLink size={14} />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>

      <ProjectModal project={project} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

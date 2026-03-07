"use client";
import { ExternalLink, Github } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseTags } from "@/lib/utils";
import type { Project } from "@/db/schema";

interface ProjectModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, open, onClose }: ProjectModalProps) {
  const tags = parseTags(project.tags);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            {project.iconUrl && (
              <img
                src={project.iconUrl}
                alt={project.title}
                className="w-10 h-10 border border-[var(--color-border)] object-cover"
              />
            )}
            <div>
              <DialogTitle>{project.title}</DialogTitle>
              <DialogDescription>{project.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {project.longDescription && (
          <p className="text-sm text-[var(--color-primary)] leading-relaxed whitespace-pre-wrap">
            {project.longDescription}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {project.githubUrl && (
            <Button variant="default" size="sm" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github size={14} /> GitHub
              </a>
            </Button>
          )}
          {project.url && (
            <Button variant="solid" size="sm" asChild>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} /> Live Site
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

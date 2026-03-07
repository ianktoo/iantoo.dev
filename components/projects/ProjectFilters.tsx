"use client";
import { Button } from "@/components/ui/button";

interface ProjectFiltersProps {
  tags: string[];
  active: string | null;
  onChange: (tag: string | null) => void;
}

export function ProjectFilters({ tags, active, onChange }: ProjectFiltersProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={active === null ? "solid" : "ghost"}
        size="sm"
        onClick={() => onChange(null)}
      >
        all
      </Button>
      {tags.map((tag) => (
        <Button
          key={tag}
          variant={active === tag ? "solid" : "ghost"}
          size="sm"
          onClick={() => onChange(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}

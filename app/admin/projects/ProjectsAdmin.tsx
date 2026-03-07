"use client";
import { useState } from "react";
import type { Project } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { parseTags } from "@/lib/utils";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Props {
  initialProjects: Project[];
}

export function ProjectsAdmin({ initialProjects }: Props) {
  const [items, setItems] = useState<Project[]>(initialProjects);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = async () => {
    const res = await fetch("/api/projects");
    if (res.ok) setItems(await res.json());
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setItems((p) => p.filter((x) => x.id !== id));
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <TerminalLine prompt="$">projects</TerminalLine>
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus size={14} /> new project
          </Button>
        </div>

        <div className="border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
          {items.length === 0 && (
            <p className="text-xs text-[var(--color-muted)] p-4 font-mono">no projects yet.</p>
          )}
          {items.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-3 hover:bg-[var(--color-elevated)] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-[var(--color-primary)] truncate">{p.title}</span>
                  <Badge variant={p.status === "active" ? "default" : "muted"} className="text-[10px] shrink-0">
                    {p.status}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--color-muted)] truncate">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {parseTags(p.tags).slice(0, 3).map((t) => (
                    <Badge key={t} variant="muted" className="text-[9px]">{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setEditing(p)}>
                      <Pencil size={13} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                      <Trash2 size={13} className="text-[var(--color-danger)]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create dialog */}
      <Dialog open={creating} onOpenChange={(o) => !o && setCreating(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>new project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSuccess={() => { setCreating(false); refresh(); }}
            onCancel={() => setCreating(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>edit project</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProjectForm
              project={editing}
              onSuccess={() => { setEditing(null); refresh(); }}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

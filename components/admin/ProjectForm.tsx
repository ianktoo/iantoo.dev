"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project } from "@/db/schema";
import { parseTags } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  longDescription: z.string().max(5000).optional(),
  url: z.string().max(500).optional(),
  githubUrl: z.string().max(500).optional(),
  iconUrl: z.string().max(500).optional(),
  tagsRaw: z.string().max(500).optional(),
  status: z.enum(["active", "archived"]),
  sortOrder: z.coerce.number().int().optional(),
});

type FormData = z.infer<typeof schema>;

interface ProjectFormProps {
  project?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData, unknown, FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      longDescription: project?.longDescription ?? "",
      url: project?.url ?? "",
      githubUrl: project?.githubUrl ?? "",
      iconUrl: project?.iconUrl ?? "",
      tagsRaw: parseTags(project?.tags).join(", "),
      status: (project?.status as "active" | "archived") ?? "active",
      sortOrder: project?.sortOrder ?? 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    const tags = data.tagsRaw
      ? data.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const body = { ...data, tags, tagsRaw: undefined };
    const url = project ? `/api/projects/${project.id}` : "/api/projects";
    const method = project ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>title</Label>
        <Input placeholder="My Project" {...register("title")} />
        {errors.title && <p className="text-xs text-[var(--color-danger)]">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>short description</Label>
        <Input placeholder="One-liner about the project" {...register("description")} />
        {errors.description && <p className="text-xs text-[var(--color-danger)]">{errors.description.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>long description (optional)</Label>
        <Textarea placeholder="Full details..." rows={4} {...register("longDescription")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>live url</Label>
          <Input placeholder="https://..." {...register("url")} />
        </div>
        <div className="space-y-1.5">
          <Label>github url</Label>
          <Input placeholder="https://github.com/..." {...register("githubUrl")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>icon url</Label>
          <Input placeholder="https://..." {...register("iconUrl")} />
        </div>
        <div className="space-y-1.5">
          <Label>sort order</Label>
          <Input type="number" {...register("sortOrder")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>tags (comma separated)</Label>
        <Input placeholder="TypeScript, Next.js, AI" {...register("tagsRaw")} />
      </div>

      <div className="space-y-1.5">
        <Label>status</Label>
        <Select
          defaultValue={project?.status ?? "active"}
          onValueChange={(v) => setValue("status", v as "active" | "archived")}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">active</SelectItem>
            <SelectItem value="archived">archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting} variant="solid" size="sm">
          {isSubmitting ? "saving..." : project ? "save changes" : "create project"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          cancel
        </Button>
      </div>
    </form>
  );
}

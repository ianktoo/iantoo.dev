"use client";
import { useState } from "react";
import type { Social } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { Trash2, Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url(),
  label: z.string().min(1).max(50),
  icon: z.string().max(50).optional(),
  sortOrder: z.coerce.number().int().optional(),
});

type FormData = z.infer<typeof schema>;

export function SocialsAdmin({ initialSocials }: { initialSocials: Social[] }) {
  const [items, setItems] = useState<Social[]>(initialSocials);
  const [adding, setAdding] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData, unknown, FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: { sortOrder: items.length + 1 },
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/socials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, visible: true }),
    });
    if (res.ok) {
      const row = await res.json();
      setItems((s) => [...s, row]);
      reset();
      setAdding(false);
    }
  };

  const toggleVisible = async (id: number, visible: boolean) => {
    await fetch(`/api/socials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible }),
    });
    setItems((s) => s.map((x) => (x.id === id ? { ...x, visible } : x)));
  };

  const deleteItem = async (id: number) => {
    await fetch(`/api/socials/${id}`, { method: "DELETE" });
    setItems((s) => s.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex items-center justify-between">
        <TerminalLine prompt="$">socials</TerminalLine>
        <Button size="sm" onClick={() => setAdding(true)}><Plus size={13} /> add social</Button>
      </div>

      <div className="border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
        {items.length === 0 && (
          <p className="text-xs text-[var(--color-muted)] p-3 font-mono">no socials yet.</p>
        )}
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 p-3">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm text-[var(--color-primary)]">{s.label}</p>
              <p className="text-xs text-[var(--color-muted)] truncate">{s.url}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Switch
                checked={s.visible ?? true}
                onCheckedChange={(v) => toggleVisible(s.id, v)}
              />
              <Button variant="ghost" size="icon" onClick={() => deleteItem(s.id)} className="h-7 w-7">
                <Trash2 size={12} className="text-[var(--color-danger)]" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <form onSubmit={handleSubmit(onSubmit)} className="border border-[var(--color-border)] p-4 space-y-3">
          <TerminalLine prompt=">" dim className="text-xs">new social link</TerminalLine>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label>platform</Label><Input placeholder="github" {...register("platform")} /></div>
            <div className="space-y-1"><Label>label</Label><Input placeholder="GitHub" {...register("label")} /></div>
          </div>
          <div className="space-y-1"><Label>url</Label><Input placeholder="https://github.com/iantoo" {...register("url")} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label>icon (lucide name)</Label><Input placeholder="github" {...register("icon")} /></div>
            <div className="space-y-1"><Label>sort order</Label><Input type="number" {...register("sortOrder")} /></div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="solid" size="sm" disabled={isSubmitting}><Save size={13} /> save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setAdding(false)}>cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}

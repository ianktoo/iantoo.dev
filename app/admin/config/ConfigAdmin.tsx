"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { AiKnowledge } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Save } from "lucide-react";

const CONFIG_FIELDS = [
  { key: "site_title", label: "site title", type: "input" },
  { key: "tagline", label: "tagline", type: "input" },
  { key: "bio", label: "bio", type: "textarea" },
  { key: "hire_status", label: "hire status (open/closed)", type: "input" },
  { key: "avatar_url", label: "avatar url", type: "input" },
  { key: "google_calendar_booking_url", label: "google calendar booking url", type: "input" },
] as const;

interface Props {
  initialConfig: Record<string, string>;
  initialKnowledge: AiKnowledge[];
}

export function ConfigAdmin({ initialConfig, initialKnowledge }: Props) {
  const [config, setConfig] = useState<Record<string, string>>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [knowledge, setKnowledge] = useState<AiKnowledge[]>(initialKnowledge);
  const [newKey, setNewKey] = useState("");
  const [newContent, setNewContent] = useState("");
  const [addingKnowledge, setAddingKnowledge] = useState(false);

  const saveConfig = async () => {
    setSaving(true);
    await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addKnowledge = async () => {
    if (!newKey.trim() || !newContent.trim()) return;
    const res = await fetch("/api/knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: newKey.trim(), content: newContent.trim() }),
    });
    if (res.ok) {
      const row = await res.json();
      setKnowledge((k) => [...k, row]);
      setNewKey("");
      setNewContent("");
      setAddingKnowledge(false);
    }
  };

  const deleteKnowledge = async (id: number) => {
    await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
    setKnowledge((k) => k.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Site Config */}
      <div className="space-y-4">
        <TerminalLine prompt="$">site config</TerminalLine>
        {CONFIG_FIELDS.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea
                value={config[field.key] ?? ""}
                onChange={(e) => setConfig((c) => ({ ...c, [field.key]: e.target.value }))}
                rows={3}
              />
            ) : (
              <Input
                value={config[field.key] ?? ""}
                onChange={(e) => setConfig((c) => ({ ...c, [field.key]: e.target.value }))}
              />
            )}
          </div>
        ))}
        <Button variant="solid" size="sm" onClick={saveConfig} disabled={saving}>
          <Save size={13} /> {saved ? "saved!" : saving ? "saving..." : "save config"}
        </Button>
      </div>

      <Separator />

      {/* AI Knowledge */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <TerminalLine prompt="$">ai knowledge base</TerminalLine>
          <Button size="sm" variant="ghost" onClick={() => setAddingKnowledge(true)}>
            <Plus size={13} /> add fact
          </Button>
        </div>

        <div className="border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
          {knowledge.length === 0 && (
            <p className="text-xs text-[var(--color-muted)] p-3 font-mono">no knowledge entries.</p>
          )}
          {knowledge.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-[var(--color-primary)] font-semibold">{item.key}</p>
                <p className="text-xs text-[var(--color-muted)] mt-0.5 leading-relaxed">{item.content}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteKnowledge(item.id)} className="shrink-0 h-7 w-7">
                <Trash2 size={12} className="text-[var(--color-danger)]" />
              </Button>
            </div>
          ))}
        </div>

        {addingKnowledge && (
          <div className="space-y-2 border border-[var(--color-border)] p-3">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="key (e.g. favorite_stack)" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
              <Input placeholder="content (what the AI knows)" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="solid" onClick={addKnowledge}>add</Button>
              <Button size="sm" variant="ghost" onClick={() => setAddingKnowledge(false)}>cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

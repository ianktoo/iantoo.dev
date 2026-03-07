"use client";
import { useState } from "react";
import type { ResumeSection, ResumeEntry } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { parseTags } from "@/lib/utils";

interface Props {
  initialSections: ResumeSection[];
  initialEntries: ResumeEntry[];
}

export function ResumeAdmin({ initialSections, initialEntries }: Props) {
  const [sections, setSections] = useState<ResumeSection[]>(initialSections);
  const [entries, setEntries] = useState<ResumeEntry[]>(initialEntries);
  const [expanded, setExpanded] = useState<number | null>(sections[0]?.id ?? null);
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionType, setNewSectionType] = useState("experience");
  const [addingEntry, setAddingEntry] = useState<number | null>(null);

  const createSection = async () => {
    const res = await fetch("/api/resume/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: newSectionType, title: newSectionTitle, sortOrder: sections.length + 1 }),
    });
    if (res.ok) {
      const row = await res.json();
      setSections((s) => [...s, row]);
      setNewSectionTitle("");
      setAddingSection(false);
    }
  };

  const deleteSection = async (id: number) => {
    if (!confirm("Delete section and all its entries?")) return;
    await fetch(`/api/resume/sections/${id}`, { method: "DELETE" });
    setSections((s) => s.filter((x) => x.id !== id));
    setEntries((e) => e.filter((x) => x.sectionId !== id));
  };

  const deleteEntry = async (id: number) => {
    await fetch(`/api/resume/entries/${id}`, { method: "DELETE" });
    setEntries((e) => e.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <TerminalLine prompt="$">resume</TerminalLine>
        <Button size="sm" onClick={() => setAddingSection(true)}><Plus size={13} /> add section</Button>
      </div>

      {addingSection && (
        <div className="border border-[var(--color-border)] p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>section title</Label>
              <Input placeholder="Experience" value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>type</Label>
              <Select value={newSectionType} onValueChange={setNewSectionType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["experience", "education", "skills", "projects", "other"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="solid" onClick={createSection}>create</Button>
            <Button size="sm" variant="ghost" onClick={() => setAddingSection(false)}>cancel</Button>
          </div>
        </div>
      )}

      {sections.map((section) => {
        const sectionEntries = entries.filter((e) => e.sectionId === section.id);
        const isOpen = expanded === section.id;
        return (
          <div key={section.id} className="border border-[var(--color-border)]">
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[var(--color-elevated)] transition-colors"
              onClick={() => setExpanded(isOpen ? null : section.id)}
            >
              <div className="flex items-center gap-2">
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="font-mono text-sm">{section.title}</span>
                <Badge variant="muted" className="text-[9px]">{section.type}</Badge>
                <Badge variant="muted" className="text-[9px]">{sectionEntries.length} entries</Badge>
              </div>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} className="h-7 w-7">
                <Trash2 size={12} className="text-[var(--color-danger)]" />
              </Button>
            </div>

            {isOpen && (
              <div className="border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]">
                {sectionEntries.map((entry) => (
                  <div key={entry.id} className="flex items-start justify-between gap-3 p-3 hover:bg-[var(--color-elevated)]">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-[var(--color-primary)]">{entry.title}</p>
                      {entry.subtitle && <p className="text-xs text-[var(--color-muted)]">{entry.subtitle}</p>}
                      {entry.dateRange && <p className="text-xs text-[var(--color-muted)]">{entry.dateRange}</p>}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {parseTags(entry.tags).map((t) => (
                          <Badge key={t} variant="muted" className="text-[9px]">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)} className="h-7 w-7 shrink-0">
                      <Trash2 size={12} className="text-[var(--color-danger)]" />
                    </Button>
                  </div>
                ))}

                {addingEntry === section.id ? (
                  <AddEntryForm
                    sectionId={section.id}
                    onAdd={(entry) => { setEntries((e) => [...e, entry]); setAddingEntry(null); }}
                    onCancel={() => setAddingEntry(null)}
                  />
                ) : (
                  <div className="p-2">
                    <Button size="sm" variant="ghost" onClick={() => setAddingEntry(section.id)}>
                      <Plus size={12} /> add entry
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AddEntryForm({ sectionId, onAdd, onCancel }: { sectionId: number; onAdd: (e: ResumeEntry) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ title: "", subtitle: "", dateRange: "", description: "", tags: "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/resume/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionId,
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (res.ok) onAdd(await res.json());
    setSaving(false);
  };

  return (
    <div className="p-3 space-y-2 bg-[var(--color-elevated)]">
      <Input placeholder="Title*" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} />
        <Input placeholder="Date range" value={form.dateRange} onChange={(e) => setForm((f) => ({ ...f, dateRange: e.target.value }))} />
      </div>
      <Textarea placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      <Input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} />
      <div className="flex gap-2">
        <Button size="sm" variant="solid" onClick={save} disabled={saving || !form.title}>save</Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>cancel</Button>
      </div>
    </div>
  );
}

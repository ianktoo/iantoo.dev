"use client";
import { useState } from "react";
import type { SupportTicket } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { formatDate } from "@/lib/utils";

export function TicketsAdmin({ initialTickets }: { initialTickets: SupportTicket[] }) {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (id: number) => setExpanded((e) => (e === id ? null : id));

  const resolve = async (id: number) => {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolved" }),
    });
    if (res.ok) {
      setTickets((t) => t.map((x) => (x.id === id ? { ...x, status: "resolved" } : x)));
    }
  };

  return (
    <div className="space-y-4">
      <TerminalLine prompt="$">support tickets</TerminalLine>

      <div className="border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
        {tickets.length === 0 && (
          <p className="text-xs text-[var(--color-muted)] p-4 font-mono">no tickets.</p>
        )}
        {tickets.map((t) => (
          <div key={t.id} className="p-3">
            <div
              className="flex items-center justify-between cursor-pointer gap-4"
              onClick={() => toggle(t.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Badge variant={t.status === "open" ? "bright" : "muted"} className="text-[10px] shrink-0">
                  {t.status}
                </Badge>
                <span className="font-mono text-sm text-[var(--color-primary)] truncate">{t.name}</span>
                <span className="text-xs text-[var(--color-muted)] hidden sm:block truncate">{t.issue.slice(0, 60)}...</span>
              </div>
              <span className="text-xs text-[var(--color-muted)] shrink-0">{formatDate(t.createdAt)}</span>
            </div>

            {expanded === t.id && (
              <div className="mt-3 space-y-2 pl-2 border-l border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted)]">
                  <span className="text-[var(--color-primary)]">email:</span> {t.email}
                </p>
                <p className="text-xs text-[var(--color-primary)] leading-relaxed whitespace-pre-wrap">{t.issue}</p>
                {t.aiResponse && (
                  <div className="border border-[var(--color-border)] p-2">
                    <p className="text-[10px] text-[var(--color-muted)] mb-1">ai response:</p>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">{t.aiResponse}</p>
                  </div>
                )}
                {t.status === "open" && (
                  <Button size="sm" variant="muted" onClick={() => resolve(t.id)}>
                    mark resolved
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

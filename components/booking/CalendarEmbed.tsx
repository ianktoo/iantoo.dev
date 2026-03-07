"use client";

interface CalendarEmbedProps {
  url: string;
}

export function CalendarEmbed({ url }: CalendarEmbedProps) {
  if (!url) {
    return (
      <div className="border border-[var(--color-border)] p-6 text-center text-[var(--color-muted)] font-mono text-sm">
        <p>{">"} calendar not configured yet.</p>
        <p className="text-xs mt-1">check back soon or drop a message at /support</p>
      </div>
    );
  }

  return (
    <div className="border border-[var(--color-border)] overflow-hidden">
      <iframe
        src={url}
        className="w-full min-h-[600px] bg-transparent"
        frameBorder="0"
        title="Book a meeting"
        allow="payment"
      />
    </div>
  );
}

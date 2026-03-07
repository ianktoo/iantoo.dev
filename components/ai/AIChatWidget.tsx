"use client";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "hey. i'm ian's ai. ask me anything — about ian, his projects, or just vibe.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "error: couldn't reach the AI. try again." },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const updated = [...m];
          updated[updated.length - 1] = { role: "assistant", content: full };
          return updated;
        });
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "error: connection failed." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <TerminalWindow
          title="~/ai-chat"
          className="w-80 h-96 flex flex-col shadow-[0_0_30px_var(--color-primary-glow)]"
          noPadding
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={cn("font-mono text-xs", msg.role === "user" ? "text-right" : "text-left")}>
                {msg.role === "assistant" && (
                  <span className="text-[var(--color-muted)] block mb-0.5">{">"} ian.ai</span>
                )}
                <span
                  className={cn(
                    "inline-block px-2 py-1 border max-w-[90%] text-left",
                    msg.role === "user"
                      ? "border-[var(--color-border-bright)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] text-[var(--color-primary)]"
                  )}
                >
                  {msg.content || (loading && i === messages.length - 1 ? "▌" : "")}
                </span>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="text-[var(--color-muted)] text-xs font-mono">{">"} thinking▌</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[var(--color-border)] p-2 flex gap-2">
            <input
              className="flex-1 bg-transparent border border-[var(--color-border)] px-2 py-1 text-xs font-mono text-[var(--color-primary)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <Button size="icon" variant="ghost" onClick={send} disabled={loading} className="h-7 w-7">
              <Send size={12} />
            </Button>
          </div>
        </TerminalWindow>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-12 border border-[var(--color-border-bright)] bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-elevated)] hover:shadow-[0_0_15px_var(--color-primary-glow)] transition-all duration-200"
        aria-label="Toggle AI chat"
      >
        {open ? <X size={18} /> : <Bot size={18} />}
      </button>
    </div>
  );
}

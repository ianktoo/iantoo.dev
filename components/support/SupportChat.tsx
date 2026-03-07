"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TerminalLine } from "@/components/terminal/TerminalLine";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SupportChatProps {
  onHasAiResponse?: (response: string) => void;
}

export function SupportChat({ onHasAiResponse }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "support terminal active. describe your issue and i'll help troubleshoot.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `[SUPPORT REQUEST] ${text}`,
            },
          ],
        }),
      });

      if (!res.ok || !res.body) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "error contacting support AI. use the ticket form below." },
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

      setLastAiResponse(full);
      onHasAiResponse?.(full);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "connection error. please use the ticket form." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col h-80">
      {/* Title bar */}
      <div className="border-b border-[var(--color-border)] px-3 py-2 bg-[var(--color-elevated)]">
        <TerminalLine prompt="$" className="text-xs">support.ai</TerminalLine>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="font-mono text-xs">
            {msg.role === "assistant" ? (
              <div>
                <span className="text-[var(--color-muted)]">{">"} </span>
                <span className="text-[var(--color-primary)]">{msg.content}</span>
              </div>
            ) : (
              <div>
                <span className="text-[var(--color-muted)]">user$ </span>
                <span className="text-[var(--color-primary)]">{msg.content}</span>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-[var(--color-muted)] text-xs font-mono">{">"} processing▌</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--color-border)] p-2 flex gap-2">
        <input
          className="flex-1 bg-transparent text-xs font-mono text-[var(--color-primary)] placeholder:text-[var(--color-muted)] focus:outline-none"
          placeholder="describe your issue..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={loading}
        />
        <Button size="icon" variant="ghost" onClick={send} disabled={loading} className="h-7 w-7">
          <Send size={12} />
        </Button>
      </div>
    </div>
  );
}

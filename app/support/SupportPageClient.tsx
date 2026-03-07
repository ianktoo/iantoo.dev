"use client";
import { useState } from "react";
import { SupportChat } from "@/components/support/SupportChat";
import { TicketForm } from "@/components/support/TicketForm";
import { Button } from "@/components/ui/button";
import { TerminalLine } from "@/components/terminal/TerminalLine";

export function SupportPageClient() {
  const [showTicket, setShowTicket] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  return (
    <div className="space-y-6">
      <SupportChat onHasAiResponse={setAiResponse} />

      {!showTicket && (
        <div className="flex items-center gap-4">
          <TerminalLine prompt=">" dim className="text-xs">
            still need help?
          </TerminalLine>
          <Button
            variant="muted"
            size="sm"
            onClick={() => setShowTicket(true)}
          >
            open a ticket
          </Button>
        </div>
      )}

      {showTicket && (
        <div className="space-y-3">
          <TerminalLine prompt=">" className="text-xs">
            submit a support ticket
          </TerminalLine>
          <TicketForm aiResponse={aiResponse} />
        </div>
      )}
    </div>
  );
}

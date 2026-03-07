import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { SupportPageClient } from "./SupportPageClient";

export const metadata: Metadata = {
  title: "Support",
  description: "Get technical help — AI-powered support with ticket fallback.",
};

export default function SupportPage() {
  return (
    <PageContainer>
      <Section>
        <TerminalWindow title="~/support">
          <TerminalLine prompt=">" className="text-xs mb-6" dim>
            describe your issue. the AI will help first — escalate to a ticket if needed.
          </TerminalLine>
          <SupportPageClient />
        </TerminalWindow>
      </Section>
    </PageContainer>
  );
}

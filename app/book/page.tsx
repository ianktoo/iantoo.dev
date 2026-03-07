import type { Metadata } from "next";
import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { CalendarEmbed } from "@/components/booking/CalendarEmbed";

export const metadata: Metadata = {
  title: "Book a Meeting",
  description: "Schedule time with Ian.",
};

export default async function BookPage() {
  const row = await db
    .select()
    .from(siteConfig)
    .where(eq(siteConfig.key, "google_calendar_booking_url"))
    .get();

  const calendarUrl = row?.value ?? "";

  return (
    <PageContainer>
      <Section>
        <TerminalWindow title="~/book">
          <TerminalLine prompt=">" dim className="text-xs mb-4">
            pick a time slot. calendar is live.
          </TerminalLine>
          <CalendarEmbed url={calendarUrl} />
        </TerminalWindow>
      </Section>
    </PageContainer>
  );
}

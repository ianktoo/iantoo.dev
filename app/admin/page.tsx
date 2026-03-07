import { db } from "@/db";
import { projects, socials, supportTickets, resumeEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TerminalLine } from "@/components/terminal/TerminalLine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminDashboard() {
  const [projectCount, socialCount, openTickets, resumeEntryCount] = await Promise.all([
    db.$count(projects, eq(projects.status, "active")),
    db.$count(socials, eq(socials.visible, true)),
    db.$count(supportTickets, eq(supportTickets.status, "open")),
    db.$count(resumeEntries),
  ]);

  const stats = [
    { label: "active projects", value: projectCount, href: "/admin/projects" },
    { label: "social links", value: socialCount, href: "/admin/socials" },
    { label: "open tickets", value: openTickets, href: "/admin/tickets", alert: openTickets > 0 },
    { label: "resume entries", value: resumeEntryCount, href: "/admin/resume" },
  ];

  return (
    <div className="space-y-6">
      <TerminalLine prompt="$">admin dashboard</TerminalLine>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href} className="no-underline hover:no-underline">
            <Card className={`hover:border-[var(--color-border-bright)] ${stat.alert ? "border-[var(--color-warning)]" : ""}`}>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-[var(--color-muted)]">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-mono font-bold ${stat.alert ? "text-[var(--color-warning)]" : "glow-text"}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="border border-[var(--color-border)] p-4 bg-[var(--color-surface)]">
        <TerminalLine prompt=">" dim className="text-xs mb-2">quick links</TerminalLine>
        <div className="space-y-1 font-mono text-xs text-[var(--color-muted)]">
          <p>{">"} <Link href="/" className="hover:text-[var(--color-primary)]">view live site</Link></p>
          <p>{">"} <Link href="/admin/config" className="hover:text-[var(--color-primary)]">edit site config + ai knowledge</Link></p>
          <p>{">"} <Link href="/admin/tickets" className="hover:text-[var(--color-primary)]">view support tickets</Link></p>
        </div>
      </div>
    </div>
  );
}

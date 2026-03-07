import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const LINKS = [
  { href: "/admin", label: "dashboard" },
  { href: "/admin/projects", label: "projects" },
  { href: "/admin/resume", label: "resume" },
  { href: "/admin/socials", label: "socials" },
  { href: "/admin/config", label: "site config" },
  { href: "/admin/tickets", label: "tickets" },
];

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-12 bottom-0 w-48 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col p-3 gap-1 overflow-y-auto">
      <p className="text-[10px] text-[var(--color-muted)] font-mono px-2 py-1">~/admin</p>
      <Separator className="mb-1" />
      {LINKS.map((link) => (
        <Button key={link.href} variant="ghost" size="sm" asChild className="justify-start text-xs w-full">
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
      <div className="mt-auto pt-2 border-t border-[var(--color-border)]">
        <form
          action={async () => {
            "use server";
            const { signOut: so } = await import("@/lib/auth");
            await so({ redirectTo: "/" });
          }}
        >
          <Button variant="destructive" size="sm" type="submit" className="w-full text-xs">
            sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}

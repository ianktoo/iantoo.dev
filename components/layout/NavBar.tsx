import Link from "next/link";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export async function NavBar() {
  const session = await auth() as AppSession;
  const admin = isAdmin(session);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--color-border)] nav-bg">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-mono font-bold text-[var(--color-primary)] glow-text hover:no-underline">
          <span className="text-[var(--color-muted)]">~/</span>iantoo.dev
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">projects</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/resume">resume</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/support">support</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/book">book</Link>
          </Button>
          {admin && (
            <Button variant="muted" size="sm" asChild>
              <Link href="/admin">admin</Link>
            </Button>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

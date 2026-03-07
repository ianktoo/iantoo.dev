export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-border)] py-4 mt-auto">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-xs text-[var(--color-muted)] font-mono">
        <span>© {year} iantoo.dev</span>
        <span className="hidden sm:block">
          <span className="text-[var(--color-muted)]">built with </span>
          <span className="text-[var(--color-primary)]">next.js</span>
          <span className="text-[var(--color-muted)]"> + </span>
          <span className="text-[var(--color-primary)]">claude</span>
        </span>
      </div>
    </footer>
  );
}

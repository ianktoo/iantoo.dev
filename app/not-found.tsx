import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 — Not Found",
};

export default function NotFound() {
  return (
    <PageContainer>
      <Section className="flex flex-col items-center justify-center text-center min-h-[60vh]">
        <p className="text-[var(--color-muted)] text-sm mb-2 font-mono">404</p>
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-3">
          Page not found
        </h1>
        <p className="text-[var(--color-muted)] text-sm mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild variant="default" size="sm">
          <Link href="/">go home</Link>
        </Button>
      </Section>
    </PageContainer>
  );
}

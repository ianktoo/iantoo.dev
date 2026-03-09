import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { ScanlineOverlay } from "@/components/terminal/ScanlineOverlay";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://iantoo.dev"),
  title: {
    template: "%s | iantoo.dev",
    default: "iantoo.dev",
  },
  description: "Developer, builder, tinkerer. I make software that does cool things.",
  openGraph: {
    type: "website",
    url: "https://iantoo.dev",
    siteName: "iantoo.dev",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@iantoo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme')||'normal';document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-[var(--color-bg)] text-[var(--color-primary)] min-h-screen flex flex-col">
        <ThemeProvider>
          <ScanlineOverlay />
          <NavBar />
          <main className="flex-1 pt-12">{children}</main>
          <Footer />
          <AIChatWidget />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

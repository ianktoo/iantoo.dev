import { Github, Twitter, Linkedin, Globe, Youtube, Mail } from "lucide-react";
import type { Social } from "@/db/schema";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  email: Mail,
  web: Globe,
};

export function SocialLink({ social }: { social: Social }) {
  const Icon = (social.icon && ICONS[social.icon.toLowerCase()]) || Globe;
  const href = social.platform === "email" ? `mailto:${social.url}` : social.url;

  return (
    <a
      href={href}
      target={social.platform !== "email" ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:shadow-none transition-all duration-150 text-sm font-mono no-underline hover:no-underline group"
    >
      <Icon size={16} />
      <span className="group-hover:glow-text">{social.label}</span>
    </a>
  );
}

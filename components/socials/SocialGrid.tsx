import { SocialLink } from "./SocialLink";
import type { Social } from "@/db/schema";

export function SocialGrid({ socials }: { socials: Social[] }) {
  if (socials.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4">
      {socials.map((social) => (
        <SocialLink key={social.id} social={social} />
      ))}
    </div>
  );
}

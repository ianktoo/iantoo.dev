import { db } from "./index";
import { siteConfig, socials, resumeSections, resumeEntries, aiKnowledge } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Site config
  const configs = [
    { key: "site_title", value: "iantoo.dev" },
    { key: "tagline", value: "Building things that matter." },
    { key: "bio", value: "Developer, builder, tinkerer. I make software that does cool things." },
    { key: "avatar_url", value: "" },
    { key: "hire_status", value: "open" },
    { key: "google_calendar_booking_url", value: "" },
  ];

  for (const config of configs) {
    db.insert(siteConfig).values(config).onConflictDoNothing().run();
  }

  // Social links
  const socialLinks = [
    { platform: "github", url: "https://github.com/iantoo", label: "GitHub", icon: "github", sortOrder: 1, visible: true },
    { platform: "twitter", url: "https://twitter.com/iantoo", label: "Twitter", icon: "twitter", sortOrder: 2, visible: true },
    { platform: "linkedin", url: "https://linkedin.com/in/iantoo", label: "LinkedIn", icon: "linkedin", sortOrder: 3, visible: true },
  ];

  for (const social of socialLinks) {
    db.insert(socials).values(social).onConflictDoNothing().run();
  }

  // Resume sections
  const experienceSection = db
    .insert(resumeSections)
    .values({ type: "experience", title: "Experience", sortOrder: 1 })
    .returning()
    .get();

  const educationSection = db
    .insert(resumeSections)
    .values({ type: "education", title: "Education", sortOrder: 2 })
    .returning()
    .get();

  const skillsSection = db
    .insert(resumeSections)
    .values({ type: "skills", title: "Skills", sortOrder: 3 })
    .returning()
    .get();

  // Resume entries
  db.insert(resumeEntries).values({
    sectionId: experienceSection.id,
    title: "Software Engineer",
    subtitle: "Freelance / Self-employed",
    dateRange: "2022 — Present",
    description: "Building AI-powered applications, voice agents, and web platforms. Helping clients turn wild ideas into working software.",
    tags: JSON.stringify(["Next.js", "Python", "AI", "TypeScript"]),
    sortOrder: 1,
  }).run();

  db.insert(resumeEntries).values({
    sectionId: skillsSection.id,
    title: "Languages & Frameworks",
    subtitle: null,
    dateRange: null,
    description: "TypeScript, Python, Next.js, React, FastAPI, Node.js",
    tags: JSON.stringify(["TypeScript", "Python", "Next.js", "FastAPI"]),
    sortOrder: 1,
  }).run();

  db.insert(resumeEntries).values({
    sectionId: skillsSection.id,
    title: "Infrastructure & Tools",
    subtitle: null,
    dateRange: null,
    description: "Linux, nginx, Docker, SQLite, PostgreSQL, Git, Oracle Cloud",
    tags: JSON.stringify(["Linux", "nginx", "Docker", "SQLite"]),
    sortOrder: 2,
  }).run();

  // AI knowledge base
  const knowledge = [
    { key: "personality", content: "Ian is a developer who loves building things. Enthusiastic, direct, and always tinkering." },
    { key: "current_projects", content: "Building iantoo.dev (this site), AI voice agents (turtle-talk), and various automation tools." },
    { key: "interests", content: "AI/ML, voice interfaces, web development, automation, hacker culture." },
    { key: "hire_status", content: "Open to interesting opportunities. DM or book a call." },
    { key: "fun_fact", content: "Ian runs his own Oracle Cloud server and builds everything from scratch." },
  ];

  for (const item of knowledge) {
    db.insert(aiKnowledge).values(item).onConflictDoNothing().run();
  }

  console.log("Seed complete!");
}

seed().catch(console.error);

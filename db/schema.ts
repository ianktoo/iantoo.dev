import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  url: text("url"),
  githubUrl: text("github_url"),
  iconUrl: text("icon_url"),
  tags: text("tags").default("[]"), // JSON array string
  status: text("status").default("active"), // 'active' | 'archived'
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

export const socials = sqliteTable("socials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  label: text("label").notNull(),
  icon: text("icon"),
  sortOrder: integer("sort_order").default(0),
  visible: integer("visible", { mode: "boolean" }).default(true),
});

export const siteConfig = sqliteTable("site_config", {
  key: text("key").primaryKey(),
  value: text("value"),
});

export const resumeSections = sqliteTable("resume_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // experience | education | skills | other
  title: text("title").notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const resumeEntries = sqliteTable("resume_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sectionId: integer("section_id").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  dateRange: text("date_range"),
  description: text("description"),
  tags: text("tags").default("[]"), // JSON array string
  sortOrder: integer("sort_order").default(0),
});

export const aiKnowledge = sqliteTable("ai_knowledge", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  content: text("content").notNull(),
});

export const supportTickets = sqliteTable("support_tickets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  issue: text("issue").notNull(),
  aiResponse: text("ai_response"),
  status: text("status").default("open"), // 'open' | 'resolved'
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// Inferred types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Social = typeof socials.$inferSelect;
export type NewSocial = typeof socials.$inferInsert;
export type SiteConfig = typeof siteConfig.$inferSelect;
export type ResumeSection = typeof resumeSections.$inferSelect;
export type NewResumeSection = typeof resumeSections.$inferInsert;
export type ResumeEntry = typeof resumeEntries.$inferSelect;
export type NewResumeEntry = typeof resumeEntries.$inferInsert;
export type AiKnowledge = typeof aiKnowledge.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;

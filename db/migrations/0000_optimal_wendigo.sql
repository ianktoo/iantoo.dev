CREATE TABLE `ai_knowledge` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_knowledge_key_unique` ON `ai_knowledge` (`key`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`long_description` text,
	`url` text,
	`github_url` text,
	`icon_url` text,
	`tags` text DEFAULT '[]',
	`status` text DEFAULT 'active',
	`sort_order` integer DEFAULT 0,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `resume_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_id` integer NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`date_range` text,
	`description` text,
	`tags` text DEFAULT '[]',
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `resume_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `site_config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text
);
--> statement-breakpoint
CREATE TABLE `socials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform` text NOT NULL,
	`url` text NOT NULL,
	`label` text NOT NULL,
	`icon` text,
	`sort_order` integer DEFAULT 0,
	`visible` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`issue` text NOT NULL,
	`ai_response` text,
	`status` text DEFAULT 'open',
	`created_at` integer
);

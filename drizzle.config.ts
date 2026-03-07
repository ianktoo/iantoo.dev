import type { Config } from "drizzle-kit";
import path from "path";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? path.join(process.cwd(), "db", "iantoo.db"),
  },
} satisfies Config;

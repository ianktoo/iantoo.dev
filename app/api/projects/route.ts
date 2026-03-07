import { db } from "@/db";
import { projects } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  longDescription: z.string().max(5000).optional(),
  url: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  iconUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string().max(30)).max(10).optional(),
  status: z.enum(["active", "archived"]).optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "active"))
    .orderBy(asc(projects.sortOrder));
  return Response.json(rows);
}

export async function POST(req: Request) {
  const session = await auth() as AppSession;
  if (!isAdmin(session))
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = projectSchema.parse(await req.json());
  } catch (e: unknown) {
    return Response.json({ error: "Invalid input", details: e }, { status: 400 });
  }

  const row = db
    .insert(projects)
    .values({
      ...body,
      tags: JSON.stringify(body.tags ?? []),
    })
    .returning()
    .get();

  return Response.json(row, { status: 201 });
}

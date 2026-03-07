import { db } from "@/db";
import { resumeSections } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { asc } from "drizzle-orm";
import { z } from "zod";

const sectionSchema = z.object({
  type: z.enum(["experience", "education", "skills", "projects", "other"]),
  title: z.string().min(1).max(100),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const rows = await db.select().from(resumeSections).orderBy(asc(resumeSections.sortOrder));
  return Response.json(rows);
}

export async function POST(req: Request) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = sectionSchema.parse(await req.json());
  } catch (e: unknown) {
    return Response.json({ error: "Invalid input", details: e }, { status: 400 });
  }

  const row = db.insert(resumeSections).values(body).returning().get();
  return Response.json(row, { status: 201 });
}

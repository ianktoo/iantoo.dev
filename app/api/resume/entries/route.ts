import { db } from "@/db";
import { resumeEntries } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

const entrySchema = z.object({
  sectionId: z.number().int(),
  title: z.string().min(1).max(100),
  subtitle: z.string().max(100).optional(),
  dateRange: z.string().max(50).optional(),
  description: z.string().max(2000).optional(),
  tags: z.array(z.string().max(30)).max(15).optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sectionId = url.searchParams.get("sectionId");

  const query = db.select().from(resumeEntries).orderBy(asc(resumeEntries.sortOrder));

  const rows = sectionId
    ? await db.select().from(resumeEntries).where(eq(resumeEntries.sectionId, Number(sectionId))).orderBy(asc(resumeEntries.sortOrder))
    : await query;

  return Response.json(rows);
}

export async function POST(req: Request) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = entrySchema.parse(await req.json());
  } catch (e: unknown) {
    return Response.json({ error: "Invalid input", details: e }, { status: 400 });
  }

  const row = db
    .insert(resumeEntries)
    .values({ ...body, tags: JSON.stringify(body.tags ?? []) })
    .returning()
    .get();
  return Response.json(row, { status: 201 });
}

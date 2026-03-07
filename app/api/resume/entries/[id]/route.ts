import { db } from "@/db";
import { resumeEntries } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  subtitle: z.string().max(100).optional(),
  dateRange: z.string().max(50).optional(),
  description: z.string().max(2000).optional(),
  tags: z.array(z.string().max(30)).max(15).optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body;
  try {
    body = patchSchema.parse(await req.json());
  } catch (e: unknown) {
    return Response.json({ error: "Invalid input", details: e }, { status: 400 });
  }

  const updates: Record<string, unknown> = { ...body };
  if (body.tags) updates.tags = JSON.stringify(body.tags);

  const row = db.update(resumeEntries).set(updates).where(eq(resumeEntries.id, Number(id))).returning().get();
  return Response.json(row);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  db.delete(resumeEntries).where(eq(resumeEntries.id, Number(id))).run();
  return new Response(null, { status: 204 });
}

import { db } from "@/db";
import { projects } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(300).optional(),
  longDescription: z.string().max(5000).optional(),
  url: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  iconUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string().max(30)).max(10).optional(),
  status: z.enum(["active", "archived"]).optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = db.select().from(projects).where(eq(projects.id, Number(id))).get();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}

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

  const row = db.update(projects).set(updates).where(eq(projects.id, Number(id))).returning().get();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  db.delete(projects).where(eq(projects.id, Number(id))).run();
  return new Response(null, { status: 204 });
}

import { db } from "@/db";
import { socials } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const patchSchema = z.object({
  platform: z.string().min(1).max(50).optional(),
  url: z.string().url().optional(),
  label: z.string().min(1).max(50).optional(),
  icon: z.string().max(50).optional(),
  sortOrder: z.number().int().optional(),
  visible: z.boolean().optional(),
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

  const row = db.update(socials).set(body).where(eq(socials.id, Number(id))).returning().get();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  db.delete(socials).where(eq(socials.id, Number(id))).run();
  return new Response(null, { status: 204 });
}

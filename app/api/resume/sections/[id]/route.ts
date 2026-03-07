import { db } from "@/db";
import { resumeSections } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const patchSchema = z.object({
  type: z.enum(["experience", "education", "skills", "projects", "other"]).optional(),
  title: z.string().min(1).max(100).optional(),
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

  const row = db.update(resumeSections).set(body).where(eq(resumeSections.id, Number(id))).returning().get();
  return Response.json(row);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  db.delete(resumeSections).where(eq(resumeSections.id, Number(id))).run();
  return new Response(null, { status: 204 });
}

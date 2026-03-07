import { db } from "@/db";
import { aiKnowledge } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = z.object({ key: z.string().min(1).max(100).optional(), content: z.string().min(1).max(2000).optional() }).parse(await req.json());
  const row = db.update(aiKnowledge).set(body).where(eq(aiKnowledge.id, Number(id))).returning().get();
  return Response.json(row);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  db.delete(aiKnowledge).where(eq(aiKnowledge.id, Number(id))).run();
  return new Response(null, { status: 204 });
}

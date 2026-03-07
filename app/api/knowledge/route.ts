import { db } from "@/db";
import { aiKnowledge } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { z } from "zod";

export async function GET(req: Request) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(aiKnowledge);
  return Response.json(rows);
}

export async function POST(req: Request) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = z.object({ key: z.string().min(1).max(100), content: z.string().min(1).max(2000) }).parse(await req.json());
  const row = db.insert(aiKnowledge).values(body).returning().get();
  return Response.json(row, { status: 201 });
}

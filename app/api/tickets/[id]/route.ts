import { db } from "@/db";
import { supportTickets } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = z.object({ status: z.enum(["open", "resolved"]) }).parse(await req.json());

  const row = db
    .update(supportTickets)
    .set({ status: body.status })
    .where(eq(supportTickets.id, Number(id)))
    .returning()
    .get();

  return Response.json(row);
}

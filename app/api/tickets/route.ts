import { db } from "@/db";
import { supportTickets } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  return Response.json(rows);
}

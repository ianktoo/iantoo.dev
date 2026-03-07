import { db } from "@/db";
import { socials } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

const socialSchema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url(),
  label: z.string().min(1).max(50),
  icon: z.string().max(50).optional(),
  sortOrder: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export async function GET() {
  const rows = await db
    .select()
    .from(socials)
    .where(eq(socials.visible, true))
    .orderBy(asc(socials.sortOrder));
  return Response.json(rows);
}

export async function POST(req: Request) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = socialSchema.parse(await req.json());
  } catch (e: unknown) {
    return Response.json({ error: "Invalid input", details: e }, { status: 400 });
  }

  const row = db.insert(socials).values(body).returning().get();
  return Response.json(row, { status: 201 });
}

import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import { auth, isAdmin, type AppSession } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  const rows = await db.select().from(siteConfig);
  const config = Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
  return Response.json(config);
}

export async function PUT(req: Request) {
  const session = await auth() as AppSession;
  if (!isAdmin(session)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const schema = z.record(z.string(), z.string().max(5000));
  let body: Record<string, string>;
  try {
    body = schema.parse(await req.json());
  } catch (e: unknown) {
    return Response.json({ error: "Invalid input", details: e }, { status: 400 });
  }

  for (const [key, value] of Object.entries(body)) {
    db.insert(siteConfig)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteConfig.key, set: { value } })
      .run();
  }

  return Response.json({ ok: true });
}

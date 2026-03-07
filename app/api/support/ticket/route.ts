import { db } from "@/db";
import { supportTickets } from "@/db/schema";
import { ticketLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { z } from "zod";

const ticketSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  issue: z.string().min(10).max(3000),
  aiResponse: z.string().max(5000).optional(),
  // Honeypot field — if filled, it's a bot
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";

  try {
    ticketLimiter.check(5, ip);
  } catch {
    return Response.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let body;
  try {
    body = ticketSchema.parse(await req.json());
  } catch (e: unknown) {
    return Response.json({ error: "Invalid input", details: e }, { status: 400 });
  }

  // Honeypot check
  if (body.website) {
    return Response.json({ ok: true }); // silently accept to confuse bots
  }

  const row = db
    .insert(supportTickets)
    .values({
      name: body.name,
      email: body.email,
      issue: body.issue,
      aiResponse: body.aiResponse,
      status: "open",
    })
    .returning()
    .get();

  return Response.json({ ok: true, id: row.id }, { status: 201 });
}

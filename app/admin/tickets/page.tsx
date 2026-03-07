import { db } from "@/db";
import { supportTickets } from "@/db/schema";
import { desc } from "drizzle-orm";
import { TicketsAdmin } from "./TicketsAdmin";

export default async function AdminTicketsPage() {
  const tickets = await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  return <TicketsAdmin initialTickets={tickets} />;
}

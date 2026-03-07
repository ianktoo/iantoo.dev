import { db } from "@/db";
import { socials } from "@/db/schema";
import { asc } from "drizzle-orm";
import { SocialsAdmin } from "./SocialsAdmin";

export default async function AdminSocialsPage() {
  const allSocials = await db.select().from(socials).orderBy(asc(socials.sortOrder));
  return <SocialsAdmin initialSocials={allSocials} />;
}

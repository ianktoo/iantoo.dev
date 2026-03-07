import { db } from "@/db";
import { resumeSections, resumeEntries } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ResumeAdmin } from "./ResumeAdmin";

export default async function AdminResumePage() {
  const [sections, entries] = await Promise.all([
    db.select().from(resumeSections).orderBy(asc(resumeSections.sortOrder)),
    db.select().from(resumeEntries).orderBy(asc(resumeEntries.sortOrder)),
  ]);
  return <ResumeAdmin initialSections={sections} initialEntries={entries} />;
}

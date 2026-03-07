import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ProjectsAdmin } from "./ProjectsAdmin";

export default async function AdminProjectsPage() {
  const allProjects = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  return <ProjectsAdmin initialProjects={allProjects} />;
}

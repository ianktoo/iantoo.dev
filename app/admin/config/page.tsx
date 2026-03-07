import { db } from "@/db";
import { siteConfig, aiKnowledge } from "@/db/schema";
import { ConfigAdmin } from "./ConfigAdmin";

export default async function AdminConfigPage() {
  const [configs, knowledge] = await Promise.all([
    db.select().from(siteConfig),
    db.select().from(aiKnowledge),
  ]);

  const configMap = Object.fromEntries(configs.map((c) => [c.key, c.value ?? ""]));

  return <ConfigAdmin initialConfig={configMap} initialKnowledge={knowledge} />;
}

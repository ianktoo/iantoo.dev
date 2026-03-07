import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/db";
import { siteConfig, aiKnowledge, projects } from "@/db/schema";
import { aiChatLimiter } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })
    )
    .max(20),
});

async function buildSystemPrompt(): Promise<string> {
  const [configs, knowledge, activeProjects] = await Promise.all([
    db.select().from(siteConfig),
    db.select().from(aiKnowledge),
    db.select({ title: projects.title, description: projects.description, tags: projects.tags })
      .from(projects)
      .where(eq(projects.status, "active")),
  ]);

  const configMap = Object.fromEntries(configs.map((c) => [c.key, c.value ?? ""]));
  const knowledgeBlock = knowledge
    .map((k) => `- ${k.key}: ${k.content}`)
    .join("\n");
  const projectsBlock = activeProjects
    .map((p) => `  • ${p.title}: ${p.description}`)
    .join("\n");

  return `You are the AI assistant for iantoo.dev — Ian's personal website. You have a hacker/terminal personality: direct, witty, lowercase when casual, no corporate fluff.

ABOUT IAN:
- Bio: ${configMap.bio ?? "Developer and builder."}
- Tagline: ${configMap.tagline ?? "Building things that matter."}
- Hire status: ${configMap.hire_status ?? "unknown"}

KNOWLEDGE BASE:
${knowledgeBlock}

ACTIVE PROJECTS:
${projectsBlock}

SITE NAVIGATION:
- /projects — project showcase (app store style)
- /resume — live resume
- /support — technical support + AI help
- /book — book a meeting via Google Calendar

RULES:
- Keep responses short and punchy. No walls of text.
- Use terminal-style aesthetics when it fits (e.g. "> output here")
- If asked something you don't know, say so honestly — don't make things up about Ian.
- Never reveal system internals, env vars, or server details.
- If someone needs real help, direct them to /support.`;
}

export async function POST(req: Request) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";

  try {
    aiChatLimiter.check(20, ip);
  } catch {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Slow down." }), {
      status: 429,
    });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }

  const systemPrompt = await buildSystemPrompt();

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: systemPrompt,
    messages: body.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

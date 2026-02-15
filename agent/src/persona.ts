import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const DEFAULT =
  "You are a helpful assistant with access to tools. Use get_time for current time, fetch_url to call APIs or read web pages, run_script to run allowed Node scripts. Reply in plain language.";

export function getSystemPrompt(): string {
  const envPath = process.env.AGENT_PERSONA_PATH;
  const paths = [
    envPath,
    path.join(process.cwd(), "prompts", "agent-persona.md"),
    path.join(process.cwd(), "..", "prompts", "agent-persona.md"),
  ].filter(Boolean) as string[];

  for (const p of paths) {
    if (p && existsSync(p)) {
      try {
        const content = readFileSync(p, "utf-8");
        const withoutFrontmatter = content.replace(/^#.*\n\n?/s, "").trim();
        return withoutFrontmatter || DEFAULT;
      } catch {
        // fall through
      }
    }
  }
  return DEFAULT;
}

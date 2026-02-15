import { execSync } from "node:child_process";
import path from "node:path";
import type { Tool } from "ollama";

const TOOLS: Tool[] = [
  {
    type: "function",
    function: {
      name: "get_time",
      description: "Get the current date and time (local timezone)",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fetch_url",
      description: "Fetch content from a URL (GET). Use for calling APIs or reading web pages.",
      parameters: {
        type: "object",
        required: ["url"],
        properties: {
          url: { type: "string", description: "The URL to fetch" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "run_script",
      description: "Run a Node.js script from the project scripts folder. Only scripts in scripts/ are allowed.",
      parameters: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", description: "Script filename without path, e.g. hello.js" },
        },
      },
    },
  },
];

export function getToolsSchema(): Tool[] {
  return TOOLS;
}

export async function runTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case "get_time":
      return new Date().toISOString();

    case "fetch_url": {
      const url = args.url as string;
      if (!url || typeof url !== "string") return "Error: url required";
      const res = await fetch(url);
      const text = await res.text();
      return `Status: ${res.status}\n${text.slice(0, 8000)}`;
    }

    case "run_script": {
      const name = args.name as string;
      if (!name || typeof name !== "string") return "Error: name required";
      const base = path.resolve(process.cwd(), "scripts");
      const requested = path.resolve(base, name);
      if (!requested.startsWith(base) || path.relative(base, requested).startsWith("..")) {
        return "Error: script must be inside scripts/";
      }
      try {
        const out = execSync(`node "${requested}"`, {
          encoding: "utf-8",
          timeout: 10_000,
        });
        return out.trim() || "(no output)";
      } catch (e: unknown) {
        const err = e as { stdout?: string; stderr?: string; message?: string };
        return `Error: ${err.stderr ?? err.message ?? String(e)}`;
      }
    }

    default:
      return `Unknown tool: ${name}`;
  }
}

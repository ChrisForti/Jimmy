import { execSync } from "node:child_process";
import path from "node:path";
import type { Tool } from "ollama";
import * as cheerio from "cheerio";

const API_URL =
  process.env.FOURTHREADS_API_URL ||
  "https://pod-api-production.up.railway.app";

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
      description:
        "Fetch content from a URL (GET). Use for calling APIs or reading web pages.",
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
      name: "scrape_trends",
      description:
        "Scrape a webpage and extract text content for trend analysis. Returns clean text from the page.",
      parameters: {
        type: "object",
        required: ["url"],
        properties: {
          url: { type: "string", description: "The URL to scrape for trends" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_google_trends",
      description:
        "Check Google Trends for keyword popularity. Returns trending data for a search term.",
      parameters: {
        type: "object",
        required: ["keyword"],
        properties: {
          keyword: {
            type: "string",
            description: "The keyword or phrase to check on Google Trends",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "pod_api_get",
      description:
        "Call a GET endpoint on the 4dthreads POD API (Railway). Use for fetching products, trends, or data.",
      parameters: {
        type: "object",
        required: ["endpoint"],
        properties: {
          endpoint: {
            type: "string",
            description: "API endpoint path (e.g., '/products', '/trends')",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "pod_api_post",
      description:
        "Call a POST endpoint on the 4dthreads POD API (Railway). Use for creating products or submitting data.",
      parameters: {
        type: "object",
        required: ["endpoint", "data"],
        properties: {
          endpoint: {
            type: "string",
            description: "API endpoint path (e.g., '/products', '/designs')",
          },
          data: {
            type: "string",
            description: "JSON string of data to send in the request body",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "run_script",
      description:
        "Run a Node.js script from the project scripts folder. Only scripts in scripts/ are allowed.",
      parameters: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            description: "Script filename without path, e.g. hello.js",
          },
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
  args: Record<string, unknown>,
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

    case "scrape_trends": {
      const url = args.url as string;
      if (!url || typeof url !== "string") return "Error: url required";
      try {
        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, and navigation
        $("script, style, nav, header, footer").remove();

        // Extract text content
        const text = $("body").text().replace(/\s+/g, " ").trim();
        return text.slice(0, 8000);
      } catch (e) {
        return `Error scraping: ${String(e)}`;
      }
    }

    case "search_google_trends": {
      const keyword = args.keyword as string;
      if (!keyword || typeof keyword !== "string")
        return "Error: keyword required";

      // Google Trends doesn't have a free API, so we'll scrape the trends page
      const encodedKeyword = encodeURIComponent(keyword);
      const url = `https://trends.google.com/trends/explore?q=${encodedKeyword}`;

      return `Google Trends URL for "${keyword}": ${url}\n\nNote: For detailed trend data, consider using the Google Trends API or scraping the page with scrape_trends tool.`;
    }

    case "pod_api_get": {
      const endpoint = args.endpoint as string;
      if (!endpoint || typeof endpoint !== "string")
        return "Error: endpoint required";

      try {
        const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
        const res = await fetch(url);
        const text = await res.text();
        return `Status: ${res.status}\n${text.slice(0, 8000)}`;
      } catch (e) {
        return `Error calling POD API: ${String(e)}`;
      }
    }

    case "pod_api_post": {
      const endpoint = args.endpoint as string;
      const data = args.data as string;

      if (!endpoint || typeof endpoint !== "string")
        return "Error: endpoint required";
      if (!data || typeof data !== "string") return "Error: data required";

      try {
        const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
        });
        const text = await res.text();
        return `Status: ${res.status}\n${text.slice(0, 8000)}`;
      } catch (e) {
        return `Error calling POD API: ${String(e)}`;
      }
    }

    case "run_script": {
      const name = args.name as string;
      if (!name || typeof name !== "string") return "Error: name required";
      const base = path.resolve(process.cwd(), "scripts");
      const requested = path.resolve(base, name);
      if (
        !requested.startsWith(base) ||
        path.relative(base, requested).startsWith("..")
      ) {
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

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import type { Message } from "ollama";

const DATA_DIR = process.env.AGENT_DATA_DIR ?? path.join(process.cwd(), "data", "sessions");

function sessionPath(sessionId: string): string {
  const safe = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 128);
  return path.join(DATA_DIR, `${safe}.json`);
}

export function loadSession(sessionId: string): Message[] {
  const file = sessionPath(sessionId);
  if (!existsSync(file)) return [];
  try {
    const raw = readFileSync(file, "utf-8");
    const data = JSON.parse(raw) as { messages?: Message[] };
    return Array.isArray(data.messages) ? data.messages : [];
  } catch {
    return [];
  }
}

export function saveSession(sessionId: string, messages: Message[]): void {
  mkdirSync(DATA_DIR, { recursive: true });
  const file = sessionPath(sessionId);
  writeFileSync(file, JSON.stringify({ messages }, null, 0), "utf-8");
}

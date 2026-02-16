import { Ollama, type Message } from "ollama";
import { getToolsSchema, runTool } from "./tools.js";
import { getSystemPrompt } from "./persona.js";
import { speak } from "./utils/speech.js";

const MODEL = process.env.OLLAMA_MODEL ?? "llama3.2";
const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://localhost:11434";
const ENABLE_SPEECH = process.env.ENABLE_SPEECH === "true";

const client = new Ollama({ host: OLLAMA_HOST });
const tools = getToolsSchema();

export type ChatResult = { reply: string; newMessages: Message[] };

export async function chat(
  userMessage: string,
  history: Message[] = []
): Promise<ChatResult> {
  const systemPrompt = getSystemPrompt();
  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userMessage },
  ];

  const maxTurns = 10;
  for (let turn = 0; turn < maxTurns; turn++) {
    const response = await client.chat({
      model: MODEL,
      messages,
      tools,
      stream: false,
    });

    const msg = response.message;
    messages.push(msg);

    const toolCalls = msg.tool_calls ?? [];
    if (toolCalls.length === 0) {
      const reply = (msg.content ?? "").trim() || "No response.";
      if (ENABLE_SPEECH) {
        speak(reply);
      }
      return { reply, newMessages: messages.slice(1) };
    }

    for (const call of toolCalls) {
      const name = call.function.name;
      const raw = call.function.arguments;
      const args =
        typeof raw === "string"
          ? (JSON.parse(raw) as Record<string, unknown>)
          : (raw ?? {});
      const result = await runTool(name, args);
      messages.push({
        role: "tool",
        tool_name: name,
        content: result,
      });
    }
  }

  return {
    reply: "Stopped after max tool turns.",
    newMessages: messages.slice(1),
  };
}

# Jimmy

I'm playing around with creating a **standalone AI agent** — that's what this project is.

Stack: **React, Node, TypeScript.**

## Guidelines

- **Radical Simplicity**: Keep code minimal, avoid over-engineering, prefer straightforward solutions
- **Testing**: Unit tests only needed for flaky code – focus on complex logic, edge cases, and error-prone areas

## Getting started

```bash
docker compose up -d
```

- **Ollama**: local LLM runtime → `http://localhost:11434`
- **Open WebUI**: chat UI → `http://localhost:3000`
- **Agent** (tools): `http://localhost:3141` — POST `/chat` with `{ "message": "..." }` or `{ "message": "...", "sessionId": "my-session" }` to keep conversation memory across requests. Uses `get_time`, `fetch_url`, `run_script` (scripts in `agent/scripts/`).

  ```bash
  curl -s -X POST http://localhost:3141/chat -H "Content-Type: application/json" -d '{"message":"What time is it?"}'
  curl -s -X POST http://localhost:3141/chat -H "Content-Type: application/json" -d '{"message":"Remember: my name is Alex.","sessionId":"user-1"}'
  curl -s -X POST http://localhost:3141/chat -H "Content-Type: application/json" -d '{"message":"What is my name?","sessionId":"user-1"}'
  ```

  **Agent persona**: Edit `prompts/agent-persona.md` to define who the agent is and how it should behave; the agent loads it at startup (via the mounted `prompts/` volume).

### Models

Pull a model into Ollama (one-time), then choose it in Open WebUI or set `OLLAMA_MODEL` for the agent in `docker-compose.yml`.

| Model           | Pull command                              | Notes                    |
|----------------|-------------------------------------------|--------------------------|
| Llama 3.2       | `docker exec -it ollama ollama pull llama3.2`       | Default, good tool use   |
| DeepSeek R1     | `docker exec -it ollama ollama pull deepseek-r1`   | Strong reasoning         |
| DeepSeek V3     | `docker exec -it ollama ollama pull deepseek-v3`   | Large MoE (671B)         |

DeepSeek v3.2 is cloud-only on Ollama and often fails to pull locally; use `deepseek-r1` or `deepseek-v3` instead.

To stop:

```bash
docker compose down
```

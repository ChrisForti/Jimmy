# Jimmy

**Jimmy** is an autonomous AI agent designed to run on a Raspberry Pi and manage a Print on Demand (POD) business. The agent performs market trend analysis for products like shirts and stationary using Printful, and integrates with an existing site and API (@4dthreads dev).

**Stack:** React, Node, TypeScript

## Project Overview

- **Deployment**: Runs autonomously on Raspberry Pi
- **Remote Access**: Manage from Mac via SSH
- **Primary Function**: POD site management and trend analysis
- **Integration**: Works with existing site/API infrastructure
- **Products**: Focuses on shirts and stationary via Printful API

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

  **Speech output**: Set `ENABLE_SPEECH=true` in `docker-compose.yml` to have the agent speak responses aloud (macOS only, requires `say` command).

### Models

Pull a model into Ollama (one-time), then choose it in Open WebUI or set `OLLAMA_MODEL` for the agent in `docker-compose.yml`.

| Model       | Pull command                                     | Notes                  |
| ----------- | ------------------------------------------------ | ---------------------- |
| Llama 3.2   | `docker exec -it ollama ollama pull llama3.2`    | Default, good tool use |
| DeepSeek R1 | `docker exec -it ollama ollama pull deepseek-r1` | Strong reasoning       |
| DeepSeek V3 | `docker exec -it ollama ollama pull deepseek-v3` | Large MoE (671B)       |

DeepSeek v3.2 is cloud-only on Ollama and often fails to pull locally; use `deepseek-r1` or `deepseek-v3` instead.

To stop:

```bash
docker compose down
```

## Raspberry Pi Deployment

### Prerequisites

Install dependencies on your Pi:

```bash
# Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker pi

# Node.js (if needed outside Docker)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Remote Access

Find your Pi's IP address:

```bash
hostname -I
```

SSH from your Mac:

```bash
ssh pi@<PI_IP_ADDRESS>
```

Deploy to Pi:

```bash
# Clone repo on Pi
git clone <repository-url> ~/jimmy
cd ~/jimmy

# Start services
docker compose up -d
```

### Integration with 4dthreads

Jimmy integrates with your existing POD infrastructure:

- **API** (Railway): Set `FOURTHREADS_API_URL` in `docker-compose.yml` to your Railway API endpoint
- **Site** (GitHub): Frontend hosted separately
- **Printful credentials**: Stored in your API's .env on Railway

Update the API URL in `docker-compose.yml`:

```yaml
- FOURTHREADS_API_URL=https://your-api.railway.app
```

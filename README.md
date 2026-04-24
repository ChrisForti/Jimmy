# Jimmy

**Jimmy** is an autonomous AI agent designed to run on a Raspberry Pi and manage a Print on Demand (POD) business. The agent performs market trend analysis for products like shirts, stationary, mugs, sportfishing boat parts, and cosmetic repairs using Printful, and integrates with an existing site and API (@4dthreads dev).

**Stack:** React, Node, TypeScript

## Project Overview

- **Deployment**: Runs autonomously on Raspberry Pi
- **Remote Access**: Manage from Mac via SSH
- **Primary Function**: POD site management and trend analysis
- **Integration**: Works with existing site/API infrastructure
- **Products**: Shirts, stationary, mugs, sportfishing boat parts, cosmetic repairs via Printful API

## Guidelines

- **Radical Simplicity**: Keep code minimal, avoid over-engineering, prefer straightforward solutions
- **Testing**: Unit tests only needed for flaky code – focus on complex logic, edge cases, and error-prone areas

## Quick Start Guide

### First-Time Setup (Raspberry Pi)

1. **Connect to Pi via Tailscale:**

   ```bash
   # On Mac: Ensure Tailscale is running
   tailscale status

   # SSH to Pi
   ssh chris@100.119.12.61
   ```

2. **Navigate to Jimmy:**

   ```bash
   cd ~/Jimmy
   ```

3. **Start the containers:**

   ```bash
   docker compose up -d
   ```

4. **Pull the AI model (one-time, ~2GB download):**

   ```bash
   docker exec -it ollama ollama pull llama3.2
   ```

5. **Verify it's running:**

   ```bash
   docker logs jimmy-agent --tail 20
   # Should see: "Agent listening on http://localhost:3141"

   curl -X POST http://localhost:3141/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"What time is it?"}'
   ```

### Regular Startup

```bash
# Connect to Pi
ssh chris@100.119.12.61

# Start Jimmy
cd ~/Jimmy && docker compose up -d

# Check status
docker ps
```

### Stopping Jimmy

```bash
cd ~/Jimmy && docker compose down
```

## Accessing Services

### From the Raspberry Pi (localhost):

- **Jimmy Agent**: `http://localhost:3141`
- **Open WebUI**: `http://localhost:3000`
- **Ollama**: `http://localhost:11434`

### From your Mac (via Tailscale):

- **Jimmy Agent**: `http://100.119.12.61:3141`
- **Open WebUI**: `http://100.119.12.61:3000`
- **Ollama**: `http://100.119.12.61:11434`

## Testing the Agent

Test Jimmy with a simple query:

```bash
# On Pi:
curl -X POST http://localhost:3141/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What time is it?"}'

# From Mac:
curl -X POST http://100.119.12.61:3141/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What products should we analyze today?"}'
```

### Using sessions (memory):

```bash
curl -X POST http://localhost:3141/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Remember: my name is Alex.","sessionId":"user-1"}'

curl -X POST http://localhost:3141/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is my name?","sessionId":"user-1"}'
```

## Troubleshooting

### "model 'llama3.2' not found"

Pull the model first:

```bash
docker exec -it ollama ollama pull llama3.2
```

### Check if containers are running:

```bash
docker ps
# Should show: jimmy-agent, ollama, open-webui
```

### View agent logs:

```bash
docker logs jimmy-agent --tail 50
docker logs jimmy-agent -f  # Follow logs in real-time
```

### Restart everything:

```bash
docker compose down && docker compose up -d
```

### Can't SSH to Pi:

Check Tailscale is running on Mac:

```bash
tailscale status
# If not connected: tailscale up
```

## Development

### Local development on Mac:

Edit code locally, changes sync to Pi automatically if using a shared folder, or:

```bash
# Edit files on Mac
cd ~/repos/jimmy

# Then on Pi, rebuild:
ssh chris@100.119.12.61
cd ~/Jimmy
docker compose down
docker compose up -d --build
```

### Install dependencies for editor IntelliSense (Mac only):

```bash
cd ~/repos/jimmy/agent
npm install
```

## Configuration

### Agent Persona

Edit `prompts/agent-persona.md` to change Jimmy's behavior and instructions.

### Change AI Model

Edit `docker-compose.yml` and set `OLLAMA_MODEL`:

```yaml
environment:
  - OLLAMA_MODEL=llama3.2 # or deepseek-r1, etc.
```

### Change API URL

Edit `docker-compose.yml` and set `FOURTHREADS_API_URL`:

```yaml
environment:
  - FOURTHREADS_API_URL=https://your-api.com
```

## Autonomous Scheduling

Jimmy runs market analysis automatically **every 6 hours**. Check what he's doing:

```bash
docker logs jimmy-agent | grep "Scheduler"
```

To run analysis immediately on startup, set in `docker-compose.yml`:

```yaml
environment:
  - RUN_ANALYSIS_ON_STARTUP=true
```

## Available Models

| Model       | Pull command                                     | Notes                  |
| ----------- | ------------------------------------------------ | ---------------------- |
| Llama 3.2   | `docker exec -it ollama ollama pull llama3.2`    | Default, good tool use |
| DeepSeek R1 | `docker exec -it ollama ollama pull deepseek-r1` | Strong reasoning       |
| DeepSeek V3 | `docker exec -it ollama ollama pull deepseek-v3` | Large MoE (671B)       |

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

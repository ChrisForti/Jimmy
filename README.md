# Market Analyzer - Artisan Watercraft Market Research Agents

**Market Analyzer** is an autonomous AI agent system designed to run on a Raspberry Pi and research market trends in the high-end artisan watercraft industry. The system performs real-time market analysis using **Tavily Search API** (free tier) + **OpenRouter** (free models) for virtually cost-free operation.

**Role:** Senior Market Strategist & Artisan Researcher  
**Industry Focus:** High-End Artisan Personal Watercraft (SUP, Surf, Kayak, Canoe)  
**Core Philosophy:** Hollow-wood, Cedar-strip, Cold-molded, and CNC-integrated composite artisan builds

**Stack:** Node, TypeScript, Drizzle ORM, PostgreSQL (Railway), Tavily Search API, OpenRouter

## Project Overview

- **Deployment**: Runs autonomously on Raspberry Pi
- **Remote Access**: Manage from Mac via SSH (Tailscale)
- **Database**: Railway PostgreSQL (cloud-hosted, shared across all agents)
- **AI Architecture**: Tavily (free search) → OpenRouter (free/cheap LLMs)
- **Monthly Cost**: ~$5 (just Railway database!)
- **Transparency**: Every insight includes source citations (e.g., "NMMA 2026 Report", "Etsy Trending")

## Three Market Research Agents

The system runs **three specialized agents** on different schedules:

### 1. SUP Agent (Stand-Up Paddleboards)

- **Schedule**: Every 6 hours
- **Focus**: Wooden SUPs (Touring, Displacement, All-around hulls)
- **Table**: `standup_opportunities`
- **Markets**: High-end artisan paddleboards, hollow-wood construction

### 2. Surfboard Agent (Eco & Wooden Surfboards)

- **Schedule**: Daily at 9 AM
- **Focus**: Eco surf, wooden surfboards, sustainable materials
- **Table**: `surfboard_opportunities`
- **Markets**: Paulownia, balsa, bamboo boards, fish/longboard/mid-length shapes

### 3. Kayak/Canoe Agent (Wooden Boats)

- **Schedule**: Every 2 days at 10 AM
- **Focus**: Cedar-strip kayaks & canoes, traditional boat building
- **Table**: `kayak_opportunities`
- **Markets**: Touring kayaks, solo pack boats, tandem canoes, prospector shapes

## Two-Step Research Workflow

**Why This Architecture?**

- Tavily provides FREE real-time web search (1,000/month)
- OpenRouter offers FREE LLMs (Gemini 2.0 Flash)
- Result: Virtually free market research with current data!

**Step 1: Tavily Search (FREE)**

- Agent sends optimized search queries to Tavily
- Tavily returns AI-ready clean text from 10+ sources
- No credit card required for free tier

**Step 2: OpenRouter Analysis (Nearly FREE)**

- Agent sends Tavily results to OpenRouter (Gemini Flash)
- LLM structures data into actionable market opportunities
- Cost: ~$0.001 per research run

**Cost: ~$0** per month for API usage (free tiers) + ~$5-10 for database

## Research Objectives

### The "Paddleboard Phase" (Primary Focus)

The agent scans 2026 global/regional markets for wood-constructed SUPs (no inflatables/foam-core):

- **Shape & Performance Trends**: Touring vs Displacement vs All-Around, preferred lengths (12'6" vs 14')
- **Aesthetic Materiality**: Viral wood combinations (Western Red Cedar, Dark Walnut, Paulownia)
- **Luxury Feature Gaps**: Integrated tech (GPS mounts), specialized fins, Eco-Luxe bio-resin finishes
- **Price Ceiling**: Boutique hand-built hollow wooden board retail positioning

### Custom Craft Expansion (Secondary Focus)

Identifies "Build Gaps" where artisan woodworking provides competitive advantage:

- Hollow Wooden Surfboards (Longboard/Mid-length segments)
- Cedar-Strip Canoes & Kayaks (Solo Pack Boats, Expedition Kayaks, Prospector shapes)
- Technical Accessories (wooden paddles, CNC-machined fin boxes, decorative inlays)

## Shop Capabilities

Research is constrained/optimized by actual shop capabilities:

- **Hand-Build Mastery**: Zero size limits for cedar-strip or hollow-wood projects
- **CNC Precision**: 3018 Pro (300mm x 400mm) for custom parts, placards, hardware, inlays
- **Material Access**: Marine Hardwoods (Teak, Mahogany, Walnut), Acrylics, King StarBoard

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI APIs**:
  - **Tavily Search API** - Real-time web search (FREE tier: 1,000 searches/month)
  - **OpenRouter** - LLM analysis with free Gemini 2.0 Flash model
- **Scheduling**: node-cron for automated research runs
- **Cost**: ~$5-10/month (just database hosting!)

## Getting Started

### 1. Install Dependencies

```bash
cd agent
npm install
```

### 2. Configure Environment

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
# Railway PostgreSQL connection string (from Railway dashboard)
DATABASE_URL=postgresql://postgres:password@host.railway.app:port/railway

# Tavily Search API (free tier: 1,000 searches/month)
TAVILY_API_KEY=tvly-xxxxxxxxxxxxx

# OpenRouter API (free Gemini 2.0 Flash model)
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxx

# Optional: Override default model
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free

# Enable automated scheduler (set to "true" for production)
ENABLE_SCHEDULER=false
```

### 3. Set Up Database

Generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 4. Run the Agent

Development mode (with hot reload):

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## Database Schema

The system uses **three separate tables** in Railway PostgreSQL to track different markets:

### 1. `standup_opportunities` - SUP Market Research

**Core Opportunity Fields**:

- **opportunity**: High-value build opportunity (e.g., "14' Hollow-Wood Touring SUP")
- **sourceOrigin**: Primary data source citations (NMMA reports, Etsy trends, etc.)
- **marketWhy**: Data supporting demand
- **materialRecommendation**: Wood/finish combo recommendations
- **cncEdge**: How the 3018 Pro CNC adds value
- **targetBuyerPersona**: Buyer profiles and willingness-to-pay

**Technical**: craftType, hullType, constructionMethod, length, width  
**Materials**: primaryWood, accentWood, finishTrend  
**Market**: pricePoint, marketSentiment, luxuryFeatures

### 2. `surfboard_opportunities` - Surfboard Market Research

**Core Opportunity Fields**: (same structure as SUP)

**Technical**: boardType (fish, longboard, mid-length), constructionMethod, length, width, thickness  
**Materials**: primaryWood (paulownia, balsa, bamboo), accentWood, finishTrend  
**Market**: pricePoint, marketSentiment, ecoFeatures

### 3. `kayak_opportunities` - Kayak & Canoe Market Research

**Core Opportunity Fields**: (same structure as SUP)

**Technical**: boatType (touring, sea, solo, tandem), constructionMethod, length, width, capacity  
**Materials**: primaryWood (cedar, mahogany), accentWood, finishTrend  
**Market**: pricePoint, marketSentiment, heritageFeatures

## Guidelines

- **Radical Simplicity**: Keep code minimal, avoid over-engineering, prefer straightforward solutions
- **Testing**: Unit tests only needed for flaky code – focus on complex logic, edge cases, and error-prone areas

## Deploying to Raspberry Pi

### First-Time Setup (Raspberry Pi)

1. **Connect to Pi via Tailscale:**

   ```bash
   # On Mac: Ensure Tailscale is running
   tailscale status

   # SSH to Pi (use your Pi's Tailscale IP)
   ssh chris@<pi-tailscale-ip>
   ```

2. **Clone and setup:**

   ```bash
   cd ~
   git clone https://github.com/ChrisForti/market-analyzer.git
   cd market-analyzer
   ```

3. **Configure environment:**

   Create `.env` file in the root with your Railway credentials:

   ```bash
   nano .env
   ```

   Add:

   ```
   DATABASE_URL=postgresql://postgres:password@host.railway.app:port/railway
   TAVILY_API_KEY=tvly-xxxxxxxxxxxxx
   OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxx
   OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
   ENABLE_SCHEDULER=true
   ```

4. **Start with Docker Compose:**

   ```bash
   docker compose up -d --build
   ```

   This will:
   - Build the agent container
   - Run database migrations automatically
   - Start all three market research agents
   - Start Adminer for database management (port 8081)

### Regular Operation

**View logs:**

```bash
docker logs market-analyzer-agent -f
```

**Restart after pulling updates:**

```bash
cd ~/market-analyzer
git pull
docker compose down
docker compose up -d --build
```

**Access Adminer (Database UI):**

- URL: `http://<pi-ip>:8081`
- Server: `<railway-host>:port`
- Username: `postgres`
- Password: `<railway-password>`
- Database: `railway`

## Research Agents

The system runs three specialized market research agents:

### Agent Workflow

Each agent follows the same structured approach:

1. **Queries Tavily API** for real-time market intelligence
2. **Analyzes opportunities** specific to their market segment
3. **Structures insights** with source citations, market evidence, material recommendations
4. **Stores data** in dedicated Railway PostgreSQL tables
5. **Runs on schedule** via node-cron:
   - **SUP Agent**: Every 6 hours
   - **Surfboard Agent**: Daily at 9 AM
   - **Kayak/Canoe Agent**: Every 2 days at 10 AM

**Output Format**: Each research cycle produces 5-10 high-value opportunities with:

- Market evidence and demand data with source citations
- Specific wood/finish recommendations
- CNC value-add suggestions (3018 Pro capabilities)
- Target buyer personas with willingness-to-pay
- Focus on boutique/artisan markets (not mass production)

**Customize agents:**

- SUP: [src/agents/sup-market.ts](agent/src/agents/sup-market.ts)
- Surfboard: [src/agents/surfboard.ts](agent/src/agents/surfboard.ts)
- Kayak/Canoe: [src/agents/kayak.ts](agent/src/agents/kayak.ts)

# On Pi:

curl -X POST http://localhost:3141/chat \
 -H "Content-Type: application/json" \
 -d '{"message":"What time is it?"}'

# From Mac:

curl -X POST http://100.119.12.61:3141/chat \
 -H "Content-Type: application/json" \
 -d '{"message":"What products should we analyze today?"}'

````

### Using sessions (memory):

```bash
curl -X POST http://localhost:3141/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Remember: my name is Alex.","sessionId":"user-1"}'

curl -X POST http://localhost:3141/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is my name?","sessionId":"user-1"}'
````

## Troubleshooting

### "model 'llama3.2' not found"

Pull the model first:

```bash
docker exec -it ollama ollama pull llama3.2
```

### Check if containers are running:

```bash
docker ps
# Should show: market-analyzer-agent, ollama, open-webui
```

### View agent logs:

```bash
docker logs market-analyzer-agent --tail 50
docker logs market-analyzer-agent -f  # Follow logs in real-time
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

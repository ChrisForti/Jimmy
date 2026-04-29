import { runJimmy } from "./lib/jimmy.js";
import { standupOpportunities, surfboardOpportunities } from "./db/schema.js";
import { supMarketAgent } from "./agents/sup-market.js";
import { surfboardAgent } from "./agents/surfboard.js";
import { startScheduler } from "./scheduler.js";

// Run both market research agents immediately on startup
console.log("🚀 Starting market analysis agents...");
runJimmy(supMarketAgent, standupOpportunities);
runJimmy(surfboardAgent, surfboardOpportunities);

// Start the scheduler for automated research runs
if (process.env.ENABLE_SCHEDULER === "true") {
  startScheduler();
  console.log("📅 Scheduler enabled - Agents will run automated research");
}

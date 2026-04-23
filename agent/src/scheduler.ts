import cron from "node-cron";
import { chat } from "./agent.js";
import { loadSession, saveSession } from "./store.js";

const SCHEDULER_SESSION_ID = "autonomous-scheduler";

/**
 * Run an autonomous task - Jimmy analyzes market trends and takes action
 */
async function runMarketAnalysis() {
  console.log("[Scheduler] Running market analysis...");

  const prompt = `You are Jimmy, an autonomous POD business agent. Your task:

1. Research current trending topics and products online
2. Identify profitable shirt and stationary designs
3. Use the Railway API to check what products exist
4. Create new trending products if opportunities found
5. Report your findings and actions taken

Focus on data-driven decisions. Look for trends with high search volume and low competition.`;

  try {
    const history = loadSession(SCHEDULER_SESSION_ID);
    const { reply, newMessages } = await chat(prompt, history);
    saveSession(SCHEDULER_SESSION_ID, newMessages);

    console.log("[Scheduler] Analysis complete:");
    console.log(reply);
  } catch (error) {
    console.error("[Scheduler] Error during market analysis:", error);
  }
}

/**
 * Start the autonomous scheduler
 */
export function startScheduler() {
  console.log("[Scheduler] Starting autonomous market analysis...");

  // Run market analysis every 6 hours
  // Cron format: minute hour day month weekday
  cron.schedule("0 */6 * * *", () => {
    console.log("[Scheduler] Triggered: Market analysis");
    runMarketAnalysis();
  });

  // Optional: Run immediately on startup for testing
  if (process.env.RUN_ANALYSIS_ON_STARTUP === "true") {
    console.log("[Scheduler] Running initial market analysis...");
    runMarketAnalysis();
  }

  console.log("[Scheduler] Scheduled market analysis every 6 hours");
}

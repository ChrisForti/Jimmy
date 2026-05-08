import cron from "node-cron";
import { runJimmy } from "./lib/jimmy.js";
import {
  standupOpportunities,
  surfboardOpportunities,
  kayakOpportunities,
} from "./db/schema.js";
import { supMarketAgent } from "./agents/sup-market.js";
import { surfboardAgent } from "./agents/surfboard.js";
import { kayakAgent } from "./agents/kayak.js";

/**
 * Run automated SUP market research
 */
async function runSupAnalysis() {
  console.log("[Scheduler] Running SUP market analysis...");

  try {
    const results = await runJimmy(supMarketAgent, standupOpportunities);
    console.log(
      `[Scheduler] SUP Analysis complete: ${results.length} opportunities identified`,
    );
  } catch (error) {
    console.error("[Scheduler] Error during SUP analysis:", error);
  }
}

/**
 * Run automated Surfboard market research
 */
async function runSurfboardAnalysis() {
  console.log("[Scheduler] Running Surfboard market analysis...");

  try {
    const results = await runJimmy(surfboardAgent, surfboardOpportunities);
    console.log(
      `[Scheduler] Surfboard Analysis complete: ${results.length} opportunities identified`,
    );
  } catch (error) {
    console.error("[Scheduler] Error during Surfboard analysis:", error);
  }
}

/**
 * Run automated Kayak & Canoe market research
 */
async function runKayakAnalysis() {
  console.log("[Scheduler] Running Kayak & Canoe market analysis...");

  try {
    const results = await runJimmy(kayakAgent, kayakOpportunities);
    console.log(
      `[Scheduler] Kayak Analysis complete: ${results.length} opportunities identified`,
    );
  } catch (error) {
    console.error("[Scheduler] Error during Kayak analysis:", error);
  }
}

/**
 * Start the autonomous scheduler
 */
export function startScheduler() {
  console.log("[Scheduler] Starting autonomous market analysis...");

  // SUP analysis every 6 hours
  cron.schedule("0 */6 * * *", () => {
    console.log("[Scheduler] Triggered: SUP market analysis");
    runSupAnalysis();
  });

  // Surfboard analysis daily at 9 AM
  cron.schedule("0 9 * * *", () => {
    console.log("[Scheduler] Triggered: Surfboard market analysis");
    runSurfboardAnalysis();
  });

  // Kayak & Canoe analysis every 2 days at 10 AM
  cron.schedule("0 10 */2 * *", () => {
    console.log("[Scheduler] Triggered: Kayak & Canoe market analysis");
    runKayakAnalysis();
  });

  // Optional: Run immediately on startup for testing
  if (process.env.RUN_ANALYSIS_ON_STARTUP === "true") {
    console.log("[Scheduler] Running initial market analyses...");
    runSupAnalysis();
    runSurfboardAnalysis();
    runKayakAnalysis();
  }

  console.log("[Scheduler] Scheduled:");
  console.log("  - SUP analysis: every 6 hours");
  console.log("  - Surfboard analysis: daily at 9 AM");
  console.log("  - Kayak/Canoe analysis: every 2 days at 10 AM");
}

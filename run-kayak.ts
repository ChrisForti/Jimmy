import { runJimmy } from "./src/lib/jimmy.js";
import { kayakOpportunities } from "./src/db/schema.js";
import { kayakAgent } from "./src/agents/kayak.js";

console.log("🚀 Manually triggering Kayak & Canoe market analysis...");

runJimmy(kayakAgent, kayakOpportunities)
  .then(() => {
    console.log("✅ Kayak analysis complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

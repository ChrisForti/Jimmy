import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import OpenAI from "openai";
import { tavily } from "@tavily/core";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

// Tavily Search API for real-time market data (free tier: 1,000 searches/month)
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });

// OpenRouter for accessing cloud LLMs (cheap models like Gemini Flash)
export const openRouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

/**
 * Two-step research workflow:
 * 1. Tavily searches the web for real-time market data (free tier)
 * 2. OpenRouter (cheap LLM) analyzes the data and structures it
 */
export async function runJimmy(agent: any, table: any) {
  console.log(`🚀 ${agent.name} is working...`);
  console.log(`📡 Step 1: Searching web with Tavily...`);

  try {
    // Step 1: Use Tavily to search for real-time market data
    const searchQuery = agent.tavilyQuery || agent.query;
    const searchResponse = await tavilyClient.search(searchQuery, {
      searchDepth: "advanced", // More comprehensive results
      maxResults: 10, // Get multiple sources
      includeAnswer: true, // Get AI-generated answer from Tavily
      includeRawContent: false, // Don't need full HTML
    });

    console.log(`✓ Tavily found ${searchResponse.results.length} sources`);

    // Compile search results into context for the LLM
    const searchContext = searchResponse.results
      .map(
        (result: any, idx: number) =>
          `[Source ${idx + 1}: ${result.url}]\n${result.content}\n`,
      )
      .join("\n");

    const tavilyAnswer = searchResponse.answer || "No summary available";

    console.log(`🤖 Step 2: Analyzing with OpenRouter (Gemini Flash)...`);

    // Step 2: Send to OpenRouter with a cheap model to analyze
    const model = process.env.OPENROUTER_MODEL || "google/gemini-flash-1.5-8b";

    const response = await openRouter.chat.completions.create({
      model,
      messages: [
        { role: "system", content: agent.systemPrompt },
        {
          role: "user",
          content: `${agent.query}

REAL-TIME WEB DATA FROM TAVILY:

Tavily Summary:
${tavilyAnswer}

Detailed Sources:
${searchContext}

Based on this current 2026 market data, provide your structured analysis as JSON.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(response.choices[0].message.content || "{}");
    const results = Array.isArray(data) ? data : data.results || [];

    console.log("\n📊 Market Analysis:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(JSON.stringify(results, null, 2));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    if (results.length > 0) {
      try {
        await db.insert(table).values(results);
        console.log(
          `✅ Saved ${results.length} opportunities to Postgres via Drizzle!`,
        );
        console.log(
          `💰 Cost: Tavily (free tier), OpenRouter (~$0.001 per research run)`,
        );
      } catch (dbError: any) {
        console.log(
          `⚠️  Database unavailable (${dbError.code || "unknown error"}) - results logged above`,
        );
      }
      return results;
    } else {
      console.log("⚠️  No results to save");
      return [];
    }
  } catch (error) {
    console.error("❌ Error running market analysis:", error);
    throw error;
  }
}

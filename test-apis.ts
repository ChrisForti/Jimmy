import OpenAI from "openai";
import { tavily } from "@tavily/core";
import "dotenv/config";

console.log("🔍 Testing API connections...\n");

// Test Tavily
async function testTavily() {
  if (!process.env.TAVILY_API_KEY) {
    console.log("❌ TAVILY_API_KEY not found in .env");
    return false;
  }

  try {
    console.log("Testing Tavily Search API...");
    const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });

    const response = await tavilyClient.search(
      "wooden stand-up paddleboard market trends 2026",
      {
        searchDepth: "basic",
        maxResults: 3,
      },
    );

    console.log("✅ Tavily API working!");
    console.log(`   Found ${response.results.length} results`);
    console.log(`   Sample: ${response.results[0]?.title || "N/A"}\n`);
    return true;
  } catch (error: any) {
    console.log("❌ Tavily API failed:");
    console.log(`   ${error.message}\n`);
    return false;
  }
}

// Test OpenRouter
async function testOpenRouter() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.log("❌ OPENROUTER_API_KEY not found in .env");
    return false;
  }

  try {
    console.log("Testing OpenRouter API...");
    const openRouter = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const model = process.env.OPENROUTER_MODEL || "google/gemini-flash-1.5";

    const response = await openRouter.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: "Say 'Hello from OpenRouter' in exactly 4 words.",
        },
      ],
    });

    console.log("✅ OpenRouter API working!");
    console.log(`   Model: ${model}`);
    console.log(`   Response: ${response.choices[0].message.content}\n`);
    return true;
  } catch (error: any) {
    console.log("❌ OpenRouter API failed:");
    console.log(`   ${error.message}\n`);
    return false;
  }
}

// Test Database
async function testDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not found in .env");
    return false;
  }

  try {
    console.log("Testing Database connection...");
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    await pool.query("SELECT NOW()");
    await pool.end();

    console.log("✅ Database connection working!\n");
    return true;
  } catch (error: any) {
    console.log("❌ Database connection failed:");
    console.log(`   ${error.message}\n`);
    return false;
  }
}

// Run all tests
async function runTests() {
  const tavilyOk = await testTavily();
  const openRouterOk = await testOpenRouter();
  const databaseOk = await testDatabase();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Summary:");
  console.log(`Tavily:     ${tavilyOk ? "✅" : "❌"}`);
  console.log(`OpenRouter: ${openRouterOk ? "✅" : "❌"}`);
  console.log(`Database:   ${databaseOk ? "✅" : "❌"}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (tavilyOk && openRouterOk && databaseOk) {
    console.log("🎉 Jimmy is ready to run! Try: npm run dev");
    console.log(
      "💰 Cost: Tavily (FREE), OpenRouter (FREE with Gemini), Database (~$5-10/mo)",
    );
  } else {
    console.log("⚠️  Please fix the failed connections above.");
    console.log("   See SETUP.md for detailed instructions.");
  }
}

runTests();

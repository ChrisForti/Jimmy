import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Market research for artisan watercraft following Jimmy Guidelines
export const marketOpportunities = pgTable("market_opportunities", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),

  // Core Opportunity (per Jimmy Guidelines Section 4)
  opportunity: text("opportunity").notNull(), // e.g., "14' Wood Touring SUP"
  marketWhy: text("market_why"), // Data supporting demand
  sourceOrigin: text("source_origin"), // Primary source citation (e.g., "NMMA 2026 Report", "Etsy Trending")
  materialRecommendation: text("material_recommendation"), // Wood/finish combo
  cncEdge: text("cnc_edge"), // How 3018 Pro adds value
  targetBuyerPersona: text("target_buyer_persona"), // Who buys & what they value

  // Technical Details
  craftType: text("craft_type"), // SUP, Surfboard, Kayak, Canoe, Accessory
  hullType: text("hull_type"), // Touring, Racing, Displacement, All-around
  constructionMethod: text("construction_method"), // Hollow-wood, Cedar-strip, Cold-molded
  length: text("length"), // Dimensions
  width: text("width"),

  // Materials & Aesthetics
  primaryWood: text("primary_wood"), // Western Red Cedar, Paulownia, Teak
  accentWood: text("accent_wood"), // Walnut, Sapele Mahogany
  finishTrend: text("finish_trend"), // Matte, High-Gloss, Bio-Epoxy, Eco-Luxe

  // Market Intelligence
  pricePoint: text("price_point"), // Retail positioning
  marketSentiment: text("market_sentiment"), // Demand indicator
  luxuryFeatures: text("luxury_features"), // GPS mounts, custom inlays, etc.
});

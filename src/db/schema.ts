import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Stand-up Paddleboard market research
export const standupOpportunities = pgTable("standup_opportunities", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),

  // Core Opportunity (per Agent Guidelines Section 4)
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

// Surfboard market research (eco surf, wooden surfboards)
export const surfboardOpportunities = pgTable("surfboard_opportunities", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),

  // Core Opportunity
  opportunity: text("opportunity").notNull(), // e.g., "6'2\" Eco Wooden Fish"
  marketWhy: text("market_why"), // Data supporting demand
  sourceOrigin: text("source_origin"), // Primary source citation
  materialRecommendation: text("material_recommendation"), // Wood/finish combo
  cncEdge: text("cnc_edge"), // How 3018 Pro adds value
  targetBuyerPersona: text("target_buyer_persona"), // Who buys & what they value

  // Technical Details
  boardType: text("board_type"), // Shortboard, Longboard, Fish, Funboard, Mid-length
  constructionMethod: text("construction_method"), // Hollow-wood, Cedar-strip, Balsa-skin
  length: text("length"), // Board dimensions
  width: text("width"),
  thickness: text("thickness"),

  // Materials & Aesthetics
  primaryWood: text("primary_wood"), // Paulownia, Balsa, Cedar, Bamboo
  accentWood: text("accent_wood"), // Walnut, Mahogany, Teak
  finishTrend: text("finish_trend"), // Natural oil, Bio-resin, Recycled epoxy

  // Market Intelligence
  pricePoint: text("price_point"), // Retail positioning
  marketSentiment: text("market_sentiment"), // Demand indicator
  ecoFeatures: text("eco_features"), // Recycled materials, sustainable sourcing, etc.
});

// Kayak & Canoe market research (cedar-strip, wooden boats)
export const kayakOpportunities = pgTable("kayak_opportunities", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),

  // Core Opportunity
  opportunity: text("opportunity").notNull(), // e.g., "16' Cedar-Strip Touring Kayak"
  marketWhy: text("market_why"), // Data supporting demand
  sourceOrigin: text("source_origin"), // Primary source citation
  materialRecommendation: text("material_recommendation"), // Wood/finish combo
  cncEdge: text("cnc_edge"), // How 3018 Pro adds value
  targetBuyerPersona: text("target_buyer_persona"), // Who buys & what they value

  // Technical Details
  boatType: text("boat_type"), // Kayak (Touring, Sea, Recreational, Whitewater) or Canoe (Solo, Tandem, Prospector, Pack)
  constructionMethod: text("construction_method"), // Cedar-strip, Stitch-and-glue, Strip-plank
  length: text("length"), // Boat dimensions
  width: text("width"),
  capacity: text("capacity"), // Weight capacity or number of paddlers

  // Materials & Aesthetics
  primaryWood: text("primary_wood"), // Western Red Cedar, White Cedar, Mahogany
  accentWood: text("accent_wood"), // Walnut, Cherry, Ash
  finishTrend: text("finish_trend"), // Varnish, Epoxy, Oil finish

  // Market Intelligence
  pricePoint: text("price_point"), // Retail positioning
  marketSentiment: text("market_sentiment"), // Demand indicator
  heritageFeatures: text("heritage_features"), // Traditional designs, classic shapes, heirloom quality
});

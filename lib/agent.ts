import { ToolLoopAgent, tool, Output, stepCountIs, gateway } from "ai";
import { z } from "zod";
import { findWines, landedCost, WINES } from "./market-data";

// One cohesive tool: resolve the wine and compute every supplier's all-in landed
// cost deterministically (FX, freight, UK duty, VAT). The model orchestrates and
// reasons; the arithmetic is done in code so the numbers are always exact.
const sourceWine = tool({
  description:
    "Look up a fine wine by free-text query (name, producer, region, vintage) and return the matched wine plus EVERY supplier's all-in landed cost per bottle in GBP at the requested quantity — already FX-converted with inbound freight, UK excise duty and VAT applied, and stock/MOQ feasibility flagged. Sorted cheapest-landed first.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("e.g. 'Sassicaia 2019' or 'Leroy Bourgogne' or 'Dom Perignon'"),
    quantity: z.number().int().positive().describe("bottles required"),
  }),
  execute: async ({ query, quantity }) => {
    const wines = findWines(query);
    if (wines.length === 0) {
      return { found: false, availableWines: WINES.map((w) => w.name) };
    }
    const wine = wines[0];
    const landedCosts = wine.listings
      .map((l) => landedCost(l, quantity))
      .sort((a, b) => a.landedUnitGBP - b.landedUnitGBP);
    return {
      found: true,
      quantity,
      matchedWine: {
        name: wine.name,
        producer: wine.producer,
        region: wine.region,
        vintage: wine.vintage,
      },
      landedCosts,
    };
  },
});

const recommendationSchema = z.object({
  matchedWine: z.object({
    name: z.string(),
    producer: z.string(),
    region: z.string(),
    vintage: z.number(),
  }),
  recommended: z.object({
    supplier: z.string(),
    country: z.string(),
    landedUnitGBP: z.number(),
    totalGBP: z.number(),
    leadDays: z.number(),
    condition: z.string(),
    reason: z.string().describe("why this supplier wins, in one sentence"),
  }),
  alternatives: z.array(
    z.object({
      supplier: z.string(),
      country: z.string(),
      landedUnitGBP: z.number(),
      totalGBP: z.number(),
      note: z.string(),
    }),
  ),
  arbitrage: z.object({
    worstLandedUnitGBP: z.number(),
    bestLandedUnitGBP: z.number(),
    savingPerBottleGBP: z.number(),
    totalSavingGBP: z.number().describe("savingPerBottleGBP times quantity"),
    note: z.string(),
  }),
  caveats: z
    .array(z.string())
    .describe(
      "3-5 SPECIFIC, non-generic risks: e.g. post-Brexit customs clearance on EU imports, provenance/OWC confirmation, label condition affecting resale, thin stock buffer, long lead time, reclaimable VAT for bonded resale",
    ),
  summary: z
    .string()
    .describe("2-3 sentence plain-English recommendation a buyer can act on"),
});

export type SourcingRecommendation = z.infer<typeof recommendationSchema>;

export const sourcingAgent = new ToolLoopAgent({
  model: gateway("anthropic/claude-haiku-4.5"),
  stopWhen: stepCountIs(5),
  instructions: `You are a fine-wine sourcing analyst for a high-end UK wine merchant. You find the cheapest reliable way to land a wine in the UK.

Process:
1. Call sourceWine once with the user's query and quantity. It returns the matched wine and every supplier's all-in landed cost (GBP) plus stock/MOQ flags.
2. Recommend the supplier with the lowest landed cost that has enough stock AND meets its minimum order quantity. If the cheapest fails stock or MOQ, pick the next viable one and explain why.
3. Quantify the arbitrage: best viable landed price vs the most expensive listing, multiplied by quantity.

Rules:
- Use the EXACT numbers from the tool. Never invent or round away figures.
- Caveats must be specific and commercially useful (customs/Brexit clearance on EU imports, provenance/OWC, label condition vs resale value, thin stock buffer, lead-time, VAT reclaim for bonded resale) — no filler like "all suppliers have stock".
- Keep the summary sharp and commercial: this goes to a buyer who wants to make money.`,
  tools: { sourceWine },
  output: Output.object({ schema: recommendationSchema }),
});

import { sourcingAgent } from "@/lib/agent";

export const maxDuration = 60;

export async function POST(req: Request) {
  let body: { wine?: unknown; quantity?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const wine = typeof body.wine === "string" ? body.wine.trim() : "";
  const quantity =
    typeof body.quantity === "number" && Number.isFinite(body.quantity)
      ? Math.floor(body.quantity)
      : NaN;

  if (!wine) {
    return Response.json({ error: "Missing 'wine'" }, { status: 400 });
  }
  if (!Number.isFinite(quantity) || quantity < 1) {
    return Response.json(
      { error: "'quantity' must be a positive integer" },
      { status: 400 },
    );
  }

  const prompt = `Source ${quantity} bottle(s) of "${wine}", landed in the United Kingdom (London). Identify the wine, compare every supplier's all-in landed cost, recommend the cheapest viable source, and quantify the arbitrage versus the most expensive listing.`;

  try {
    const result = await sourcingAgent.generate({ prompt });

    // Lightweight trace of which tools the agent actually called.
    type StepLike = { toolCalls?: Array<{ toolName: string; input: unknown }> };
    const steps = (result as { steps?: StepLike[] }).steps ?? [];
    const trace = steps.flatMap((s) =>
      (s.toolCalls ?? []).map((tc) => ({ tool: tc.toolName, input: tc.input })),
    );

    return Response.json({ output: result.output, trace });
  } catch (err) {
    console.error("sourcing agent error", err);
    return Response.json(
      { error: "The sourcing agent failed. Please try again." },
      { status: 500 },
    );
  }
}

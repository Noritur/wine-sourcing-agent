import { streamSourcing } from "@/lib/agent";
import type { SourcingRecommendation } from "@/lib/agent";

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

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

      try {
        send({ type: "status", text: "Scanning suppliers across markets…" });

        const result = streamSourcing(prompt);

        let last: Partial<SourcingRecommendation> | undefined;
        let announcedWriting = false;
        for await (const partial of result.partialOutputStream) {
          last = partial as Partial<SourcingRecommendation>;
          if (!announcedWriting) {
            announcedWriting = true;
            send({ type: "status", text: "Computing landed cost · ranking…" });
          }
          send({ type: "partial", output: partial });
        }

        // The recommendation is usable only once the model has produced the
        // recommended supplier and a summary.
        if (!last?.recommended?.supplier || !last?.summary) {
          send({
            type: "error",
            error: "The sourcing agent failed. Please try again.",
          });
          controller.close();
          return;
        }

        const steps = await result.steps;
        const trace = steps.flatMap((s) =>
          (s.toolCalls ?? []).map((tc) => ({ tool: tc.toolName })),
        );
        send({ type: "trace", trace });
        send({ type: "done" });
      } catch (err) {
        console.error("sourcing stream error", err);
        send({
          type: "error",
          error: "The sourcing agent failed. Please try again.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

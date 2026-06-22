# Fine Wine Sourcing Agent

An AI agent that finds the cheapest reliable way to source a fine wine across a
fragmented global supplier market — the same bottle trades at very different
prices by country, and the arbitrage is real money at scale.

**Live demo → https://wine-sourcing-agent.vercel.app**

Give it a wine and a quantity. The agent looks up every supplier, computes the
true **landed cost** into the UK (FX conversion, inbound freight, excise duty,
VAT), picks the cheapest source that actually has stock and clears its minimum
order quantity, and quantifies the saving versus the priciest listing — with a
short, commercial rationale and the real watch-outs (customs, provenance, VAT
reclaim, label condition).

## How it works

```
user → /api/source → ToolLoopAgent (Claude via Vercel AI Gateway)
                         │
                         └─ tool: sourceWine(query, quantity)
                              → resolves the wine
                              → computes every supplier's all-in landed cost (GBP)
                         │
                         └─ structured output → recommendation + arbitrage + caveats
```

Design choice: **the arithmetic is deterministic code, the judgement is the LLM.**
`sourceWine` does the FX/duty/VAT math in `lib/market-data.ts` so the numbers are
always exact; the model orchestrates the lookup, ranks suppliers, and writes the
analysis. Output is schema-validated (Zod) so the UI renders structured data, not
free text.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind v4
- **AI SDK v6** — `ToolLoopAgent`, tool calling, structured `Output`
- **Claude (Haiku 4.5)** via the **Vercel AI Gateway** (OIDC auth in production —
  no API keys in the deployment)
- Deployed on **Vercel**

## Run locally

```bash
pnpm install
# auth for the AI Gateway: either link to Vercel and pull an OIDC token…
vercel link && vercel env pull .env.local
# …or set AI_GATEWAY_API_KEY=... in .env.local
pnpm dev   # http://localhost:3000
```

## Note on data

Supplier prices, stock and lead times are **synthetic demo data**; wine, producer
and region names are real. FX, duty and VAT rates are indicative. The reasoning is
a live tool-calling agent, not a canned response.

"use client";

import { useState } from "react";
import type { SourcingRecommendation } from "@/lib/agent";

type ApiResponse = {
  output?: SourcingRecommendation;
  trace?: { tool: string; input: unknown }[];
  error?: string;
};

const FLAG: Record<string, string> = {
  FR: "🇫🇷",
  IT: "🇮🇹",
  ES: "🇪🇸",
  DE: "🇩🇪",
  GB: "🇬🇧",
  US: "🇺🇸",
  HK: "🇭🇰",
};

const EXAMPLES = [
  { wine: "Sassicaia 2019", quantity: 24 },
  { wine: "Domaine Leroy Bourgogne 2018", quantity: 6 },
  { wine: "Dom Pérignon 2013", quantity: 60 },
  { wine: "Vega Sicilia Único 2014", quantity: 12 },
];

const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(n);

const flag = (c: string) => FLAG[c] ?? "🏳️";

export default function Home() {
  const [wine, setWine] = useState("Sassicaia 2019");
  const [quantity, setQuantity] = useState(24);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SourcingRecommendation | null>(null);
  const [trace, setTrace] = useState<{ tool: string; input: unknown }[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function run(w = wine, q = quantity) {
    setLoading(true);
    setError(null);
    setData(null);
    setTrace([]);
    try {
      const res = await fetch("/api/source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wine: w, quantity: q }),
      });
      const json: ApiResponse = await res.json();
      if (!res.ok || json.error || !json.output) {
        setError(json.error ?? "Something went wrong.");
      } else {
        setData(json.output);
        setTrace(json.trace ?? []);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      {/* Header */}
      <header className="mb-10">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
          <span className="inline-block h-px w-8 bg-[var(--gold)]" />
          Sourcing intelligence
        </div>
        <h1 className="serif text-4xl leading-tight text-[var(--text)] sm:text-5xl">
          Fine Wine{" "}
          <span className="text-[var(--gold-soft)]">Sourcing Agent</span>
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
          The same bottle trades at wildly different prices across countries. Give
          the agent a wine and a quantity — it queries suppliers worldwide,
          computes the all-in <span className="text-[var(--text)]">landed cost</span>{" "}
          to the UK (FX, freight, duty, VAT), and tells you where to buy and how
          much you save.
        </p>
      </header>

      {/* Form */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl shadow-black/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) run();
          }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <label className="flex-1">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--muted)]">
              Wine
            </span>
            <input
              value={wine}
              onChange={(e) => setWine(e.target.value)}
              placeholder="e.g. Barolo Monfortino 2016"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3.5 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--gold)]"
            />
          </label>
          <label className="sm:w-32">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--muted)]">
              Bottles
            </span>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="tnum w-full rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3.5 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--gold)]"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !wine.trim()}
            className="rounded-lg bg-[var(--gold)] px-5 py-2.5 font-medium text-[#1a1206] transition hover:bg-[var(--gold-soft)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sourcing…" : "Source it"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.wine}
              disabled={loading}
              onClick={() => {
                setWine(ex.wine);
                setQuantity(ex.quantity);
                run(ex.wine, ex.quantity);
              }}
              className="rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-1 text-xs text-[var(--muted)] transition hover:border-[var(--gold)] hover:text-[var(--text)] disabled:opacity-40"
            >
              {ex.wine} · {ex.quantity}
            </button>
          ))}
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="mt-8 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 text-sm text-[var(--muted)]">
          <p className="serif text-lg text-[var(--text)]">The agent is working…</p>
          <p className="mt-2">
            Identifying the wine · querying global suppliers · converting FX ·
            adding freight, duty &amp; VAT · ranking by landed cost.
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/30 p-5 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Result */}
      {data && !loading && (
        <section className="mt-8 space-y-5">
          {/* Matched wine */}
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--muted)]">
              Matched
            </div>
            <h2 className="serif text-2xl text-[var(--text)]">
              {data.matchedWine.name}
            </h2>
            <div className="text-sm text-[var(--muted)]">
              {data.matchedWine.producer} · {data.matchedWine.region} ·{" "}
              {data.matchedWine.vintage}
            </div>
          </div>

          {/* Recommended */}
          <div className="overflow-hidden rounded-2xl border border-[var(--gold)]/40 bg-gradient-to-b from-[var(--panel-2)] to-[var(--panel)] shadow-2xl shadow-black/40">
            <div className="border-b border-[var(--border)] px-5 py-2 text-xs uppercase tracking-[0.2em] text-[var(--gold-soft)]">
              Recommended source
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="serif text-xl text-[var(--text)]">
                  {flag(data.recommended.country)} {data.recommended.supplier}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
                  {data.recommended.reason}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--muted)]">
                  <span>Lead time: {data.recommended.leadDays} days</span>
                  <span>· {data.recommended.condition}</span>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="tnum serif text-3xl text-[var(--gold-soft)]">
                  {gbp(data.recommended.landedUnitGBP)}
                </div>
                <div className="text-xs text-[var(--muted)]">landed / bottle</div>
                <div className="tnum mt-2 text-lg text-[var(--text)]">
                  {gbp(data.recommended.totalGBP)}
                </div>
                <div className="text-xs text-[var(--muted)]">order total</div>
              </div>
            </div>
          </div>

          {/* Arbitrage */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-5 py-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-[var(--muted)]">
                Arbitrage vs the priciest source
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">
                {data.arbitrage.note}
              </div>
            </div>
            <div className="text-right">
              <div className="tnum serif text-2xl text-[var(--gold-soft)]">
                {gbp(data.arbitrage.totalSavingGBP)}
              </div>
              <div className="text-xs text-[var(--muted)]">
                saved ({gbp(data.arbitrage.savingPerBottleGBP)}/btl)
              </div>
            </div>
          </div>

          {/* Alternatives */}
          {data.alternatives.length > 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
              <div className="mb-3 text-xs uppercase tracking-wider text-[var(--muted)]">
                Other sources considered
              </div>
              <div className="divide-y divide-[var(--border)]">
                {data.alternatives.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <div>
                      <span className="text-[var(--text)]">
                        {flag(a.country)} {a.supplier}
                      </span>
                      <span className="ml-2 text-[var(--muted)]">{a.note}</span>
                    </div>
                    <div className="tnum text-right text-[var(--muted)]">
                      {gbp(a.landedUnitGBP)}/btl
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caveats */}
          {data.caveats.length > 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
              <div className="mb-2 text-xs uppercase tracking-wider text-[var(--muted)]">
                Watch-outs
              </div>
              <ul className="space-y-1.5 text-sm text-[var(--muted)]">
                {data.caveats.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--gold)]">▸</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary */}
          <p className="serif border-l-2 border-[var(--gold)] pl-4 text-[15px] italic leading-relaxed text-[var(--text)]">
            {data.summary}
          </p>

          {/* Agent trace */}
          {trace.length > 0 && (
            <details className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 text-sm">
              <summary className="cursor-pointer text-[var(--muted)]">
                How the agent worked ({trace.length} tool call
                {trace.length === 1 ? "" : "s"})
              </summary>
              <ol className="mt-3 space-y-2">
                {trace.map((t, i) => (
                  <li key={i} className="font-mono text-xs text-[var(--muted)]">
                    <span className="text-[var(--gold-soft)]">{t.tool}</span>(
                    {JSON.stringify(t.input)})
                  </li>
                ))}
              </ol>
            </details>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-[var(--border)] pt-5 text-xs leading-relaxed text-[var(--muted)]">
        Working prototype built for the Hedonism Wines AI specialist role · not
        affiliated. Supplier prices, stock and lead times are{" "}
        <span className="text-[var(--text)]">synthetic demo data</span>; wine and
        region names are real. FX, duty and VAT are indicative. The reasoning is a
        live Claude agent calling real pricing tools.
      </footer>
    </main>
  );
}

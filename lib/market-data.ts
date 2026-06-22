// Synthetic fine-wine market data for the sourcing demo.
// Real wine/region/producer names, INVENTED prices/suppliers/stock. Demo data only.
// The point: model a fragmented global market where the same bottle trades at very
// different prices across countries — exactly where sourcing intelligence pays off.

export type Country = "FR" | "IT" | "ES" | "DE" | "GB" | "US" | "HK";

export interface Listing {
  supplier: string;
  country: Country;
  /** price per single 75cl bottle, in the supplier's local currency */
  unitPrice: number;
  currency: "EUR" | "GBP" | "USD" | "HKD";
  /** bottles available */
  stock: number;
  /** minimum order quantity, in bottles */
  moq: number;
  leadDays: number;
  /** provenance / condition note a buyer would care about */
  condition: string;
}

export interface Wine {
  id: string;
  name: string;
  producer: string;
  region: string;
  vintage: number;
  listings: Listing[];
}

export const WINES: Wine[] = [
  {
    id: "sassicaia-2019",
    name: "Sassicaia 2019",
    producer: "Tenuta San Guido",
    region: "Bolgheri, Tuscany",
    vintage: 2019,
    listings: [
      { supplier: "Cantina Toscana Srl", country: "IT", unitPrice: 245, currency: "EUR", stock: 240, moq: 6, leadDays: 9, condition: "Ex-domaine, OWC available" },
      { supplier: "Berry Bros nominee", country: "GB", unitPrice: 295, currency: "GBP", stock: 60, moq: 1, leadDays: 3, condition: "UK duty-paid, pristine" },
      { supplier: "Rare Wine Co (US)", country: "US", unitPrice: 360, currency: "USD", stock: 120, moq: 12, leadDays: 18, condition: "Cellar-direct, slightly scuffed labels" },
      { supplier: "Kowloon Fine Wine", country: "HK", unitPrice: 2950, currency: "HKD", stock: 90, moq: 6, leadDays: 14, condition: "Temperature-controlled storage" },
    ],
  },
  {
    id: "tignanello-2020",
    name: "Tignanello 2020",
    producer: "Marchesi Antinori",
    region: "Tuscany",
    vintage: 2020,
    listings: [
      { supplier: "Antinori allocation", country: "IT", unitPrice: 110, currency: "EUR", stock: 600, moq: 12, leadDays: 10, condition: "Ex-cellar" },
      { supplier: "Vins du Monde", country: "FR", unitPrice: 128, currency: "EUR", stock: 180, moq: 6, leadDays: 7, condition: "Bonded warehouse" },
      { supplier: "London Fine Wine plc", country: "GB", unitPrice: 142, currency: "GBP", stock: 96, moq: 1, leadDays: 2, condition: "UK duty-paid" },
    ],
  },
  {
    id: "leroy-bourgogne-2018",
    name: "Bourgogne Rouge 2018",
    producer: "Domaine Leroy",
    region: "Burgundy",
    vintage: 2018,
    listings: [
      { supplier: "Domaine direct (FR)", country: "FR", unitPrice: 520, currency: "EUR", stock: 24, moq: 3, leadDays: 12, condition: "Strict allocation, ex-domaine" },
      { supplier: "Burgundy Cellars HK", country: "HK", unitPrice: 6800, currency: "HKD", stock: 36, moq: 6, leadDays: 15, condition: "Collector provenance" },
      { supplier: "US Grand Cru LLC", country: "US", unitPrice: 740, currency: "USD", stock: 18, moq: 6, leadDays: 20, condition: "Single-owner cellar" },
    ],
  },
  {
    id: "krug-grande-cuvee",
    name: "Krug Grande Cuvee 171eme Edition",
    producer: "Krug",
    region: "Champagne",
    vintage: 2023,
    listings: [
      { supplier: "Maison Champagne FR", country: "FR", unitPrice: 165, currency: "EUR", stock: 480, moq: 6, leadDays: 8, condition: "Ex-Reims" },
      { supplier: "Berlin Wein GmbH", country: "DE", unitPrice: 172, currency: "EUR", stock: 300, moq: 6, leadDays: 9, condition: "Bonded" },
      { supplier: "London Fine Wine plc", country: "GB", unitPrice: 185, currency: "GBP", stock: 144, moq: 1, leadDays: 2, condition: "UK duty-paid" },
      { supplier: "NY Bubbles Inc", country: "US", unitPrice: 245, currency: "USD", stock: 200, moq: 12, leadDays: 16, condition: "Climate-stored" },
    ],
  },
  {
    id: "vega-sicilia-unico-2014",
    name: "Vega Sicilia Unico 2014",
    producer: "Vega Sicilia",
    region: "Ribera del Duero",
    vintage: 2014,
    listings: [
      { supplier: "Bodega directa (ES)", country: "ES", unitPrice: 360, currency: "EUR", stock: 120, moq: 6, leadDays: 11, condition: "Ex-bodega, OWC" },
      { supplier: "Iberia Wines", country: "ES", unitPrice: 345, currency: "EUR", stock: 72, moq: 12, leadDays: 13, condition: "Bonded, mixed cases" },
      { supplier: "London Fine Wine plc", country: "GB", unitPrice: 395, currency: "GBP", stock: 48, moq: 1, leadDays: 3, condition: "UK duty-paid" },
    ],
  },
  {
    id: "barolo-monfortino-2016",
    name: "Barolo Riserva Monfortino 2016",
    producer: "Giacomo Conterno",
    region: "Piedmont",
    vintage: 2016,
    listings: [
      { supplier: "Piemonte Allocazione", country: "IT", unitPrice: 720, currency: "EUR", stock: 36, moq: 3, leadDays: 14, condition: "Allocation, ex-cellar" },
      { supplier: "Rare Wine Co (US)", country: "US", unitPrice: 1050, currency: "USD", stock: 24, moq: 6, leadDays: 19, condition: "Single-owner" },
      { supplier: "Kowloon Fine Wine", country: "HK", unitPrice: 8200, currency: "HKD", stock: 30, moq: 6, leadDays: 15, condition: "Temperature-controlled" },
    ],
  },
  {
    id: "dom-perignon-2013",
    name: "Dom Perignon 2013",
    producer: "Moet & Chandon",
    region: "Champagne",
    vintage: 2013,
    listings: [
      { supplier: "Maison Champagne FR", country: "FR", unitPrice: 155, currency: "EUR", stock: 720, moq: 6, leadDays: 7, condition: "Ex-Epernay" },
      { supplier: "Berlin Wein GmbH", country: "DE", unitPrice: 149, currency: "EUR", stock: 540, moq: 12, leadDays: 9, condition: "Bonded" },
      { supplier: "London Fine Wine plc", country: "GB", unitPrice: 178, currency: "GBP", stock: 240, moq: 1, leadDays: 2, condition: "UK duty-paid" },
    ],
  },
  {
    id: "opus-one-2018",
    name: "Opus One 2018",
    producer: "Opus One Winery",
    region: "Napa Valley",
    vintage: 2018,
    listings: [
      { supplier: "Napa Direct LLC", country: "US", unitPrice: 295, currency: "USD", stock: 360, moq: 6, leadDays: 17, condition: "Winery-direct" },
      { supplier: "Vins du Monde", country: "FR", unitPrice: 330, currency: "EUR", stock: 96, moq: 6, leadDays: 10, condition: "Bonded warehouse" },
      { supplier: "London Fine Wine plc", country: "GB", unitPrice: 340, currency: "GBP", stock: 72, moq: 1, leadDays: 3, condition: "UK duty-paid" },
    ],
  },
];

// --- FX (indicative, demo) ---
export const FX_TO_GBP: Record<Listing["currency"], number> = {
  GBP: 1,
  EUR: 0.85,
  USD: 0.79,
  HKD: 0.1,
};

// --- Logistics & UK import costs (indicative, demo) ---
// Per-bottle inbound freight + insurance to a UK bonded warehouse, by origin.
export const SHIP_PER_BOTTLE_GBP: Record<Country, number> = {
  GB: 0,
  FR: 3.5,
  IT: 4,
  ES: 4,
  DE: 3.5,
  US: 9,
  HK: 11,
};

// UK still-wine excise duty per 75cl bottle (indicative) + VAT rate.
export const UK_DUTY_PER_BOTTLE_GBP = 2.67;
export const UK_VAT = 0.2;

export function findWines(query: string): Wine[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored = WINES.map((w) => {
    const hay = `${w.name} ${w.producer} ${w.region} ${w.vintage}`.toLowerCase();
    const score = terms.reduce((s, t) => (hay.includes(t) ? s + 1 : s), 0);
    return { w, score };
  }).filter((x) => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.map((x) => x.w);
}

export interface LandedCost {
  supplier: string;
  country: Country;
  unitPriceLocal: number;
  currency: Listing["currency"];
  goodsGBP: number; // converted goods cost per bottle
  shipGBP: number;
  dutyGBP: number;
  vatGBP: number;
  landedUnitGBP: number; // all-in per bottle, GBP
  inStock: boolean;
  meetsMoq: boolean;
  leadDays: number;
  condition: string;
}

/** Pure, deterministic landed-cost calc for one listing at a given quantity. */
export function landedCost(listing: Listing, quantity: number): LandedCost {
  const goodsGBP = listing.unitPrice * FX_TO_GBP[listing.currency];
  const shipGBP = SHIP_PER_BOTTLE_GBP[listing.country];
  const dutyGBP = UK_DUTY_PER_BOTTLE_GBP;
  // VAT applies to goods + duty + freight (simplified, demo).
  const vatGBP = (goodsGBP + dutyGBP + shipGBP) * UK_VAT;
  const landedUnitGBP = goodsGBP + shipGBP + dutyGBP + vatGBP;
  return {
    supplier: listing.supplier,
    country: listing.country,
    unitPriceLocal: listing.unitPrice,
    currency: listing.currency,
    goodsGBP: round2(goodsGBP),
    shipGBP: round2(shipGBP),
    dutyGBP: round2(dutyGBP),
    vatGBP: round2(vatGBP),
    landedUnitGBP: round2(landedUnitGBP),
    inStock: listing.stock >= quantity,
    meetsMoq: quantity >= listing.moq,
    leadDays: listing.leadDays,
    condition: listing.condition,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

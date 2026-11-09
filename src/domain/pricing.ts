/**
 * prsnn price list — identical for every companion.
 *
 * The values here are the DEFAULTS, the same as prsnn-backend's
 * src/utils/pricing.js. The live prices come from GET /settings/pricing
 * (a superadmin can change them in the app); `applyPricing` swaps them in and
 * every helper below reads `pricing()`. If the server can't be reached the
 * bundled defaults are used. Companions choose which durations they offer;
 * they don't set prices.
 */
export const BASE_RATE = 399;

export const DEFAULT_PACKAGE_PRICES: Readonly<Record<number, number>> = Object.freeze({
  1: 399,
  2: 699,
  3: 999,
  4: 1299,
  5: 1599,
  6: 1899,
  7: 2199,
  8: 2499,
  9: 2799,
  10: 3099,
  11: 3349,
  12: 3599,
});
/** @deprecated use pricing().packagePrices (live) or DEFAULT_PACKAGE_PRICES. */
export const PACKAGE_PRICES = DEFAULT_PACKAGE_PRICES;

export const ALL_HOURS = Object.keys(DEFAULT_PACKAGE_PRICES).map(Number);
/** Highlighted as "Popular choice". */
export const POPULAR_HOURS = 4;

export interface PricingSettings {
  packagePrices: Record<number, number>;
  /** prsnn's share of each booking (0.2 → companion receives 80%). */
  platformShare: number;
  /** Kept when a customer cancels before the cutoff (0.15 → 85% refunded). */
  cancellationFee: number;
  cancellationCutoffMinutes: number;
  offerMinMinutes: number;
  offerMaxMinutes: number;
  /** Sessions run inside dayStart–dayEnd ("HH:MM"). */
  dayStart: string;
  dayEnd: string;
  /** Shown to customers when a companion hasn't customised their list. */
  headlineHours: number[];
}

export const DEFAULT_PRICING: Readonly<PricingSettings> = Object.freeze({
  packagePrices: DEFAULT_PACKAGE_PRICES,
  platformShare: 0.2,
  cancellationFee: 0.15,
  cancellationCutoffMinutes: 15,
  offerMinMinutes: 15,
  offerMaxMinutes: 300,
  dayStart: '07:00',
  dayEnd: '22:00',
  headlineHours: [1, 2, 4, 6, 12],
});

let current: PricingSettings = DEFAULT_PRICING;
const listeners = new Set<() => void>();

/** Pricing in force (server copy once loaded, else the defaults). */
export const pricing = () => current;

/** Swap in the server's pricing. Unknown or missing fields keep the defaults. */
export function applyPricing(p: Partial<PricingSettings> | null | undefined) {
  if (!p) return;
  const prices: Record<number, number> = { ...DEFAULT_PACKAGE_PRICES };
  for (const [h, v] of Object.entries(p.packagePrices ?? {})) if (ALL_HOURS.includes(Number(h)) && Number(v) > 0) prices[Number(h)] = Number(v);
  current = { ...DEFAULT_PRICING, ...p, packagePrices: prices, headlineHours: p.headlineHours?.length ? p.headlineHours : DEFAULT_PRICING.headlineHours };
  listeners.forEach((l) => l());
}
export const resetPricing = () => {
  current = DEFAULT_PRICING;
  listeners.forEach((l) => l());
};
/** For useSyncExternalStore. */
export const subscribePricing = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Backwards-compatible names (read the live values). */
export const HEADLINE_HOURS = DEFAULT_PRICING.headlineHours;

export const priceFor = (hours: number): number | null => current.packagePrices[hours] ?? null;
export const hourlyFor = (hours: number) => Math.round((current.packagePrices[hours] ?? current.packagePrices[1] * hours) / hours);
/** Saving versus paying the 1-hour price for every hour. */
export const savingFor = (hours: number) => Math.max(0, current.packagePrices[1] * hours - (current.packagePrices[hours] ?? current.packagePrices[1] * hours));
export const companionShareOf = (amount: number) => Math.floor(amount * (1 - current.platformShare));
export const platformShareOf = (amount: number) => amount - companionShareOf(amount);

export const hoursLabel = (h: number) => `${h} ${h === 1 ? 'hour' : 'hours'}`;

/** Durations a companion offers (older profiles: the headline packages). */
export const offeredHours = (packages?: number[] | null) => (packages && packages.length ? [...packages].sort((a, b) => a - b) : current.headlineHours);

/**
 * Same rules the server applies to a price change (PUT /admin/settings/pricing):
 * every longer package costs more in total and less per hour. Returns an error
 * message for the first broken pair, or null.
 */
export function priceCurveError(prices: Record<number, number>): string | null {
  for (const h of ALL_HOURS) {
    const v = prices[h];
    if (!Number.isInteger(v) || v < 1) return `Enter a whole rupee price for ${hoursLabel(h)}.`;
  }
  for (let h = 2; h <= 12; h++) {
    const a = prices[h - 1];
    const b = prices[h];
    if (!(b > a)) return `${hoursLabel(h)} must cost more than ${hoursLabel(h - 1)}.`;
    if (!(b / h < a / (h - 1))) return `${hoursLabel(h)} must cost less per hour than ${hoursLabel(h - 1)} (₹${Math.round(b / h)} vs ₹${Math.round(a / (h - 1))}).`;
  }
  return null;
}

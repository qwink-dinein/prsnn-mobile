/**
 * prsnn price list — identical for every companion. Mirrors
 * prsnn-backend/src/utils/pricing.js exactly (a test checks the anchors).
 * Companions choose which durations they offer; they don't set prices.
 */
export const BASE_RATE = 399;

export const PACKAGE_PRICES: Record<number, number> = {
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
};

export const ALL_HOURS = Object.keys(PACKAGE_PRICES).map(Number);
/** Shown to customers when a companion hasn't customised their list. */
export const HEADLINE_HOURS = [1, 2, 4, 6, 12];
/** Highlighted as "Popular choice". */
export const POPULAR_HOURS = 4;

/** prsnn keeps 20% of each booking; the companion receives 80%. */
export const PLATFORM_SHARE = 0.2;
/** Customer cancels 15+ minutes before the start: 85% back, 15% fee. */
export const CANCELLATION_FEE = 0.15;
export const CANCELLATION_CUTOFF_MINUTES = 15;

/** Sessions run inside 07:00–22:00. */
export const DAY_START = '07:00';
export const DAY_END = '22:00';

export const priceFor = (hours: number): number | null => PACKAGE_PRICES[hours] ?? null;
export const hourlyFor = (hours: number) => Math.round((PACKAGE_PRICES[hours] ?? BASE_RATE * hours) / hours);
/** Saving versus paying ₹399 for every hour. */
export const savingFor = (hours: number) => Math.max(0, BASE_RATE * hours - (PACKAGE_PRICES[hours] ?? BASE_RATE * hours));
export const companionShareOf = (amount: number) => Math.floor(amount * (1 - PLATFORM_SHARE));
export const platformShareOf = (amount: number) => amount - companionShareOf(amount);

export const hoursLabel = (h: number) => `${h} ${h === 1 ? 'hour' : 'hours'}`;

/** Durations a companion offers (older profiles: the five headline packages). */
export const offeredHours = (packages?: number[] | null) => (packages && packages.length ? [...packages].sort((a, b) => a - b) : HEADLINE_HOURS);

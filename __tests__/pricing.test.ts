import { DEFAULT_PACKAGE_PRICES as PACKAGE_PRICES, DEFAULT_PRICING, applyPricing, companionShareOf, hourlyFor, offeredHours, priceFor, pricing, resetPricing, savingFor } from '@/domain/pricing';
import { amountDuePaise, formatMinutes, totalOfBooking } from '@/domain/booking';

describe('fixed price list', () => {
  it('matches the owner’s published packages', () => {
    expect([1, 2, 4, 6, 12].map((h) => PACKAGE_PRICES[h])).toEqual([399, 699, 1299, 1899, 3599]);
    expect([2, 4, 6, 12].map(savingFor)).toEqual([99, 297, 495, 1189]);
    expect([1, 2, 4, 6].map(hourlyFor)).toEqual([399, 350, 325, 317]);
  });
  it('bundled defaults are the backend defaults (used until GET /settings/pricing loads)', () => {
    expect(PACKAGE_PRICES).toEqual({ 1: 399, 2: 699, 3: 999, 4: 1299, 5: 1599, 6: 1899, 7: 2199, 8: 2499, 9: 2799, 10: 3099, 11: 3349, 12: 3599 });
    expect(DEFAULT_PRICING).toMatchObject({ platformShare: 0.2, cancellationFee: 0.15, cancellationCutoffMinutes: 15, offerMinMinutes: 15, offerMaxMinutes: 300, dayStart: '07:00', dayEnd: '22:00', headlineHours: [1, 2, 4, 6, 12] });
    expect(pricing()).toBe(DEFAULT_PRICING);
  });
  it('server prices replace the defaults everywhere', () => {
    applyPricing({ ...DEFAULT_PRICING, packagePrices: { ...PACKAGE_PRICES, 1: 449 }, platformShare: 0.25, headlineHours: [1, 4] });
    expect(priceFor(1)).toBe(449);
    expect(hourlyFor(1)).toBe(449);
    expect(companionShareOf(400)).toBe(300);
    expect(offeredHours(undefined)).toEqual([1, 4]);
    resetPricing();
    expect(priceFor(1)).toBe(399);
  });
  it('ignores junk from the server and keeps defaults for missing hours', () => {
    applyPricing({ packagePrices: { 2: -5, 99: 10 } as Record<number, number> });
    expect(priceFor(2)).toBe(699);
    expect(priceFor(99)).toBeNull();
    resetPricing();
  });
  it('longer always costs less per hour', () => {
    for (let h = 2; h <= 12; h++) expect(PACKAGE_PRICES[h] / h).toBeLessThan(PACKAGE_PRICES[h - 1] / (h - 1));
  });
  it('companion receives 80%', () => {
    expect(companionShareOf(399)).toBe(319);
    expect(companionShareOf(1299)).toBe(1039);
  });
  it('older companions offer the five headline packages', () => {
    expect(offeredHours(undefined)).toEqual([1, 2, 4, 6, 12]);
    expect(offeredHours([8, 1])).toEqual([1, 8]);
  });
  it('booking totals use the package price; older bookings use rate × hours', () => {
    expect(amountDuePaise(399, '240', 1299)).toBe(129900);
    expect(totalOfBooking({ pricePerHour: 600, duration: '90', packagePrice: undefined, amountPaid: 0 })).toBe(900);
    expect(totalOfBooking({ pricePerHour: 399, duration: '240', packagePrice: 1299, amountPaid: 0 })).toBe(1299);
  });
  it('formats long countdowns', () => {
    expect(formatMinutes(12)).toBe('12 min');
    expect(formatMinutes(120)).toBe('2 h');
    expect(formatMinutes(290)).toBe('4 h 50 min');
  });
});

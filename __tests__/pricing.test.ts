import fs from 'fs';
import path from 'path';
import { PACKAGE_PRICES, companionShareOf, hourlyFor, offeredHours, savingFor } from '@/domain/pricing';
import { amountDuePaise, formatMinutes, totalOfBooking } from '@/domain/booking';

describe('fixed price list', () => {
  it('matches the owner’s published packages', () => {
    expect([1, 2, 4, 6, 12].map((h) => PACKAGE_PRICES[h])).toEqual([399, 699, 1299, 1899, 3599]);
    expect([2, 4, 6, 12].map(savingFor)).toEqual([99, 297, 495, 1189]);
    expect([1, 2, 4, 6].map(hourlyFor)).toEqual([399, 350, 325, 317]);
  });
  it('is identical to the backend table', () => {
    const backend = path.join(__dirname, '../../prsnn-backend/src/utils/pricing.js');
    if (!fs.existsSync(backend)) return; // backend repo not checked out next to the app
    const src = fs.readFileSync(backend, 'utf8');
    for (const [h, price] of Object.entries(PACKAGE_PRICES)) expect(src).toContain(`${h}: ${price},`);
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

import { panicWindow } from '@/domain/safety';
import { durationLine, savingPercent } from '@/domain/pricing';
import { CATEGORIES, categoryOf, offersCategory } from '@/domain/categories';
import { needsSetup } from '@/domain/setup';
import type { SessionUser } from '@/domain/types';

const at = (iso: string) => new Date(iso).getTime();

describe('panic button window', () => {
  const b = { scheduledDate: '2026-11-15T00:00:00.000Z', startTime: '16:00', duration: '120' as const, status: 'accepted' as const, paymentStatus: 'paid' as const };
  it('is off before the start, on during the session and for 1 hour after, then off', () => {
    const start = new Date(2026, 10, 15, 16, 0).getTime();
    expect(panicWindow(b, start - 60_000)).toMatchObject({ on: false, before: true });
    expect(panicWindow(b, start).on).toBe(true);
    expect(panicWindow(b, start + 2 * 3600_000 + 59 * 60_000).on).toBe(true);
    expect(panicWindow(b, start + 3 * 3600_000 + 60_000)).toMatchObject({ on: false, after: true });
  });
  it('needs a confirmed, paid booking', () => {
    expect(panicWindow({ ...b, status: 'pending' }, at('2026-11-15T11:00:00Z')).eligible).toBe(false);
    expect(panicWindow({ ...b, paymentStatus: 'pending' }, at('2026-11-15T11:00:00Z')).eligible).toBe(false);
  });
});

describe('price cards', () => {
  it('say how much time it is, never an activity', () => {
    for (let h = 1; h <= 12; h++) expect(durationLine(h)).not.toMatch(/lunch|dinner|movie|coffee|shopping|trip|walk/i);
  });
  it('show the saving as a percent of the 1-hour rate', () => {
    expect(savingPercent(1)).toBe(0);
    expect(savingPercent(4)).toBe(19); // 1,596 - 1,299 = 297
  });
});

describe('categories', () => {
  it('are the five agreed ones, with no place names', () => {
    expect(CATEGORIES.map((c) => c.key)).toEqual(['new_in_town', 'dont_go_alone', 'explore', 'loved_one', 'work_study']);
    for (const c of CATEGORIES) expect(`${c.title} ${c.line} ${c.bullets.join(' ')}`).not.toMatch(/hyderabad|mumbai|delhi|bengaluru|charminar|golconda/i);
    expect(categoryOf('explore')?.title).toBe('Explore & Discover');
  });
  it('match companions who offer them (older profiles match all)', () => {
    expect(offersCategory(['work_study'], 'work_study')).toBe(true);
    expect(offersCategory(['work_study'], 'explore')).toBe(false);
    expect(offersCategory([], 'explore')).toBe(true);
  });
});

describe('setup', () => {
  const full: SessionUser = { id: 'u', role: 'user', is_verified: true, verification_status: 'verified', fullName: 'Rahul', phone: '919876543210', gender: 'man', seeGender: 'everyone', profileVisibility: 'open', city: 'Pune', categories: ['explore'], photoStatus: 'pending' };
  it('is done for a member with everything answered (photo may still be in review)', () => expect(needsSetup(full)).toBe(false));
  it('asks members for a photo, categories and a mobile for email sign-ups', () => {
    expect(needsSetup({ ...full, photoStatus: 'none' })).toBe(true);
    expect(needsSetup({ ...full, categories: [] })).toBe(true);
    expect(needsSetup({ ...full, phone: undefined, email: 'a@b.co' })).toBe(true);
    expect(needsSetup({ ...full, phone: undefined, email: 'a@b.co', contactPhone: '447700900123' })).toBe(false);
  });
  it('only needs a name from staff and companions', () => {
    expect(needsSetup({ ...full, role: 'companion', categories: [], photoStatus: 'none' })).toBe(false);
    expect(needsSetup({ ...full, role: 'superadmin', fullName: '' })).toBe(true);
  });
});

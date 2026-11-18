import { formatTime, freeToday } from '@/domain/booking';
import { filterCompanions, hasVisiblePhoto, photosFirst } from '@/domain/search';
import { defaultVisibility } from '@/domain/privacy';
import type { Companion } from '@/domain/types';

// Wednesday 18 Nov 2026, local time.
const at = (h: number, m = 0) => new Date(2026, 10, 18, h, m);
const c = (over: Partial<Companion> = {}): Companion => ({
  id: 'c1',
  fullName: 'Test Companion',
  tags: [],
  availability: { wednesday: true },
  startTime: '09:00',
  endTime: '21:00',
  profilePhoto: 'https://example.com/p.jpg',
  ...over,
});

describe('Available today', () => {
  it('not working today → not free', () => {
    expect(freeToday(c({ availability: { thursday: true } }), [], at(10))).toBeNull();
  });

  it('free from about now → "till <end>"', () => {
    const f = freeToday(c(), [], at(10));
    expect(f?.from).toBe('11:30'); // 90-minute booking lead
    expect(f?.label).toBe(`till ${formatTime('21:00')}`);
  });

  it('booked until later → "<from> – <end>"', () => {
    const f = freeToday(c(), [{ start: '11:00', duration: 360 }], at(10));
    expect(f?.from).toBe('17:00');
    expect(f?.label).toBe(`${formatTime('17:00')} – ${formatTime('21:00')}`);
  });

  it('a 1-hour session no longer fits → not free', () => {
    expect(freeToday(c(), [], at(20))).toBeNull();
  });

  it('fully booked for the rest of the day → not free', () => {
    expect(freeToday(c(), [{ start: '11:00', duration: 600 }], at(10))).toBeNull();
  });

  it('touching bookings leave the gap free', () => {
    const f = freeToday(c({ endTime: '14:00' }), [{ start: '11:30', duration: 60 }], at(10));
    expect(f?.from).toBe('12:30');
  });
});

describe('visible photos first', () => {
  const open1 = c({ id: 'a' });
  const locked = c({ id: 'b', locked: true });
  const noPhoto = c({ id: 'c', profilePhoto: null });
  const open2 = c({ id: 'd' });

  it('a visible photo is uploaded and not locked', () => {
    expect(hasVisiblePhoto(open1)).toBe(true);
    expect(hasVisiblePhoto(locked)).toBe(false);
    expect(hasVisiblePhoto(noPhoto)).toBe(false);
  });

  it('keeps order within each group', () => {
    expect(photosFirst([locked, open1, noPhoto, open2]).map((x) => x.id)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('Recommended puts visible photos first; price sorts ignore it', () => {
    const list = [locked, open1];
    expect(filterCompanions(list, '', 'all', 'all', 'recommended').map((x) => x.id)).toEqual(['a', 'b']);
    expect(filterCompanions([c({ id: 'x', locked: true, pricePerHour: 1 }), c({ id: 'y', pricePerHour: 2 })], '', 'all', 'all', 'priceLow').map((x) => x.id)).toEqual(['x', 'y']);
  });
});

describe('photo default', () => {
  it('everyone starts with an open photo', () => {
    expect(defaultVisibility('woman')).toBe('open');
  });
});

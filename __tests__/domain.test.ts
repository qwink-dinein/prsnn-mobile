import {
  amountDuePaise,
  canChat,
  canComplete,
  canPay,
  startsAt,
  durationLabel,
  earningsFor,
  endTimeOf,
  formatINR,
  formatTime,
  isDayAvailable,
  matchesCategory,
  monthGrid,
  parseDateKey,
  stageOf,
  tabOf,
  timeSlots,
  toDateKey,
} from '@/domain/booking';
import { filterCompanions } from '@/domain/search';
import { normaliseIndianMobile, displayPhone } from '@/domain/phone';
import { ago } from '@/domain/time';
import type { Booking, Companion } from '@/domain/types';

const booking = (over: Partial<Booking> = {}): Booking => ({
  _id: 'b1',
  requesterId: 'u1',
  companionId: 'c1',
  status: 'pending',
  paymentStatus: 'pending',
  pricePerHour: 600,
  startTime: '16:00',
  duration: '120',
  scheduledDate: '2026-11-15T00:00:00.000Z',
  createdAt: '2026-11-01T00:00:00.000Z',
  ...over,
});

describe('pricing mirrors the backend (payment.controller amountDueInPaise)', () => {
  it('charges rate × hours in paise', () => {
    expect(amountDuePaise(600, '120')).toBe(120000);
    expect(amountDuePaise(450, '90')).toBe(67500);
    expect(amountDuePaise(333, '30')).toBe(16650);
  });
  it('defaults to 60 minutes like the server', () => {
    expect(amountDuePaise(500, '' as never)).toBe(50000);
  });
  it('formats rupees with Indian grouping', () => {
    expect(formatINR(1050)).toBe('₹1,050');
    expect(formatINR(123456)).toBe('₹1,23,456');
    expect(formatINR(99.5)).toBe('₹99.50');
  });
});

describe('time helpers', () => {
  it('formats 12-hour times', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
    expect(formatTime('12:30')).toBe('12:30 PM');
    expect(formatTime('16:00')).toBe('4:00 PM');
  });
  it('adds durations', () => {
    expect(endTimeOf('16:00', '120')).toBe('18:00');
    expect(endTimeOf('20:30', '90')).toBe('22:00');
  });
  it('labels durations', () => {
    expect(durationLabel('30')).toBe('30 min');
    expect(durationLabel('60')).toBe('1 hour');
    expect(durationLabel('90')).toBe('1.5 hours');
  });
  it('keeps the chosen calendar day (no timezone shift)', () => {
    const d = parseDateKey('2026-11-15T00:00:00.000Z');
    expect(d.getDate()).toBe(15);
    expect(toDateKey(d)).toBe('2026-11-15');
  });
  it('builds a Sunday-first month grid', () => {
    const g = monthGrid(2026, 10); // November 2026 starts on a Sunday
    expect(g[0][0]?.getDate()).toBe(1);
    expect(g.flat().filter(Boolean)).toHaveLength(30);
    g.forEach((w) => expect(w).toHaveLength(7));
  });
});

describe('availability and slots', () => {
  const c = { startTime: '10:00', endTime: '12:00' };
  it('offers half-hour starts inside the companion window, inclusive', () => {
    expect(timeSlots(c, new Date(2030, 0, 1), new Date(2029, 0, 1))).toEqual(['10:00', '10:30', '11:00', '11:30', '12:00']);
  });
  it('drops times already past (plus 30 min notice) today', () => {
    const now = new Date(2030, 0, 1, 10, 15);
    expect(timeSlots(c, new Date(2030, 0, 1), now)).toEqual(['11:00', '11:30', '12:00']);
  });
  it('falls back to 7 AM – 10 PM when the companion set no hours, and must end by 10 PM', () => {
    const s = timeSlots({}, new Date(2030, 0, 1), new Date(2029, 0, 1));
    expect(s[0]).toBe('07:00');
    expect(s[s.length - 1]).toBe('22:00');
    const twelve = timeSlots({}, new Date(2030, 0, 1), new Date(2029, 0, 1), 30, 30, 720);
    expect(twelve[twelve.length - 1]).toBe('10:00'); // 10:00 + 12 h = 22:00
  });
  it('checks the weekday', () => {
    const sunday = new Date(2026, 10, 15);
    expect(isDayAvailable({ sunday: true }, sunday)).toBe(true);
    expect(isDayAvailable({ monday: true }, sunday)).toBe(false);
    expect(isDayAvailable(undefined, sunday)).toBe(false);
  });
});

describe('booking stages follow the backend flow', () => {
  it('request → accept → pay → chat', () => {
    expect(stageOf(booking())).toBe('awaiting');
    expect(stageOf(booking({ status: 'accepted' }))).toBe('pay');
    expect(stageOf(booking({ status: 'accepted', paymentStatus: 'paid' }))).toBe('confirmed');
    expect(stageOf(booking({ status: 'rejected' }))).toBe('declined');
  });
  it('opens chat only on confirmed, paid bookings, for both people (database rule)', () => {
    expect(canChat(booking({ status: 'accepted' }), false)).toBe(false);
    expect(canChat(booking({ status: 'accepted' }), true)).toBe(false);
    expect(canChat(booking({ status: 'completed', paymentStatus: 'paid' }), true)).toBe(true);
    expect(canChat(booking({ status: 'accepted', paymentStatus: 'paid' }), false)).toBe(true);
    expect(canChat(booking({ status: 'pending' }), true)).toBe(false);
  });
  it('allows "Mark completed" only after the end, with no open alert or report', () => {
    const b = booking({ status: 'accepted', paymentStatus: 'paid' });
    const start = startsAt(b).getTime();
    expect(canComplete(b, start + 30 * 60_000)).toBe(false); // mid-session: chat must stay open
    expect(canComplete(b, start + 120 * 60_000)).toBe(true);
    expect(canComplete({ ...b, panic: { id: 'p', raisedAt: '', mine: true, sends: 1 } }, start + 180 * 60_000)).toBe(false);
    expect(canComplete({ ...b, dispute: { status: 'open' } }, start + 180 * 60_000)).toBe(false);
    expect(canComplete({ ...b, paymentStatus: 'pending' }, start + 180 * 60_000)).toBe(false);
  });
  it('offers Pay only while the booking can still be paid', () => {
    const now = Date.parse('2026-11-16T10:00:00Z');
    const waiting = booking({ flow: 'prepaid', allocation: { state: 'awaiting_payment', paymentDeadline: '2026-11-16T10:20:00Z' } });
    expect(canPay(waiting, now)).toBe(true);
    expect(canPay({ ...waiting, paymentStatus: 'failed' }, now)).toBe(true); // try again after a failed attempt
    expect(canPay(waiting, Date.parse('2026-11-16T10:21:00Z'))).toBe(false); // window closed
    expect(canPay(booking({ flow: 'prepaid', allocation: { state: 'cancelled' } }), now)).toBe(false);
    expect(canPay({ ...waiting, paymentStatus: 'paid' }, now)).toBe(false);
    expect(canPay(booking({ status: 'accepted' }), now)).toBe(true); // website request
  });
  it('sorts into tabs', () => {
    const now = new Date(2026, 10, 15, 12, 0);
    expect(tabOf(booking(), now)).toBe('upcoming');
    expect(tabOf(booking({ startTime: '09:00', duration: '60' }), now)).toBe('past');
    expect(tabOf(booking({ status: 'cancelled' }), now)).toBe('cancelled');
    expect(tabOf(booking({ status: 'completed' }), now)).toBe('past');
  });
});

describe('earnings', () => {
  it('sums the companion’s 80% of paid sessions in the month, by week', () => {
    const list = [
      booking({ status: 'completed', paymentStatus: 'paid', amountPaid: 1200, scheduledDate: '2026-11-03T00:00:00.000Z' }),
      booking({ status: 'completed', paymentStatus: 'paid', amountPaid: 900, scheduledDate: '2026-11-20T00:00:00.000Z' }),
      booking({ paymentStatus: 'pending', scheduledDate: '2026-11-21T00:00:00.000Z' }),
      booking({ status: 'completed', paymentStatus: 'paid', amountPaid: 5000, scheduledDate: '2026-10-30T00:00:00.000Z' }),
    ];
    const e = earningsFor(list, 2026, 10);
    expect(e.total).toBe(1680); // 960 + 720
    expect(e.sessions).toBe(2);
    expect(e.average).toBe(840);
    expect(e.pending).toBe(1);
    expect(e.weeks.map((w) => w.amount)).toEqual([960, 0, 720, 0]);
  });
});

describe('search', () => {
  const list: Companion[] = [
    { id: 'a', fullName: 'Ayesha', area: 'Banjara Hills', pricePerHour: 600, tags: ['Coffee', 'Walks'], categories: ['new_in_town'] },
    { id: 'b', fullName: 'Rohan', area: 'Jubilee Hills', pricePerHour: 400, tags: ['Events'], categories: ['dont_go_alone'] },
    { id: 'c', fullName: 'Fatima', area: 'Tolichowki', pricePerHour: 500, tags: ['Study'], categories: ['work_study'] },
  ];
  it('matches categories through tags', () => {
    expect(matchesCategory(['Café hopping'], 'coffee')).toBe(true);
    expect(matchesCategory(['Cricket'], 'coffee')).toBe(false);
  });
  it('filters by text, category and area, and sorts by price', () => {
    expect(filterCompanions(list, 'banjara', 'all', 'all', 'recommended').map((c) => c.id)).toEqual(['a']);
    expect(filterCompanions(list, '', 'dont_go_alone', 'all', 'recommended').map((c) => c.id)).toEqual(['b']);
    expect(filterCompanions(list, '', 'all', 'Tolichowki', 'recommended').map((c) => c.id)).toEqual(['c']);
    expect(filterCompanions(list, '', 'all', 'all', 'priceLow').map((c) => c.id)).toEqual(['b', 'c', 'a']);
  });
});

describe('phone numbers', () => {
  it('accepts Indian mobiles in common formats', () => {
    expect(normaliseIndianMobile('98765 43210')).toBe('919876543210');
    expect(normaliseIndianMobile('+91 98765-43210')).toBe('919876543210');
    expect(normaliseIndianMobile('09876543210')).toBe('919876543210');
  });
  it('rejects landlines and short numbers', () => {
    expect(normaliseIndianMobile('12345 67890')).toBeNull();
    expect(normaliseIndianMobile('98765')).toBeNull();
  });
  it('displays with spacing', () => {
    expect(displayPhone('919876543210')).toBe('+91 98765 43210');
  });
});

describe('relative time', () => {
  it('reads naturally', () => {
    const now = Date.parse('2026-11-09T12:00:00Z');
    expect(ago('2026-11-09T11:59:30Z', now)).toBe('just now');
    expect(ago('2026-11-09T11:58:00Z', now)).toBe('2 min ago');
    expect(ago('2026-11-09T09:00:00Z', now)).toBe('3 h ago');
    expect(ago('2026-11-08T09:00:00Z', now)).toBe('yesterday');
  });
});

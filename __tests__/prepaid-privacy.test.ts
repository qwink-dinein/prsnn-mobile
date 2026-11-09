import { awaitingAnswer, isMineAsCompanion, minutesLeft, paymentLabel, refundIfCancelledNow, stageOf, tabOf, timeSlots, MIN_LEAD_MINUTES } from '@/domain/booking';
import { filterCompanions } from '@/domain/search';
import { searchPlaces, stateOf, cityCount } from '@/domain/places';
import { defaultVisibility, hasIdentity, seeLabel } from '@/domain/privacy';
import { areasFor } from '@/data/india-areas';
import type { Booking, Companion } from '@/domain/types';

const NOW = new Date(2026, 10, 15, 12, 0);
const b = (over: Partial<Booking> = {}): Booking => ({
  _id: 'p1',
  flow: 'prepaid',
  requesterId: 'me',
  companionId: null,
  status: 'pending',
  paymentStatus: 'paid',
  pricePerHour: 600,
  startTime: '18:00',
  duration: '60',
  scheduledDate: '2026-11-15T00:00:00.000Z',
  createdAt: '2026-11-15T00:00:00.000Z',
  amountPaid: 600,
  allocation: { state: 'offering' },
  ...over,
});

describe('prepaid stages (booking state separate from payment state)', () => {
  it('maps allocation states', () => {
    expect(stageOf(b({ paymentStatus: 'pending', allocation: { state: 'awaiting_payment' } }))).toBe('paying');
    expect(stageOf(b())).toBe('finding');
    expect(stageOf(b({ status: 'accepted', allocation: { state: 'assigned' } }))).toBe('confirmed');
    expect(stageOf(b({ status: 'completed', allocation: { state: 'assigned' } }))).toBe('completed');
    expect(stageOf(b({ status: 'cancelled', allocation: { state: 'failed' } }))).toBe('unfulfilled');
    expect(stageOf(b({ status: 'cancelled', allocation: { state: 'cancelled' } }))).toBe('cancelled');
  });
  it('website bookings keep the request → accept → pay stages', () => {
    expect(stageOf(b({ flow: 'request', status: 'pending', paymentStatus: 'pending' }))).toBe('awaiting');
    expect(stageOf(b({ flow: 'request', status: 'accepted', paymentStatus: 'pending' }))).toBe('pay');
  });
  it('failed allocations sit under Cancelled', () => {
    expect(tabOf(b({ status: 'pending', allocation: { state: 'failed' } }), NOW)).toBe('cancelled');
  });
  it('labels payment separately, including refunds and test payments', () => {
    expect(paymentLabel(b({ paymentMode: 'simulated' }))).toBe('Paid ₹600 (test)');
    expect(paymentLabel(b({ refund: { status: 'pending', amount: 600 } }))).toBe('Refund of ₹600 in progress');
    expect(paymentLabel(b({ refund: { status: 'processed', amount: 600 } }))).toBe('Refunded ₹600');
    expect(paymentLabel(b({ paymentStatus: 'pending' }))).toBe('Not paid');
  });
});

describe('refund preview follows the refund policy', () => {
  it('full refund before the start, none after', () => {
    expect(refundIfCancelledNow(b(), NOW)).toMatchObject({ amount: 600 });
    expect(refundIfCancelledNow(b({ startTime: '11:00' }), NOW)).toMatchObject({ amount: 0 });
    expect(refundIfCancelledNow(b({ paymentStatus: 'pending' }), NOW)).toMatchObject({ amount: 0, reason: 'Nothing has been charged.' });
  });
  it('counts down offer minutes', () => {
    expect(minutesLeft(new Date(NOW.getTime() + 61_000).toISOString(), NOW)).toBe(2);
    expect(minutesLeft(new Date(NOW.getTime() - 1).toISOString(), NOW)).toBe(0);
  });
  it('needs 90 minutes of notice for a prepaid session today', () => {
    const slots = timeSlots({ startTime: '12:00', endTime: '14:00' }, new Date(2026, 10, 15), NOW, 30, MIN_LEAD_MINUTES);
    expect(slots).toEqual(['13:30', '14:00']);
  });
});

describe('companion view of offers', () => {
  const offer = (status: 'offered' | 'accepted' | 'declined' | 'expired' | 'withdrawn', mins = 10) => b({ myOffer: { status, expiresAt: new Date(NOW.getTime() + mins * 60_000).toISOString(), offeredAt: NOW.toISOString() } });
  it('only accepted offers are theirs (earnings, chat)', () => {
    expect(isMineAsCompanion(offer('accepted'))).toBe(true);
    expect(isMineAsCompanion(offer('withdrawn'))).toBe(false);
    expect(isMineAsCompanion(b({ flow: 'request' }))).toBe(true);
  });
  it('a live, unexpired offer is waiting for an answer; an expired one is not', () => {
    expect(awaitingAnswer(offer('offered', 5), NOW)).toBe(true);
    expect(awaitingAnswer(offer('offered', -1), NOW)).toBe(false);
    expect(awaitingAnswer(offer('declined'), NOW)).toBe(false);
  });
});

describe('cities and areas', () => {
  it('bundles every state’s cities', () => {
    expect(cityCount).toBeGreaterThan(4000);
    expect(stateOf('Hyderabad')).toBe('Telangana');
    expect(stateOf('Gurugram')).toBe('Haryana');
  });
  it('searches by prefix first and narrows by state', () => {
    expect(searchPlaces('hyd')[0]).toEqual({ city: 'Hyderabad', state: 'Telangana' });
    expect(searchPlaces('').slice(0, 3).map((p) => p.city)).toEqual(['Hyderabad', 'Bengaluru', 'Mumbai']);
    expect(searchPlaces('', { state: 'Goa' }).every((p) => p.state === 'Goa')).toBe(true);
  });
  it('has area lists for the big metros', () => {
    expect(areasFor('Hyderabad')).toContain('Banjara Hills');
    expect(areasFor('Bengaluru')).toContain('Indiranagar');
    expect(areasFor('Tiny Town')).toEqual([]);
  });
  it('filters companions by city', () => {
    const list: Companion[] = [
      { id: 'a', city: 'Hyderabad', tags: [] },
      { id: 'b', city: 'Pune', tags: [] },
    ];
    expect(filterCompanions(list, '', 'all', 'all', 'recommended', 'hyderabad').map((c) => c.id)).toEqual(['a']);
    expect(filterCompanions(list, '', 'all', 'all', 'recommended', null)).toHaveLength(2);
  });
});

describe('privacy defaults', () => {
  it('men open, women and non-binary locked', () => {
    expect(defaultVisibility('man')).toBe('open');
    expect(defaultVisibility('woman')).toBe('locked');
    expect(defaultVisibility('nonbinary')).toBe('locked');
  });
  it('identity is complete only with all three choices', () => {
    expect(hasIdentity({ gender: 'woman', seeGender: 'woman', profileVisibility: 'locked' })).toBe(true);
    expect(hasIdentity({ gender: 'woman', seeGender: 'woman' })).toBe(false);
    expect(seeLabel('everyone')).toBe('Everyone');
  });
});

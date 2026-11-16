import { mergeBookings, sideOf } from '@/domain/booking';
import type { Booking } from '@/domain/types';

const bk = (id: string, requester: string, companion: string | null = null) => ({ _id: id, requesterId: { _id: requester, fullName: 'R' }, companionId: companion ? { _id: companion, fullName: 'C' } : null }) as unknown as Booking;

describe('someone who is both a member and a companion', () => {
  it('sees which side of each booking they are on, from the booking itself', () => {
    expect(sideOf(bk('a', 'me', 'basha'), 'me')).toBe('member');
    expect(sideOf(bk('b', 'riya', 'me'), 'me')).toBe('companion');
    expect(sideOf(bk('c', 'riya'), undefined)).toBe('companion');
  });

  it('gets requests received and bookings made in one list, each once', () => {
    const received = [bk('1', 'riya', 'me'), bk('2', 'arun', 'me')];
    const made = [bk('3', 'me', 'basha'), bk('2', 'arun', 'me')];
    expect(mergeBookings(received, made).map((b) => b._id)).toEqual(['1', '2', '3']);
  });

  it('copes with either list still loading', () => {
    expect(mergeBookings(undefined, [bk('3', 'me', 'basha')]).map((b) => b._id)).toEqual(['3']);
    expect(mergeBookings([bk('1', 'riya', 'me')], undefined).map((b) => b._id)).toEqual(['1']);
  });
});

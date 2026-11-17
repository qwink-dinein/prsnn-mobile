import { chatOpen, chatThreads, mergeMessages, threadOf } from '@/domain/chat';
import type { ChatMessage } from '@/domain/types';

const m = (id: string, at: string): ChatMessage => ({ _id: id, bookingId: 'b', senderId: 's', content: id, createdAt: at });

describe('chat history and live messages', () => {
  it('keeps a live message that arrived before the history finished loading', () => {
    const live = [m('m3', '2026-11-16T10:03:00Z')];
    const history = [m('m1', '2026-11-16T10:01:00Z'), m('m2', '2026-11-16T10:02:00Z')];
    expect(mergeMessages(live, history).map((x) => x._id)).toEqual(['m1', 'm2', 'm3']);
  });
  it('never shows a message twice', () => {
    const list = [m('m1', '2026-11-16T10:01:00Z')];
    expect(mergeMessages(list, [m('m1', '2026-11-16T10:01:00Z')])).toBe(list);
  });
});

// Times are local; a booking is on 21 Nov 2026, 12:00 for 60 minutes unless given.
const bk = (id: string, o: Partial<{ status: string; paid: boolean; date: string; start: string; dur: number; req: string; comp: string }> = {}) =>
  ({
    _id: id,
    status: (o.status ?? 'accepted') as 'accepted',
    paymentStatus: (o.paid === false ? 'pending' : 'paid') as 'paid',
    scheduledDate: o.date ?? '2026-11-21',
    startTime: o.start ?? '12:00',
    duration: (o.dur ?? 60) as 60,
    requesterId: o.req ?? 'u1',
    companionId: o.comp ?? 'c1',
  });
const at = (date: string, time: string) => new Date(`${date}T${time}:00`).getTime();

describe('chat opens on confirmation and closes when the session ends', () => {
  it('is open from confirmation until the session end', () => {
    expect(chatOpen(bk('a'), at('2026-11-17', '13:00'))).toBe(true); // days before: open once confirmed
    expect(chatOpen(bk('a'), at('2026-11-21', '12:59'))).toBe(true);
    expect(chatOpen(bk('a'), at('2026-11-21', '13:00'))).toBe(false); // session over
  });
  it('is closed before payment, and for completed or cancelled bookings', () => {
    expect(chatOpen(bk('a', { paid: false }), at('2026-11-17', '13:00'))).toBe(false);
    expect(chatOpen(bk('a', { status: 'completed' }), at('2026-11-21', '12:30'))).toBe(false);
    expect(chatOpen(bk('a', { status: 'cancelled' }), at('2026-11-17', '13:00'))).toBe(false);
  });
});

describe('one chat per person', () => {
  const list = [bk('old', { date: '2026-11-17', start: '15:30' }), bk('next', { start: '13:00' }), bk('first', { start: '12:00' }), bk('other', { comp: 'c2', date: '2026-11-10' })];
  it('puts every booking with the same person in one thread, oldest first', () => {
    const t = chatThreads(list, at('2026-11-18', '10:00'));
    expect(t).toHaveLength(2);
    expect(t[0].bookings.map((b) => b._id)).toEqual(['old', 'first', 'next']);
  });
  it('sends to the open booking that ends first, and the thread stays open until the last one ends', () => {
    expect(threadOf('old', list, at('2026-11-18', '10:00'))?.sendTo?._id).toBe('first');
    expect(threadOf('old', list, at('2026-11-21', '13:30'))?.sendTo?._id).toBe('next');
    expect(threadOf('old', list, at('2026-11-21', '14:00'))?.sendTo).toBeNull();
  });
  it('keeps the two sides of a pair apart (I booked them / they booked me)', () => {
    const t = chatThreads([bk('a'), bk('b', { req: 'c1', comp: 'u1' })], at('2026-11-18', '10:00'));
    expect(t).toHaveLength(2);
  });
  it('lists open threads first', () => {
    const t = chatThreads(list, at('2026-11-18', '10:00'));
    expect(t[0].sendTo).not.toBeNull();
    expect(t[1].sendTo).toBeNull();
  });
});

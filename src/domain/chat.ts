import type { Booking, ChatMessage } from './types';
import { idOf, startsAt } from './booking';

/**
 * Adds messages to a chat without duplicates, oldest first. History loads and live messages
 * are always merged with what's on screen, never swapped in, so a message that arrived while
 * the history was loading is kept.
 */
export function mergeMessages(prev: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  if (!incoming.length) return prev;
  const seen = new Set(prev.map((m) => m._id));
  const fresh = incoming.filter((m) => !seen.has(m._id));
  if (!fresh.length) return prev;
  return [...prev, ...fresh].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/**
 * One chat per person. Messages still belong to a booking (disputes and safety records need that),
 * but every booking between the same two people, on the same side, shows as one thread.
 *
 * Sending is allowed only while one of those bookings is "open": confirmed (accepted), paid, and its
 * session hasn't ended yet. The database enforces the same rule (`private.chat_open`), so an old app
 * can't send after the session either. A new booking with the same person opens the thread again.
 */
type ChatBooking = Pick<Booking, '_id' | 'status' | 'paymentStatus' | 'scheduledDate' | 'startTime' | 'duration' | 'requesterId' | 'companionId'> & { ref?: string };

/** When the session ends (local time). */
export const endsAt = (b: Pick<Booking, 'scheduledDate' | 'startTime' | 'duration'>): Date => new Date(startsAt(b).getTime() + Number(b.duration || 60) * 60_000);

/** Can a message be sent on this booking right now? */
export const chatOpen = (b: Pick<Booking, 'status' | 'paymentStatus' | 'scheduledDate' | 'startTime' | 'duration'>, now = Date.now()): boolean =>
  b.status === 'accepted' && b.paymentStatus === 'paid' && now < endsAt(b).getTime();

/** The thread a booking belongs to: who booked and who was booked (so each side of a pair is its own thread). */
export const threadKey = (b: Pick<Booking, 'requesterId' | 'companionId'>): string => `${idOf(b.requesterId)}>${idOf(b.companionId)}`;

export interface ChatThread<B extends ChatBooking = ChatBooking> {
  key: string;
  /** Oldest session first. */
  bookings: B[];
  /** The booking new messages go to: the open one whose session ends first, if any. */
  sendTo: B | null;
  /** The booking to open the thread on: the open one, else the next upcoming, else the most recent. */
  main: B;
}

/** Groups chat bookings into one thread per person. Newest activity first. */
export function chatThreads<B extends ChatBooking>(bookings: B[], now = Date.now()): ChatThread<B>[] {
  const by = new Map<string, B[]>();
  for (const b of bookings) {
    const k = threadKey(b);
    by.set(k, [...(by.get(k) ?? []), b]);
  }
  const threads = [...by.entries()].map(([key, list]) => {
    const sorted = [...list].sort((a, b) => startsAt(a).getTime() - startsAt(b).getTime());
    const open = sorted.filter((b) => chatOpen(b, now)).sort((a, b) => endsAt(a).getTime() - endsAt(b).getTime());
    return { key, bookings: sorted, sendTo: open[0] ?? null, main: open[0] ?? sorted[sorted.length - 1] };
  });
  // Open threads first (soonest session first), then closed ones (most recent session first).
  return threads.sort((a, b) => {
    if (!!a.sendTo !== !!b.sendTo) return a.sendTo ? -1 : 1;
    return a.sendTo && b.sendTo ? startsAt(a.sendTo).getTime() - startsAt(b.sendTo).getTime() : startsAt(b.main).getTime() - startsAt(a.main).getTime();
  });
}

/** The thread a booking is in, from a list of bookings. */
export function threadOf<B extends ChatBooking>(bookingId: string, bookings: B[], now = Date.now()): ChatThread<B> | null {
  const me = bookings.find((b) => b._id === bookingId);
  if (!me) return null;
  return chatThreads(bookings.filter((b) => threadKey(b) === threadKey(me)), now)[0] ?? null;
}

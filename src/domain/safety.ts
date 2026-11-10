import { startsAt } from './booking';
import type { Booking } from './types';

/** The panic button is on from the session start until 1 hour after it ends. */
export const PANIC_AFTER_END_MS = 60 * 60_000;

/** When the panic button is on (confirmed, paid bookings only). */
export function panicWindow(b: Pick<Booking, 'scheduledDate' | 'startTime' | 'duration' | 'status' | 'paymentStatus'>, now = Date.now()) {
  const start = startsAt(b).getTime();
  const end = start + Number(b.duration) * 60_000 + PANIC_AFTER_END_MS;
  const eligible = (b.status === 'accepted' || b.status === 'completed') && b.paymentStatus === 'paid';
  return { start, end, eligible, on: eligible && now >= start && now <= end, before: eligible && now < start, after: now > end };
}

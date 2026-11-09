import { CANCELLATION_CUTOFF_MINUTES, CANCELLATION_FEE, companionShareOf } from './pricing';
import type { Availability, Booking, Companion, DayKey, Duration, PersonRef } from './types';

/** Durations the backend accepts (Booking.duration enum, minutes as strings). */
export const DURATIONS: Duration[] = ['30', '60', '90', '120', '180', '240'];

export const DAY_KEYS: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/** Sessions run inside 07:00–22:00 (business rule; backend enforces it). */
export const DEFAULT_START = '07:00';
export const DEFAULT_END = '22:00';

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

export const fromMinutes = (min: number) => {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/** "16:00" → "4:00 PM" */
export function formatTime(hhmm: string): string {
  const total = toMinutes(hhmm);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export const endTimeOf = (start: string, duration: Duration | string) => fromMinutes(toMinutes(start) + Number(duration));

export function durationLabel(d: Duration | string): string {
  const min = Number(d);
  if (min < 60) return `${min} min`;
  const h = min / 60;
  return `${h % 1 === 0 ? h : h.toFixed(1)} ${h === 1 ? 'hour' : 'hours'}`;
}

/**
 * Amount owed in paise. Mirrors backend amountDueInPaise() exactly so the
 * price we show is the price Razorpay charges:
 *   Math.round(pricePerHour * (minutes / 60) * 100)
 */
export function amountDuePaise(pricePerHour: number, duration: Duration | string, packagePrice?: number | null): number {
  if (packagePrice) return Math.round(packagePrice * 100);
  const hours = (parseInt(String(duration), 10) || 60) / 60;
  return Math.round(pricePerHour * hours * 100);
}

/** Total for a booking: what was paid, else its package price, else rate × hours (older bookings). */
export const totalOfBooking = (b: Pick<Booking, 'amountPaid' | 'packagePrice' | 'pricePerHour' | 'duration'>) =>
  b.amountPaid || b.packagePrice || rupees(amountDuePaise(b.pricePerHour, b.duration));

export const rupees = (paise: number) => paise / 100;

export function formatINR(amount: number): string {
  const fixed = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  const [int, dec] = fixed.split('.');
  // Indian grouping: 1,23,456
  const last3 = int.slice(-3);
  const rest = int.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}` : last3;
  return `₹${grouped}${dec ? `.${dec}` : ''}`;
}

/**
 * The backend stores scheduledDate as UTC midnight of the chosen day and checks
 * availability with `new Date(scheduledDate).getDay()` on a UTC server. We send
 * and read the plain "YYYY-MM-DD" part so the day never shifts across timezones.
 */
export const toDateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function parseDateKey(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export const dayKeyOf = (d: Date): DayKey => DAY_KEYS[d.getDay()];

export function isDayAvailable(availability: Availability | undefined, d: Date): boolean {
  return !!availability?.[dayKeyOf(d)];
}

export function availableDayNames(availability: Availability | undefined): string[] {
  const order: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return order.filter((k) => availability?.[k]).map((k) => k.slice(0, 3).replace(/^./, (c) => c.toUpperCase()));
}

/**
 * Start-time slots for a companion. The backend accepts any start between the
 * companion's start and end (inclusive); we offer every 30 minutes and drop
 * slots already in the past when the chosen day is today.
 */
export function timeSlots(c: Pick<Companion, 'startTime' | 'endTime'>, day: Date, now: Date = new Date(), step = 30, leadMinutes = 30, durationMinutes = 0): string[] {
  const start = Math.max(toMinutes(c.startTime || DEFAULT_START), toMinutes(DEFAULT_START));
  // Start inside the companion's hours, and finish by 22:00.
  const end = Math.min(toMinutes(c.endTime || DEFAULT_END), toMinutes(DEFAULT_END) - durationMinutes);
  const isToday = toDateKey(day) === toDateKey(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const out: string[] = [];
  for (let t = start; t <= end; t += step) {
    if (isToday && t < nowMin + leadMinutes) continue; // leave time to confirm a companion
    out.push(fromMinutes(t));
  }
  return out;
}

/** Month grid (weeks × 7) with nulls for padding, Sunday first like the mock-up. */
export function monthGrid(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(first.getDay()).fill(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export const personOf = (p: PersonRef | string | null | undefined): PersonRef | null => (p && typeof p === 'object' ? p : null);
export const idOf = (p: PersonRef | string | null | undefined): string => (p && typeof p === 'object' ? p._id : (p ?? ''));

/** The companion to show on a customer's booking: the assigned one, else the one they chose. */
export const companionOf = (b: Pick<Booking, 'companionId' | 'preferredCompanionId'>): PersonRef | null => personOf(b.companionId) ?? personOf(b.preferredCompanionId);

/** When the session starts, as a local Date. */
export function startsAt(b: Pick<Booking, 'scheduledDate' | 'startTime'>): Date {
  const d = parseDateKey(b.scheduledDate);
  const min = toMinutes(b.startTime || '00:00');
  d.setHours(Math.floor(min / 60), min % 60, 0, 0);
  return d;
}

export type Stage =
  | 'awaiting' // request flow: waiting for the companion to accept
  | 'pay' // request flow: accepted, customer must pay
  | 'paying' // prepaid: booking created, payment not finished
  | 'finding' // prepaid: paid, offering to companions
  | 'confirmed'
  | 'completed'
  | 'declined'
  | 'unfulfilled' // prepaid: nobody accepted in time → refunded
  | 'cancelled';

/**
 * Where a booking stands for the customer.
 * Website flow: request → accept → pay. App (prepaid): pay → companion offers → confirmed.
 */
export function stageOf(b: Pick<Booking, 'status' | 'paymentStatus'> & Partial<Pick<Booking, 'flow' | 'allocation'>>): Stage {
  if (b.flow === 'prepaid') {
    switch (b.allocation?.state) {
      case 'awaiting_payment':
        return 'paying';
      case 'offering':
        return 'finding';
      case 'failed':
        return 'unfulfilled';
      case 'cancelled':
        return 'cancelled';
      default:
        return b.status === 'completed' ? 'completed' : b.status === 'cancelled' ? 'cancelled' : 'confirmed';
    }
  }
  switch (b.status) {
    case 'pending':
      return 'awaiting';
    case 'accepted':
      return b.paymentStatus === 'paid' ? 'confirmed' : 'pay';
    case 'completed':
      return 'completed';
    case 'rejected':
      return 'declined';
    default:
      return 'cancelled';
  }
}

/** Plain-language payment state, kept separate from the booking state. */
export function paymentLabel(b: Pick<Booking, 'paymentStatus'> & Partial<Pick<Booking, 'refund' | 'amountPaid' | 'paymentMode'>>): string {
  const test = b.paymentMode === 'simulated' ? ' (test)' : '';
  const r = b.refund;
  if (r && r.status !== 'none') {
    const amt = formatINR(r.amount);
    if (r.status === 'processed') return `Refunded ${amt}${test}`;
    if (r.status === 'failed') return `Refund of ${amt} is being retried`;
    return `Refund of ${amt} in progress`;
  }
  if (b.paymentStatus === 'paid') return `Paid ${formatINR(b.amountPaid ?? 0)}${test}`;
  if (b.paymentStatus === 'refunded') return 'Refunded';
  if (b.paymentStatus === 'failed') return 'Payment failed';
  return 'Not paid';
}

/**
 * What the customer gets back if they cancel now (prsnn refund policy):
 * before the session starts → everything paid; after it starts → nothing automatic.
 */
export function refundIfCancelledNow(b: Booking, now: Date = new Date(), by: 'customer' | 'companion' = 'customer'): { amount: number; fee: number; reason: string } {
  const paid = b.amountPaid ?? 0;
  if (b.paymentStatus !== 'paid') return { amount: 0, fee: 0, reason: 'Nothing has been charged.' };
  if (by === 'companion') return { amount: paid, fee: 0, reason: 'The customer gets a full refund when a companion cancels.' };
  const minutesToStart = (startsAt(b).getTime() - now.getTime()) / 60000;
  if (minutesToStart >= CANCELLATION_CUTOFF_MINUTES) {
    const amount = Math.round(paid * (1 - CANCELLATION_FEE));
    return { amount, fee: paid - amount, reason: `Cancelling ${CANCELLATION_CUTOFF_MINUTES}+ minutes before the start: ${Math.round((1 - CANCELLATION_FEE) * 100)}% refunded (a ${Math.round(CANCELLATION_FEE * 100)}% cancellation fee applies).` };
  }
  return { amount: 0, fee: paid, reason: `It’s within ${CANCELLATION_CUTOFF_MINUTES} minutes of the start (or later), so there’s no refund. Use “Report a problem” if something went wrong.` };
}

/** Minutes left on a deadline (rounded up), or 0. */
export function minutesLeft(iso: string | null | undefined, now: Date = new Date()): number {
  if (!iso) return 0;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - now.getTime()) / 60000));
}

/** "12 min", "2 h", "4 h 50 min". */
export function formatMinutes(m: number): string {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}

/** Earliest session the prepaid flow accepts (allocation needs 90 minutes). */
export const MIN_LEAD_MINUTES = 90;

export type BookingTab = 'upcoming' | 'past' | 'cancelled';

export function tabOf(b: Booking, now: Date = new Date()): BookingTab {
  if (b.status === 'cancelled' || b.status === 'rejected') return 'cancelled';
  if (b.flow === 'prepaid' && ['failed', 'cancelled'].includes(b.allocation?.state ?? '')) return 'cancelled';
  if (b.status === 'completed') return 'past';
  const end = startsAt(b);
  end.setMinutes(end.getMinutes() + Number(b.duration || 60));
  return end.getTime() < now.getTime() ? 'past' : 'upcoming';
}

/** Chat opens for accepted bookings; the requester must have paid (backend socket rule). */
export function canChat(b: Pick<Booking, 'status' | 'paymentStatus'>, isCompanion: boolean): boolean {
  if (!['accepted', 'completed'].includes(b.status)) return false;
  return isCompanion || b.paymentStatus === 'paid';
}

export interface EarningsSummary {
  total: number;
  sessions: number;
  average: number;
  pending: number;
  weeks: { label: string; amount: number }[];
}

/** Companion earnings for one month from incoming bookings (paid ones only). */
/** A companion's own booking: website requests to them, or prepaid offers they accepted. */
export const isMineAsCompanion = (b: Booking) => b.flow !== 'prepaid' || b.myOffer?.status === 'accepted';

/** Waiting for the companion's answer: a live prepaid offer or a pending website request. */
export function awaitingAnswer(b: Booking, now: Date = new Date()): boolean {
  if (b.flow === 'prepaid') return b.myOffer?.status === 'offered' && new Date(b.myOffer.expiresAt).getTime() > now.getTime();
  return b.status === 'pending';
}

export function earningsFor(bookings: Booking[], year: number, month: number): EarningsSummary {
  const inMonth = bookings.filter(isMineAsCompanion).filter((b) => {
    const d = parseDateKey(b.scheduledDate);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const paid = inMonth.filter((b) => b.paymentStatus === 'paid');
  // The companion's 80%, not the customer's total.
  const amount = (b: Booking) => b.companionShare ?? companionShareOf(totalOfBooking(b));
  const total = paid.reduce((s, b) => s + amount(b), 0);
  const days = new Date(year, month + 1, 0).getDate();
  const ranges: [number, number][] = [[1, 7], [8, 14], [15, 21], [22, days]];
  const weeks = ranges.map(([a, z]) => ({
    label: `${a}–${z}`,
    amount: paid.filter((b) => {
      const d = parseDateKey(b.scheduledDate).getDate();
      return d >= a && d <= z;
    }).reduce((s, b) => s + amount(b), 0),
  }));
  return {
    total,
    sessions: paid.length,
    average: paid.length ? Math.round(total / paid.length) : 0,
    pending: bookings.filter((b) => awaitingAnswer(b)).length,
    weeks,
  };
}

/** Category chips on Home/Search map onto companion tags (free text on the backend). */
export const CATEGORIES = [
  { key: 'coffee', label: 'Coffee', icon: 'coffee', match: ['coffee', 'cafe', 'café', 'tea', 'chai'] },
  { key: 'walks', label: 'Walks', icon: 'walk', match: ['walk', 'walks', 'park', 'hike', 'explore'] },
  { key: 'events', label: 'Events', icon: 'ticket', match: ['event', 'events', 'concert', 'movie', 'show', 'party', 'wedding'] },
  { key: 'study', label: 'Study', icon: 'book', match: ['study', 'books', 'reading', 'library', 'work', 'cowork'] },
  { key: 'food', label: 'Food', icon: 'sparkle', match: ['food', 'dinner', 'lunch', 'brunch', 'restaurant'] },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]['key'];

export function matchesCategory(tags: string[] | undefined, key: CategoryKey): boolean {
  const cat = CATEGORIES.find((c) => c.key === key);
  if (!cat) return true;
  const lower = (tags ?? []).map((t) => t.toLowerCase());
  return lower.some((t) => (cat.match as readonly string[]).some((m) => t.includes(m)));
}

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

/** Report reasons: the same keys and labels as private.report_reason_label on the server. */
export type ReportReason = 'inappropriate' | 'harassment' | 'fake_profile' | 'not_allowed' | 'safety' | 'other';

export const REPORT_REASONS: { key: ReportReason; label: string }[] = [
  { key: 'inappropriate', label: 'Inappropriate messages or behaviour' },
  { key: 'harassment', label: 'Harassment or threats' },
  { key: 'fake_profile', label: 'Fake profile or not who they say' },
  { key: 'not_allowed', label: 'Asked for something not allowed (dating, payment outside prsnn…)' },
  { key: 'safety', label: 'Safety concern' },
  { key: 'other', label: 'Something else' },
];

export const REPORT_DETAILS_MAX = 1000;

/** What's missing before a report can be sent; null when ready. */
export function reportError(reason: ReportReason | null, details: string): string | null {
  if (!reason) return 'Choose a reason.';
  if (reason === 'other' && !details.trim()) return 'Tell us what happened.';
  if (details.length > REPORT_DETAILS_MAX) return `Keep it under ${REPORT_DETAILS_MAX} characters.`;
  return null;
}

export interface BlockedPerson {
  id: string;
  name: string;
  photo?: string | null;
  at: string;
}

export interface AdminReport {
  id: string;
  reason: ReportReason;
  reasonLabel: string;
  details?: string | null;
  status: 'open' | 'closed';
  resolution?: string | null;
  createdAt: string;
  handledAt?: string | null;
  reporter: { id: string | null; name?: string | null; phone?: string | null; role?: string | null };
  reported: { id: string | null; name?: string | null; phone?: string | null; role?: string | null; suspended?: boolean; reportsTotal?: number };
  booking?: { id: string; ref: string } | null;
}

import type { AdminBooking, AdminPerson, Role } from './types';

/**
 * Who may do what in the in-app admin (ADMIN_SPEC.md). The server enforces the
 * same split (requireStaff in prsnn-backend routes/adminApp.routes.js); the app
 * uses this only to decide which screens and buttons to show.
 *
 * 'admin' is the website's staff role; it gets the same rights as a sub-admin.
 */
export const STAFF_ROLES: readonly Role[] = ['admin', 'subadmin', 'superadmin'];

export const isStaff = (role?: Role | null) => !!role && STAFF_ROLES.includes(role);
export const isSuperadmin = (role?: Role | null) => role === 'superadmin';

export type AdminAction =
  // operations — every staff role
  | 'verify'
  | 'editUser'
  | 'suspendUser'
  | 'deleteUser'
  | 'editBooking'
  | 'cancelBooking'
  | 'reassignBooking'
  | 'answerDispute'
  | 'viewDisputeChat'
  // superadmin only
  | 'refund'
  | 'retryRefund'
  | 'markPaid'
  | 'overrideFee'
  | 'deleteBooking'
  | 'editPrices'
  | 'broadcast'
  | 'manageAdmins'
  | 'viewActivity'
  | 'viewMoney'
  | 'sendNotification';

const SUPER_ONLY = new Set<AdminAction>(['refund', 'retryRefund', 'markPaid', 'overrideFee', 'deleteBooking', 'editPrices', 'broadcast', 'manageAdmins', 'viewActivity', 'viewMoney', 'sendNotification']);

export function can(role: Role | null | undefined, action: AdminAction): boolean {
  if (!isStaff(role)) return false;
  return SUPER_ONLY.has(action) ? isSuperadmin(role) : true;
}

/** Staff accounts can only be changed by a superadmin; superadmins only through SUPERADMIN_PHONES. */
export function canActOn(viewer: Role | null | undefined, target: Role, self = false): boolean {
  if (!isStaff(viewer) || self) return false;
  if (target === 'superadmin') return false;
  if (isStaff(target)) return isSuperadmin(viewer);
  return true;
}

export const roleLabel = (r: Role) =>
  ({ user: 'Member', companion: 'Companion', admin: 'Admin (web)', subadmin: 'Sub-admin', superadmin: 'Superadmin' })[r] ?? r;

export type BookingTab = 'live' | 'refunds' | 'done';

/** One label + tone for a booking row in the admin lists. */
export function adminBookingState(b: Pick<AdminBooking, 'status' | 'paymentStatus' | 'refund' | 'refundReview' | 'dispute' | 'allocation'>): { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' } {
  if (b.dispute?.status === 'open') return { label: 'Dispute open', tone: 'danger' };
  if (b.refundReview?.needed) return { label: 'Refund decision needed', tone: 'warning' };
  if (b.refund?.status === 'failed') return { label: 'Refund failed', tone: 'danger' };
  if (b.refund?.status === 'pending') return { label: 'Refund pending', tone: 'warning' };
  if (b.refund?.status === 'processed') return { label: `Refunded ₹${b.refund.amount}`, tone: 'neutral' };
  if (b.status === 'completed') return { label: 'Completed', tone: 'success' };
  if (b.status === 'cancelled' || b.status === 'rejected') return { label: b.status === 'cancelled' ? 'Cancelled' : 'Declined', tone: 'neutral' };
  if (b.allocation?.state === 'awaiting_payment' || b.paymentStatus === 'pending') return { label: 'Awaiting payment', tone: 'warning' };
  if (b.allocation?.state === 'offering') return { label: 'Finding companion', tone: 'warning' };
  if (b.allocation?.state === 'id_check') return { label: 'Held · companion ID check', tone: 'warning' };
  if (b.status === 'accepted') return { label: 'Confirmed', tone: 'success' };
  return { label: 'Pending', tone: 'neutral' };
}

/** What a superadmin may still refund on this booking (one refund per booking, server rule). */
export function refundableAmount(b: Pick<AdminBooking, 'paymentStatus' | 'amountPaid' | 'refund'>): number {
  if (b.paymentStatus !== 'paid') return 0;
  if (b.refund && ['pending', 'processed'].includes(b.refund.status)) return 0;
  return b.amountPaid ?? 0;
}

export const personName = (p: AdminPerson | string | null | undefined, fallback = '—') => (p && typeof p === 'object' ? p.fullName || p.username || fallback : fallback);
export const personId = (p: AdminPerson | string | null | undefined) => (p && typeof p === 'object' ? p._id : (p ?? ''));

/** Plain-language line for an activity-log entry. */
export function describeAction(action: string): string {
  const map: Record<string, string> = {
    'verification.approve': 'verified a companion',
    'verification.reject': 'rejected a companion',
    'user.edit': 'edited a profile',
    'app.preview': 'viewed the app with sample data',
    'user.suspend': 'suspended an account',
    'user.unsuspend': 'restored an account',
    'user.delete': 'deleted an account',
    'admin.add': 'added a sub-admin',
    'admin.remove': 'removed a sub-admin',
    'booking.edit': 'edited a booking',
    'booking.cancel': 'cancelled a booking',
    'booking.reassign': 'reassigned a booking',
    'booking.refund': 'refunded a booking',
    'booking.refund_retry': 'retried a refund',
    'booking.mark_paid': 'marked a booking paid',
    'booking.override_fee': 'changed a cancellation fee',
    'booking.delete': 'deleted a booking',
    'booking.read_chat': 'read a dispute chat',
    'dispute.reply': 'replied to a dispute',
    'dispute.close': 'closed a dispute',
    'notification.create': 'sent a notification',
    'notification.delete': 'deleted a notification',
    'settings.pricing': 'changed prices',
    'broadcast.send': 'sent a push broadcast',
  };
  return map[action] ?? action;
}

import type { NotificationType, Role } from './types';
import { staffLevel } from './admin';

/**
 * One account, up to three modes. Everyone books in "booking" mode; a companion can also step into
 * "companion" mode (requests, earnings, client chats); staff also get "admin". Becoming a companion adds a mode; it never takes
 * the member side away. Which mode a booking or notification belongs to is decided from the booking
 * or notification itself, never from the account's role.
 */
export type AppMode = 'booking' | 'companion' | 'admin';
/** The two modes that live in the tabs (Admin is its own set of screens). */
export type SideMode = 'booking' | 'companion';
type Who = { role?: Role | null; staffRole?: Role | null } | Role | null | undefined;
const who = (w: Who) => (typeof w === 'string' ? { role: w } : w ?? null);

/** Can this account use companion mode? Companions (staff who are companions too). */
export const canUseCompanionMode = (role: Role | undefined | null) => role === 'companion';

/** Every mode this person can use, in switch order: Admin (staff), Booking (everyone), Companion (companions). */
export function modesFor(w: Who): AppMode[] {
  const p = who(w);
  const out: AppMode[] = [];
  if (staffLevel(p)) out.push('admin');
  out.push('booking');
  if (canUseCompanionMode(p?.role)) out.push('companion');
  return out;
}

/**
 * The mode to show: the remembered choice if this person can use it; otherwise Admin for staff,
 * Companion for companions (that's where requests arrive), Booking for everyone else.
 */
export function effectiveMode(w: Who, saved: AppMode | undefined): AppMode {
  const modes = modesFor(w);
  if (saved && modes.includes(saved)) return saved;
  return modes.includes('admin') ? 'admin' : modes.includes('companion') ? 'companion' : 'booking';
}

/** The tabs' mode: Admin has its own screens, so on the tabs it reads as Booking. */
export const sideMode = (m: AppMode): SideMode => (m === 'admin' ? 'booking' : m);

/** The mode a booking belongs to for me: bookings I made are booking mode, ones I was booked for are companion mode. */
export const modeOfSide = (side: 'member' | 'companion'): SideMode => (side === 'member' ? 'booking' : 'companion');

/**
 * The mode a notification opens in. Offers and requests are for the companion; confirmations,
 * payments and refunds are for the person who booked. Anything else keeps the current mode.
 */
export function modeForNotification(type: NotificationType | string | undefined): SideMode | null {
  switch (type) {
    case 'booking_offer':
    case 'booking_request':
      return 'companion';
    case 'booking_confirmed':
    case 'booking_accepted':
    case 'payment_completed':
    case 'refund':
      return 'booking';
    default:
      return null;
  }
}

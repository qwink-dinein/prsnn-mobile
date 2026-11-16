import type { NotificationType, Role } from './types';

/**
 * One account, two modes. Everyone books in "booking" mode; an approved companion can also step into
 * "companion" mode (requests, earnings, client chats). Becoming a companion adds a mode; it never takes
 * the member side away. Which mode a booking or notification belongs to is decided from the booking
 * or notification itself, never from the account's role.
 */
export type AppMode = 'booking' | 'companion';

/** Can this account use companion mode? Only approved companions (staff use Admin). */
export const canUseCompanionMode = (role: Role | undefined | null) => role === 'companion';

/**
 * The mode to show. A companion's remembered choice (companion mode if they haven't chosen yet, since
 * that's where requests arrive); everyone else is always in booking mode.
 */
export function effectiveMode(role: Role | undefined | null, saved: AppMode | undefined): AppMode {
  if (!canUseCompanionMode(role)) return 'booking';
  return saved ?? 'companion';
}

/** The mode a booking belongs to for me: bookings I made are booking mode, ones I was booked for are companion mode. */
export const modeOfSide = (side: 'member' | 'companion'): AppMode => (side === 'member' ? 'booking' : 'companion');

/**
 * The mode a notification opens in. Offers and requests are for the companion; confirmations,
 * payments and refunds are for the person who booked. Anything else keeps the current mode.
 */
export function modeForNotification(type: NotificationType | string | undefined): AppMode | null {
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

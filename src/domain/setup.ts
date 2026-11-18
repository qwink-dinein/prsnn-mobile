import type { SessionUser } from './types';
import { hasIdentity } from './privacy';
import { staffLevel } from './admin';
import type { AppMode } from './mode';

/**
 * Setup still has unanswered questions. Staff working in Admin only need a name; staff who switch
 * to Booking answer the member questions like anyone. Companions answer the rest in companion sign-up. Members need: a mobile (email sign-ups
 * give one with the country code), gender, who to meet, photo privacy, city,
 * at least one category, and a photo.
 */
export function needsSetup(u: SessionUser | null | undefined, mode?: AppMode): boolean {
  if (!u) return false;
  if (!u.fullName) return true;
  if (u.role === 'companion') return false;
  if (staffLevel(u) && mode !== 'booking') return false;
  if (!u.phone && !u.contactPhone) return true;
  return !hasIdentity(u) || !u.city || !u.categories?.length || !u.photoStatus || u.photoStatus === 'none';
}

/**
 * The furthest step a multi-step form may reopen on: the first one whose answer is missing
 * (or the last step when everything is answered). Used so a remembered step never lands past
 * a question whose answer didn't survive (for example a photo picked but not yet uploaded).
 */
export function firstUnanswered<T extends string>(steps: readonly T[], answered: Partial<Record<T, boolean>>): number {
  const i = steps.findIndex((s) => !answered[s]);
  return i < 0 ? Math.max(0, steps.length - 1) : i;
}

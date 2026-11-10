import type { SessionUser } from './types';
import { hasIdentity } from './privacy';
import { isStaff } from './admin';

/**
 * Setup still has unanswered questions. Staff only need a name; companions
 * answer the rest in companion sign-up. Members need: a mobile (email sign-ups
 * give one with the country code), gender, who to meet, photo privacy, city,
 * at least one category, and a photo.
 */
export function needsSetup(u: SessionUser | null | undefined): boolean {
  if (!u) return false;
  if (!u.fullName) return true;
  if (isStaff(u.role) || u.role === 'companion') return false;
  if (!u.phone && !u.contactPhone) return true;
  return !hasIdentity(u) || !u.city || !u.categories?.length || !u.photoStatus || u.photoStatus === 'none';
}

/**
 * Who a login belongs to: a mobile number (last 10 digits) or, for email
 * sign-ups, the lower-cased email. Used to key the PIN and the saved session
 * on this phone, and to check a restored session is the right person's.
 */
export function loginKey(id: string): string {
  return id.includes('@') ? `e.${id.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '_')}` : id.replace(/\D/g, '').slice(-10);
}

/** The login id of a Supabase auth user: phone first, else email. */
export function loginIdOfAuthUser(u: { phone?: string | null; email?: string | null } | null | undefined): string | null {
  return u?.phone || u?.email || null;
}

/** true when the auth user is the person `id` (number or email) identifies. */
export function sameLogin(id: string | null | undefined, u: { phone?: string | null; email?: string | null } | null | undefined): boolean {
  if (!id || !u) return false;
  if (id.includes('@')) return !!u.email && loginKey(u.email) === loginKey(id);
  return !!u.phone && loginKey(u.phone) === loginKey(id) && loginKey(id).length === 10;
}

/**
 * A failed session refresh: should the person be asked for a code again?
 * Only when the server says the saved session is gone. A network problem is not
 * a reason to log anyone out; they try again when they're back online.
 */
export function sessionIsGone(message: string | null | undefined): boolean {
  if (!message) return false;
  if (/fetch|network|timed? ?out|offline|failed to fetch|load failed/i.test(message)) return false;
  return /refresh token|invalid|not found|revoked|already used|session.*(missing|expired)|jwt/i.test(message);
}

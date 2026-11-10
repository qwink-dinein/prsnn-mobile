import { router } from 'expo-router';
import type { SessionUser } from '@/domain/types';
import type { AuthResult } from '@/services';
import { useSession } from '@/state/session';
import { svc } from '@/services';
import { hasIdentity } from '@/domain/privacy';
import { isStaff } from '@/domain/admin';
import { displayPhone as displayPhoneOf } from '@/domain/phone';

/** Where to go once someone is signed in and set up. */
export function goHome(user: SessionUser | null = useSession.getState().user) {
  if (isStaff(user?.role)) {
    router.replace('/admin');
    return;
  }
  if (user?.role === 'companion' && (user.verification_status === 'not_submitted' || !user.verification_status)) {
    router.replace('/fellow/onboarding');
    return;
  }
  router.replace('/home');
}

/** Setup still has unanswered questions (staff only need a name; companions answer the rest in companion sign-up). */
export function needsSetup(u: SessionUser | null | undefined): boolean {
  if (!u) return false;
  if (!u.fullName) return true;
  if (isStaff(u.role) || u.role === 'companion') return false;
  if (!u.phone && !u.contactPhone) return true; // email sign-ups give a mobile for updates and safety alerts
  return !hasIdentity(u) || !u.city || !u.categories?.length || !u.photoStatus || u.photoStatus === 'none';
}

/** After the PIN is set (or skipped): finish setup, else home. */
export function afterPin(user: SessionUser | null = useSession.getState().user) {
  if (needsSetup(user)) router.replace('/setup-profile');
  else goHome(user);
}

/**
 * After OTP / email / PIN sign-in. The PIN comes first, straight after the
 * number (or email) is verified; then setup for anything unanswered; then home.
 */
export async function afterAuth(res: AuthResult, opts: { resetPin?: boolean; viaPin?: boolean } = {}) {
  await useSession.getState().signIn(res.token, res.user);
  // Refresh from the server (photo/approval status, categories, city) without blocking on errors.
  try {
    const fresh = await svc.me();
    await useSession.getState().updateUser({ ...fresh, hasPin: res.user.hasPin });
    res = { ...res, user: { ...res.user, ...fresh, hasPin: res.user.hasPin } };
  } catch {
    // offline: carry on with what sign-in returned
  }
  if (opts.resetPin && !res.isNewUser) router.replace({ pathname: '/pin', params: { mode: 'set', reset: '1' } });
  else if (!opts.viaPin && !res.user.hasPin) router.replace({ pathname: '/pin', params: { mode: 'set' } });
  else afterPin(res.user);
}

export { normaliseIndianMobile, displayPhone } from '@/domain/phone';

/** "+91 98765 43210" for numbers, the address itself for email sign-ups. */
export const displayLogin = (id?: string | null) => (!id ? '' : id.includes('@') ? id : displayPhoneOf(id));

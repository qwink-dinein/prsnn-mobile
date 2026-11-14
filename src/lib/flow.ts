import { router } from 'expo-router';
import type { SessionUser } from '@/domain/types';
import type { AuthResult } from '@/services';
import { useSession } from '@/state/session';
import { svc } from '@/services';
import { needsSetup } from '@/domain/setup';
import { isStaff } from '@/domain/admin';
import { displayPhone as displayPhoneOf } from '@/domain/phone';
import { hasLocalPin } from '@/lib/pin';

/**
 * Replace the whole stack, so the screens behind (welcome, number, code, PIN) can't be
 * reached with the back button or a swipe once someone is past them.
 */
function resetTo(href: Parameters<typeof router.replace>[0]) {
  if (router.canDismiss()) router.dismissAll();
  router.replace(href);
}

/** Where to go once someone is signed in and set up. */
export function goHome(user: SessionUser | null = useSession.getState().user) {
  if (isStaff(user?.role)) {
    resetTo('/admin');
    return;
  }
  if (user?.role === 'companion' && (user.verification_status === 'not_submitted' || !user.verification_status)) {
    resetTo('/fellow/onboarding');
    return;
  }
  resetTo('/home');
}

export { needsSetup } from '@/domain/setup';

/**
 * Not signed in: whoever last logged in on this phone and set a PIN goes straight
 * to the PIN screen (no WhatsApp code needed); everyone else to `fallback`.
 */
export async function goToLogin(fallback: '/welcome' | '/login' = '/welcome') {
  const last = useSession.getState().prefs.lastPhone;
  if (last && (await hasLocalPin(last))) resetTo({ pathname: '/pin', params: { mode: 'login', phone: last } });
  else resetTo(fallback);
}

/** After the PIN is set (or skipped): finish setup, else home. */
export function afterPin(user: SessionUser | null = useSession.getState().user) {
  if (needsSetup(user)) resetTo('/setup-profile');
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
  if (opts.resetPin && !res.isNewUser) resetTo({ pathname: '/pin', params: { mode: 'set', reset: '1' } });
  else if (!opts.viaPin && !res.user.hasPin) resetTo({ pathname: '/pin', params: { mode: 'set' } });
  else afterPin(res.user);
}

export { normaliseIndianMobile, displayPhone } from '@/domain/phone';

/** "+91 98765 43210" for numbers, the address itself for email sign-ups. */
export const displayLogin = (id?: string | null) => (!id ? '' : id.includes('@') ? id : displayPhoneOf(id));

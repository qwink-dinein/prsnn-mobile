import { router } from 'expo-router';
import type { SessionUser } from '@/domain/types';
import type { AuthResult } from '@/services';
import { useSession } from '@/state/session';
import { svc } from '@/services';
import { hasIdentity } from '@/domain/privacy';

/** Where to go once someone is signed in and set up. */
export function goHome(user: SessionUser | null = useSession.getState().user) {
  if (user?.role === 'companion' && (user.verification_status === 'not_submitted' || !user.verification_status)) {
    router.replace('/fellow/onboarding');
    return;
  }
  router.replace('/home');
}

/**
 * After OTP / email / PIN sign-in:
 *   new or nameless account → set up profile → set PIN → home
 *   no PIN yet              → set PIN → home
 */
export async function afterAuth(res: AuthResult, opts: { resetPin?: boolean } = {}) {
  await useSession.getState().signIn(res.token, res.user);
  // Logins that don't return gender/privacy (email accounts) pick them up from the profile.
  if (!hasIdentity(res.user)) {
    try {
      const p = await svc.profile();
      const patch = { gender: p.gender, seeGender: p.seeGender, profileVisibility: p.profileVisibility, city: p.city ?? res.user.city, fullName: res.user.fullName || p.fullName };
      await useSession.getState().updateUser(patch);
      res = { ...res, user: { ...res.user, ...patch } };
    } catch {
      // offline or older server: the setup screen asks instead
    }
  }
  // Forgot PIN: the OTP proved it's them, so go straight to choosing a new PIN.
  if (opts.resetPin && !res.isNewUser) router.replace({ pathname: '/pin', params: { mode: 'set', reset: '1' } });
  else if (res.isNewUser || !res.user.fullName || !hasIdentity(res.user)) router.replace('/setup-profile');
  else if (res.user.phone && !res.user.hasPin) router.replace({ pathname: '/pin', params: { mode: 'set' } });
  else goHome(res.user);
}

export { normaliseIndianMobile, displayPhone } from '@/domain/phone';

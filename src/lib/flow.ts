import { router } from 'expo-router';
import type { SessionUser } from '@/domain/types';
import type { AuthResult } from '@/services';
import { useSession } from '@/state/session';

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
export async function afterAuth(res: AuthResult) {
  await useSession.getState().signIn(res.token, res.user);
  if (res.isNewUser || !res.user.fullName) router.replace('/setup-profile');
  else if (res.user.phone && !res.user.hasPin) router.replace({ pathname: '/pin', params: { mode: 'set' } });
  else goHome(res.user);
}

export { normaliseIndianMobile, displayPhone } from '@/domain/phone';

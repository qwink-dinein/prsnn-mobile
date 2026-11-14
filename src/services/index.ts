import { DEMO } from '@/lib/config';
import { backend } from './backend';
import { demo } from './demo';

let current = DEMO ? demo : backend;
let previewing = false;

/**
 * One entry point for all server calls. Demo mode (EXPO_PUBLIC_DEMO=1) swaps in sample
 * data at build time; staff "View the app as…" swaps it in at run time (setSampleMode).
 */
export const svc: typeof backend = new Proxy({} as typeof backend, {
  get: (_t, key) => (current as Record<string | symbol, unknown>)[key],
});

/** True while the app is running on sample data (demo build or an admin preview). Nothing reaches the server. */
export const isSampleMode = () => DEMO || previewing;

/** Staff preview: route every call to the sample service, or back to the real backend. */
export function setSampleMode(on: boolean) {
  previewing = on;
  current = DEMO || on ? demo : backend;
}

export type { AuthResult, PaymentIntent, CompanionForm, IdForm, UnreadCounts } from './backend';

/** React Query keys, in one place so invalidation stays consistent. */
export const qk = {
  me: ['me'] as const,
  unread: ['unread'] as const,
  companions: ['companions'] as const,
  companion: (id: string) => ['companion', id] as const,
  myBookings: ['bookings', 'mine'] as const,
  incoming: ['bookings', 'incoming'] as const,
  booking: (id: string) => ['booking', id] as const,
  notifications: ['notifications'] as const,
  profile: ['profile'] as const,
  profileCheck: ['profile', 'check'] as const,
  pricing: ['settings', 'pricing'] as const,
  admin: {
    all: ['admin'] as const,
    overview: ['admin', 'overview'] as const,
    verifications: ['admin', 'verifications'] as const,
    users: (q: string, role: string) => ['admin', 'users', q, role] as const,
    user: (id: string) => ['admin', 'user', id] as const,
    admins: ['admin', 'admins'] as const,
    bookings: (tab: string) => ['admin', 'bookings', tab] as const,
    booking: (id: string) => ['admin', 'booking', id] as const,
    messages: (id: string) => ['admin', 'messages', id] as const,
    disputes: (status: string) => ['admin', 'disputes', status] as const,
    audience: ['admin', 'audience'] as const,
    broadcasts: ['admin', 'broadcasts'] as const,
    activity: ['admin', 'activity'] as const,
  },
};

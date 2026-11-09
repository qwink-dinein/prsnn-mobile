import { DEMO } from '@/lib/config';
import { backend } from './backend';
import { demo } from './demo';

/** One entry point for all server calls. Demo mode swaps in sample data. */
export const svc = DEMO ? demo : backend;

export type { AuthResult, PaymentIntent, CompanionForm } from './backend';

/** React Query keys, in one place so invalidation stays consistent. */
export const qk = {
  companions: ['companions'] as const,
  companion: (id: string) => ['companion', id] as const,
  myBookings: ['bookings', 'mine'] as const,
  incoming: ['bookings', 'incoming'] as const,
  booking: (id: string) => ['booking', id] as const,
  notifications: ['notifications'] as const,
  profile: ['profile'] as const,
  profileCheck: ['profile', 'check'] as const,
};

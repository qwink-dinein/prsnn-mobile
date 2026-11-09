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

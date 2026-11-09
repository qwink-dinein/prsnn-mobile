import { api, toForm, type UploadFile } from '@/lib/api';
import type { AdminBooking, AdminChatMessage, AdminOverview, AdminUser, AppNotification, AuditEntry, Booking, BroadcastAudience, BroadcastRecord, Companion, Duration, Policy, Profile, ProfileCheck, Quote, SessionUser, BookingStatus } from '@/domain/types';
import type { PricingSettings } from '@/domain/pricing';
import type { BookingTab } from '@/domain/admin';

/** The list endpoint returns a mapped shape, search/get return raw User docs. Normalise both. */
export function normaliseCompanion(raw: Record<string, any>): Companion {
  return {
    id: String(raw.id ?? raw._id ?? raw.userId),
    username: raw.username,
    fullName: raw.fullName,
    profilePhoto: raw.profilePhoto ?? raw.profilePhotoUrl ?? null,
    description: raw.description,
    pricePerHour: raw.pricePerHour ?? raw.price_per_hour,
    packages: Array.isArray(raw.packages) ? raw.packages : undefined,
    city: raw.city,
    area: raw.area,
    state: raw.state,
    gender: raw.gender,
    locked: !!raw.locked,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    availability: raw.availability,
    startTime: raw.startTime ?? raw.start_time,
    endTime: raw.endTime ?? raw.end_time,
  };
}

export interface AuthResult {
  token: string;
  user: SessionUser;
  isNewUser?: boolean;
}

export interface PaymentIntent {
  /** 'simulated' while the backend runs PAYMENT_MODE=simulated (test checkout, no money moves). */
  mode?: 'razorpay' | 'simulated';
  orderId: string;
  amount: number; // paise
  currency: string;
  keyId?: string;
}

export interface CompanionForm {
  fullName: string;
  phoneNumber: string;
  city: string;
  area: string;
  description: string;
  /** Durations (hours) the companion offers; prices are fixed. */
  packages: number[];
  startTime: string;
  endTime: string;
  tags: string[];
  days: Record<string, boolean>;
  state?: string;
  gender?: string;
  profileVisibility?: string;
  profilePhoto: UploadFile | null;
  idProofFront: UploadFile | null;
  idProofBack: UploadFile | null;
  backupPhoto?: UploadFile | null;
}

export const backend = {
  // ── Auth (phone OTP + PIN are new endpoints, see API.md §Auth) ──
  sendOtp: (phone: string, channel: 'whatsapp' | 'sms' = 'whatsapp') =>
    api.post<{ message: string; expiresIn?: number }>('/auth/phone/send-otp', { phone, channel }),
  verifyOtp: (phone: string, otp: string, role?: 'user' | 'companion') => api.post<AuthResult>('/auth/phone/verify-otp', { phone, otp, role }),
  setPin: (pin: string) => api.post<{ message: string }>('/auth/pin/set', { pin }),
  pinLogin: (phone: string, pin: string) => api.post<AuthResult>('/auth/pin/login', { phone, pin }),
  // Existing web accounts keep working with email/username + password.
  emailLogin: (email: string, password: string) => api.post<AuthResult>('/auth/login', { email, password }),
  verifyEmail: (email: string, otp: string) => api.post<AuthResult>('/auth/verify-email', { email, otp }),

  // ── Companions ──
  companions: async () => (await api.get<Record<string, any>[]>('/companions?limit=100')).map(normaliseCompanion),
  companion: async (id: string) => normaliseCompanion(await api.get<Record<string, any>>(`/companions/${id}`)),

  // ── Bookings ──
  createBooking: (b: { companionId: string; scheduledDate: string; startTime: string; duration: Duration; message?: string }) =>
    api.post<{ message: string; booking: Booking }>('/bookings/request', b),
  myBookings: () => api.get<Booking[]>('/bookings/my-requests'),
  incomingBookings: () => api.get<Booking[]>('/bookings/incoming-requests'),
  booking: (id: string) => api.get<Booking>(`/bookings/${id}`),
  setBookingStatus: (id: string, status: Exclude<BookingStatus, 'pending'>) => api.put<{ booking: Booking }>(`/bookings/${id}/status`, { status }),
  cancelBooking: (id: string) => api.post<{ booking: Booking }>(`/bookings/${id}/cancel`),

  // ── Prepaid booking (pay first, then companion offers) ──
  policy: () => api.get<Policy>('/bookings/prepaid/policy'),
  createPrepaidBooking: (b: { companionId: string; scheduledDate: string; startTime: string; duration: Duration; idempotencyKey: string; acceptTerms: true; message?: string; experience?: string; city?: string; area?: string }) =>
    api.post<{ booking: Booking; quote: Quote; policy: Policy; replayed?: boolean }>('/bookings/prepaid', b),
  acceptOffer: (id: string) => api.post<{ message: string; booking: Booking }>(`/bookings/${id}/offer/accept`),
  declineOffer: (id: string) => api.post<{ message: string }>(`/bookings/${id}/offer/decline`),
  openDispute: (id: string, reason: string) => api.post<{ message: string; booking: Booking }>(`/bookings/${id}/dispute`, { reason }),

  // ── Payments (Razorpay) ──
  createPaymentIntent: (bookingId: string) => api.post<PaymentIntent>('/payments/create-intent', { bookingId }),
  verifyPayment: (p: { bookingId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    api.post<{ message: string; booking: Booking }>('/payments/verify-payment', p),
  simulatePayment: (bookingId: string, outcome: 'success' | 'failure' = 'success') => api.post<{ message: string; booking: Booking }>('/payments/simulate', { bookingId, outcome }),

  // ── Notifications ──
  notifications: () => api.get<AppNotification[]>('/notifications'),
  clearNotifications: () => api.del<{ message: string }>('/notifications/clear'),

  // ── Profile ──
  profile: () => api.get<Profile>('/profile'),
  checkProfile: () => api.get<ProfileCheck>('/profile/check'),
  onboardBasic: (f: { fullName: string; phoneNumber: string; city: string; area: string; profilePhoto?: UploadFile | null }) =>
    api.post<{ user: Profile }>('/profile/onboard-basic', toForm({ fullName: f.fullName, phoneNumber: f.phoneNumber, city: f.city, area: f.area }, { profilePhoto: f.profilePhoto })),
  onboardCompanion: (f: CompanionForm) =>
    api.post<{ message: string }>(
      '/profile/onboard-companion',
      toForm(
        {
          fullName: f.fullName,
          phoneNumber: f.phoneNumber,
          city: f.city,
          area: f.area,
          description: f.description,
          packages: f.packages,
          startTime: f.startTime,
          endTime: f.endTime,
          tags: f.tags,
          state: f.state,
          gender: f.gender,
          profileVisibility: f.profileVisibility,
          visibilityConsent: f.profileVisibility ? true : undefined,
          ...Object.fromEntries(Object.entries(f.days).map(([d, on]) => [`${d}_availability`, on])),
        },
        { profilePhoto: f.profilePhoto, idProofFront: f.idProofFront, idProofBack: f.idProofBack, backupPhoto: f.backupPhoto },
      ),
    ),
  /** Gender, who to see, profile lock (consent required when changing it), city/state/area. */
  updateIdentity: (f: { gender?: string; seeGender?: string; profileVisibility?: string; visibilityConsent?: boolean; city?: string; state?: string; area?: string }) =>
    api.put<{ message: string }>('/profile/update', toForm(f)),
  updateProfile: (fields: Record<string, unknown>, photo?: UploadFile | null) => api.put<{ message: string }>('/profile/update', toForm(fields, { profilePhoto: photo })),
  deleteAccount: () => api.del<{ message: string }>('/profile'),
  /** Expo push token for this device; null turns pushes off (sign-out). */
  savePushToken: (token: string | null) => api.put<{ message: string }>('/profile/push-token', { token }),

  // ── Prices (public; the app falls back to the bundled defaults) ──
  pricing: () => api.get<PricingSettings>('/settings/pricing'),

  // ── In-app admin (staff only; money/price/push routes are superadmin-only on the server) ──
  admin: {
    overview: () => api.get<AdminOverview>('/admin/app/overview'),
    verifications: () => api.get<AdminUser[]>('/admin/app/verifications'),
    decideVerification: (id: string, decision: 'verified' | 'rejected', note?: string) => api.post<{ message: string; user: AdminUser }>(`/admin/app/verifications/${id}`, { decision, note }),
    users: (p: { q?: string; role?: string } = {}) => api.get<AdminUser[]>(`/admin/app/users?${new URLSearchParams(Object.entries(p).filter(([, v]) => v) as [string, string][]).toString()}`),
    user: (id: string) => api.get<{ user: AdminUser; bookings: AdminBooking[] }>(`/admin/app/users/${id}`),
    updateUser: (id: string, fields: Partial<AdminUser>) => api.patch<{ message: string; user: AdminUser }>(`/admin/app/users/${id}`, fields),
    suspendUser: (id: string, suspended: boolean, reason?: string) => api.post<{ message: string; user: AdminUser }>(`/admin/app/users/${id}/suspend`, { suspended, reason }),
    deleteUser: (id: string) => api.del<{ message: string }>(`/admin/app/users/${id}`),
    admins: () => api.get<AdminUser[]>('/admin/app/admins'),
    addAdmin: (phone: string) => api.post<{ message: string; user: AdminUser }>('/admin/app/admins', { phone }),
    removeAdmin: (id: string) => api.del<{ message: string }>(`/admin/app/admins/${id}`),
    bookings: (tab: BookingTab) => api.get<AdminBooking[]>(`/admin/app/bookings?tab=${tab}`),
    booking: (id: string) => api.get<AdminBooking>(`/admin/app/bookings/${id}`),
    bookingMessages: (id: string) => api.get<AdminChatMessage[]>(`/admin/app/bookings/${id}/messages`),
    updateBooking: (id: string, fields: { scheduledDate?: string; startTime?: string; message?: string; status?: 'completed' }) => api.patch<{ message: string; booking: AdminBooking }>(`/admin/app/bookings/${id}`, fields),
    cancelBooking: (id: string, reason: string, refundAmount?: number) => api.post<{ message: string; booking: AdminBooking }>(`/admin/app/bookings/${id}/cancel`, { reason, refundAmount }),
    reassignBooking: (id: string, companionId: string) => api.post<{ message: string; booking: AdminBooking }>(`/admin/app/bookings/${id}/reassign`, { companionId }),
    refund: (id: string, amount: number, reason: string) => api.post<{ message: string; booking: AdminBooking }>(`/admin/app/bookings/${id}/refund`, { amount, reason }),
    retryRefund: (id: string) => api.post<{ message: string; booking: AdminBooking }>(`/admin/app/bookings/${id}/refund/retry`),
    markPaid: (id: string) => api.post<{ message: string; booking: AdminBooking }>(`/admin/app/bookings/${id}/mark-paid`),
    overrideFee: (id: string, retained: number) => api.post<{ message: string; booking: AdminBooking }>(`/admin/app/bookings/${id}/cancellation-fee`, { retained }),
    deleteBooking: (id: string) => api.del<{ message: string }>(`/admin/app/bookings/${id}`),
    disputes: (status: 'open' | 'resolved') => api.get<AdminBooking[]>(`/admin/app/disputes?status=${status}`),
    replyDispute: (id: string, message: string) => api.post<{ message: string; booking: AdminBooking }>(`/admin/app/disputes/${id}/reply`, { message }),
    closeDispute: (id: string, resolution: string) => api.post<{ message: string; booking: AdminBooking }>(`/admin/app/disputes/${id}/close`, { resolution }),
    savePricing: (p: Partial<PricingSettings> & { repriceUnpaid?: boolean }) => api.put<{ message: string; pricing: PricingSettings; repriced: number }>('/admin/settings/pricing', p),
    audience: () => api.get<Record<BroadcastAudience, number>>('/admin/app/broadcast/audience'),
    broadcast: (b: { audience: BroadcastAudience; title: string; body: string }) => api.post<{ message: string; broadcast: BroadcastRecord }>('/admin/broadcast', b),
    broadcasts: () => api.get<BroadcastRecord[]>('/admin/app/broadcasts'),
    activity: (before?: string) => api.get<AuditEntry[]>(`/admin/app/activity${before ? `?before=${encodeURIComponent(before)}` : ''}`),
  },
};

export type Backend = typeof backend;

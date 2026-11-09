import { api, toForm, type UploadFile } from '@/lib/api';
import type { AppNotification, Booking, Companion, Duration, Profile, ProfileCheck, SessionUser, BookingStatus } from '@/domain/types';

/** The list endpoint returns a mapped shape, search/get return raw User docs. Normalise both. */
export function normaliseCompanion(raw: Record<string, any>): Companion {
  return {
    id: String(raw.id ?? raw._id ?? raw.userId),
    username: raw.username,
    fullName: raw.fullName,
    profilePhoto: raw.profilePhoto ?? raw.profilePhotoUrl ?? null,
    description: raw.description,
    pricePerHour: raw.pricePerHour ?? raw.price_per_hour,
    city: raw.city,
    area: raw.area,
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
  orderId: string;
  amount: number; // paise
  currency: string;
  keyId: string;
}

export interface CompanionForm {
  fullName: string;
  phoneNumber: string;
  city: string;
  area: string;
  description: string;
  pricePerHour: number;
  startTime: string;
  endTime: string;
  tags: string[];
  days: Record<string, boolean>;
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

  // ── Payments (Razorpay) ──
  createPaymentIntent: (bookingId: string) => api.post<PaymentIntent>('/payments/create-intent', { bookingId }),
  verifyPayment: (p: { bookingId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    api.post<{ message: string; booking: Booking }>('/payments/verify-payment', p),

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
          pricePerHour: f.pricePerHour,
          startTime: f.startTime,
          endTime: f.endTime,
          tags: f.tags,
          ...Object.fromEntries(Object.entries(f.days).map(([d, on]) => [`${d}_availability`, on])),
        },
        { profilePhoto: f.profilePhoto, idProofFront: f.idProofFront, idProofBack: f.idProofBack, backupPhoto: f.backupPhoto },
      ),
    ),
  updateProfile: (fields: Record<string, unknown>, photo?: UploadFile | null) => api.put<{ message: string }>('/profile/update', toForm(fields, { profilePhoto: photo })),
  deleteAccount: () => api.del<{ message: string }>('/profile'),
};

export type Backend = typeof backend;

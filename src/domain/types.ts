/** Shapes returned by prsnn-backend (see API.md). Keep in sync with src/models/*.js there. */

export type Role = 'user' | 'companion' | 'admin' | 'superadmin';
export type VerificationStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type Availability = Partial<Record<DayKey, boolean>>;

export interface SessionUser {
  id: string;
  email?: string;
  username?: string;
  role: Role;
  is_verified: boolean;
  verification_status: VerificationStatus;
  fullName?: string;
  profilePhoto?: string | null;
  phone?: string;
  hasPin?: boolean;
}

export interface Companion {
  id: string;
  username?: string;
  fullName?: string;
  profilePhoto?: string | null;
  description?: string;
  pricePerHour?: number;
  city?: string;
  area?: string;
  tags: string[];
  availability?: Availability;
  startTime?: string; // "HH:MM"
  endTime?: string;
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type Duration = '30' | '60' | '90' | '120' | '180' | '240';

export interface PersonRef {
  _id: string;
  fullName?: string;
  profilePhotoUrl?: string;
  pricePerHour?: number;
  phoneNumber?: string;
}

export interface Booking {
  _id: string;
  requesterId: PersonRef | string;
  companionId: PersonRef | string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  message?: string;
  pricePerHour: number;
  startTime: string; // "HH:MM"
  duration: Duration;
  scheduledDate: string; // ISO
  amountPaid?: number;
  createdAt: string;
}

export type NotificationType = 'booking_request' | 'booking_accepted' | 'payment_completed' | 'other';

export interface AppNotification {
  _id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  bookingId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  username?: string;
  email?: string;
  role: Role;
  fullName?: string;
  phoneNumber?: string;
  city?: string;
  area?: string;
  profilePhotoUrl?: string;
  description?: string;
  pricePerHour?: number;
  startTime?: string;
  endTime?: string;
  tags?: string[];
  availability?: Availability;
  verification_status: VerificationStatus;
  is_verified: boolean;
}

export interface ProfileCheck {
  hasProfile: boolean;
  status: VerificationStatus | 'not_found';
  is_verified?: boolean;
  role?: Role;
}

/** Shapes returned by prsnn-backend (see API.md). Keep in sync with src/models/*.js there. */

export type Role = 'user' | 'companion' | 'admin' | 'superadmin';
export type VerificationStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

export type Gender = 'woman' | 'man' | 'nonbinary';
export type SeeGender = Gender | 'everyone';
export type Visibility = 'open' | 'locked';

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
  gender?: Gender;
  seeGender?: SeeGender;
  profileVisibility?: Visibility;
  city?: string;
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
  state?: string;
  gender?: Gender;
  /** Locked by the companion: no photo, first name only (until a confirmed booking). */
  locked?: boolean;
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
  locked?: boolean;
}

export type AllocationState = 'awaiting_payment' | 'offering' | 'assigned' | 'failed' | 'cancelled';
export type RefundStatus = 'none' | 'pending' | 'processed' | 'failed';

export interface Booking {
  _id: string;
  requesterId: PersonRef | string;
  /** Request flow: the companion asked. Prepaid: empty until a companion accepts. */
  companionId?: PersonRef | string | null;
  /** 'prepaid' (app): pay first, then up to 3 companions are offered in turn. */
  flow?: 'request' | 'prepaid';
  preferredCompanionId?: PersonRef | string | null;
  allocation?: { state: AllocationState; paymentDeadline?: string; deadline?: string; assignedAt?: string; failedReason?: string };
  /** Customer's view of the offers: how many companions were tried, and the live offer's deadline. */
  offerSummary?: { tried: number; liveUntil: string | null };
  /** Companion's view: their own offer. */
  myOffer?: { status: 'offered' | 'accepted' | 'declined' | 'expired' | 'withdrawn'; expiresAt: string; offeredAt: string } | null;
  refund?: { status: RefundStatus; amount: number; reason?: string; processedAt?: string };
  dispute?: { status: 'none' | 'open' | 'resolved'; reason?: string; openedAt?: string };
  cancelledBy?: 'requester' | 'companion' | 'system' | 'admin';
  cancelReason?: string;
  paymentMode?: 'razorpay' | 'simulated';
  paidAt?: string;
  city?: string;
  area?: string;
  experience?: string;
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

export type NotificationType = 'booking_request' | 'booking_accepted' | 'payment_completed' | 'booking_offer' | 'booking_confirmed' | 'booking_cancelled' | 'refund' | 'dispute' | 'other';

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
  state?: string;
  gender?: Gender;
  seeGender?: SeeGender;
  profileVisibility?: Visibility;
  visibilityConsentAt?: string;
}

export interface Policy {
  fees: string;
  allocation: string;
  cancellation: string[];
  refunds: string;
  support: string;
}

export interface Quote {
  currency: 'INR';
  amount: number;
  fees: number;
  pricePerHour: number;
  duration: string;
}

export interface ProfileCheck {
  hasProfile: boolean;
  status: VerificationStatus | 'not_found';
  is_verified?: boolean;
  role?: Role;
}

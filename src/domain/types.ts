/** Shapes returned by prsnn-backend (see API.md). Keep in sync with src/models/*.js there. */

export type Role = 'user' | 'companion' | 'admin' | 'subadmin' | 'superadmin';
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
  /** Durations (hours) this companion offers at the fixed package prices. */
  packages?: number[];
  tags: string[];
  availability?: Availability;
  startTime?: string; // "HH:MM"
  endTime?: string;
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
/** Minutes. Whole hours 1–12 are packages; 30/90/180 exist on older website bookings. */
export type Duration = '30' | '60' | '90' | '120' | '180' | '240' | '300' | '360' | '420' | '480' | '540' | '600' | '660' | '720';

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
  refund?: { status: RefundStatus; amount: number; retained?: number; reason?: string; processedAt?: string };
  dispute?: {
    status: 'none' | 'open' | 'resolved';
    reason?: string;
    openedAt?: string;
    openedBy?: PersonRef | string;
    notes?: { by: string; role: Role; message: string; at: string }[];
    resolution?: string;
    resolvedAt?: string;
  };
  cancelledBy?: 'requester' | 'companion' | 'system' | 'admin';
  cancelReason?: string;
  paymentMode?: 'razorpay' | 'simulated';
  paidAt?: string;
  city?: string;
  area?: string;
  experience?: string;
  /** Fixed package price (₹), same for every companion. */
  packagePrice?: number;
  /** What the companion receives (80%). */
  companionShare?: number;
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
  packages?: number[];
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
  hours?: number;
  effectiveHourly?: number;
  pricePerHour: number;
  duration: string;
}

export interface ProfileCheck {
  hasProfile: boolean;
  status: VerificationStatus | 'not_found';
  is_verified?: boolean;
  role?: Role;
}

// ───────── In-app admin (ADMIN_SPEC.md, API.md §Admin) ─────────

export interface AdminPerson extends PersonRef {
  username?: string;
  phone?: string;
  role?: Role;
}

/** A booking as staff see it: people populated; payout fields only for superadmins. */
export interface AdminBooking extends Omit<Booking, 'requesterId' | 'companionId' | 'preferredCompanionId'> {
  ref: string;
  requesterId: AdminPerson | string;
  companionId?: AdminPerson | string | null;
  preferredCompanionId?: AdminPerson | string | null;
  /** A sub-admin cancelled a paid booking; a superadmin decides the refund. */
  refundReview?: { needed: boolean; note?: string; requestedAt?: string };
  refund?: Booking['refund'] & { attempts?: number };
  offers?: { _id: string; companionId: AdminPerson | string; status: string; offeredAt: string; expiresAt: string }[];
  cancelledAt?: string;
  /** Superadmin only. */
  platformShare?: number;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  username?: string;
  fullName: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  role: Role;
  verificationStatus: VerificationStatus;
  suspended: boolean;
  suspendedReason?: string;
  city?: string;
  area?: string;
  state?: string;
  gender?: Gender;
  seeGender?: SeeGender;
  profileVisibility: Visibility;
  profilePhotoUrl?: string;
  backupPhotoUrl?: string;
  idProofFrontUrl?: string;
  idProofBackUrl?: string;
  description?: string;
  tags: string[];
  packages?: number[];
  availability?: Availability;
  startTime?: string;
  endTime?: string;
  hasPushToken: boolean;
  createdAt: string;
}

export interface AdminOverview {
  role: Role;
  pendingVerifications: number;
  liveBookings: number;
  openDisputes: number;
  refundsToReview: number;
  failedRefunds: number;
  members: number;
  companions: number;
  bookingsToday: number;
  /** Superadmin only. */
  money?: { collected: number; refunded: number; companionPayouts: number; platformNet: number };
}

export interface AuditEntry {
  _id: string;
  action: string;
  role: Role;
  actorId: string;
  actorName: string;
  target?: { kind?: string; id?: string };
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  at: string;
}

export type BroadcastAudience = 'members' | 'companions';
export interface BroadcastRecord {
  _id: string;
  audience: BroadcastAudience;
  title: string;
  body: string;
  recipients: number;
  sent: number;
  failed: number;
  createdAt: string;
}

export interface AdminChatMessage {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole?: Role;
  content: string;
  createdAt: string;
}

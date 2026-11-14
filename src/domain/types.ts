/** Shapes returned by prsnn-backend (see API.md). Keep in sync with src/models/*.js there. */

export type Role = 'user' | 'companion' | 'admin' | 'subadmin' | 'superadmin';
/**
 * Companion ID check (asked at the first booking, not at sign-up):
 *  not_submitted — profile not finished; id_required — live, no ID yet;
 *  pending — ID under review; verified; rejected — hidden until a new ID is approved.
 */
export type VerificationStatus = 'not_submitted' | 'id_required' | 'pending' | 'verified' | 'rejected';
export type IdType = 'aadhaar' | 'pan' | 'driving_licence' | 'passport' | 'voter_id';

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
  state?: string;
  area?: string;
  /** Email sign-ups (visitors from abroad) use contactPhone for updates and safety alerts. */
  contactPhone?: string | null;
  country?: string | null;
  /** Every photo is approved by staff before others see it. */
  photoStatus?: PhotoStatus;
  photoNote?: string | null;
  /** Companions: profile approval before going live. */
  approvalStatus?: ApprovalStatus;
  /** Suspended by staff: not listed, can't accept bookings. */
  suspended?: boolean;
  approvalNote?: string | null;
  categories?: string[];
}

export type PhotoStatus = 'none' | 'pending' | 'approved' | 'changes_requested';
export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'changes_requested' | 'rejected';

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
  /** False for new companions whose ID is checked at their first booking. */
  idVerified?: boolean;
  categories?: string[];
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
  idVerified?: boolean;
}

/** id_check: a new companion accepted; held while staff check their ID. */
export type AllocationState = 'awaiting_payment' | 'offering' | 'id_check' | 'assigned' | 'failed' | 'cancelled';
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
  category?: string | null;
  /** The public place both people agreed to meet. */
  meetingPlace?: string | null;
  /** Booked for someone else: who they are. The companion never sees the number. */
  recipient?: Recipient | null;
  /** An open panic alert on this booking, if any. */
  panic?: { id: string; raisedAt: string; mine: boolean; sends: number; lastSentAt?: string | null } | null;
}

export type Relation = 'mother' | 'father' | 'grandparent' | 'relative' | 'friend' | 'other';
export interface Recipient {
  relation: Relation;
  name: string;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
}

export interface PanicAlert {
  id: string;
  bookingId: string;
  ref: string;
  raisedRole: 'member' | 'companion';
  raisedAt: string;
  sends: number;
  lastSentAt?: string | null;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  resolvedNote?: string | null;
  scheduledDate: string;
  startTime: string;
  duration: number;
  meetingPlace?: string | null;
  city?: string | null;
  area?: string | null;
  recipient?: { name: string; relation: string; phone?: string | null } | null;
  member: { id: string; name: string; phone?: string | null };
  companion: { id: string; name: string; phone?: string | null };
}

export interface CityPlan {
  id: string;
  state: string;
  city: string;
  category: string;
  title: string;
  details?: string | null;
  hours: number;
  sort?: number;
  active?: boolean;
}

export interface Locality {
  name: string;
  district: string;
  pincode: string;
}

export type NotificationType = 'booking_request' | 'booking_accepted' | 'payment_completed' | 'booking_offer' | 'booking_confirmed' | 'booking_cancelled' | 'refund' | 'dispute' | 'other' | 'action_needed' | 'approval' | 'panic';

/** What tapping a notification does (staff change requests, approvals, panic alerts). */
export interface NotificationAction {
  kind: 'fix' | 'rejected' | 'approved' | 'photo_approved' | 'review' | 'panic' | 'panic_resolved';
  target?: 'photo' | 'profile';
  reasons?: string[];
  uid?: string;
  alertId?: string;
  bookingId?: string;
}

export interface AppNotification {
  _id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  action?: NotificationAction | null;
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
  /** Storage paths of the ID documents (private bucket; the app signs links). */
  idType?: IdType;
  idFrontPath?: string;
  idBackPath?: string;
  selfiePath?: string;
  country?: string | null;
  photoStatus?: PhotoStatus;
  photoNote?: string | null;
  approvalStatus?: ApprovalStatus;
  approvalNote?: string | null;
  categories?: string[];
  updatedAt?: string;
  /** Verification queue: earliest deadline of bookings held for this companion's ID check. */
  heldUntil?: string | null;
  heldBookings?: number;
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

import { areaName } from '@/domain/places';
import type { BusyTime } from '@/domain/booking';
import type { UploadFile } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { checkLocalPin, hasLocalPin, setLocalPin } from '@/lib/pin';
import { restoreSession, useSession } from '@/state/session';
import { sameLogin } from '@/domain/login';
import { LEGAL_VERSION, type Consent, type ConsentKind } from '@/domain/rules';
import type { AdminBooking, AdminChatMessage, AdminOverview, AdminUser, AppNotification, AuditEntry, Booking, BroadcastAudience, BroadcastRecord, CityPlan, Companion, Duration, Locality, PanicAlert, Policy, Profile, ProfileCheck, Quote, Recipient, SessionUser, BookingStatus, IdType, Gender, SeeGender, Visibility, ApprovalStatus } from '@/domain/types';
import type { PricingSettings } from '@/domain/pricing';
import type { BookingTab } from '@/domain/admin';
import type { AdminReport, BlockedPerson, ReportReason } from '@/domain/safety';

/**
 * All server calls, on Supabase (prsnn-backend/supabase). Every call is an RPC
 * to a function that checks who is calling, or a table read behind row-level
 * security. Errors come back as Error(message) with the server's wording.
 */

/** Companions come from list_companions / get_companion (privacy rules applied there). */
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
    area: areaName(raw.area) || undefined,
    state: raw.state,
    gender: raw.gender,
    locked: !!raw.locked,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    availability: raw.availability,
    startTime: raw.startTime ?? raw.start_time,
    endTime: raw.endTime ?? raw.end_time,
    idVerified: raw.idVerified !== false,
  };
}

export interface AuthResult {
  token: string;
  user: SessionUser;
  isNewUser?: boolean;
}

export interface PaymentIntent {
  /** 'simulated' while the server runs payment_mode = simulated (test checkout, no money moves). */
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
  categories: string[];
  /** Null when a photo was already uploaded earlier in setup. */
  profilePhoto: UploadFile | null;
}

/** Photo ID + selfie, asked for when a companion accepts their first booking. */
export interface IdForm {
  idType: IdType;
  front: UploadFile;
  back?: UploadFile | null;
  selfie: UploadFile;
}

// ───────── helpers ─────────

const NETWORK = 'No connection. Check your internet and try again.';

/** Call a database function; throw its message on error. */
// ── Staff live preview ("View the app as" a real person) ──
// While set, the app's reads run as that person through admin_view_as (staff only, logged on the
// server), and nothing can be changed: every write is refused before it leaves the phone.
// The person comes from the session itself, so leaving the preview (Exit, Log out, an expired
// session) always switches back at once.
const viewingAs = () => useSession.getState().preview?.live?.id ?? null;
export const isLivePreview = () => viewingAs() !== null;
export const PREVIEW_READ_ONLY = 'This is a live preview: you can look around, but nothing can be changed.';
/** Read as the previewed person. */
const AS_PERSON = new Set(['me', 'my_profile', 'my_bookings', 'incoming_bookings', 'get_booking', 'list_companions', 'get_companion', 'unread_counts', 'my_consents', 'my_blocks']);
/** The same for everyone: safe to read as the staff member. */
const SHARED = new Set(['booking_policy', 'payment_mode', 'search_localities', 'city_plans_for', 'companion_busy', 'companions_busy']);
/** Harmless bookkeeping a screen does on its own (marking a chat read): skipped quietly. */
const SKIP = new Set(['mark_chat_read', 'save_push_token']);

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const viewAs = viewingAs();
  if (viewAs && !SHARED.has(fn)) {
    if (SKIP.has(fn)) return null as T;
    if (!AS_PERSON.has(fn)) throw new Error(PREVIEW_READ_ONLY);
    const r = await supabase.rpc('admin_view_as', { target: viewAs, fn, args: args ?? {} });
    if (r.error) throw new Error(/fetch|network/i.test(r.error.message) ? NETWORK : r.error.message);
    return r.data as T;
  }
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(/fetch|network/i.test(error.message) ? NETWORK : error.message);
  return data as T;
}

async function uid(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (!id) throw new Error('Please log in again.');
  return id;
}

/** Upload a picked image to `<bucket>/<my id>/<kind>-<time>.<ext>`; returns the storage path. */
async function upload(bucket: 'avatars' | 'verification', kind: string, file: UploadFile): Promise<string> {
  if (viewingAs()) throw new Error(PREVIEW_READ_ONLY);
  const me = await uid();
  const ext = (file.name.split('.').pop() || file.type.split('/').pop() || 'jpg').toLowerCase().replace('jpeg', 'jpg');
  const path = `${me}/${kind}-${Date.now()}.${ext}`;
  const body = await (await fetch(file.uri)).arrayBuffer();
  const { error } = await supabase.storage.from(bucket).upload(path, body, { contentType: file.type || 'image/jpeg', upsert: false });
  if (error) throw new Error(error.message.includes('mime') ? 'Use a JPG or PNG photo.' : 'Could not upload the photo. Please try again.');
  return path;
}

/** Who a PIN belongs to on this device: the mobile number, or the email for email sign-ups. */
export const loginIdOf = (u: Pick<SessionUser, 'phone' | 'email'> | null | undefined) => u?.phone || u?.email || null;

async function sessionUser(user: SessionUser): Promise<SessionUser> {
  return { ...user, hasPin: await hasLocalPin(loginIdOf(user)) };
}

const toPlus = (phone: string) => `+${phone.replace(/\D/g, '')}`;
const WEAK_PINS = new Set(['0000', '1111', '1234', '4321', '1212', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '0123', '1122', '6969']);

/** Edit-profile fields from the forms → update_my_profile keys. */
function profilePatch(fields: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  const availability: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue;
    const day = k.match(/^(\w+)_availability$/);
    if (day) availability[day[1]] = v === true || v === 'true';
    else if (k !== 'phoneNumber') out[k] = v;
  }
  if (Object.keys(availability).length) out.availability = availability;
  return out;
}

function toProfile(p: Record<string, any>): Profile {
  return {
    id: p.id,
    role: p.role,
    fullName: p.full_name,
    phoneNumber: p.phone ? String(p.phone).replace(/^91/, '') : undefined,
    city: p.city ?? undefined,
    area: areaName(p.area) || undefined,
    state: p.state ?? undefined,
    profilePhotoUrl: p.profilePhotoUrl ?? undefined,
    description: p.description ?? undefined,
    startTime: p.start_time ?? undefined,
    endTime: p.end_time ?? undefined,
    tags: p.tags ?? [],
    packages: p.packages ?? undefined,
    availability: p.availability ?? {},
    verification_status: p.verification_status,
    is_verified: !!p.staff_role || ['subadmin', 'superadmin'].includes(p.role) || p.verification_status === 'verified',
    gender: p.gender ?? undefined,
    seeGender: p.see_gender ?? undefined,
    profileVisibility: p.profile_visibility ?? undefined,
    visibilityConsentAt: p.visibility_consent_at ?? undefined,
  };
}

/** ID documents are private: staff get short-lived signed links. */
async function withDocLinks(users: Record<string, any>[]): Promise<AdminUser[]> {
  const paths = users.flatMap((u) => [u.idFrontPath, u.idBackPath, u.selfiePath]).filter(Boolean) as string[];
  const links: Record<string, string> = {};
  if (paths.length) {
    const { data } = await supabase.storage.from('verification').createSignedUrls(paths, 3600);
    for (const d of data ?? []) if (d.path && d.signedUrl) links[d.path] = d.signedUrl;
  }
  return users.map((u) => ({ ...u, idProofFrontUrl: links[u.idFrontPath], idProofBackUrl: links[u.idBackPath], backupPhotoUrl: links[u.selfiePath] }) as AdminUser);
}

// ───────── the service ─────────

/** The `payments` edge function (Razorpay orders and verification), with its error message passed through. */
async function payments<T>(body: Record<string, unknown>): Promise<T> {
  if (viewingAs()) throw new Error(PREVIEW_READ_ONLY);
  const { data, error } = await supabase.functions.invoke('payments', { body });
  if (error) {
    const ctx = (error as { context?: Response }).context;
    const msg = ctx && typeof ctx.json === 'function' ? ((await ctx.json().catch(() => null)) as { error?: string } | null)?.error : null;
    throw new Error(msg || (/fetch|network/i.test(error.message) ? NETWORK : 'Payments are busy right now. Please try again.'));
  }
  return data as T;
}

export const backend = {
  // ── Auth: phone OTP (WhatsApp, SMS backup) through Supabase Auth; PIN unlocks this device ──
  sendOtp: async (phone: string, channel: 'whatsapp' | 'sms' = 'whatsapp') => {
    const role = useSession.getState().prefs.intendedRole === 'companion' ? 'companion' : 'user';
    const { error } = await supabase.auth.signInWithOtp({ phone: toPlus(phone), options: { channel: 'sms', data: { role, otp_channel: channel } } });
    if (error) throw new Error(/fetch|network/i.test(error.message) ? NETWORK : error.message);
    return { message: channel === 'sms' ? 'Code sent by SMS.' : 'Code sent on WhatsApp.', expiresIn: 300 };
  },
  verifyOtp: async (phone: string, otp: string, _role?: 'user' | 'companion'): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.verifyOtp({ phone: toPlus(phone), token: otp, type: 'sms' });
    if (error || !data.session) {
      const m = error?.message ?? '';
      throw new Error(/expired|invalid/i.test(m) ? 'That code isn’t right or has expired. Check it, or ask for a new one.' : /fetch|network/i.test(m) ? NETWORK : m || 'Could not verify the code.');
    }
    const user = await sessionUser(await rpc<SessionUser>('sync_my_role'));
    return { token: data.session.access_token, user, isNewUser: !user.fullName };
  },
  setPin: async (pin: string) => {
    if (!/^\d{4}$/.test(pin)) throw new Error('PIN must be 4 digits.');
    if (WEAK_PINS.has(pin)) throw new Error('That PIN is too easy to guess. Try another.');
    const id = loginIdOf(useSession.getState().user);
    if (!id) throw new Error('Verify your number or email before setting a PIN.');
    await setLocalPin(id, pin);
    return { message: 'PIN set.' };
  },
  /** `id` is the mobile number or, for email sign-ups, the email. */
  pinLogin: async (id: string, pin: string): Promise<AuthResult> => {
    if (!(await checkLocalPin(id, pin))) throw new Error('Incorrect PIN.');
    // The session on this phone (refreshed by the library if it's old), else the copy saved for this person.
    const { data } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
    let session = data.session && sameLogin(id, data.session.user) ? data.session : null;
    if (!session) {
      const back = await restoreSession(id);
      if (!back.session) throw new Error(back.gone ? 'For your safety, confirm it’s you with a code this once. Tap “Forgot PIN?”.' : NETWORK);
      session = back.session;
    }
    const user = await sessionUser(await rpc<SessionUser>('sync_my_role'));
    return { token: session.access_token, user };
  },
  /** Visitors from abroad: a 6-digit code by email (Supabase Auth email OTP). */
  sendEmailOtp: async (email: string) => {
    const role = useSession.getState().prefs.intendedRole === 'companion' ? 'companion' : 'user';
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { shouldCreateUser: true, data: { role } } });
    if (error) throw new Error(/fetch|network/i.test(error.message) ? NETWORK : /rate|seconds/i.test(error.message) ? 'Please wait a minute before asking for another code.' : error.message);
    return { message: 'Code sent by email.' };
  },
  verifyEmailOtp: async (email: string, otp: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: otp, type: 'email' });
    if (error || !data.session) {
      const m = error?.message ?? '';
      throw new Error(/expired|invalid/i.test(m) ? 'That code isn’t right or has expired. Check it, or ask for a new one.' : /fetch|network/i.test(m) ? NETWORK : m || 'Could not verify the code.');
    }
    const user = await sessionUser(await rpc<SessionUser>('sync_my_role'));
    return { token: data.session.access_token, user, isNewUser: !user.fullName };
  },
  /** The signed-in person, fresh from the server (photo and approval status included). */
  me: async () => sessionUser(await rpc<SessionUser>('me')),
  /** Record agreements the person just gave (timestamped on the server, with the policy version). */
  recordConsents: (kinds: ConsentKind[]) => rpc<Consent[]>('record_consents', { kinds, ver: LEGAL_VERSION }),
  myConsents: () => rpc<Consent[]>('my_consents'),
  // Web email accounts didn't move to Supabase: everyone uses their mobile number.
  emailLogin: async (_email: string, _password: string): Promise<AuthResult> => {
    throw new Error('Email login has moved. Log in with your mobile number.');
  },
  verifyEmail: async (_email: string, _otp: string): Promise<AuthResult> => {
    throw new Error('Email login has moved. Log in with your mobile number.');
  },
  signOut: async () => {
    await supabase.auth.signOut();
  },

  // ── Companions (privacy rules applied on the server) ──
  companions: async () => (await rpc<Record<string, any>[]>('list_companions')).map(normaliseCompanion),
  companion: async (id: string) => normaliseCompanion(await rpc<Record<string, any>>('get_companion', { cid: id })),

  // ── Bookings ──
  createBooking: async (_b: { companionId: string; scheduledDate: string; startTime: string; duration: Duration; message?: string }): Promise<{ message: string; booking: Booking }> => {
    throw new Error('Book from the companion’s page: pay first, then they confirm.');
  },
  myBookings: () => rpc<Booking[]>('my_bookings'),
  incomingBookings: () => rpc<Booking[]>('incoming_bookings'),
  booking: (id: string) => rpc<Booking>('get_booking', { bid: id }),
  setBookingStatus: async (id: string, status: Exclude<BookingStatus, 'pending'>) => {
    if (status === 'completed') return rpc<{ message: string; booking: Booking }>('complete_booking', { bid: id });
    if (status === 'cancelled') return rpc<{ message: string; booking: Booking }>('cancel_booking', { bid: id });
    throw new Error('Use Accept or Decline on the offer.');
  },
  cancelBooking: (id: string) => rpc<{ message: string; booking: Booking }>('cancel_booking', { bid: id }),

  // ── Prepaid booking (pay first, then companion offers) ──
  policy: () => rpc<Policy>('booking_policy'),
  /** Times a companion is already taken on a day (`YYYY-MM-DD`), so they aren't offered again. */
  companionBusy: (id: string, date: string) => rpc<BusyTime[]>('companion_busy', { cid: id, d: date }),
  /** Every companion's taken times on one day: { companionId: BusyTime[] } ("Available today"). */
  companionsBusy: (date: string) => rpc<Record<string, BusyTime[]>>('companions_busy', { d: date }),
  /** Block and report another person (works both ways: hidden, not matched, no messages). */
  blockUser: (id: string) => rpc<{ message: string }>('block_user', { uid: id }),
  unblockUser: (id: string) => rpc<{ message: string }>('unblock_user', { uid: id }),
  myBlocks: () => rpc<BlockedPerson[]>('my_blocks'),
  reportUser: (id: string, reason: ReportReason, details?: string, bookingId?: string, alsoBlock = false) =>
    rpc<{ message: string }>('report_user', { uid: id, reason, details: details ?? null, bid: bookingId ?? null, also_block: alsoBlock }),
  createPrepaidBooking: (b: { companionId: string; scheduledDate: string; startTime: string; duration: Duration; idempotencyKey: string; acceptTerms: true; message?: string; experience?: string; city?: string; area?: string; category?: string | null; meetingPlace: string; homeVisit?: boolean; recipient?: Recipient | null }) =>
    rpc<{ booking: Booking; quote: Quote; policy: Policy; replayed?: boolean }>('create_prepaid_booking', { p: b }),
  acceptOffer: (id: string) => rpc<{ message: string; booking: Booking; idCheck?: boolean }>('accept_offer', { bid: id }),
  declineOffer: (id: string) => rpc<{ message: string }>('decline_offer', { bid: id }),
  openDispute: (id: string, reason: string) => rpc<{ message: string; booking: Booking }>('open_dispute', { bid: id, reason }),

  // ── Safety: panic button (session start → 1 h after the end) ──
  raisePanic: (bookingId: string) => rpc<PanicAlert>('raise_panic', { bid: bookingId }),
  resolvePanic: (alertId: string, note?: string) => rpc<PanicAlert>('resolve_panic', { aid: alertId, note: note ?? null }),

  // ── Places: every India Post locality, and staff-curated plans per city ──
  searchLocalities: (state: string, q: string, city?: string | null) => rpc<Locality[]>('search_localities', { state_name: state, q, city_name: city ?? null }),
  cityPlans: (city: string) => rpc<CityPlan[]>('city_plans_for', { city_name: city }),

  // ── Payments ──
  /** 'simulated' (test checkout, no money moves) or 'razorpay'. */
  paymentMode: () => rpc<string>('payment_mode'),
  createPaymentIntent: async (bookingId: string): Promise<PaymentIntent> => {
    const mode = await rpc<string>('payment_mode');
    if (mode === 'simulated') {
      const b = await rpc<Booking>('get_booking', { bid: bookingId });
      if (b.paymentStatus === 'paid') throw new Error('This booking is already paid.');
      return { mode: 'simulated', orderId: `sim_${bookingId}`, amount: (b.packagePrice ?? 0) * 100, currency: 'INR' };
    }
    // Real payments: the server creates a Razorpay order for the booking's price (never the app's number).
    return payments<PaymentIntent>({ action: 'order', bookingId });
  },
  /** Server checks Razorpay's signature and the captured payment, then confirms the booking. */
  verifyPayment: async (p: { bookingId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }): Promise<{ message: string; booking: Booking }> => {
    await payments<{ ok: true }>({ action: 'verify', bookingId: p.bookingId, orderId: p.razorpayOrderId, paymentId: p.razorpayPaymentId, signature: p.razorpaySignature });
    return { message: 'Payment received.', booking: await rpc<Booking>('get_booking', { bid: p.bookingId }) };
  },
  simulatePayment: async (bookingId: string, outcome: 'success' | 'failure' = 'success') => {
    const r = await rpc<{ message: string; booking: Booking; failed?: boolean }>('simulate_payment', { bid: bookingId, outcome });
    if (r.failed) throw new Error(r.message);
    return r;
  },

  // ── Notifications ──
  notifications: async (): Promise<AppNotification[]> => {
    type N = { id: string; type: AppNotification['type']; message: string; is_read: boolean; created_at: string; action: AppNotification['action'] };
    const viewAs = viewingAs();
    if (viewAs) {
      const r = await supabase.rpc('admin_view_as', { target: viewAs, fn: 'notifications', args: {} });
      if (r.error) throw new Error(/fetch|network/i.test(r.error.message) ? NETWORK : r.error.message);
      return ((r.data ?? []) as N[]).map((n) => ({ _id: n.id, type: n.type, message: n.message, isRead: n.is_read, createdAt: n.created_at, action: n.action }));
    }
    const { data, error } = await supabase.from('notifications').select('id, type, message, is_read, created_at, action').order('created_at', { ascending: false }).limit(100);
    if (error) throw new Error(/fetch|network/i.test(error.message) ? NETWORK : error.message);
    return (data ?? []).map((n) => ({ _id: n.id, type: n.type, message: n.message, isRead: n.is_read, createdAt: n.created_at, action: n.action }));
  },
  /** Live badge counts: unread notifications, unread chat messages (total and per booking), bookings needing you. */
  unreadCounts: async (): Promise<UnreadCounts> => rpc<UnreadCounts>('unread_counts'),
  /** Opening a chat marks it read up to now. */
  markChatRead: async (bookingId: string) => {
    await rpc('mark_chat_read', { bid: bookingId });
    return { message: 'Read' };
  },
  markNotificationsRead: async () => {
    if (viewingAs()) return { message: 'Preview' };
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', await uid()).eq('is_read', false);
    if (error) throw new Error(error.message);
    return { message: 'Read' };
  },
  clearNotifications: async () => {
    if (viewingAs()) return { message: 'Preview' };
    const { error } = await supabase.from('notifications').delete().eq('user_id', await uid());
    if (error) throw new Error(error.message);
    return { message: 'Cleared' };
  },

  // ── Profile ──
  profile: async () => toProfile(await rpc<Record<string, any>>('my_profile')),
  checkProfile: async (): Promise<ProfileCheck> => {
    const p = await rpc<Record<string, any> | null>('my_profile');
    if (!p) return { hasProfile: false, status: 'not_found' };
    return { hasProfile: !!p.full_name, status: p.verification_status, is_verified: p.verification_status === 'verified', role: p.role };
  },
  onboardBasic: async (f: { fullName: string; phoneNumber: string; city: string; area: string; profilePhoto?: UploadFile | null }) => {
    const photoPath = f.profilePhoto ? await upload('avatars', 'profile', f.profilePhoto) : undefined;
    await rpc('update_my_profile', { p: { fullName: f.fullName, city: f.city, area: f.area, ...(photoPath ? { photoPath } : {}) } });
    return { user: await backend.profile() };
  },
  /** Companion profile → live straight away. The ID is asked for at the first booking. */
  onboardCompanion: async (f: CompanionForm) => {
    const photoPath = f.profilePhoto ? await upload('avatars', 'profile', f.profilePhoto) : undefined;
    const me = await rpc<SessionUser>('submit_companion_application', {
      p: {
        fullName: f.fullName, city: f.city, state: f.state, area: f.area, description: f.description, packages: f.packages,
        startTime: f.startTime, endTime: f.endTime, tags: f.tags, availability: f.days, gender: f.gender, categories: f.categories,
        ...(f.profileVisibility ? { profileVisibility: f.profileVisibility, visibilityConsent: true } : {}),
        ...(photoPath ? { photoPath } : {}),
      },
    });
    return { message: 'Sent for approval.', user: await sessionUser(me) };
  },
  /** Send the ID for review (status → pending). Stored in the private verification bucket. */
  submitIdDocuments: async (f: IdForm) => {
    const [idFrontPath, idBackPath, selfiePath] = await Promise.all([
      upload('verification', 'id-front', f.front),
      f.back ? upload('verification', 'id-back', f.back) : Promise.resolve(undefined),
      upload('verification', 'selfie', f.selfie),
    ]);
    await rpc('submit_id_documents', { p: { idType: f.idType, idFrontPath, ...(idBackPath ? { idBackPath } : {}), selfiePath } });
    return { message: 'ID sent. We’ll check it as soon as we can.' };
  },
  /** Gender, who to see, profile lock (consent required when changing it), city/state/area. */
  updateIdentity: async (f: { gender?: string; seeGender?: string; profileVisibility?: string; visibilityConsent?: boolean; city?: string; state?: string; area?: string }) => {
    await rpc('update_my_profile', { p: profilePatch(f) });
    return { message: 'Updated' };
  },
  updateProfile: async (fields: Record<string, unknown>, photo?: UploadFile | null) => {
    const photoPath = photo ? await upload('avatars', 'profile', photo) : undefined;
    await rpc('save_profile', { p: { ...profilePatch(fields), ...(photoPath ? { photoPath } : {}) } });
    return { message: 'Saved' };
  },
  /** Profile fields incl. categories, contact phone and country; a new photo goes to review. Returns the fresh session user. */
  saveProfile: async (fields: Record<string, unknown>, photo?: UploadFile | null) => {
    const photoPath = photo ? await upload('avatars', 'profile', photo) : undefined;
    return sessionUser(await rpc<SessionUser>('save_profile', { p: { ...profilePatch(fields), ...(photoPath ? { photoPath } : {}) } }));
  },
  /** After fixing what our team asked for (a new photo is resubmitted by uploading it). */
  resubmitForReview: async () => sessionUser(await rpc<SessionUser>('resubmit_for_review')),
  deleteAccount: async () => {
    const r = await rpc<{ message: string }>('delete_my_account');
    await supabase.auth.signOut().catch(() => {});
    return r;
  },
  /** Expo push token for this device; null turns pushes off (sign-out). */
  savePushToken: async (token: string | null) => {
    await rpc('save_push_token', { token });
    return { message: token ? 'Notifications on.' : 'Notifications off.' };
  },

  // ── Prices (public; the app falls back to the bundled defaults) ──
  pricing: async (): Promise<PricingSettings> => {
    const { data, error } = await supabase.from('settings').select('value').eq('key', 'pricing').single();
    if (error) throw new Error(error.message);
    return data.value as PricingSettings;
  },

  // ── In-app admin (staff only; money/price/push are superadmin-only on the server) ──
  admin: {
    overview: () => rpc<AdminOverview>('admin_overview'),
    reports: (status: 'open' | 'closed' | '' = 'open') => rpc<AdminReport[]>('admin_reports', { st: status }),
    closeReport: (id: string, note: string) => rpc<{ message: string }>('admin_close_report', { rid: id, resolution: note }),
    verifications: async () => withDocLinks(await rpc<Record<string, any>[]>('admin_verifications')),
    decideVerification: (id: string, decision: 'verified' | 'rejected', note?: string) => rpc<{ message: string; user: AdminUser }>('admin_decide_verification', { uid: id, decision, note: note ?? null }),
    users: (p: { q?: string; role?: string } = {}) => rpc<AdminUser[]>('admin_users', { q: p.q ?? '', role_filter: p.role ?? '' }),
    user: async (id: string) => {
      const r = await rpc<{ user: Record<string, any>; bookings: AdminBooking[] }>('admin_user', { uid: id });
      return { user: (await withDocLinks([r.user]))[0], bookings: r.bookings };
    },
    updateUser: (id: string, fields: Partial<AdminUser>) => rpc<{ message: string; user: AdminUser }>('admin_update_user', { uid: id, p: fields }),
    suspendUser: (id: string, suspended: boolean, reason?: string) => rpc<{ message: string; user: AdminUser }>('admin_suspend_user', { uid: id, on_off: suspended, reason: reason ?? null }),
    deleteUser: (id: string) => rpc<{ message: string }>('admin_delete_user', { uid: id }),
    admins: () => rpc<AdminUser[]>('admin_admins'),
    addAdmin: (phone: string) => rpc<{ message: string; user: AdminUser }>('admin_add_admin', { phone }),
    removeAdmin: (id: string) => rpc<{ message: string }>('admin_remove_admin', { uid: id }),
    bookings: (tab: BookingTab) => rpc<AdminBooking[]>('admin_bookings', { tab }),
    booking: (id: string) => rpc<AdminBooking>('admin_booking', { bid: id }),
    bookingMessages: (id: string) => rpc<AdminChatMessage[]>('admin_booking_messages', { bid: id }),
    updateBooking: (id: string, fields: { scheduledDate?: string; startTime?: string; message?: string; status?: 'completed' }) => rpc<{ message: string; booking: AdminBooking }>('admin_update_booking', { bid: id, p: fields }),
    cancelBooking: (id: string, reason: string, refundAmount?: number) => rpc<{ message: string; booking: AdminBooking }>('admin_cancel_booking', { bid: id, reason, refund_amount: refundAmount ?? null }),
    reassignBooking: (id: string, companionId: string) => rpc<{ message: string; booking: AdminBooking }>('admin_reassign_booking', { bid: id, cid: companionId }),
    refund: (id: string, amount: number, reason: string) => rpc<{ message: string; booking: AdminBooking }>('admin_refund', { bid: id, amount, reason }),
    retryRefund: (id: string) => rpc<{ message: string; booking: AdminBooking }>('admin_retry_refund', { bid: id }),
    markPaid: (id: string) => rpc<{ message: string; booking: AdminBooking }>('admin_mark_paid', { bid: id }),
    overrideFee: (id: string, retained: number) => rpc<{ message: string; booking: AdminBooking }>('admin_override_fee', { bid: id, retained }),
    deleteBooking: (id: string) => rpc<{ message: string }>('admin_delete_booking', { bid: id }),
    disputes: (status: 'open' | 'resolved') => rpc<AdminBooking[]>('admin_disputes', { st: status }),
    replyDispute: (id: string, message: string) => rpc<{ message: string; booking: AdminBooking }>('admin_reply_dispute', { bid: id, msg: message }),
    closeDispute: (id: string, resolution: string) => rpc<{ message: string; booking: AdminBooking }>('admin_close_dispute', { bid: id, resolution }),
    savePricing: ({ repriceUnpaid, ...p }: Partial<PricingSettings> & { repriceUnpaid?: boolean }) =>
      rpc<{ message: string; pricing: PricingSettings; repriced: number }>('admin_save_pricing', { p, reprice_unpaid: !!repriceUnpaid }),
    audience: () => rpc<Record<BroadcastAudience, number>>('admin_audience'),
    broadcast: async (b: { audience: BroadcastAudience; title: string; body: string }) => {
      const { data, error } = await supabase.functions.invoke('broadcast', { body: b });
      if (error) {
        const ctx = (error as { context?: Response }).context;
        const msg = ctx && typeof ctx.json === 'function' ? ((await ctx.json().catch(() => null)) as { message?: string } | null)?.message : null;
        throw new Error(msg || 'Could not send the broadcast.');
      }
      return data as { message: string; broadcast: BroadcastRecord };
    },
    broadcasts: async (): Promise<BroadcastRecord[]> => {
      const { data, error } = await supabase.from('broadcasts').select('*').order('created_at', { ascending: false }).limit(50);
      if (error) throw new Error(error.message);
      return (data ?? []).map((b) => ({ _id: b.id, audience: b.audience, title: b.title, body: b.body, recipients: b.recipients, sent: b.sent, failed: b.failed, createdAt: b.created_at }));
    },
    activity: (before?: string) => rpc<AuditEntry[]>('admin_activity', { before_at: before ?? null }),
    /** Website interest list (mobile + member/companion/both), newest first. Staff only. */
    enquiries: (limit = 200) => rpc<EnquiryList>('admin_enquiries', { lim: limit }),
    signups: (limit = 500) => rpc<SignupList>('admin_signups', { lim: limit }),
    userConsents: (id: string) => rpc<{ kind: string; version: string; source: string; bookingId: string | null; acceptedAt: string; withdrawnAt: string | null }[]>('admin_user_consents', { uid: id }),
    /** Records a staff "View the app as…" preview in the activity log (the preview itself is sample data). */
    logPreview: (as: 'member' | 'companion', start: string) => rpc<null>('admin_log_preview', { as_role: as, start_at: start }),
    /** Start a live, read-only preview as a real person (logged on the server); returns who they are. */
    viewAs: async (id: string): Promise<SessionUser> => {
      const { data, error } = await supabase.rpc('admin_view_as', { target: id, fn: 'start', args: {} });
      if (error) throw new Error(/fetch|network/i.test(error.message) ? NETWORK : error.message);
      return { ...(data as SessionUser), hasPin: true };
    },
    approvalCounts: () => rpc<{ companions: number; photos: number; idChecks: number; panics: number }>('admin_approval_counts'),
    approvals: async (kind: 'companions' | 'photos') => withDocLinks(await rpc<Record<string, any>[]>('admin_approvals', { kind })),
    decideProfile: (id: string, decision: 'approve' | 'reject', note?: string) => rpc<{ message: string; user: AdminUser }>('admin_decide_profile', { uid: id, decision, note: note ?? null }),
    approvePhoto: (id: string) => rpc<{ message: string; user: AdminUser }>('admin_decide_photo', { uid: id }),
    requestChanges: (id: string, target: 'photo' | 'profile', reasons: string[], note: string) => rpc<{ message: string; user: AdminUser }>('admin_request_changes', { uid: id, target, reasons, note }),
    panics: (openOnly = true) => rpc<PanicAlert[]>('admin_panics', { open_only: openOnly }),
    resolvePanic: (alertId: string, note?: string) => rpc<PanicAlert>('resolve_panic', { aid: alertId, note: note ?? null }),
    cityPlans: (city?: string) => rpc<CityPlan[]>('admin_city_plans', { city_name: city ?? null }),
    saveCityPlan: (p: Partial<CityPlan>) => rpc<CityPlan>('admin_save_city_plan', { p }),
    deleteCityPlan: (id: string) => rpc<{ message: string }>('admin_delete_city_plan', { pid: id }),
  },
};

export interface EnquiryList {
  counts: { total: number; member: number; companion: number; both: number };
  items: { phone: string; interest: 'member' | 'companion' | 'both'; source: string; submissions: number; createdAt: string; updatedAt: string; joinedApp?: boolean }[];
}

/** Admin · Interested · App: what each person chose when they signed up in the app. */
export interface SignupItem {
  id: string;
  fullName: string;
  phone: string | null;
  role: 'user' | 'companion';
  categories: string[];
  gender: Gender | null;
  seeGender: SeeGender | null;
  visibility: Visibility | null;
  city: string | null;
  area: string | null;
  approvalStatus: ApprovalStatus | null;
  verificationStatus: string;
  setupDone: boolean;
  createdAt: string;
}
export interface SignupList {
  counts: { total: number; member: number; companion: number; setupDone: number; categories: Record<string, number> };
  items: SignupItem[];
}

export type Backend = typeof backend;

export interface UnreadCounts {
  notifications: number;
  messages: number;
  perChat: Record<string, number>;
  bookings: number;
}

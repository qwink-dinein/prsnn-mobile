import type { UploadFile } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { checkLocalPin, hasLocalPin, setLocalPin } from '@/lib/pin';
import { useSession } from '@/state/session';
import type { AdminBooking, AdminChatMessage, AdminOverview, AdminUser, AppNotification, AuditEntry, Booking, BroadcastAudience, BroadcastRecord, Companion, Duration, Policy, Profile, ProfileCheck, Quote, SessionUser, BookingStatus, IdType } from '@/domain/types';
import type { PricingSettings } from '@/domain/pricing';
import type { BookingTab } from '@/domain/admin';

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
    area: raw.area,
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
async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
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
  const me = await uid();
  const ext = (file.name.split('.').pop() || file.type.split('/').pop() || 'jpg').toLowerCase().replace('jpeg', 'jpg');
  const path = `${me}/${kind}-${Date.now()}.${ext}`;
  const body = await (await fetch(file.uri)).arrayBuffer();
  const { error } = await supabase.storage.from(bucket).upload(path, body, { contentType: file.type || 'image/jpeg', upsert: false });
  if (error) throw new Error(error.message.includes('mime') ? 'Use a JPG or PNG photo.' : 'Could not upload the photo. Please try again.');
  return path;
}

async function sessionUser(user: SessionUser): Promise<SessionUser> {
  return { ...user, hasPin: await hasLocalPin(user.phone) };
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
    area: p.area ?? undefined,
    state: p.state ?? undefined,
    profilePhotoUrl: p.profilePhotoUrl ?? undefined,
    description: p.description ?? undefined,
    startTime: p.start_time ?? undefined,
    endTime: p.end_time ?? undefined,
    tags: p.tags ?? [],
    packages: p.packages ?? undefined,
    availability: p.availability ?? {},
    verification_status: p.verification_status,
    is_verified: ['subadmin', 'superadmin'].includes(p.role) || p.verification_status === 'verified',
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
    const phone = useSession.getState().user?.phone;
    if (!phone) throw new Error('Verify your mobile number before setting a PIN.');
    await setLocalPin(phone, pin);
    return { message: 'PIN set.' };
  },
  pinLogin: async (phone: string, pin: string): Promise<AuthResult> => {
    if (!(await checkLocalPin(phone, pin))) throw new Error('Incorrect PIN.');
    const { data } = await supabase.auth.refreshSession();
    const same = data.session?.user.phone?.replace(/\D/g, '').slice(-10) === phone.replace(/\D/g, '').slice(-10);
    if (!data.session || !same) throw new Error('Your session on this phone has ended. Log in with OTP.');
    const user = await sessionUser(await rpc<SessionUser>('sync_my_role'));
    return { token: data.session.access_token, user };
  },
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
  createPrepaidBooking: (b: { companionId: string; scheduledDate: string; startTime: string; duration: Duration; idempotencyKey: string; acceptTerms: true; message?: string; experience?: string; city?: string; area?: string }) =>
    rpc<{ booking: Booking; quote: Quote; policy: Policy; replayed?: boolean }>('create_prepaid_booking', { p: b }),
  acceptOffer: (id: string) => rpc<{ message: string; booking: Booking; idCheck?: boolean }>('accept_offer', { bid: id }),
  declineOffer: (id: string) => rpc<{ message: string }>('decline_offer', { bid: id }),
  openDispute: (id: string, reason: string) => rpc<{ message: string; booking: Booking }>('open_dispute', { bid: id, reason }),

  // ── Payments ──
  createPaymentIntent: async (bookingId: string): Promise<PaymentIntent> => {
    const mode = await rpc<string>('payment_mode');
    if (mode !== 'simulated') throw new Error('Online payments aren’t switched on yet. Please try again later.');
    const b = await rpc<Booking>('get_booking', { bid: bookingId });
    if (b.paymentStatus === 'paid') throw new Error('This booking is already paid.');
    return { mode: 'simulated', orderId: `sim_${bookingId}`, amount: (b.packagePrice ?? 0) * 100, currency: 'INR' };
  },
  verifyPayment: async (_p: { bookingId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }): Promise<{ message: string; booking: Booking }> => {
    throw new Error('Online payments aren’t switched on yet.');
  },
  simulatePayment: async (bookingId: string, outcome: 'success' | 'failure' = 'success') => {
    const r = await rpc<{ message: string; booking: Booking; failed?: boolean }>('simulate_payment', { bid: bookingId, outcome });
    if (r.failed) throw new Error(r.message);
    return r;
  },

  // ── Notifications ──
  notifications: async (): Promise<AppNotification[]> => {
    const { data, error } = await supabase.from('notifications').select('id, type, message, is_read, created_at').order('created_at', { ascending: false }).limit(100);
    if (error) throw new Error(error.message);
    return (data ?? []).map((n) => ({ _id: n.id, type: n.type, message: n.message, isRead: n.is_read, createdAt: n.created_at }));
  },
  clearNotifications: async () => {
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
    if (!f.profilePhoto) throw new Error('Add a profile photo.');
    const photoPath = await upload('avatars', 'profile', f.profilePhoto);
    await rpc('submit_companion_application', {
      p: {
        fullName: f.fullName, city: f.city, state: f.state, area: f.area, description: f.description, packages: f.packages,
        startTime: f.startTime, endTime: f.endTime, tags: f.tags, availability: f.days, gender: f.gender,
        ...(f.profileVisibility ? { profileVisibility: f.profileVisibility, visibilityConsent: true } : {}),
        photoPath,
      },
    });
    return { message: 'You’re live. Members in your city can now book you.' };
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
    await rpc('update_my_profile', { p: { ...profilePatch(fields), ...(photoPath ? { photoPath } : {}) } });
    return { message: 'Saved' };
  },
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
  },
};

export type Backend = typeof backend;

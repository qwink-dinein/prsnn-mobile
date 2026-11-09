import type { AppNotification, Booking, Companion, Gender, Policy, Profile, SessionUser } from '@/domain/types';
import { amountDuePaise, refundIfCancelledNow, toDateKey } from '@/domain/booking';
import { priceFor, pricing } from '@/domain/pricing';
import { useSession } from '@/state/session';
import type { Backend, AuthResult } from './backend';
import { demoAdmin, demoRoleFor } from './demoAdmin';

/**
 * Sample data for EXPO_PUBLIC_DEMO=1 (design review, preview, screenshots).
 * Same signatures as the real backend service; mirrors its rules (gender
 * filter, locked profiles, prepaid allocation) closely enough to try every
 * flow. Nothing here is sent anywhere. State resets on reload.
 */
const wait = <T>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(v), ms));
const fail = (message: string) => new Promise<never>((_, j) => setTimeout(() => j(new Error(message)), 250));
const allDays = { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true };

type DemoCompanion = Companion & { gender: Gender; visibility: 'open' | 'locked' };

const people: DemoCompanion[] = [
  { id: 'c1', packages: [1, 2, 4, 6], fullName: 'Ayesha Khan', gender: 'woman', visibility: 'locked', city: 'Hyderabad', state: 'Telangana', area: 'Banjara Hills', pricePerHour: 399, tags: ['Coffee', 'Walks', 'Books', 'Hindi'], availability: allDays, startTime: '10:00', endTime: '20:00', description: 'I love exploring new cafés, long walks and meaningful chats. Available for coffee meetups and city walks. Public places only, for safety.' },
  { id: 'c2', fullName: 'Rohan Mehta', gender: 'man', visibility: 'open', city: 'Hyderabad', state: 'Telangana', area: 'Jubilee Hills', pricePerHour: 399, tags: ['Walks', 'Events', 'Cricket'], availability: { ...allDays, monday: false }, startTime: '09:00', endTime: '21:00', description: 'Weekend explorer and live-music regular. Happy to come along to an event so you don’t go alone.' },
  { id: 'c3', fullName: 'Fatima Siddiqui', gender: 'woman', visibility: 'locked', city: 'Hyderabad', state: 'Telangana', area: 'Tolichowki', pricePerHour: 399, tags: ['Study', 'Coffee', 'Urdu'], availability: allDays, startTime: '11:00', endTime: '19:00', description: 'Study partner and quiet café company. I keep you on task and the coffee coming.' },
  { id: 'c4', packages: [2, 4, 8, 12], fullName: 'Arjun Reddy', gender: 'man', visibility: 'open', city: 'Hyderabad', state: 'Telangana', area: 'Gachibowli', pricePerHour: 399, tags: ['Events', 'Food', 'Telugu'], availability: allDays, startTime: '12:00', endTime: '21:00', description: 'Foodie who knows every biryani spot worth the queue. Good company for dinners and shows.' },
  { id: 'c5', fullName: 'Neha Sharma', gender: 'woman', visibility: 'open', city: 'Hyderabad', state: 'Telangana', area: 'Madhapur', pricePerHour: 399, tags: ['Walks', 'Study', 'Yoga'], availability: { ...allDays, sunday: false }, startTime: '09:00', endTime: '18:00', description: 'Morning walks at KBR Park, slow mornings, honest conversation.' },
  { id: 'c6', fullName: 'Sameer Ali', gender: 'man', visibility: 'open', city: 'Hyderabad', state: 'Telangana', area: 'Old City', pricePerHour: 399, tags: ['Walks', 'Food', 'History'], availability: allDays, startTime: '15:00', endTime: '21:00', description: 'Old City walks: Charminar, Laad Bazaar and the best Irani chai. Let me show you around.' },
  { id: 'c7', fullName: 'Priya Iyer', gender: 'woman', visibility: 'locked', city: 'Bengaluru', state: 'Karnataka', area: 'Indiranagar', pricePerHour: 399, tags: ['Coffee', 'Events', 'Kannada'], availability: allDays, startTime: '10:00', endTime: '21:00', description: 'Indiranagar cafés and weekend gigs. Calm, curious, a good listener.' },
  { id: 'c8', fullName: 'Kabir Das', gender: 'nonbinary', visibility: 'locked', city: 'Mumbai', state: 'Maharashtra', area: 'Bandra West', pricePerHour: 399, tags: ['Walks', 'Food', 'Art'], availability: allDays, startTime: '11:00', endTime: '21:00', description: 'Bandra sea-face walks, galleries and street food.' },
  { id: 'c9', fullName: 'Zoya Ansari', gender: 'woman', visibility: 'open', city: 'Hyderabad', state: 'Telangana', area: 'Kondapur', pricePerHour: 399, tags: ['Coffee', 'Study', 'Urdu'], availability: allDays, startTime: '10:00', endTime: '20:00', description: 'Book-club regular and coffee snob. Happy to be your study buddy.' },
];

const POLICY: Policy = {
  fees: 'No booking fee. One price list for every companion: ₹399 for 1 hour, with lower hourly rates for longer bookings. The price shown is the total you pay, whichever companion accepts — you are never charged more.',
  allocation:
    'Payment reserves your booking; it is confirmed when an eligible companion accepts. Your chosen companion gets between 15 minutes and 5 hours to respond, depending on how far away your session is. If they can’t make it, we offer your booking to up to 2 similar verified companions, one at a time. If nobody accepts at least 1 hour before the session, it is cancelled and fully refunded.',
  cancellation: [
    'Cancel at least 15 minutes before the session starts: 85% refunded (a 15% cancellation fee is kept by prsnn).',
    'Cancel within 15 minutes of the start, or after it starts: no refund.',
    'If your companion cancels, or no companion accepts: full refund.',
    'Companion no-show: full refund after review. Your own no-show: no refund.',
  ],
  refunds: 'Refunds go to your original payment method. Timing depends on your bank or UPI app.',
  support: 'mukarramjahmm@gmail.com',
};

const viewer = () => useSession.getState().user;
const first = (n?: string) => (n ?? '').split(' ')[0];

/** Server-side rules, applied the same way here. */
const unlockedIds = () => new Set(bookings.filter((b) => b.status === 'accepted' && b.paymentStatus === 'paid').map((b) => personId(b.companionId)));
function view(c: DemoCompanion): Companion {
  const locked = c.visibility === 'locked' && !unlockedIds().has(c.id);
  return { ...c, locked, profilePhoto: locked ? null : c.profilePhoto, fullName: locked ? first(c.fullName) : c.fullName };
}
const visibleTo = (c: DemoCompanion) => {
  const see = viewer()?.seeGender;
  return !see || see === 'everyone' || c.gender === see;
};

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${toDateKey(d)}T00:00:00.000Z`;
};
const ref = (c: DemoCompanion) => ({ _id: c.id, fullName: c.visibility === 'locked' ? first(c.fullName) : c.fullName, profilePhotoUrl: c.profilePhoto ?? undefined, pricePerHour: c.pricePerHour, locked: c.visibility === 'locked' });
const personId = (p: Booking['companionId']) => (p && typeof p === 'object' ? p._id : (p ?? ''));
const inMin = (m: number) => new Date(Date.now() + m * 60_000).toISOString();

let bookings: Booking[] = [
  // App bookings (prepaid)
  { _id: 'p1', flow: 'prepaid', requesterId: 'me', preferredCompanionId: ref(people[2]), companionId: null, status: 'pending', paymentStatus: 'paid', paymentMode: 'simulated', amountPaid: 999, pricePerHour: 399, packagePrice: 999, startTime: '11:30', duration: '180', scheduledDate: day(2), createdAt: day(0), allocation: { state: 'offering', deadline: inMin(110) }, offerSummary: { tried: 1, liveUntil: inMin(130) } },
  { _id: 'b1', flow: 'prepaid', requesterId: 'me', preferredCompanionId: ref(people[0]), companionId: { ...ref(people[0]), fullName: people[0].fullName, locked: false }, status: 'accepted', paymentStatus: 'paid', paymentMode: 'simulated', pricePerHour: 399, packagePrice: 699, startTime: '16:00', duration: '120', scheduledDate: day(1), amountPaid: 699, createdAt: day(-1), allocation: { state: 'assigned' } },
  { _id: 'p2', flow: 'prepaid', requesterId: 'me', preferredCompanionId: ref(people[6]), companionId: null, status: 'cancelled', paymentStatus: 'refunded', paymentMode: 'simulated', amountPaid: 399, pricePerHour: 399, packagePrice: 399, startTime: '19:00', duration: '60', scheduledDate: day(-1), createdAt: day(-2), allocation: { state: 'failed', failedReason: 'no_one_accepted_in_time' }, refund: { status: 'processed', amount: 399 }, cancelledBy: 'system' },
  // Older website-style bookings (request → accept → pay) still show and work.
  { _id: 'b2', flow: 'request', requesterId: 'me', companionId: ref(people[1]), status: 'accepted', paymentStatus: 'pending', pricePerHour: 399, packagePrice: 399, startTime: '17:00', duration: '60', scheduledDate: day(3), createdAt: day(0) },
  { _id: 'b4', flow: 'request', requesterId: 'me', companionId: ref(people[3]), status: 'completed', paymentStatus: 'paid', pricePerHour: 399, packagePrice: 699, startTime: '19:00', duration: '120', scheduledDate: day(-6), amountPaid: 699, createdAt: day(-9) },
];

const incoming: Booking[] = [
  { _id: 'o1', flow: 'prepaid', requesterId: { _id: 'u7', fullName: 'Karan', locked: true }, companionId: null, status: 'pending', paymentStatus: 'paid', paymentMode: 'simulated', amountPaid: 399, pricePerHour: 399, packagePrice: 399, startTime: '16:00', duration: '60', scheduledDate: day(2), createdAt: day(0), message: 'Coffee at Roastery? First time in Hyderabad.', allocation: { state: 'offering' }, myOffer: { status: 'offered', expiresAt: inMin(170), offeredAt: inMin(-10) } },
  { _id: 'i2', companionShare: 559, flow: 'prepaid', requesterId: { _id: 'u8', fullName: 'Priya Nair' }, companionId: 'me', status: 'accepted', paymentStatus: 'paid', paymentMode: 'simulated', pricePerHour: 399, packagePrice: 699, startTime: '11:00', duration: '120', scheduledDate: day(1), amountPaid: 699, createdAt: day(-2), allocation: { state: 'assigned' }, myOffer: { status: 'accepted', expiresAt: inMin(-30), offeredAt: inMin(-40) } },
  { _id: 'i3', flow: 'request', requesterId: { _id: 'u9', fullName: 'Imran Shaikh' }, companionId: 'me', status: 'completed', paymentStatus: 'paid', pricePerHour: 399, packagePrice: 1299, startTime: '17:00', duration: '240', scheduledDate: day(-3), amountPaid: 1299, createdAt: day(-5) },
];

let notifications: AppNotification[] = [
  { _id: 'n1', type: 'booking_confirmed', message: 'Ayesha confirmed your booking #B1. Chat is open.', isRead: false, createdAt: inMin(-2) },
  { _id: 'n2', type: 'payment_completed', message: 'Payment received for booking #P1. We’re confirming your companion.', isRead: false, createdAt: inMin(-20) },
  { _id: 'n3', type: 'refund', message: 'We couldn’t find an available companion for booking #P2. Your full payment of ₹399 was refunded.', isRead: true, createdAt: inMin(-26 * 60) },
  { _id: 'n4', type: 'other', message: 'New companions near you in Banjara Hills.', isRead: true, createdAt: inMin(-3 * 24 * 60) },
];

const me: SessionUser = { id: 'me', role: 'user', is_verified: true, verification_status: 'verified', fullName: 'Mukarram', phone: '919876543210', hasPin: true, gender: 'man', seeGender: 'everyone', profileVisibility: 'open', city: 'Hyderabad' };
const auth = (u: SessionUser = me): AuthResult => ({ token: 'demo-token', user: u });
const keys = new Map<string, string>(); // idempotencyKey → booking id
const find = (id: string) => [...bookings, ...incoming].find((b) => b._id === id);
const patch = (id: string, p: Partial<Booking>) => {
  bookings = bookings.map((b) => (b._id === id ? { ...b, ...p } : b));
  const i = incoming.findIndex((b) => b._id === id);
  if (i >= 0) incoming[i] = { ...incoming[i], ...p };
};

export const demo: Backend = {
  sendOtp: () => wait({ message: 'Code sent on WhatsApp', expiresIn: 300 }),
  // New phone numbers are new accounts: they go through "About you" (gender, show me, privacy, city).
  verifyOtp: (phone, _otp, role) => {
    const staff = demoRoleFor(phone);
    if (staff) return wait({ ...auth({ ...me, phone, role: staff, fullName: staff === 'superadmin' ? 'Owner' : 'Farah (ops)' }), isNewUser: false });
    return wait({ ...auth({ ...me, phone, role: role ?? 'user', hasPin: false, fullName: undefined, gender: undefined, seeGender: undefined, profileVisibility: undefined }), isNewUser: true });
  },
  setPin: () => wait({ message: 'PIN set' }),
  pinLogin: (phone) => wait(auth({ ...me, phone, role: demoRoleFor(phone) ?? me.role })),
  emailLogin: () => wait(auth()),
  verifyEmail: () => wait(auth()),

  companions: () => wait(people.filter(visibleTo).map(view)),
  companion: (id) => {
    const c = people.find((x) => x.id === id);
    return c && visibleTo(c) ? wait(view(c)) : fail('Companion not found or not verified');
  },

  createBooking: (b) => {
    const c = people.find((x) => x.id === b.companionId) ?? people[0];
    const booking: Booking = { _id: `b${Date.now()}`, flow: 'request', requesterId: 'me', companionId: ref(c), status: 'pending', paymentStatus: 'pending', pricePerHour: c.pricePerHour ?? 500, startTime: b.startTime, duration: b.duration, scheduledDate: `${b.scheduledDate}T00:00:00.000Z`, createdAt: new Date().toISOString() };
    bookings = [booking, ...bookings];
    return wait({ message: 'Booking request sent successfully!', booking });
  },
  // Always hand out fresh copies, like a real API, so screens see changes.
  myBookings: () => wait(bookings.map((x) => ({ ...x }))),
  incomingBookings: () => wait(incoming.map((x) => ({ ...x }))),
  booking: (id) => (find(id) ? wait({ ...find(id)! }) : fail('Booking not found.')),
  setBookingStatus: (id, status) => {
    patch(id, { status });
    return wait({ message: 'Updated.', booking: find(id)! });
  },
  cancelBooking: (id) => {
    const b = find(id);
    if (!b) return fail('Booking not found.');
    // Same rule as the server: 15+ min before the start → 85% back; later → nothing.
    const r = refundIfCancelledNow(b);
    const refund = r.amount > 0 ? { status: 'processed' as const, amount: r.amount, retained: r.fee } : undefined;
    patch(id, { status: 'cancelled', cancelledBy: 'requester', allocation: b.flow === 'prepaid' ? { state: 'cancelled' } : b.allocation, ...(refund ? { refund, paymentStatus: 'refunded' as const } : {}), offerSummary: undefined });
    return wait({ message: r.amount > 0 ? `Cancelled. ₹${r.amount} is being refunded.` : 'Cancelled.', booking: find(id)! });
  },

  policy: () => wait(POLICY),
  createPrepaidBooking: (b) => {
    const existing = keys.get(b.idempotencyKey);
    if (existing) {
      const again = find(existing)!;
      return wait({ booking: again, quote: { currency: 'INR' as const, amount: again.packagePrice ?? 0, fees: 0, pricePerHour: 399, duration: again.duration }, policy: POLICY, replayed: true });
    }
    const c = people.find((x) => x.id === b.companionId) ?? people[0];
    const booking: Booking = {
      _id: `p${Date.now()}`,
      flow: 'prepaid',
      requesterId: 'me',
      preferredCompanionId: ref(c),
      companionId: null,
      status: 'pending',
      paymentStatus: 'pending',
      pricePerHour: 399,
      packagePrice: priceFor(Number(b.duration) / 60) ?? undefined,
      startTime: b.startTime,
      duration: b.duration,
      scheduledDate: `${b.scheduledDate}T00:00:00.000Z`,
      createdAt: new Date().toISOString(),
      message: b.message,
      allocation: { state: 'awaiting_payment', paymentDeadline: inMin(30) },
    };
    bookings = [booking, ...bookings];
    keys.set(b.idempotencyKey, booking._id);
    return wait({ booking, quote: { currency: 'INR' as const, amount: booking.packagePrice ?? 0, fees: 0, pricePerHour: 399, duration: booking.duration }, policy: POLICY });
  },
  acceptOffer: (id) => {
    const b = incoming.find((x) => x._id === id);
    if (!b || b.myOffer?.status !== 'offered' || new Date(b.myOffer.expiresAt) < new Date()) return fail('This offer has expired or was already taken.');
    patch(id, { status: 'accepted', companionId: 'me', allocation: { state: 'assigned' }, myOffer: { ...b.myOffer, status: 'accepted' }, requesterId: { _id: 'u7', fullName: 'Karan Malhotra' } });
    return wait({ message: 'Booking confirmed. Chat is open.', booking: find(id)! });
  },
  declineOffer: (id) => {
    const b = incoming.find((x) => x._id === id);
    if (!b?.myOffer) return fail('This offer is no longer open.');
    patch(id, { myOffer: { ...b.myOffer, status: 'declined' } });
    return wait({ message: 'Declined. We’ll offer it to someone else.' });
  },
  openDispute: (id, reason) => {
    patch(id, { dispute: { status: 'open', reason, openedAt: new Date().toISOString() } });
    return wait({ message: 'Thanks — our team will review this and contact you.', booking: find(id)! });
  },

  createPaymentIntent: (bookingId) => {
    const b = find(bookingId);
    if (!b) return fail('Booking not found.');
    return wait({ mode: 'simulated' as const, orderId: `sim_${bookingId}`, amount: amountDuePaise(b.pricePerHour, b.duration, b.packagePrice), currency: 'INR' });
  },
  verifyPayment: ({ bookingId }) => demo.simulatePayment(bookingId, 'success'),
  simulatePayment: (bookingId, outcome) => {
    if (outcome === 'failure') return fail('Test payment declined. No money was taken.');
    const b = find(bookingId);
    if (!b) return fail('Booking not found.');
    const amountPaid = amountDuePaise(b.pricePerHour, b.duration, b.packagePrice) / 100;
    if (b.flow === 'prepaid') {
      patch(bookingId, { paymentStatus: 'paid', paymentMode: 'simulated', amountPaid, allocation: { state: 'offering', deadline: inMin(120) }, offerSummary: { tried: 1, liveUntil: inMin(140) } });
      // Demo only: the chosen companion accepts after a few seconds.
      setTimeout(() => {
        const cur = find(bookingId);
        if (cur?.allocation?.state !== 'offering') return;
        const chosen = cur.preferredCompanionId && typeof cur.preferredCompanionId === 'object' ? cur.preferredCompanionId : null;
        const full = people.find((p) => p.id === chosen?._id);
        patch(bookingId, { status: 'accepted', companionId: full ? { ...ref(full), fullName: full.fullName, locked: false } : chosen, allocation: { state: 'assigned' }, offerSummary: undefined });
        notifications = [{ _id: `n${Date.now()}`, type: 'booking_confirmed', message: `${first(full?.fullName)} confirmed your booking. Chat is open.`, isRead: false, createdAt: new Date().toISOString() }, ...notifications];
      }, 7000);
    } else {
      patch(bookingId, { paymentStatus: 'paid', paymentMode: 'simulated', amountPaid });
    }
    return wait({ message: 'Test payment successful.', booking: find(bookingId)! });
  },

  notifications: () => wait([...notifications]),
  clearNotifications: () => {
    notifications = [];
    return wait({ message: 'Cleared' });
  },

  profile: () => {
    const u = viewer();
    return wait<Profile>({ id: 'me', role: u?.role ?? 'user', fullName: u?.fullName ?? 'Mukarram', phoneNumber: '9876543210', city: u?.city ?? 'Hyderabad', state: 'Telangana', area: 'Banjara Hills', verification_status: 'verified', is_verified: true, gender: u?.gender, seeGender: u?.seeGender, profileVisibility: u?.profileVisibility });
  },
  checkProfile: () => wait({ hasProfile: true, status: 'verified' as const, is_verified: true, role: viewer()?.role ?? ('user' as const) }),
  onboardBasic: (f) => wait({ user: { id: 'me', role: 'user' as const, fullName: f.fullName, verification_status: 'verified' as const, is_verified: true } }),
  onboardCompanion: () => wait({ message: 'Submitted' }),
  updateIdentity: () => wait({ message: 'Updated' }),
  updateProfile: () => wait({ message: 'Updated' }),
  deleteAccount: () => wait({ message: 'Deleted' }),
  savePushToken: () => wait({ message: 'Notifications on.' }),
  signOut: () => wait(undefined),
  pricing: () => wait({ ...pricing() }),
  admin: demoAdmin,
};

export const demoIncoming = incoming;

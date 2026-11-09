import type { AppNotification, Booking, Companion, Gender, Policy, Profile, SessionUser } from '@/domain/types';
import { amountDuePaise, toDateKey } from '@/domain/booking';
import { useSession } from '@/state/session';
import type { Backend, AuthResult } from './backend';

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
  { id: 'c1', fullName: 'Ayesha Khan', gender: 'woman', visibility: 'locked', city: 'Hyderabad', state: 'Telangana', area: 'Banjara Hills', pricePerHour: 600, tags: ['Coffee', 'Walks', 'Books', 'Hindi'], availability: allDays, startTime: '10:00', endTime: '20:00', description: 'I love exploring new cafés, long walks and meaningful chats. Available for coffee meetups and city walks. Public places only, for safety.' },
  { id: 'c2', fullName: 'Rohan Mehta', gender: 'man', visibility: 'open', city: 'Hyderabad', state: 'Telangana', area: 'Jubilee Hills', pricePerHour: 500, tags: ['Walks', 'Events', 'Cricket'], availability: { ...allDays, monday: false }, startTime: '09:00', endTime: '21:00', description: 'Weekend explorer and live-music regular. Happy to come along to an event so you don’t go alone.' },
  { id: 'c3', fullName: 'Fatima Siddiqui', gender: 'woman', visibility: 'locked', city: 'Hyderabad', state: 'Telangana', area: 'Tolichowki', pricePerHour: 450, tags: ['Study', 'Coffee', 'Urdu'], availability: allDays, startTime: '11:00', endTime: '19:00', description: 'Study partner and quiet café company. I keep you on task and the coffee coming.' },
  { id: 'c4', fullName: 'Arjun Reddy', gender: 'man', visibility: 'open', city: 'Hyderabad', state: 'Telangana', area: 'Gachibowli', pricePerHour: 700, tags: ['Events', 'Food', 'Telugu'], availability: allDays, startTime: '12:00', endTime: '21:00', description: 'Foodie who knows every biryani spot worth the queue. Good company for dinners and shows.' },
  { id: 'c5', fullName: 'Neha Sharma', gender: 'woman', visibility: 'open', city: 'Hyderabad', state: 'Telangana', area: 'Madhapur', pricePerHour: 550, tags: ['Walks', 'Study', 'Yoga'], availability: { ...allDays, sunday: false }, startTime: '09:00', endTime: '18:00', description: 'Morning walks at KBR Park, slow mornings, honest conversation.' },
  { id: 'c6', fullName: 'Sameer Ali', gender: 'man', visibility: 'open', city: 'Hyderabad', state: 'Telangana', area: 'Old City', pricePerHour: 400, tags: ['Walks', 'Food', 'History'], availability: allDays, startTime: '15:00', endTime: '21:00', description: 'Old City walks: Charminar, Laad Bazaar and the best Irani chai. Let me show you around.' },
  { id: 'c7', fullName: 'Priya Iyer', gender: 'woman', visibility: 'locked', city: 'Bengaluru', state: 'Karnataka', area: 'Indiranagar', pricePerHour: 650, tags: ['Coffee', 'Events', 'Kannada'], availability: allDays, startTime: '10:00', endTime: '21:00', description: 'Indiranagar cafés and weekend gigs. Calm, curious, a good listener.' },
  { id: 'c8', fullName: 'Kabir Das', gender: 'nonbinary', visibility: 'locked', city: 'Mumbai', state: 'Maharashtra', area: 'Bandra West', pricePerHour: 600, tags: ['Walks', 'Food', 'Art'], availability: allDays, startTime: '11:00', endTime: '21:00', description: 'Bandra sea-face walks, galleries and street food.' },
  { id: 'c9', fullName: 'Zoya Ansari', gender: 'woman', visibility: 'open', city: 'Hyderabad', state: 'Telangana', area: 'Kondapur', pricePerHour: 500, tags: ['Coffee', 'Study', 'Urdu'], availability: allDays, startTime: '10:00', endTime: '20:00', description: 'Book-club regular and coffee snob. Happy to be your study buddy.' },
];

const POLICY: Policy = {
  fees: 'No booking fee. You pay the companion’s hourly rate × hours.',
  allocation:
    'Your chosen companion has 15 minutes to accept. If they can’t, we offer your booking to up to 2 similar verified companions (same city, your “show me” preference, same or lower rate). If nobody accepts within 2 hours (or 1 hour before the session), the booking is cancelled and fully refunded.',
  cancellation: [
    'Cancel any time before the session starts: full refund.',
    'If your companion cancels before the start: full refund.',
    'After the session starts: no automatic refund. Report a problem and we review it.',
    'Companion no-show: full refund. Your own no-show: no refund.',
  ],
  refunds: 'Refunds go to your original payment method. Timing depends on your bank or UPI app.',
  support: 'admin@prsnn.com',
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
  { _id: 'p1', flow: 'prepaid', requesterId: 'me', preferredCompanionId: ref(people[2]), companionId: null, status: 'pending', paymentStatus: 'paid', paymentMode: 'simulated', amountPaid: 675, pricePerHour: 450, startTime: '11:30', duration: '90', scheduledDate: day(2), createdAt: day(0), allocation: { state: 'offering', deadline: inMin(110) }, offerSummary: { tried: 1, liveUntil: inMin(12) } },
  { _id: 'b1', flow: 'prepaid', requesterId: 'me', preferredCompanionId: ref(people[0]), companionId: { ...ref(people[0]), fullName: people[0].fullName, locked: false }, status: 'accepted', paymentStatus: 'paid', paymentMode: 'simulated', pricePerHour: 600, startTime: '16:00', duration: '120', scheduledDate: day(1), amountPaid: 1200, createdAt: day(-1), allocation: { state: 'assigned' } },
  { _id: 'p2', flow: 'prepaid', requesterId: 'me', preferredCompanionId: ref(people[6]), companionId: null, status: 'cancelled', paymentStatus: 'refunded', paymentMode: 'simulated', amountPaid: 650, pricePerHour: 650, startTime: '19:00', duration: '60', scheduledDate: day(-1), createdAt: day(-2), allocation: { state: 'failed', failedReason: 'no_one_accepted_in_time' }, refund: { status: 'processed', amount: 650 }, cancelledBy: 'system' },
  // Older website-style bookings (request → accept → pay) still show and work.
  { _id: 'b2', flow: 'request', requesterId: 'me', companionId: ref(people[1]), status: 'accepted', paymentStatus: 'pending', pricePerHour: 500, startTime: '17:00', duration: '60', scheduledDate: day(3), createdAt: day(0) },
  { _id: 'b4', flow: 'request', requesterId: 'me', companionId: ref(people[3]), status: 'completed', paymentStatus: 'paid', pricePerHour: 700, startTime: '19:00', duration: '120', scheduledDate: day(-6), amountPaid: 1400, createdAt: day(-9) },
];

const incoming: Booking[] = [
  { _id: 'o1', flow: 'prepaid', requesterId: { _id: 'u7', fullName: 'Karan', locked: true }, companionId: null, status: 'pending', paymentStatus: 'paid', paymentMode: 'simulated', amountPaid: 600, pricePerHour: 600, startTime: '16:00', duration: '60', scheduledDate: day(2), createdAt: day(0), message: 'Coffee at Roastery? First time in Hyderabad.', allocation: { state: 'offering' }, myOffer: { status: 'offered', expiresAt: inMin(12), offeredAt: inMin(-3) } },
  { _id: 'i2', flow: 'prepaid', requesterId: { _id: 'u8', fullName: 'Priya Nair' }, companionId: 'me', status: 'accepted', paymentStatus: 'paid', paymentMode: 'simulated', pricePerHour: 600, startTime: '11:00', duration: '120', scheduledDate: day(1), amountPaid: 1200, createdAt: day(-2), allocation: { state: 'assigned' }, myOffer: { status: 'accepted', expiresAt: inMin(-30), offeredAt: inMin(-40) } },
  { _id: 'i3', flow: 'request', requesterId: { _id: 'u9', fullName: 'Imran Shaikh' }, companionId: 'me', status: 'completed', paymentStatus: 'paid', pricePerHour: 600, startTime: '17:00', duration: '90', scheduledDate: day(-3), amountPaid: 900, createdAt: day(-5) },
];

let notifications: AppNotification[] = [
  { _id: 'n1', type: 'booking_confirmed', message: 'Ayesha confirmed your booking #B1. Chat is open.', isRead: false, createdAt: inMin(-2) },
  { _id: 'n2', type: 'payment_completed', message: 'Payment received for booking #P1. We’re confirming your companion.', isRead: false, createdAt: inMin(-20) },
  { _id: 'n3', type: 'refund', message: 'We couldn’t find an available companion for booking #P2. Your full payment of ₹650 was refunded.', isRead: true, createdAt: inMin(-26 * 60) },
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
  verifyOtp: (phone, _otp, role) => wait({ ...auth({ ...me, phone, role: role ?? 'user', hasPin: false, fullName: undefined, gender: undefined, seeGender: undefined, profileVisibility: undefined }), isNewUser: true }),
  setPin: () => wait({ message: 'PIN set' }),
  pinLogin: (phone) => wait(auth({ ...me, phone })),
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
    return wait({ booking: find(id)! });
  },
  cancelBooking: (id) => {
    const b = find(id);
    if (!b) return fail('Booking not found.');
    const started = new Date(`${b.scheduledDate.slice(0, 10)}T${b.startTime}:00`).getTime() <= Date.now();
    const refund = b.paymentStatus === 'paid' && !started ? { status: 'processed' as const, amount: b.amountPaid ?? 0 } : undefined;
    patch(id, { status: 'cancelled', cancelledBy: 'requester', allocation: b.flow === 'prepaid' ? { state: 'cancelled' } : b.allocation, ...(refund ? { refund, paymentStatus: 'refunded' as const } : {}), offerSummary: undefined });
    return wait({ booking: find(id)! });
  },

  policy: () => wait(POLICY),
  createPrepaidBooking: (b) => {
    const existing = keys.get(b.idempotencyKey);
    if (existing) {
      const again = find(existing)!;
      return wait({ booking: again, quote: { currency: 'INR' as const, amount: amountDuePaise(again.pricePerHour, again.duration) / 100, fees: 0, pricePerHour: again.pricePerHour, duration: again.duration }, policy: POLICY, replayed: true });
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
      pricePerHour: c.pricePerHour ?? 500,
      startTime: b.startTime,
      duration: b.duration,
      scheduledDate: `${b.scheduledDate}T00:00:00.000Z`,
      createdAt: new Date().toISOString(),
      message: b.message,
      allocation: { state: 'awaiting_payment', paymentDeadline: inMin(30) },
    };
    bookings = [booking, ...bookings];
    keys.set(b.idempotencyKey, booking._id);
    return wait({ booking, quote: { currency: 'INR' as const, amount: amountDuePaise(booking.pricePerHour, booking.duration) / 100, fees: 0, pricePerHour: booking.pricePerHour, duration: booking.duration }, policy: POLICY });
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
    return wait({ mode: 'simulated' as const, orderId: `sim_${bookingId}`, amount: amountDuePaise(b.pricePerHour, b.duration), currency: 'INR' });
  },
  verifyPayment: ({ bookingId }) => demo.simulatePayment(bookingId, 'success'),
  simulatePayment: (bookingId, outcome) => {
    if (outcome === 'failure') return fail('Test payment declined. No money was taken.');
    const b = find(bookingId);
    if (!b) return fail('Booking not found.');
    const amountPaid = amountDuePaise(b.pricePerHour, b.duration) / 100;
    if (b.flow === 'prepaid') {
      patch(bookingId, { paymentStatus: 'paid', paymentMode: 'simulated', amountPaid, allocation: { state: 'offering', deadline: inMin(120) }, offerSummary: { tried: 1, liveUntil: inMin(15) } });
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
};

export const demoIncoming = incoming;

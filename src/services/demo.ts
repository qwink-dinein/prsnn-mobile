import type { AppNotification, Booking, Companion, Profile, SessionUser } from '@/domain/types';
import { toDateKey } from '@/domain/booking';
import type { Backend, AuthResult } from './backend';

/**
 * Sample data for EXPO_PUBLIC_DEMO=1 (design review and screenshots).
 * Every function has the same signature as the real backend service.
 * Nothing here is sent anywhere.
 */
const wait = <T>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(v), ms));
const allDays = { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true };

const companions: Companion[] = [
  { id: 'c1', fullName: 'Ayesha Khan', city: 'Hyderabad', area: 'Banjara Hills', pricePerHour: 600, tags: ['Coffee', 'Walks', 'Books', 'Hindi'], availability: allDays, startTime: '10:00', endTime: '20:00', description: 'I love exploring new cafés, long walks and meaningful chats. Available for coffee meetups and city walks. Public places only, for safety.' },
  { id: 'c2', fullName: 'Rohan Mehta', city: 'Hyderabad', area: 'Jubilee Hills', pricePerHour: 500, tags: ['Walks', 'Events', 'Cricket'], availability: { ...allDays, monday: false }, startTime: '09:00', endTime: '21:00', description: 'Weekend explorer and live-music regular. Happy to come along to an event so you don’t go alone.' },
  { id: 'c3', fullName: 'Fatima Siddiqui', city: 'Hyderabad', area: 'Tolichowki', pricePerHour: 450, tags: ['Study', 'Coffee', 'Urdu'], availability: allDays, startTime: '11:00', endTime: '19:00', description: 'Study partner and quiet café company. I keep you on task and the coffee coming.' },
  { id: 'c4', fullName: 'Arjun Reddy', city: 'Hyderabad', area: 'Gachibowli', pricePerHour: 700, tags: ['Events', 'Food', 'Telugu'], availability: allDays, startTime: '12:00', endTime: '21:00', description: 'Foodie who knows every biryani spot worth the queue. Good company for dinners and shows.' },
  { id: 'c5', fullName: 'Neha Sharma', city: 'Hyderabad', area: 'Madhapur', pricePerHour: 550, tags: ['Walks', 'Study', 'Yoga'], availability: { ...allDays, sunday: false }, startTime: '09:00', endTime: '18:00', description: 'Morning walks at KBR Park, slow mornings, honest conversation.' },
  { id: 'c6', fullName: 'Sameer Ali', city: 'Hyderabad', area: 'Old City', pricePerHour: 400, tags: ['Walks', 'Food', 'History'], availability: allDays, startTime: '15:00', endTime: '21:00', description: 'Old City walks: Charminar, Laad Bazaar and the best Irani chai. Let me show you around.' },
];

const me: SessionUser = { id: 'me', role: 'user', is_verified: true, verification_status: 'verified', fullName: 'Mukarram', phone: '919876543210', hasPin: true };

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${toDateKey(d)}T00:00:00.000Z`;
};
const ref = (c: Companion) => ({ _id: c.id, fullName: c.fullName, profilePhotoUrl: c.profilePhoto ?? undefined, pricePerHour: c.pricePerHour });

let bookings: Booking[] = [
  { _id: 'b1', requesterId: 'me', companionId: ref(companions[0]), status: 'accepted', paymentStatus: 'paid', pricePerHour: 600, startTime: '16:00', duration: '120', scheduledDate: day(1), amountPaid: 1200, createdAt: day(-1) },
  { _id: 'b2', requesterId: 'me', companionId: ref(companions[1]), status: 'accepted', paymentStatus: 'pending', pricePerHour: 500, startTime: '17:00', duration: '60', scheduledDate: day(3), createdAt: day(0) },
  { _id: 'b3', requesterId: 'me', companionId: ref(companions[2]), status: 'pending', paymentStatus: 'pending', pricePerHour: 450, startTime: '11:30', duration: '90', scheduledDate: day(5), createdAt: day(0) },
  { _id: 'b4', requesterId: 'me', companionId: ref(companions[3]), status: 'completed', paymentStatus: 'paid', pricePerHour: 700, startTime: '19:00', duration: '120', scheduledDate: day(-6), amountPaid: 1400, createdAt: day(-9) },
  { _id: 'b5', requesterId: 'me', companionId: ref(companions[5]), status: 'cancelled', paymentStatus: 'pending', pricePerHour: 400, startTime: '18:00', duration: '60', scheduledDate: day(-2), createdAt: day(-4) },
];

const incoming: Booking[] = [
  { _id: 'i1', requesterId: { _id: 'u7', fullName: 'Karan Malhotra' }, companionId: 'me', status: 'pending', paymentStatus: 'pending', pricePerHour: 600, startTime: '16:00', duration: '60', scheduledDate: day(2), createdAt: day(0), message: 'Coffee at Roastery? First time in Hyderabad.' },
  { _id: 'i2', requesterId: { _id: 'u8', fullName: 'Priya Nair' }, companionId: 'me', status: 'accepted', paymentStatus: 'paid', pricePerHour: 600, startTime: '11:00', duration: '120', scheduledDate: day(1), amountPaid: 1200, createdAt: day(-2) },
  { _id: 'i3', requesterId: { _id: 'u9', fullName: 'Imran Shaikh' }, companionId: 'me', status: 'completed', paymentStatus: 'paid', pricePerHour: 600, startTime: '17:00', duration: '90', scheduledDate: day(-3), amountPaid: 900, createdAt: day(-5) },
];

let notifications: AppNotification[] = [
  { _id: 'n1', type: 'booking_accepted', message: 'Ayesha Khan has accepted your booking request.', isRead: false, createdAt: new Date(Date.now() - 2 * 60_000).toISOString() },
  { _id: 'n2', type: 'booking_accepted', message: 'Rohan Mehta has accepted your booking request. Pay to confirm.', isRead: false, createdAt: new Date(Date.now() - 60 * 60_000).toISOString() },
  { _id: 'n3', type: 'payment_completed', message: 'Payment received for booking #4F2A91.', isRead: true, createdAt: new Date(Date.now() - 26 * 3600_000).toISOString() },
  { _id: 'n4', type: 'other', message: 'New companions near you in Banjara Hills.', isRead: true, createdAt: new Date(Date.now() - 3 * 86400_000).toISOString() },
];

const auth = (u: SessionUser = me): AuthResult => ({ token: 'demo-token', user: u });

export const demo: Backend = {
  sendOtp: () => wait({ message: 'Code sent on WhatsApp', expiresIn: 300 }),
  verifyOtp: (phone, _otp, role) => wait({ ...auth({ ...me, phone, role: role ?? 'user', hasPin: false }), isNewUser: false }),
  setPin: () => wait({ message: 'PIN set' }),
  pinLogin: (phone) => wait(auth({ ...me, phone })),
  emailLogin: () => wait(auth()),
  verifyEmail: () => wait(auth()),

  companions: () => wait(companions),
  companion: (id) => wait(companions.find((c) => c.id === id) ?? companions[0]),

  createBooking: (b) => {
    const c = companions.find((x) => x.id === b.companionId) ?? companions[0];
    const booking: Booking = { _id: `b${Date.now()}`, requesterId: 'me', companionId: ref(c), status: 'pending', paymentStatus: 'pending', pricePerHour: c.pricePerHour ?? 500, startTime: b.startTime, duration: b.duration, scheduledDate: `${b.scheduledDate}T00:00:00.000Z`, createdAt: new Date().toISOString() };
    bookings = [booking, ...bookings];
    return wait({ message: 'Booking request sent successfully!', booking });
  },
  myBookings: () => wait(bookings),
  incomingBookings: () => wait(incoming),
  booking: (id) => wait([...bookings, ...incoming].find((b) => b._id === id) ?? bookings[0]),
  setBookingStatus: (id, status) => {
    const b = incoming.find((x) => x._id === id);
    if (b) b.status = status;
    return wait({ booking: b ?? incoming[0] });
  },
  cancelBooking: (id) => {
    bookings = bookings.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b));
    return wait({ booking: bookings.find((b) => b._id === id)! });
  },

  createPaymentIntent: (bookingId) => {
    const b = bookings.find((x) => x._id === bookingId);
    const amount = b ? Math.round(b.pricePerHour * (Number(b.duration) / 60) * 100) : 0;
    return wait({ orderId: 'order_demo', amount, currency: 'INR', keyId: 'rzp_test_demo' });
  },
  verifyPayment: ({ bookingId }) => {
    bookings = bookings.map((b) => (b._id === bookingId ? { ...b, paymentStatus: 'paid' } : b));
    return wait({ message: 'Payment verified successfully.', booking: bookings.find((b) => b._id === bookingId)! });
  },

  notifications: () => wait(notifications),
  clearNotifications: () => {
    notifications = [];
    return wait({ message: 'Cleared' });
  },

  profile: () => wait<Profile>({ id: 'me', role: 'user', fullName: 'Mukarram', phoneNumber: '9876543210', city: 'Hyderabad', area: 'Banjara Hills', verification_status: 'verified', is_verified: true }),
  checkProfile: () => wait({ hasProfile: true, status: 'verified' as const, is_verified: true, role: 'user' as const }),
  onboardBasic: (f) => wait({ user: { id: 'me', role: 'user' as const, fullName: f.fullName, verification_status: 'verified' as const, is_verified: true } }),
  onboardCompanion: () => wait({ message: 'Submitted' }),
  updateProfile: () => wait({ message: 'Updated' }),
  deleteAccount: () => wait({ message: 'Deleted' }),
};

export const demoIncoming = incoming;

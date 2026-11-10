import type { AdminBooking, AdminUser, AuditEntry, BroadcastRecord, CityPlan, PanicAlert, Role } from '@/domain/types';
import { applyPricing, pricing, priceCurveError } from '@/domain/pricing';
import { toDateKey } from '@/domain/booking';
import { useSession } from '@/state/session';
import type { Backend } from './backend';

/**
 * Sample admin data for EXPO_PUBLIC_DEMO=1. Same rules as the server where it
 * matters (sub-admins can't move money; one refund per booking). In demo,
 * log in with 90000 00000 for a superadmin or 90000 00001 for a sub-admin.
 */
const wait = <T>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(v), ms));
const fail = (message: string) => new Promise<never>((_, j) => setTimeout(() => j(new Error(message)), 250));
const role = (): Role => useSession.getState().user?.role ?? 'user';
const isSuper = () => role() === 'superadmin';
const inMin = (m: number) => new Date(Date.now() + m * 60_000).toISOString();
const day = (o: number) => {
  const d = new Date();
  d.setDate(d.getDate() + o);
  return `${toDateKey(d)}T00:00:00.000Z`;
};
const allDays = { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true };

const u = (id: string, fullName: string, r: Role, over: Partial<AdminUser> = {}): AdminUser => ({
  id,
  fullName,
  role: r,
  phone: `91${9100000000 + Number(id.replace(/\D/g, '') || 0)}`,
  verificationStatus: 'verified',
  suspended: false,
  profileVisibility: 'open',
  tags: [],
  city: 'Hyderabad',
  hasPushToken: true,
  createdAt: day(-30),
  ...over,
});

let users: AdminUser[] = [
  u('u1', 'Karan Malhotra', 'user', { area: 'Gachibowli' }),
  u('u2', 'Priya Nair', 'user', { area: 'Madhapur', hasPushToken: false }),
  u('u3', 'Imran Shaikh', 'user', { area: 'Tolichowki' }),
  u('c1', 'Ayesha Khan', 'companion', { area: 'Banjara Hills', packages: [1, 2, 4, 6], availability: allDays, startTime: '10:00', endTime: '20:00', description: 'Cafés, walks and good conversation.', tags: ['Coffee', 'Walks'] }),
  u('c2', 'Rohan Mehta', 'companion', { area: 'Jubilee Hills', availability: allDays, startTime: '09:00', endTime: '21:00', tags: ['Events'] }),
  u('c3', 'Sana Mirza', 'companion', { verificationStatus: 'pending', approvalStatus: 'pending', categories: ['work_study', 'new_in_town'], area: 'Kondapur', description: 'Book-club regular, happy to be your study buddy.', tags: ['Study', 'Coffee'], profilePhotoUrl: undefined }),
  u('c4', 'Vikram Rao', 'companion', { verificationStatus: 'pending', area: 'Kukatpally', description: 'Cricket, street food and long walks.', tags: ['Walks', 'Food'] }),
  u('s1', 'Farah (ops)', 'subadmin'),
];

const person = (id: string) => {
  const p = users.find((x) => x.id === id);
  return p ? { _id: p.id, fullName: p.fullName, phone: p.phone, role: p.role } : id;
};

const bk = (o: Partial<AdminBooking> & { _id: string }): AdminBooking => ({
  ref: o._id.toUpperCase().padStart(6, '0'),
  flow: 'prepaid',
  requesterId: person('u1'),
  companionId: person('c1'),
  status: 'accepted',
  paymentStatus: 'paid',
  paymentMode: 'simulated',
  pricePerHour: 399,
  packagePrice: 699,
  amountPaid: 699,
  companionShare: 559,
  duration: '120',
  startTime: '16:00',
  scheduledDate: day(1),
  createdAt: day(-1),
  allocation: { state: 'assigned' },
  refund: { status: 'none', amount: 0 },
  ...o,
});

let bookings: AdminBooking[] = [
  bk({ _id: 'a1' }),
  bk({ _id: 'a2', requesterId: person('u2'), companionId: null, preferredCompanionId: person('c2'), status: 'pending', allocation: { state: 'offering', deadline: inMin(90) }, scheduledDate: day(2), startTime: '11:00', duration: '60', packagePrice: 399, amountPaid: 399, companionShare: undefined }),
  bk({ _id: 'a3', requesterId: person('u3'), status: 'pending', paymentStatus: 'pending', amountPaid: 0, companionId: null, preferredCompanionId: person('c1'), allocation: { state: 'awaiting_payment', paymentDeadline: inMin(20) }, companionShare: undefined }),
  bk({ _id: 'a4', status: 'cancelled', cancelledBy: 'admin', cancelReason: 'Companion unwell', refundReview: { needed: true, note: 'Companion unwell', requestedAt: inMin(-50) }, scheduledDate: day(0) }),
  bk({ _id: 'a5', requesterId: person('u2'), status: 'cancelled', cancelledBy: 'system', refund: { status: 'failed', amount: 1299, reason: 'No companion accepted', attempts: 2 }, packagePrice: 1299, amountPaid: 1299, duration: '240', scheduledDate: day(-1) }),
  bk({ _id: 'a6', status: 'completed', scheduledDate: day(-4), dispute: { status: 'open', reason: 'Companion arrived 40 minutes late and left early.', openedAt: inMin(-300), openedBy: person('u1'), notes: [] } }),
  bk({ _id: 'a7', requesterId: person('u3'), companionId: person('c2'), status: 'completed', scheduledDate: day(-9), packagePrice: 399, amountPaid: 399, companionShare: 319, duration: '60' }),
];

const chats: Record<string, { _id: string; senderId: string; senderName: string; content: string; createdAt: string }[]> = {
  a6: [
    { _id: 'm1', senderId: 'u1', senderName: 'Karan Malhotra', content: 'Hi! I’m at the café near the entrance.', createdAt: inMin(-6000) },
    { _id: 'm2', senderId: 'c1', senderName: 'Ayesha Khan', content: 'Running late, sorry — traffic on Road No. 12.', createdAt: inMin(-5990) },
    { _id: 'm3', senderId: 'u1', senderName: 'Karan Malhotra', content: 'It’s been 40 minutes…', createdAt: inMin(-5960) },
  ],
};

let activity: AuditEntry[] = [
  { _id: 'l1', action: 'verification.approve', role: 'subadmin', actorId: 's1', actorName: 'Farah (ops)', target: { kind: 'user', id: 'c2' }, before: { verificationStatus: 'pending' }, after: { verificationStatus: 'verified' }, at: inMin(-90) },
  { _id: 'l2', action: 'booking.cancel', role: 'subadmin', actorId: 's1', actorName: 'Farah (ops)', target: { kind: 'booking', id: 'a4' }, after: { reason: 'Companion unwell' }, at: inMin(-50) },
];
let broadcasts: BroadcastRecord[] = [{ _id: 'bc1', audience: 'companions', title: 'Weekend demand is high', body: 'Turn on Saturday and Sunday availability to get more bookings.', recipients: 2, sent: 2, failed: 0, createdAt: day(-3) }];

const log = (action: string, target: AuditEntry['target'], after?: Record<string, unknown>, before?: Record<string, unknown>) => {
  const me = useSession.getState().user;
  activity = [{ _id: `l${Date.now()}`, action, role: role(), actorId: me?.id ?? 'me', actorName: me?.fullName ?? 'You', target, before, after, at: new Date().toISOString() }, ...activity];
};
const view = (b: AdminBooking): AdminBooking => {
  const o = { ...b };
  if (isSuper()) o.platformShare = o.companionShare != null ? (o.amountPaid ?? 0) - o.companionShare : undefined;
  else delete o.companionShare;
  return o;
};
const findB = (id: string) => bookings.find((b) => b._id === id);
const putB = (id: string, p: Partial<AdminBooking>) => {
  bookings = bookings.map((b) => (b._id === id ? { ...b, ...p } : b));
  return view(findB(id)!);
};
const putU = (id: string, p: Partial<AdminUser>) => {
  users = users.map((x) => (x.id === id ? { ...x, ...p } : x));
  return users.find((x) => x.id === id)!;
};
const superOnly = () => (isSuper() ? null : fail('Access denied'));

export const demoAdmin: Backend['admin'] = {
  overview: () =>
    wait({
      role: role(),
      pendingVerifications: users.filter((x) => x.role === 'companion' && x.verificationStatus === 'pending').length,
      liveBookings: bookings.filter((b) => ['pending', 'accepted'].includes(b.status)).length,
      openDisputes: bookings.filter((b) => b.dispute?.status === 'open').length,
      refundsToReview: bookings.filter((b) => b.refundReview?.needed).length,
      failedRefunds: bookings.filter((b) => b.refund?.status === 'failed').length,
      members: users.filter((x) => x.role === 'user').length,
      companions: users.filter((x) => x.role === 'companion' && x.verificationStatus === 'verified').length,
      bookingsToday: 2,
      ...(isSuper() ? { money: { collected: 5294, refunded: 0, companionPayouts: 1437, platformNet: 3857 } } : {}),
    }),
  verifications: () => wait(users.filter((x) => x.role === 'companion' && x.verificationStatus === 'pending')),
  decideVerification: (id, decision) => {
    log(`verification.${decision === 'verified' ? 'approve' : 'reject'}`, { kind: 'user', id }, { verificationStatus: decision });
    return wait({ message: decision === 'verified' ? 'Companion verified.' : 'Companion rejected.', user: putU(id, { verificationStatus: decision }) });
  },
  users: ({ q, role: r } = {}) => {
    const t = (q ?? '').toLowerCase();
    return wait(users.filter((x) => (!r || (r === 'staff' ? ['admin', 'subadmin', 'superadmin'].includes(x.role) : x.role === r)) && (!t || `${x.fullName} ${x.phone} ${x.city}`.toLowerCase().includes(t))));
  },
  user: (id) => {
    const x = users.find((y) => y.id === id);
    if (!x) return fail('User not found.');
    const mine = bookings.filter((b) => [b.requesterId, b.companionId].some((p) => p && typeof p === 'object' && p._id === id));
    return wait({ user: x, bookings: mine.map(view) });
  },
  updateUser: (id, fields) => {
    log('user.edit', { kind: 'user', id }, fields as Record<string, unknown>);
    const { role: _ignored, ...rest } = fields;
    return wait({ message: 'Saved.', user: putU(id, rest) });
  },
  suspendUser: (id, suspended) => {
    log(suspended ? 'user.suspend' : 'user.unsuspend', { kind: 'user', id }, { suspended });
    return wait({ message: suspended ? 'Account suspended.' : 'Account restored.', user: putU(id, { suspended }) });
  },
  deleteUser: (id) => {
    users = users.filter((x) => x.id !== id);
    log('user.delete', { kind: 'user', id });
    return wait({ message: 'Account deleted.' });
  },
  admins: () => superOnly() ?? wait(users.filter((x) => ['admin', 'subadmin', 'superadmin'].includes(x.role))),
  addAdmin: (phone) => {
    if (!isSuper()) return fail('Access denied');
    const digits = phone.replace(/\D/g, '').slice(-10);
    const existing = users.find((x) => x.phone?.endsWith(digits));
    const user = existing ? putU(existing.id, { role: 'subadmin' }) : u(`s${Date.now()}`, `+91 ${digits}`, 'subadmin', { phone: `91${digits}` });
    if (!existing) users = [...users, user];
    log('admin.add', { kind: 'user', id: user.id }, { role: 'subadmin' });
    return wait({ message: 'Sub-admin added.', user });
  },
  removeAdmin: (id) => {
    if (!isSuper()) return fail('Access denied');
    putU(id, { role: 'user' });
    log('admin.remove', { kind: 'user', id });
    return wait({ message: 'Sub-admin removed.' });
  },
  bookings: (tab) =>
    wait(
      bookings
        .filter((b) => (tab === 'live' ? ['pending', 'accepted'].includes(b.status) : tab === 'done' ? ['completed', 'cancelled', 'rejected'].includes(b.status) : b.refundReview?.needed || (b.refund && b.refund.status !== 'none')))
        .map(view)
    ),
  booking: (id) => (findB(id) ? wait(view(findB(id)!)) : fail('Booking not found.')),
  bookingMessages: (id) => (findB(id)?.dispute?.status && findB(id)!.dispute!.status !== 'none' ? wait(chats[id] ?? []) : fail('Chats are only visible for bookings with a reported problem.')),
  updateBooking: (id, fields) => {
    log('booking.edit', { kind: 'booking', id }, fields);
    return wait({ message: 'Booking updated.', booking: putB(id, fields as Partial<AdminBooking>) });
  },
  cancelBooking: (id, reason, refundAmount) => {
    if (refundAmount !== undefined && !isSuper()) return fail('Only a superadmin can refund.');
    const b = findB(id);
    if (!b || !['pending', 'accepted'].includes(b.status)) return fail('This booking is already closed.');
    const paid = b.paymentStatus === 'paid';
    const p: Partial<AdminBooking> = { status: 'cancelled', cancelledBy: 'admin', cancelReason: reason, allocation: { ...(b.allocation ?? { state: 'cancelled' }), state: 'cancelled' } };
    if (paid && refundAmount !== undefined) p.refund = { status: 'processed', amount: refundAmount, retained: (b.amountPaid ?? 0) - refundAmount };
    else if (paid) p.refundReview = { needed: true, note: reason };
    log('booking.cancel', { kind: 'booking', id }, { reason, refundAmount });
    return wait({ message: paid && refundAmount === undefined ? 'Cancelled. A superadmin will decide the refund.' : 'Cancelled.', booking: putB(id, p) });
  },
  reassignBooking: (id, companionId) => {
    log('booking.reassign', { kind: 'booking', id }, { companionId });
    return wait({ message: 'Booking reassigned.', booking: putB(id, { companionId: person(companionId), status: 'accepted', allocation: { state: 'assigned' } }) });
  },
  refund: (id, amount, reason) => {
    if (!isSuper()) return fail('Access denied');
    const b = findB(id);
    if (!b) return fail('Booking not found.');
    if (b.refund && ['pending', 'processed'].includes(b.refund.status)) return fail('A refund has already been issued for this booking.');
    log('booking.refund', { kind: 'booking', id }, { amount, reason });
    return wait({ message: `Refund of ₹${amount} processed.`, booking: putB(id, { refund: { status: 'processed', amount, retained: (b.amountPaid ?? 0) - amount, reason }, refundReview: { needed: false }, paymentStatus: 'refunded' }) });
  },
  retryRefund: (id) => {
    if (!isSuper()) return fail('Access denied');
    const b = findB(id);
    if (b?.refund?.status !== 'failed') return fail('Only a failed refund can be retried.');
    log('booking.refund_retry', { kind: 'booking', id });
    return wait({ message: 'Retry processed.', booking: putB(id, { refund: { ...b.refund, status: 'processed' }, paymentStatus: 'refunded' }) });
  },
  markPaid: (id) => {
    if (!isSuper()) return fail('Access denied');
    const b = findB(id);
    if (!b) return fail('Booking not found.');
    log('booking.mark_paid', { kind: 'booking', id });
    return wait({ message: `Marked paid (₹${b.packagePrice}, simulated).`, booking: putB(id, { paymentStatus: 'paid', amountPaid: b.packagePrice, allocation: { state: 'offering' } }) });
  },
  overrideFee: (id, retained) => {
    if (!isSuper()) return fail('Access denied');
    const b = findB(id);
    if (!b) return fail('Booking not found.');
    const amount = (b.amountPaid ?? 0) - retained;
    log('booking.override_fee', { kind: 'booking', id }, { retained });
    return wait({ message: `Fee set to ₹${retained}. ₹${amount} refund processed.`, booking: putB(id, { refund: { status: amount > 0 ? 'processed' : 'none', amount, retained }, refundReview: { needed: false } }) });
  },
  deleteBooking: (id) => {
    if (!isSuper()) return fail('Access denied');
    bookings = bookings.filter((b) => b._id !== id);
    log('booking.delete', { kind: 'booking', id });
    return wait({ message: 'Booking deleted.' });
  },
  disputes: (status) => wait(bookings.filter((b) => b.dispute?.status === status).map(view)),
  replyDispute: (id, message) => {
    const b = findB(id);
    if (!b?.dispute) return fail('Dispute not found.');
    log('dispute.reply', { kind: 'booking', id }, { message });
    const me = useSession.getState().user;
    return wait({ message: 'Reply sent.', booking: putB(id, { dispute: { ...b.dispute, notes: [...(b.dispute.notes ?? []), { by: me?.id ?? 'me', role: role(), message, at: new Date().toISOString() }] } }) });
  },
  closeDispute: (id, resolution) => {
    const b = findB(id);
    if (!b?.dispute) return fail('Dispute not found.');
    log('dispute.close', { kind: 'booking', id }, { resolution });
    return wait({ message: 'Dispute closed.', booking: putB(id, { dispute: { ...b.dispute, status: 'resolved', resolution, resolvedAt: new Date().toISOString() } }) });
  },
  savePricing: ({ repriceUnpaid, ...p }) => {
    if (!isSuper()) return fail('Access denied');
    const next = { ...pricing(), ...p, packagePrices: { ...pricing().packagePrices, ...(p.packagePrices ?? {}) } };
    const err = priceCurveError(next.packagePrices);
    if (err) return fail(err);
    applyPricing(next);
    log('settings.pricing', { kind: 'settings', id: 'pricing' }, { packagePrices: next.packagePrices });
    let repriced = 0;
    if (repriceUnpaid) {
      bookings = bookings.map((b) => (b.allocation?.state === 'awaiting_payment' ? (repriced++, { ...b, packagePrice: next.packagePrices[Number(b.duration) / 60] }) : b));
    }
    return wait({ message: repriceUnpaid ? `Prices saved. ${repriced} unpaid booking${repriced === 1 ? '' : 's'} re-priced.` : 'Prices saved. New bookings use them now.', pricing: next, repriced });
  },
  audience: () => superOnly() ?? wait({ members: users.filter((x) => x.role === 'user' && x.hasPushToken).length, companions: users.filter((x) => x.role === 'companion' && x.verificationStatus === 'verified' && x.hasPushToken).length }),
  broadcast: ({ audience, title, body }) => {
    if (!isSuper()) return fail('Access denied');
    const n = users.filter((x) => (audience === 'members' ? x.role === 'user' : x.role === 'companion' && x.verificationStatus === 'verified') && x.hasPushToken).length;
    const record: BroadcastRecord = { _id: `bc${Date.now()}`, audience, title, body, recipients: n, sent: n, failed: 0, createdAt: new Date().toISOString() };
    broadcasts = [record, ...broadcasts];
    log('broadcast.send', { kind: 'broadcast', id: record._id }, { audience, title });
    return wait({ message: `Sent to ${n} of ${n} devices (demo: nothing was sent).`, broadcast: record });
  },
  broadcasts: () => superOnly() ?? wait(broadcasts),
  activity: () => superOnly() ?? wait(activity),
  approvalCounts: () => wait({ companions: users.filter((x) => x.role === 'companion' && x.approvalStatus === 'pending').length, photos: users.filter((x) => x.photoStatus === 'pending').length, idChecks: users.filter((x) => x.verificationStatus === 'pending').length, panics: panics.filter((a) => !a.resolvedAt).length }),
  approvals: (kind) => wait(kind === 'companions' ? users.filter((x) => x.role === 'companion' && x.approvalStatus === 'pending') : users.filter((x) => x.photoStatus === 'pending' && x.role !== 'companion')),
  decideProfile: (id, decision, note) => {
    log(`approval.${decision}`, { kind: 'user', id }, { note });
    return wait({ message: decision === 'approve' ? 'Approved. They’re live.' : 'Rejected. They’ve been told why.', user: putU(id, { approvalStatus: decision === 'approve' ? 'approved' : 'rejected', approvalNote: note ?? null, photoStatus: decision === 'approve' ? 'approved' : undefined }) });
  },
  approvePhoto: (id) => wait({ message: 'Photo approved.', user: putU(id, { photoStatus: 'approved' }) }),
  requestChanges: (id, target, _reasons, note) => {
    log('approval.request_changes', { kind: 'user', id }, { target, note });
    return wait({ message: 'Sent. It’s in their notifications.', user: putU(id, target === 'photo' ? { photoStatus: 'changes_requested', photoNote: note } : { approvalStatus: 'changes_requested', approvalNote: note }) });
  },
  panics: (openOnly = true) => wait(panics.filter((a) => !openOnly || !a.resolvedAt)),
  resolvePanic: (aid) => {
    panics = panics.map((a) => (a.id === aid ? { ...a, resolvedAt: new Date().toISOString(), resolvedBy: 'You' } : a));
    return wait(panics.find((a) => a.id === aid)!);
  },
  cityPlans: () => wait(plans),
  saveCityPlan: (p) => {
    const next = { id: p.id ?? `cp${Date.now()}`, state: p.state ?? 'Telangana', city: p.city ?? 'Hyderabad', category: p.category ?? 'explore', title: p.title ?? 'New plan', details: p.details ?? null, hours: p.hours ?? 2, active: p.active ?? true } as CityPlan;
    plans = p.id ? plans.map((x) => (x.id === p.id ? next : x)) : [...plans, next];
    return wait(next);
  },
  deleteCityPlan: (id) => {
    plans = plans.filter((x) => x.id !== id);
    return wait({ message: 'Removed.' });
  },
};

let panics: PanicAlert[] = [
  { id: 'pa1', bookingId: 'ab1', ref: 'A6F7ED', raisedRole: 'member', raisedAt: inMin(-7), sends: 2, lastSentAt: inMin(-2), scheduledDate: day(0).slice(0, 10), startTime: '16:00', duration: 240, meetingPlace: 'Starbucks, Inorbit Mall', city: 'Hyderabad', area: 'Madhapur', member: { id: 'm1', name: 'Rahul Mehta', phone: '919876543210' }, companion: { id: 'c1', name: 'Ayesha Khan', phone: '919000011111' } },
];
let plans: CityPlan[] = [
  { id: 'cp1', state: 'Telangana', city: 'Hyderabad', category: 'explore', title: 'Fort and heritage walk', details: 'Golconda Fort and the Qutb Shahi Tombs', hours: 6, active: true },
  { id: 'cp2', state: 'Telangana', city: 'Hyderabad', category: 'new_in_town', title: 'Café hopping', details: 'A few cafés and the streets around them', hours: 2, active: true },
];

/** Demo logins for the admin roles. */
export const demoRoleFor = (phone: string): Role | null => (phone.endsWith('9000000000') ? 'superadmin' : phone.endsWith('9000000001') ? 'subadmin' : null);

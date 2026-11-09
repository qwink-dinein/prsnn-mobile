import { adminBookingState, can, canActOn, describeAction, isStaff, personName, refundableAmount } from '@/domain/admin';
import { DEFAULT_PACKAGE_PRICES, priceCurveError } from '@/domain/pricing';

describe('admin roles (ADMIN_SPEC)', () => {
  it('staff are admin, subadmin and superadmin', () => {
    expect(['admin', 'subadmin', 'superadmin'].every((r) => isStaff(r as never))).toBe(true);
    expect(isStaff('user')).toBe(false);
    expect(isStaff('companion')).toBe(false);
    expect(isStaff(undefined)).toBe(false);
  });
  it('sub-admins do operations only', () => {
    for (const a of ['verify', 'editUser', 'suspendUser', 'deleteUser', 'editBooking', 'cancelBooking', 'reassignBooking', 'answerDispute', 'viewDisputeChat'] as const) expect(can('subadmin', a)).toBe(true);
    for (const a of ['refund', 'retryRefund', 'markPaid', 'overrideFee', 'editPrices', 'broadcast', 'manageAdmins', 'viewActivity', 'viewMoney'] as const) {
      expect(can('subadmin', a)).toBe(false);
      expect(can('admin', a)).toBe(false);
      expect(can('superadmin', a)).toBe(true);
    }
    expect(can('user', 'verify')).toBe(false);
  });
  it('only a superadmin acts on staff; nobody acts on superadmins or themselves', () => {
    expect(canActOn('subadmin', 'user')).toBe(true);
    expect(canActOn('subadmin', 'companion')).toBe(true);
    expect(canActOn('subadmin', 'subadmin')).toBe(false);
    expect(canActOn('superadmin', 'subadmin')).toBe(true);
    expect(canActOn('superadmin', 'superadmin')).toBe(false);
    expect(canActOn('superadmin', 'user', true)).toBe(false);
    expect(canActOn('user', 'user')).toBe(false);
  });
});

describe('admin booking state', () => {
  const base = { status: 'accepted' as const, paymentStatus: 'paid' as const, amountPaid: 699, refund: { status: 'none' as const, amount: 0 } };
  it('puts what needs a decision first', () => {
    expect(adminBookingState({ ...base, dispute: { status: 'open' }, refundReview: { needed: true } }).label).toBe('Dispute open');
    expect(adminBookingState({ ...base, status: 'cancelled', refundReview: { needed: true } }).label).toBe('Refund decision needed');
    expect(adminBookingState({ ...base, refund: { status: 'failed', amount: 699 } }).tone).toBe('danger');
    expect(adminBookingState({ ...base, refund: { status: 'processed', amount: 594 } }).label).toBe('Refunded ₹594');
    expect(adminBookingState(base).label).toBe('Confirmed');
    expect(adminBookingState({ ...base, status: 'pending', paymentStatus: 'pending', allocation: { state: 'awaiting_payment' } }).label).toBe('Awaiting payment');
    expect(adminBookingState({ ...base, status: 'pending', allocation: { state: 'offering' } }).label).toBe('Finding companion');
  });
  it('one refund per booking, only when paid', () => {
    expect(refundableAmount(base)).toBe(699);
    expect(refundableAmount({ ...base, refund: { status: 'failed', amount: 699 } })).toBe(699);
    expect(refundableAmount({ ...base, refund: { status: 'processed', amount: 100 } })).toBe(0);
    expect(refundableAmount({ ...base, paymentStatus: 'pending' })).toBe(0);
  });
  it('names people and actions plainly', () => {
    expect(personName({ _id: '1', fullName: 'Ayesha' })).toBe('Ayesha');
    expect(personName('abc', 'Member')).toBe('Member');
    expect(describeAction('booking.refund')).toBe('refunded a booking');
    expect(describeAction('something.new')).toBe('something.new');
  });
});

describe('price curve (same rule as the server)', () => {
  it('accepts the defaults', () => expect(priceCurveError({ ...DEFAULT_PACKAGE_PRICES })).toBeNull());
  it('longer must cost more', () => expect(priceCurveError({ ...DEFAULT_PACKAGE_PRICES, 3: 650 })).toMatch(/3 hours must cost more than 2 hours/));
  it('longer must cost less per hour', () => expect(priceCurveError({ ...DEFAULT_PACKAGE_PRICES, 2: 800 })).toMatch(/less per hour/));
  it('needs whole rupees', () => expect(priceCurveError({ ...DEFAULT_PACKAGE_PRICES, 5: 1599.5 })).toMatch(/whole rupee/));
});

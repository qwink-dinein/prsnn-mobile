import { canUseCompanionMode, effectiveMode, modeForNotification, modeOfSide } from '@/domain/mode';

describe('booking and companion modes', () => {
  it('members only ever see booking mode', () => {
    expect(canUseCompanionMode('user')).toBe(false);
    expect(effectiveMode('user', 'companion')).toBe('booking');
    expect(effectiveMode(undefined, undefined)).toBe('booking');
  });

  it('companions start in companion mode and keep the mode they last chose', () => {
    expect(canUseCompanionMode('companion')).toBe(true);
    expect(effectiveMode('companion', undefined)).toBe('companion');
    expect(effectiveMode('companion', 'booking')).toBe('booking');
  });

  it('a booking I made lives in booking mode; one I was booked for in companion mode', () => {
    expect(modeOfSide('member')).toBe('booking');
    expect(modeOfSide('companion')).toBe('companion');
  });

  it('notifications open the mode they belong to', () => {
    expect(modeForNotification('booking_offer')).toBe('companion');
    expect(modeForNotification('booking_confirmed')).toBe('booking');
    expect(modeForNotification('refund')).toBe('booking');
    expect(modeForNotification('approval')).toBeNull();
  });
});

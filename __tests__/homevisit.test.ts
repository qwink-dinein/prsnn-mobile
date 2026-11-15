import { canHomeVisit, meetingPlaceError } from '@/domain/booking';

describe('home visits for a loved one', () => {
  it('are allowed only for Companion for a Loved One, booked for someone else', () => {
    expect(canHomeVisit('loved_one', true)).toBe(true);
    expect(canHomeVisit('loved_one', false)).toBe(false);
    expect(canHomeVisit('dont_go_alone', true)).toBe(false);
    expect(canHomeVisit(null, true)).toBe(false);
  });
  it('need a full address; public places need a short name', () => {
    expect(meetingPlaceError('Home', true)).toMatch(/full home address/);
    expect(meetingPlaceError('Flat 4B, Rose Apartments, Road 12', true)).toBeNull();
    expect(meetingPlaceError('CCD', false)).toBeNull();
    expect(meetingPlaceError('a', false)).toMatch(/public place/);
  });
});

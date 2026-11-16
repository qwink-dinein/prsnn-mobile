import { freeSlots } from '@/domain/booking';

describe('freeSlots (no double bookings)', () => {
  const slots = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'];

  it('hides every start that would overlap a booked hour', () => {
    // 12:00–13:00 is taken; a 1-hour session can't start 11:30, 12:00 or 12:30.
    expect(freeSlots(slots, [{ start: '12:00', duration: 60 }], 60)).toEqual(['10:00', '10:30', '11:00', '13:00', '13:30']);
  });

  it('lets sessions touch a booking without overlapping it', () => {
    const free = freeSlots(slots, [{ start: '12:00', duration: 60 }], 60);
    expect(free).toContain('11:00'); // ends 12:00
    expect(free).toContain('13:00'); // starts 13:00
  });

  it('accounts for the length being booked', () => {
    // A 2-hour session from 10:30 would run into 12:00.
    expect(freeSlots(slots, [{ start: '12:00', duration: 60 }], 120)).toEqual(['10:00', '13:00', '13:30']);
  });

  it('keeps everything when nothing is booked', () => {
    expect(freeSlots(slots, [], 60)).toEqual(slots);
  });
});

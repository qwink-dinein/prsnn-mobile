import { firstUnanswered } from '@/domain/setup';

describe('remembered sign-up step', () => {
  const steps = ['name', 'where', 'photo', 'visibility'] as const;
  it('reopens no further than the first unanswered question', () => {
    // The photo was picked but never uploaded (lost on restart): back to the photo step.
    expect(firstUnanswered(steps, { name: true, where: true, photo: false, visibility: true })).toBe(2);
  });
  it('allows the last step when everything is answered', () => {
    expect(firstUnanswered(steps, { name: true, where: true, photo: true, visibility: true })).toBe(3);
  });
  it('starts at the beginning when nothing is answered', () => {
    expect(firstUnanswered(steps, {})).toBe(0);
  });
});

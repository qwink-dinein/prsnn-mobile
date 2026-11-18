import { REPORT_REASONS, reportError } from '@/domain/safety';

describe('reporting someone', () => {
  it('has the six reasons the server accepts', () => {
    expect(REPORT_REASONS.map((r) => r.key)).toEqual(['inappropriate', 'harassment', 'fake_profile', 'not_allowed', 'safety', 'other']);
  });
  it('needs a reason, and details for "Something else"', () => {
    expect(reportError(null, '')).toBe('Choose a reason.');
    expect(reportError('other', '  ')).toBe('Tell us what happened.');
    expect(reportError('harassment', '')).toBeNull();
    expect(reportError('other', 'Kept asking for my number')).toBeNull();
  });
  it('limits details to 1000 characters', () => {
    expect(reportError('safety', 'x'.repeat(1001))).toMatch(/1000/);
  });
});

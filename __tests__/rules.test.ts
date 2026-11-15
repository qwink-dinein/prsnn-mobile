import { agreedAt, HOUSE_RULES, missingConsents, NOT_FOR, signInConsents } from '../src/domain/rules';

test('says plainly what prsnn is not', () => {
  const titles = NOT_FOR.map(([t]) => t);
  for (const t of ['Not a dating app', 'Not for errands or chores', 'Not therapy or counselling', 'Not an escort or adult service']) expect(titles).toContain(t);
  expect(HOUSE_RULES.map(([t]) => t)).toEqual(expect.arrayContaining(['Respect, always', 'No means no', 'Public places only']));
});

test('sign-in consents: WhatsApp only for phone sign-ups', () => {
  expect(signInConsents(false)).toContain('whatsapp_updates');
  expect(signInConsents(true)).not.toContain('whatsapp_updates');
  expect(signInConsents(true)).toEqual(expect.arrayContaining(['terms', 'privacy', 'age_18']));
});

test('latest agreement time and what is still missing', () => {
  const list = [
    { kind: 'house_rules' as const, version: '2026-01-01', acceptedAt: '2026-01-01T10:00:00Z' },
    { kind: 'house_rules' as const, version: '2026-11-16', acceptedAt: '2026-11-16T10:00:00Z' },
    { kind: 'terms' as const, version: '2026-11-16', acceptedAt: '2026-11-16T09:00:00Z' },
  ];
  expect(agreedAt(list, 'house_rules')).toBe('2026-11-16T10:00:00Z');
  expect(agreedAt(list, 'companion_terms')).toBeNull();
  expect(missingConsents(list, ['house_rules', 'companion_terms'])).toEqual(['companion_terms']);
  expect(missingConsents(undefined, ['house_rules'])).toEqual(['house_rules']);
});

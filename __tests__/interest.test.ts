import { signupDetails, topCategories, roleLabel } from '../src/domain/interest';

const base = { role: 'user' as const, categories: ['loved_one', 'explore'], seeGender: 'everyone' as const, visibility: 'locked' as const, city: 'Hyderabad', area: 'Gachibowli', setupDone: true };

test('member choices read as labels', () => {
  expect(signupDetails(base)).toEqual([
    ['Wants', 'Companion for a Loved One, Explore & Discover'],
    ['Meet', 'Everyone'],
    ['Photos', 'Locked until booked'],
    ['Where', 'Gachibowli, Hyderabad'],
  ]);
  expect(roleLabel('user')).toBe('Find company');
});

test('missing answers are left out, unfinished setup is flagged', () => {
  expect(signupDetails({ ...base, categories: [], seeGender: null, visibility: null, city: null, area: null, setupDone: false })).toEqual([['Setup', 'Not finished']]);
});

test('companions show what they offer and their review status, not who to meet', () => {
  const rows = signupDetails({ ...base, role: 'companion', approvalStatus: 'pending' });
  expect(rows[0][0]).toBe('Offers');
  expect(rows.find(([k]) => k === 'Meet')).toBeUndefined();
  expect(rows).toContainEqual(['Status', 'Waiting for review']);
});

test('top categories sort by count', () => {
  expect(topCategories({ explore: 2, loved_one: 5, x_unknown: 2 }).map((c) => c.key)).toEqual(['loved_one', 'explore', 'x_unknown']);
});

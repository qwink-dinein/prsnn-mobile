import { CATEGORIES } from './categories';

/** What a person chose when they signed up in the app, as short labels for the admin list. */
export interface SignupChoices {
  role: 'user' | 'companion';
  categories: string[];
  seeGender: 'woman' | 'man' | 'nonbinary' | 'everyone' | null;
  visibility: 'open' | 'locked' | null;
  city: string | null;
  area: string | null;
  setupDone: boolean;
  approvalStatus?: string | null;
}

const MEET: Record<string, string> = { woman: 'Women', man: 'Men', nonbinary: 'Non-binary people', everyone: 'Everyone' };
const APPROVAL: Record<string, string> = { draft: 'Sign-up not sent', pending: 'Waiting for review', approved: 'Approved', changes_requested: 'Changes asked', rejected: 'Rejected' };

export const categoryTitle = (key: string) => CATEGORIES.find((c) => c.key === key)?.title ?? key;

export function roleLabel(role: SignupChoices['role']): string {
  return role === 'companion' ? 'Companion' : 'Find company';
}

/** Rows of "label: value" for one sign-up, leaving out anything they haven't answered. */
export function signupDetails(s: SignupChoices): [string, string][] {
  const rows: [string, string][] = [];
  if (s.categories.length) rows.push([s.role === 'companion' ? 'Offers' : 'Wants', s.categories.map(categoryTitle).join(', ')]);
  if (s.role === 'user' && s.seeGender) rows.push(['Meet', MEET[s.seeGender] ?? s.seeGender]);
  if (s.visibility) rows.push(['Photos', s.visibility === 'locked' ? 'Locked until booked' : 'Open']);
  const place = [s.area, s.city].filter(Boolean).join(', ');
  if (place) rows.push(['Where', place]);
  if (s.role === 'companion' && s.approvalStatus) rows.push(['Status', APPROVAL[s.approvalStatus] ?? s.approvalStatus]);
  if (!s.setupDone) rows.push(['Setup', 'Not finished']);
  return rows;
}

/** Category keys sorted by how many members chose them, most first. */
export function topCategories(counts: Record<string, number>): { key: string; title: string; n: number }[] {
  return Object.entries(counts)
    .map(([key, n]) => ({ key, title: categoryTitle(key), n }))
    .sort((a, b) => b.n - a.n || a.title.localeCompare(b.title));
}

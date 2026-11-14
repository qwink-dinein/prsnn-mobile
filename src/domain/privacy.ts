import type { Gender, SeeGender, Visibility } from './types';

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'woman', label: 'Woman' },
  { value: 'man', label: 'Man' },
  { value: 'nonbinary', label: 'Non-binary' },
];

export const SEE_OPTIONS: { value: SeeGender; label: string }[] = [
  { value: 'woman', label: 'Women' },
  { value: 'man', label: 'Men' },
  { value: 'nonbinary', label: 'Non-binary people' },
  { value: 'everyone', label: 'Everyone' },
];

/** Owner's rule: men open by default; women (and non-binary people) locked by default. */
export const defaultVisibility = (g?: Gender | null): Visibility => (g === 'man' ? 'open' : 'locked');

export const VISIBILITY_COPY: Record<Visibility, { title: string; body: string }> = {
  open: { title: 'Open', body: 'Everyone' },
  locked: { title: 'Locked', body: 'Only people you’ve booked with' },
};

export const seeLabel = (s?: SeeGender | null) => SEE_OPTIONS.find((o) => o.value === s)?.label ?? 'Everyone';

/**
 * Has this person finished the gender / show-me / visibility step?
 * Companions aren't asked "show me" (they don't browse), so they only need
 * gender and visibility — otherwise every companion login looped back to setup.
 */
export const hasIdentity = (u?: { role?: string; gender?: Gender; seeGender?: SeeGender; profileVisibility?: Visibility } | null) =>
  // Staff work in the admin screens and aren't listed, so they skip these questions.
  ['admin', 'subadmin', 'superadmin'].includes(u?.role ?? '') || !!(u?.gender && u?.profileVisibility && (u.role === 'companion' || u.seeGender));

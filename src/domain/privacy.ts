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
  open: { title: 'Open', body: 'Everyone can see your photo and full name.' },
  locked: { title: 'Locked', body: 'People see a blurred placeholder with a lock and your first name. Your photo shows only to someone with a confirmed, paid booking with you.' },
};

export const seeLabel = (s?: SeeGender | null) => SEE_OPTIONS.find((o) => o.value === s)?.label ?? 'Everyone';

/** Has this person finished the gender / show-me / visibility step? */
export const hasIdentity = (u?: { gender?: Gender; seeGender?: SeeGender; profileVisibility?: Visibility } | null) => !!(u?.gender && u?.seeGender && u?.profileVisibility);

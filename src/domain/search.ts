import { offersCategory, type CategoryKey } from './categories';
import type { Companion } from './types';

export type Sort = 'recommended' | 'priceLow' | 'priceHigh';
export const SORTS: { key: Sort; label: string }[] = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'priceLow', label: 'Price: low to high' },
  { key: 'priceHigh', label: 'Price: high to low' },
];

export function filterCompanions(list: Companion[], text: string, category: CategoryKey | 'all', area: string | 'all', sort: Sort, city?: string | null): Companion[] {
  const t = text.trim().toLowerCase();
  const out = list.filter((c) => {
    if (city && (c.city ?? '').toLowerCase() !== city.toLowerCase()) return false;
    if (category !== 'all' && !offersCategory(c.categories, category)) return false;
    if (area !== 'all' && c.area !== area) return false;
    if (!t) return true;
    return [c.fullName, c.username, c.description, c.area, c.city, ...c.tags, ...(c.categories ?? [])].some((f) => f?.toLowerCase().includes(t));
  });
  if (sort === 'recommended') return photosFirst(out);
  if (sort === 'priceLow') out.sort((a, b) => (a.pricePerHour ?? 0) - (b.pricePerHour ?? 0));
  if (sort === 'priceHigh') out.sort((a, b) => (b.pricePerHour ?? 0) - (a.pricePerHour ?? 0));
  return out;
}

/** A photo members can see: not locked and uploaded. */
export const hasVisiblePhoto = (c: Pick<Companion, 'locked' | 'profilePhoto'>) => !c.locked && !!c.profilePhoto;

/**
 * Owner's rule (18 Nov): among equal matches, companions with a visible photo come first
 * ("Shown higher in search and on Home" in the photo nudge). Stable: keeps the order within each group.
 */
export function photosFirst<T extends Pick<Companion, 'locked' | 'profilePhoto'>>(list: T[]): T[] {
  return [...list.filter(hasVisiblePhoto), ...list.filter((c) => !hasVisiblePhoto(c))];
}

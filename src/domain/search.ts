import { matchesCategory, type CategoryKey } from './booking';
import type { Companion } from './types';

export type Sort = 'recommended' | 'priceLow' | 'priceHigh';
export const SORTS: { key: Sort; label: string }[] = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'priceLow', label: 'Price: low to high' },
  { key: 'priceHigh', label: 'Price: high to low' },
];

export function filterCompanions(list: Companion[], text: string, category: CategoryKey | 'all', area: string | 'all', sort: Sort): Companion[] {
  const t = text.trim().toLowerCase();
  const out = list.filter((c) => {
    if (category !== 'all' && !matchesCategory(c.tags, category)) return false;
    if (area !== 'all' && c.area !== area) return false;
    if (!t) return true;
    return [c.fullName, c.username, c.description, c.area, c.city, ...c.tags].some((f) => f?.toLowerCase().includes(t));
  });
  if (sort === 'priceLow') out.sort((a, b) => (a.pricePerHour ?? 0) - (b.pricePerHour ?? 0));
  if (sort === 'priceHigh') out.sort((a, b) => (b.pricePerHour ?? 0) - (a.pricePerHour ?? 0));
  return out;
}

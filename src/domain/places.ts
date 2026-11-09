import data from '@/data/india-cities.json';

/** State → cities, from the ODbL countries-states-cities database (see src/data). */
const STATES = (data as { states: Record<string, string[]> }).states;

export interface Place {
  city: string;
  state: string;
}

export const STATE_NAMES: string[] = Object.keys(STATES);

/** Every city once, with its state, sorted by name. */
export const ALL_PLACES: Place[] = Object.entries(STATES)
  .flatMap(([state, cities]) => cities.map((city) => ({ city, state })))
  .sort((a, b) => a.city.localeCompare(b.city));

/** Big cities first when the search box is empty (people mostly pick these). */
export const POPULAR = ['Hyderabad', 'Bengaluru', 'Mumbai', 'New Delhi', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Gurugram', 'Noida', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh', 'Visakhapatnam', 'Indore'];

const fold = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '');

/**
 * Search cities. Prefix matches first, then word starts, then anywhere; an
 * empty query returns the popular cities. `state` narrows to one state.
 */
export function searchPlaces(query: string, { state, limit = 60 }: { state?: string | null; limit?: number } = {}): Place[] {
  const pool = state ? ALL_PLACES.filter((p) => p.state === state) : ALL_PLACES;
  const q = fold(query.trim());
  if (!q) {
    if (state) return pool.slice(0, limit);
    return POPULAR.map((c) => ALL_PLACES.find((p) => p.city === c)).filter(Boolean).slice(0, limit) as Place[];
  }
  const scored: { p: Place; s: number }[] = [];
  for (const p of pool) {
    const name = fold(p.city);
    const s = name.startsWith(q) ? 0 : name.split(' ').some((w) => w.startsWith(q)) ? 1 : name.includes(q) ? 2 : fold(p.state).startsWith(q) ? 3 : -1;
    if (s >= 0) scored.push({ p, s });
  }
  return scored.sort((a, b) => a.s - b.s || a.p.city.localeCompare(b.p.city)).slice(0, limit).map((x) => x.p);
}

export const stateOf = (city?: string | null): string | undefined => (city ? ALL_PLACES.find((p) => p.city.toLowerCase() === city.toLowerCase())?.state : undefined);

export const cityCount = ALL_PLACES.length;

/**
 * The five categories (owner, 2026-11-10). Keys match the backend
 * (private.categories()). Copy is India-wide: no place names here — places only
 * appear in a city's "Popular in …" plans (city_plans, edited by staff).
 */
export type CategoryKey = 'new_in_town' | 'dont_go_alone' | 'explore' | 'loved_one' | 'work_study';

export interface Category {
  key: CategoryKey;
  title: string;
  /** One line under the title on cards. */
  line: string;
  /** Companion-side line: why they'd enjoy offering it. */
  companionLine: string;
  bullets: string[];
  /** Suggested booking length (hours) shown on the card and the category page. */
  hours: number;
  image: number;
}

export const CATEGORIES: Category[] = [
  {
    key: 'new_in_town',
    title: 'New in Town',
    line: 'Make your first days less lonely',
    companionLine: 'Help newcomers feel at home',
    bullets: ['Explore neighbourhoods', 'Find cafés and local spots', 'Discover weekend activities', 'Meet someone who knows the city'],
    hours: 4,
    image: require('../../assets/images/walks.jpg'),
  },
  {
    key: 'dont_go_alone',
    title: 'Don’t Go Alone',
    line: 'Good plans deserve good company',
    companionLine: 'Be the plus-one people hope for',
    bullets: ['Concerts and live music', 'Weddings and social events', 'Movies and dinners', 'Festivals and weekend outings'],
    hours: 4,
    image: require('../../assets/images/evening.jpg'),
  },
  {
    key: 'explore',
    title: 'Explore & Discover',
    line: 'Experience more of your city with a local',
    companionLine: 'Show off the city you know best',
    bullets: ['Food trucks and restaurants', 'Parks and outdoor activities', 'Local attractions', 'Shopping and neighbourhood walks'],
    hours: 6,
    image: require('../../assets/images/events.jpg'),
  },
  {
    key: 'loved_one',
    title: 'Companion for a Loved One',
    line: 'Because you can’t always be there',
    companionLine: 'Bring warmth to someone’s week',
    bullets: ['Coffee and social outings', 'Walks and recreation', 'Shopping trips', 'Non-medical social visits'],
    hours: 2,
    image: require('../../assets/images/park.jpg'),
  },
  {
    key: 'work_study',
    title: 'Work & Study Together',
    line: 'Make working alone feel less alone',
    companionLine: 'Focus together, get more done',
    bullets: ['Coffee-shop co-working', 'Study sessions', 'Accountability sessions', 'Focus meetups'],
    hours: 2,
    image: require('../../assets/images/study.jpg'),
  },
];

export const categoryOf = (key?: string | null) => CATEGORIES.find((c) => c.key === key) ?? null;
export const categoryTitle = (key?: string | null) => categoryOf(key)?.title ?? 'Booking';

/** Does a companion offer this category? Older profiles without categories match everything. */
export const offersCategory = (cats: string[] | undefined, key: CategoryKey | null | undefined) => !key || !cats?.length || cats.includes(key);

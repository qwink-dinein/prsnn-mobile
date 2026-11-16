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
  /** What people use it for (the same list as the website's category pages). */
  bullets: string[];
  /** The moment it fixes, as the card's headline (same words on the website). */
  pain: string;
  /** One-line promise under the headline. */
  promise: string;
  /** Suggested booking length (hours) shown on the card and the category page. */
  hours: number;
  /**
   * Where the faces are in the photo (CSS object-position style). Every card crops the photo to its own
   * shape; this keeps the faces in frame instead of the centre of the picture.
   */
  focus: { left: string; top: string };
  image: number;
}

export const CATEGORIES: Category[] = [
  {
    key: 'new_in_town',
    title: 'New in Town',
    line: 'Make your first days less lonely',
    companionLine: 'Help newcomers feel at home',
    bullets: ['A first walk around your new neighbourhood: where to eat, shop and get coffee', 'Finding cafés, gyms, parks and weekend spots that suit you', 'Help with the practical bits: markets, a SIM card, where to buy what', 'A Sunday out so the weekend doesn’t feel empty', 'Company for your first visits to the city’s famous places'],
    hours: 4,
    pain: 'New city. No one to call yet.',
    promise: 'Find a local to help you settle in.',
    image: require('../../assets/images/cat/new-in-town.jpg'),
    focus: { left: '50%', top: '18%' },
  },
  {
    key: 'dont_go_alone',
    title: 'Don’t Go Alone',
    line: 'Good plans deserve good company',
    companionLine: 'Be the plus-one people hope for',
    bullets: ['Concerts, stand-up and live music when your friends can’t make it', 'A wedding, reception or party where you’d rather not walk in alone', 'Movies, plays and dinners out', 'Festivals, exhibitions and weekend outings', 'Sports matches and screenings with someone who enjoys them too'],
    hours: 4,
    pain: 'Two tickets. One you.',
    promise: 'A trusted companion by your side.',
    image: require('../../assets/images/cat/dont-go-alone.jpg'),
    focus: { left: '50%', top: '24%' },
  },
  {
    key: 'explore',
    title: 'Explore & Discover',
    line: 'Experience more of your city with a local',
    companionLine: 'Show off the city you know best',
    bullets: ['Heritage walks: forts, old streets and the stories behind them', 'Food trails through markets and street-food lanes', 'Shopping streets and hidden local favourites', 'Museums, galleries and city tours at your pace', 'Trying something new: a lake walk, a sunrise trek, a pottery class'],
    hours: 6,
    pain: 'You live here. You’ve seen none of it.',
    promise: 'Go further with someone who knows the way.',
    image: require('../../assets/images/cat/explore.jpg'),
    focus: { left: '50%', top: '35%' },
  },
  {
    key: 'loved_one',
    title: 'Companion for a Loved One',
    line: 'Because you can’t always be there',
    companionLine: 'Bring warmth to someone’s week',
    bullets: ['A warm visit at home, if you ask for one: tea, talk and a little time together', 'A walk in the park or to their place of worship, at their pace', 'Company on errands, a shopping trip or a day out', 'Someone to go with them to a family function or event', 'Visits while you’re away for work or living abroad', 'Booked and paid by you from anywhere; they just enjoy the company'],
    hours: 2,
    pain: 'Mom’s alone today.',
    promise: 'Warm company for parents and grandparents.',
    image: require('../../assets/images/cat/loved-one.jpg'),
    focus: { left: '50%', top: '35%' },
  },
  {
    key: 'work_study',
    title: 'Work & Study Together',
    line: 'Make working alone feel less alone',
    companionLine: 'Focus together, get more done',
    bullets: ['Co-working at a café so the day doesn’t feel isolating', 'Focused study sessions at a library or quiet café', 'Exam prep with someone keeping you on track', 'Practising a language or a presentation out loud', 'A steady weekly session to build the habit'],
    hours: 2,
    pain: 'Day four of working alone.',
    promise: 'Get more done, together.',
    image: require('../../assets/images/cat/work-study.jpg'),
    focus: { left: '50%', top: '22%' },
  },
];

export const categoryOf = (key?: string | null) => CATEGORIES.find((c) => c.key === key) ?? null;
export const categoryTitle = (key?: string | null) => categoryOf(key)?.title ?? 'Booking';

/** Does a companion offer this category? Older profiles without categories match everything. */
export const offersCategory = (cats: string[] | undefined, key: CategoryKey | null | undefined) => !key || !cats?.length || cats.includes(key);

/** The group photo used for "Real people. Real connections." (website and app). */
export const COMMUNITY_IMAGE = require('../../assets/images/cat/community.jpg');
export const COMMUNITY_FOCUS = { left: '50%', top: '40%' };

/**
 * Runtime config from EXPO_PUBLIC_* variables (inlined at build time).
 * Defaults point at the live prsnn backend (Supabase) and website.
 */
const trim = (s: string) => s.replace(/\/+$/, '');

/**
 * Supabase project (Mumbai). The publishable key is meant to ship inside apps:
 * every table is behind row-level security and every write goes through
 * functions that check who is calling. Never put a secret / service-role key here.
 */
export const SUPABASE_URL = trim(process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mhovyhapzhxcmcuelbol.supabase.co');
export const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || 'sb_publishable_EjvwHde8WRvzboJF3JE6LQ_1L5FJdIT';

/** Run on built-in sample data (no network). Design review, screenshots, store previews. */
export const DEMO = process.env.EXPO_PUBLIC_DEMO === '1';

/** The public website (legal pages live there so the app and site always show the same text). */
export const SITE_URL = trim(process.env.EXPO_PUBLIC_SITE_URL || 'https://prsnn.com');
/** Optional support address, set at build time (kept out of the repo). Without it, Help opens the grievance page. */
const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL || '';

export const LINKS = {
  website: SITE_URL,
  terms: `${SITE_URL}/terms`,
  privacy: `${SITE_URL}/privacy`,
  refund: `${SITE_URL}/refunds`,
  conduct: `${SITE_URL}/guidelines`,
  companionTerms: `${SITE_URL}/companion-terms`,
  grievance: `${SITE_URL}/grievance`,
  childSafety: `${SITE_URL}/child-safety`,
  legal: `${SITE_URL}/legal`,
  support: SUPPORT_EMAIL ? `mailto:${SUPPORT_EMAIL}` : `${SITE_URL}/grievance`,
};

/**
 * Runtime config from EXPO_PUBLIC_* variables (inlined at build time).
 * Defaults point at the live prsnn backend on Render.
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

export const LINKS = {
  website: 'https://prsnn.com',
  terms: 'https://prsnn.com/terms-of-service',
  privacy: 'https://prsnn.com/privacy-policy',
  refund: 'https://prsnn.com/refund-policy',
  conduct: 'https://prsnn.com/code-of-conduct',
  support: 'mailto:support@prsnn.com',
};

/**
 * Runtime config from EXPO_PUBLIC_* variables (inlined at build time).
 * Defaults point at the live prsnn backend on Render.
 */
const trim = (s: string) => s.replace(/\/+$/, '');

export const API_URL = trim(process.env.EXPO_PUBLIC_API_URL || 'https://prssn-backend.onrender.com/api');
export const SOCKET_URL = trim(process.env.EXPO_PUBLIC_SOCKET_URL || API_URL.replace(/\/api$/, ''));
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

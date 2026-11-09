/**
 * prsnn design tokens.
 *
 * Colours are copied one-for-one from the web app's "2026 Presence palette"
 * (prsnn-frontend/app/globals.css → @theme). Keep the two in sync: if a value
 * changes on the web, change it here too. See design.md.
 */
export const colors = {
  // Core palette (web: --color-*)
  ink: '#0E110D',
  inkSoft: '#1C2218',
  mist: '#F3F1EB', // app background
  mistDeep: '#E8E5DC', // pressed / skeleton
  paper: '#FAF9F6', // cards, sheets
  white: '#FFFFFF',
  moss: '#2F4A34', // primary actions
  mossMid: '#3D5F42',
  mossSoft: '#D7E3D4', // selected chips, soft fills
  green50: '#F2F6F1',
  signal: '#C8F03C', // accent: online dot, highlights. Never as text on light bg.
  signalDeep: '#A8CC20',
  clay: '#C45C2A', // logo dot, favourites, warnings
  line: 'rgba(14,17,13,0.08)',
  lineStrong: 'rgba(14,17,13,0.16)',

  // Greys (web: --color-gray-*)
  gray200: '#D6D3C9',
  gray300: '#B8B4A8',
  gray400: '#8E8A7E',
  gray500: '#6A665C',
  gray600: '#4A473F',

  // Semantic
  text: '#0E110D',
  textMuted: '#6A665C', // 5.3:1 on mist
  textSubtle: '#8E8A7E', // captions only (≥ 14pt)
  onMoss: '#FAF9F6',
  danger: '#B3261E',
  dangerSoft: '#F9E3E1',
  warning: '#C45C2A',
  warningSoft: '#F6E4DA',
  success: '#2F4A34',
  successSoft: '#D7E3D4',
} as const;

export const space = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, pill: 999 } as const;

/** Soft shadows from the web (--shadow-neoblack / neogreen), tuned for native. */
export const shadow = {
  card: {
    shadowColor: '#0E110D',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  lifted: {
    shadowColor: '#2F4A34',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
} as const;

/** Minimum touch target (Apple HIG 44pt, Material 48dp → 48 satisfies both). */
export const HIT = 48;

/** Gutter used by every screen. */
export const GUTTER = 20;

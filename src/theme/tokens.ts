/**
 * prsnn design tokens.
 *
 * Approved palette (porcelain, midnight, champagne) and type (Urbanist, Outfit logo).
 * See design.md. The web app will be moved to the same palette.
 */
export const colors = {
  // Approved palette (2026-11-14): porcelain, midnight, champagne. See design.md.
  porcelain: '#F1F1F4', // app background
  midnight: '#181B34', // text, primary buttons, selected
  champagne: '#C9B68E', // logo dot, Popular, selected outline, buttons on photos
  champagneDeep: '#8E7646', // savings and accents as text on light backgrounds
  champagneMist: '#F6F1E6', // selected fills, tips
  steel: '#3A3F5C', // card material
  mistCard: '#E6E6EC', // card material, pressed, skeleton

  // Legacy names, re-pointed so every screen uses the new palette.
  ink: '#181B34',
  inkSoft: '#2A2E4A',
  mist: '#F1F1F4', // app background
  mistDeep: '#E6E6EC', // pressed / skeleton / segmented track
  paper: '#FFFFFF', // cards, sheets, inputs
  white: '#FFFFFF',
  moss: '#181B34', // primary actions (midnight)
  mossMid: '#2A2E4A',
  mossSoft: '#F6F1E6', // soft fills, icon wells (champagne mist)
  green50: '#F6F1E6', // selected / unread rows
  signal: '#C9B68E',
  signalDeep: '#8E7646',
  clay: '#8E7646', // warnings, hearts (deep champagne)
  line: 'rgba(24,27,52,0.08)',
  lineStrong: 'rgba(24,27,52,0.16)',

  gray200: '#D5D6DF',
  gray300: '#B8B9C6',
  gray400: '#8E90A3',
  gray500: '#6B6E85',
  gray600: '#4C4F66',

  text: '#181B34',
  textMuted: '#6B6E85', // 4.9:1 on porcelain
  textSubtle: '#8E90A3',
  onMoss: '#F1F1F4',
  danger: '#B3261E',
  dangerSoft: '#F9E3E1',
  warning: '#8E7646',
  warningSoft: '#F6F1E6',
  success: '#2E7D4F',
  successSoft: '#E3F1E8',
} as const;

export const space = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, pill: 999 } as const;

/** Soft shadows from the web (--shadow-neoblack / neogreen), tuned for native. */
export const shadow = {
  card: {
    shadowColor: '#181B34',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  lifted: {
    shadowColor: '#181B34',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
} as const;

/** Minimum touch target (Apple HIG 44pt, Material 48dp → 48 satisfies both). */
export const HIT = 48;

/** Widest a column of content gets (tablets, landscape, web); wider screens centre it. */
export const CONTENT_MAX = 680;

/** Gutter used by every screen. */
export const GUTTER = 20;

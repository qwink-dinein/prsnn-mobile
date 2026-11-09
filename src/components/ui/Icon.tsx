import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme/tokens';

/**
 * Inline stroke icon set on a 24×24 grid (no icon font to download, works
 * offline, renders the same on iOS, Android and web). Line weight 1.7 to match
 * the thin outline icons in the mock-ups.
 */
const PATHS = {
  home: 'M4 11l8-7 8 7v9h-5v-6h-6v6H4z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm9 2-4-4',
  calendar: 'M5 6h14v14H5zM5 10h14M9 4v4m6-4v4',
  message: 'M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm3 5h8m-8 3h5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zm4 4h4',
  chevronLeft: 'M15 5l-7 7 7 7',
  chevronRight: 'M9 5l7 7-7 7',
  chevronDown: 'M5 9l7 7 7-7',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5 10 17l9-10',
  mapPin: 'M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z',
  coffee: 'M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9zm11 1h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3m3-3v3m3-3v3',
  walk: 'M13 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM9 21l2-6 3 3v3M8 11l2-4h4l2 4 2 1M10 7l-1 5',
  ticket: 'M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V7zm10 0v10',
  book: 'M5 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5V4zm14 0h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6V4z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z',
  shield: 'M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3z',
  shieldCheck: 'M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3zM9 12l2 2 4-4',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 9.5a1 1 0 1 0 0-.01',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13v5l3 2',
  wallet: 'M4 7h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4V7zm0 0V6a1 1 0 0 1 1-1h11M16 13h.01',
  card: 'M3 6h18v12H3zM3 10h18M7 15h3',
  bank: 'M3 10 12 4l9 6M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18',
  upi: 'M8 4 5 20m6-16-3 16M15 6l5 6-5 6',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2.2-1.3L14.3 3h-4l-.4 2.4a7.5 7.5 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2.2 1.3l.4 2.4h4l.4-2.4a7.5 7.5 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.3z',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm-2.5-11.5a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 4m0 2.7v.1',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-10v6m0-9v.1',
  bookmark: 'M7 4h10v16l-5-4-5 4V4z',
  send: 'M4 12 20 4l-6 16-3-7-7-1z',
  dots: 'M6 12h.01M12 12h.01M18 12h.01',
  sliders: 'M4 7h10m4 0h2M4 17h4m4 0h8M14 5v4M8 15v4',
  arrowRight: 'M5 12h14m-5-5 5 5-5 5',
  rupee: 'M7 5h10M7 9h10M7 5h3a4 4 0 0 1 0 8H7l7 7',
  chart: 'M4 20V10m6 10V4m6 16v-7m4 7H3',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4',
  idCard: 'M3 6h18v12H3zM8 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-3 3a3 3 0 0 1 6 0M14 10h4m-4 3h3',
  trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
  badgeCheck: 'M12 3l2.2 1.6 2.7-.1.8 2.6 2.2 1.6-.9 2.6.9 2.6-2.2 1.6-.8 2.6-2.7-.1L12 21l-2.2-1.6-2.7.1-.8-2.6-2.2-1.6.9-2.6-.9-2.6 2.2-1.6.8-2.6 2.7.1L12 3zM8.5 12l2.5 2.5 4.5-5',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0 0-6m2 15a5 5 0 0 0-3-4.6',
  backspace: 'M9 5h11v14H9l-6-7 6-7zm3 4 5 6m0-6-5 6',
  doc: 'M6 3h8l4 4v14H6V3zm8 0v4h4M9 12h6m-6 4h6',
  flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
} as const;

export type IconName = keyof typeof PATHS;

const FILLED: Partial<Record<IconName, true>> = {};

type Props = { name: IconName; size?: number; color?: string; filled?: boolean; strokeWidth?: number };

export const Icon = memo(function Icon({ name, size = 22, color = colors.ink, filled, strokeWidth = 1.7 }: Props) {
  const fill = filled || FILLED[name] ? color : 'none';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path
        d={PATHS[name]}
        stroke={color}
        strokeWidth={name === 'dots' ? 3 : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
    </Svg>
  );
});

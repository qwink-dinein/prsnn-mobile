/**
 * Typography: Lora (serif) for display headings, matching the app mock-ups
 * ("Life is better with good company."), and DM Sans for everything people
 * read and tap — the same body face as the website (next/font DM_Sans).
 * Subpath imports keep unused weights out of the bundle.
 */
export const fontAssets = {
  'Lora-Medium': require('@expo-google-fonts/lora/500Medium/Lora_500Medium.ttf'),
  'Lora-SemiBold': require('@expo-google-fonts/lora/600SemiBold/Lora_600SemiBold.ttf'),
  'DMSans-Regular': require('@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf'),
  'DMSans-Medium': require('@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf'),
  'DMSans-SemiBold': require('@expo-google-fonts/dm-sans/600SemiBold/DMSans_600SemiBold.ttf'),
  'DMSans-Bold': require('@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf'),
};

export const fonts = {
  display: 'Lora-SemiBold',
  displayMedium: 'Lora-Medium',
  body: 'DMSans-Regular',
  medium: 'DMSans-Medium',
  semibold: 'DMSans-SemiBold',
  bold: 'DMSans-Bold',
} as const;

/**
 * Text styles (iOS-style names). Sizes are the default (Large) Dynamic Type
 * sizes; RN scales them with the person's text-size setting because
 * allowFontScaling stays on (capped in <Text> so layouts survive).
 */
export const type = {
  largeTitle: { fontFamily: fonts.display, fontSize: 32, lineHeight: 38, letterSpacing: -0.6 },
  title1: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32, letterSpacing: -0.4 },
  title2: { fontFamily: fonts.display, fontSize: 21, lineHeight: 27, letterSpacing: -0.2 },
  title3: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24 },
  headline: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23 },
  callout: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21 },
  subhead: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 19 },
  footnote: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 20 },
} as const;

export type TextVariant = keyof typeof type;

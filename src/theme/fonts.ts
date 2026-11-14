/**
 * Typography (approved 2026-11-14): Urbanist for titles and text, Outfit Bold
 * for the "prsnn." logo and big numbers. Subpath imports keep unused weights out.
 */
export const fontAssets = {
  'Urbanist-Regular': require('@expo-google-fonts/urbanist/400Regular/Urbanist_400Regular.ttf'),
  'Urbanist-Medium': require('@expo-google-fonts/urbanist/500Medium/Urbanist_500Medium.ttf'),
  'Urbanist-SemiBold': require('@expo-google-fonts/urbanist/600SemiBold/Urbanist_600SemiBold.ttf'),
  'Urbanist-Bold': require('@expo-google-fonts/urbanist/700Bold/Urbanist_700Bold.ttf'),
  'Outfit-Bold': require('@expo-google-fonts/outfit/700Bold/Outfit_700Bold.ttf'),
};

export const fonts = {
  display: 'Urbanist-SemiBold',
  displayMedium: 'Urbanist-Medium',
  brand: 'Outfit-Bold', // logo and big numbers (prices, times)
  number: 'Outfit-Bold',
  body: 'Urbanist-Regular',
  medium: 'Urbanist-Medium',
  semibold: 'Urbanist-SemiBold',
  bold: 'Urbanist-Bold',
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

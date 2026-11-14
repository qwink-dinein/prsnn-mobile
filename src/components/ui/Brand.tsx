import { Text as RNText, View, type TextStyle, type StyleProp } from 'react-native';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

/** The brand word: "prsnn" in Outfit Bold followed by a round champagne dot (design.md). */
export const BRAND_WORD = 'prsnn';

/** Is this ink colour light (so we're on a dark background)? */
const isLight = (c: string) => /^#?(f|e|d)/i.test(c.replace('#', '')) || c === colors.onMoss || c === colors.white;
/** Champagne on dark backgrounds and photos; deep champagne on light ones (readable). */
export const dotColorFor = (ink: string) => (isLight(ink) ? colors.champagne : colors.champagneDeep);

/**
 * Inline brand mark inside running text: <Text>Verified by <Brand /></Text>.
 * Inherits the surrounding size and colour.
 */
export function Brand({ style }: { style?: StyleProp<TextStyle> }) {
  return (
    <RNText style={[{ fontFamily: fonts.brand, fontStyle: 'normal', letterSpacing: -0.3 }, style]} accessibilityLabel={BRAND_WORD}>
      {BRAND_WORD}
      <RNText style={{ color: colors.champagneDeep }}>.</RNText>
    </RNText>
  );
}

/** Large wordmark (splash, login, home header): "prsnn" + a round dot 0.2 × the font size. */
export function Wordmark({ size = 28, color = colors.ink, dotColor }: { size?: number; color?: string; dotColor?: string }) {
  const d = Math.max(4, Math.round(size * 0.2));
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={BRAND_WORD} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <RNText
        maxFontSizeMultiplier={1.3}
        style={{ fontFamily: fonts.brand, fontSize: size, lineHeight: Math.round(size * 1.15), color, letterSpacing: -size * 0.045, includeFontPadding: false }}
      >
        {BRAND_WORD}
      </RNText>
      <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: dotColor ?? dotColorFor(color), marginLeft: Math.round(size * 0.05), marginBottom: Math.round(size * 0.2) }} />
    </View>
  );
}

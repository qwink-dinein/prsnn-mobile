import { Text as RNText, type TextStyle, type StyleProp } from 'react-native';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

/** The brand word, always the same way: italic serif "prsnn" + a clay full stop. */
export const BRAND_WORD = 'prsnn';

/**
 * Inline brand mark inside running text: <Text>Verified by <Brand /></Text>.
 * Inherits the surrounding size; only the face and the clay dot change.
 */
export function Brand({ style }: { style?: StyleProp<TextStyle> }) {
  return (
    <RNText style={[{ fontFamily: fonts.brand, fontStyle: 'normal' }, style]} accessibilityLabel={BRAND_WORD}>
      {BRAND_WORD}
      <RNText style={{ color: colors.clay }}>.</RNText>
    </RNText>
  );
}

/** Large wordmark (splash, login, home header). */
export function Wordmark({ size = 28, color = colors.ink, dotStyle }: { size?: number; color?: string; dotStyle?: StyleProp<TextStyle> }) {
  return (
    <RNText
      accessibilityRole="header"
      accessibilityLabel={BRAND_WORD}
      maxFontSizeMultiplier={1.3}
      style={{ fontFamily: fonts.brand, fontSize: size, lineHeight: Math.round(size * 1.25), color, letterSpacing: -size * 0.02 }}
    >
      {BRAND_WORD}
      <RNText style={[{ color: colors.clay }, dotStyle]}>.</RNText>
    </RNText>
  );
}

import { Text as RNText, type TextProps } from 'react-native';
import { colors } from '@/theme/tokens';
import { type, type TextVariant } from '@/theme/fonts';

type Props = TextProps & {
  variant?: TextVariant;
  color?: string;
  center?: boolean;
  muted?: boolean;
};

/** All app text goes through here so Dynamic Type and fonts stay consistent. */
export function Text({ variant = 'body', color, center, muted, style, maxFontSizeMultiplier, ...rest }: Props) {
  const isDisplay = variant === 'largeTitle' || variant === 'title1';
  return (
    <RNText
      {...rest}
      // Grows with the person's text size; display titles are capped so they don't wrap into a wall.
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? (isDisplay ? 1.4 : 2)}
      style={[
        type[variant],
        { color: color ?? (muted ? colors.textMuted : colors.text) },
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}

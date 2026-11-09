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
      // Grows with the person's text size, up to a point the layouts hold (cards,
      // price grids, the PIN pad). At 2× phones with large system fonts broke them.
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? (isDisplay ? 1.2 : 1.35)}
      style={[
        type[variant],
        { color: color ?? (muted ? colors.textMuted : colors.text) },
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}

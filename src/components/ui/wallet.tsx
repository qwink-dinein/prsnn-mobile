import { memo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, radius } from '@/theme/tokens';

/**
 * The approved "Wallet" card materials (design.md): cards look like premium membership cards
 * with fine engraved lines. Used by the Home categories and the price cards.
 */
export type Material = 'midnight' | 'champagne' | 'pearl' | 'steel' | 'mist';

export const MATERIALS: Record<Material, { bg: string; fg: string; accent: string; line: string; dark: boolean }> = {
  midnight: { bg: colors.midnight, fg: colors.porcelain, accent: colors.champagne, line: 'rgba(201,182,142,0.22)', dark: true },
  champagne: { bg: colors.champagne, fg: colors.midnight, accent: colors.midnight, line: 'rgba(24,27,52,0.10)', dark: false },
  pearl: { bg: colors.white, fg: colors.midnight, accent: colors.champagneDeep, line: 'rgba(142,118,70,0.16)', dark: false },
  steel: { bg: colors.steel, fg: colors.porcelain, accent: colors.champagne, line: 'rgba(241,241,244,0.12)', dark: true },
  mist: { bg: colors.mistCard, fg: colors.midnight, accent: colors.champagneDeep, line: 'rgba(24,27,52,0.08)', dark: false },
};

/** Fine banknote-style wave lines and rings, drawn behind the card content. */
export const Guilloche = memo(function Guilloche({ stroke }: { stroke: string }) {
  const w = 300;
  const h = 190;
  const waves = [];
  for (let y = -10; y < h + 30; y += 9) {
    waves.push(<Path key={`w${y}`} d={`M-20,${y} C${w * 0.25},${y - 26} ${w * 0.5},${y + 26} ${w * 0.75},${y} S${w + 40},${y - 26} ${w + 40},${y}`} fill="none" stroke={stroke} strokeWidth={0.7} />);
  }
  const rings = [];
  for (let r = 18; r < 120; r += 12) rings.push(<Circle key={`r${r}`} cx={w * 0.86} cy={h * 0.2} r={r} fill="none" stroke={stroke} strokeWidth={0.7} />);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <Svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
        {waves}
        {rings}
      </Svg>
    </View>
  );
});

/** A card in a material: rounded, engraved, softly lifted. */
export function MaterialCard({ material, children, style, lifted }: { material: Material; children: ReactNode; style?: StyleProp<ViewStyle>; lifted?: boolean }) {
  const m = MATERIALS[material];
  return (
    <View style={[styles.card, { backgroundColor: m.bg }, material === 'pearl' && styles.pearl, lifted ? styles.lifted : styles.tab, style]}>
      <Guilloche stroke={m.line} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xxl - 4, overflow: 'hidden' },
  // White needs an outline on the porcelain background to read as a card.
  pearl: { borderWidth: 1, borderColor: colors.line },
  lifted: { shadowColor: colors.midnight, shadowOpacity: 0.28, shadowRadius: 18, shadowOffset: { width: 0, height: 18 }, elevation: 8 },
  tab: { shadowColor: colors.midnight, shadowOpacity: 0.1, shadowRadius: 7, shadowOffset: { width: 0, height: -4 }, elevation: 2 },
});

import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, radius, space } from '@/theme/tokens';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { PressScale } from './ui/motion';
import { CATEGORIES, type Category, type CategoryKey } from '@/domain/categories';
import { formatINR } from '@/domain/booking';
import { priceFor } from '@/domain/pricing';

/**
 * Category cards: photo on top, words on a paper panel below (never text over
 * a photo, so it's always readable). Multi-select with a check, or tap-through.
 */
export function CategoryTiles({
  selected,
  onToggle,
  audience = 'member',
  keys,
}: {
  selected: string[];
  onToggle: (k: CategoryKey) => void;
  audience?: 'member' | 'companion';
  keys?: CategoryKey[];
}) {
  const list = keys ? CATEGORIES.filter((c) => keys.includes(c.key)) : CATEGORIES;
  return (
    <View style={styles.grid} accessibilityRole="list">
      {list.map((c, i) => (
        <CategoryCard key={c.key} c={c} on={selected.includes(c.key)} onPress={() => onToggle(c.key)} audience={audience} wide={list.length % 2 === 1 && i === 0} selectable />
      ))}
    </View>
  );
}

export function CategoryCard({ c, on, onPress, audience = 'member', wide, selectable, showPrice }: { c: Category; on?: boolean; onPress: () => void; audience?: 'member' | 'companion'; wide?: boolean; selectable?: boolean; showPrice?: boolean }) {
  const line = audience === 'companion' ? c.companionLine : c.line;
  return (
    <PressScale
      accessibilityRole={selectable ? 'checkbox' : 'button'}
      accessibilityState={selectable ? { checked: !!on } : undefined}
      accessibilityLabel={`${c.title}. ${line}${showPrice ? `. From ${formatINR(priceFor(c.hours) ?? 0)} for ${c.hours} hours` : ''}`}
      onPress={onPress}
      scaleTo={0.97}
      style={wide ? styles.wide : styles.cell}
      innerStyle={[styles.card, on && styles.cardOn]}
    >
      <View>
        <Image source={c.image} style={[styles.photo, wide && { height: 120 }]} contentFit="cover" transition={200} accessibilityIgnoresInvertColors />
        {showPrice ? (
          <View style={styles.price}>
            <Text variant="caption" color={colors.moss} style={{ fontWeight: '700' }}>
              {c.hours} hrs · {formatINR(priceFor(c.hours) ?? 0)}
            </Text>
          </View>
        ) : null}
        {selectable ? (
          <View style={[styles.tick, on && styles.tickOn]}>{on ? <Icon name="check" size={14} color={colors.onMoss} strokeWidth={3} /> : null}</View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text variant="headline" numberOfLines={2}>
          {c.title}
        </Text>
        <Text variant="footnote" muted numberOfLines={2}>
          {line}
        </Text>
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  cell: { width: '48.5%', flexGrow: 1 },
  wide: { width: '100%' },
  card: { borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 2, borderColor: colors.line, overflow: 'hidden' },
  cardOn: { borderColor: colors.moss, backgroundColor: colors.green50 },
  photo: { width: '100%', height: 96, backgroundColor: colors.mistDeep },
  body: { padding: space.md, gap: 2, minHeight: 76 },
  tick: { position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.paper, backgroundColor: 'rgba(14,17,13,0.35)', alignItems: 'center', justifyContent: 'center' },
  tickOn: { backgroundColor: colors.moss, borderColor: colors.paper },
  price: { position: 'absolute', left: 8, top: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: colors.paper },
});

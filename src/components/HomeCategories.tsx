import { useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { router } from 'expo-router';
import { colors, GUTTER, space } from '@/theme/tokens';
import { useAppWidth } from '@/lib/layout';
import { CATEGORIES } from '@/domain/categories';
import { PhotoCard } from './PhotoCard';

/**
 * Home categories: the approved photo cards in a swipeable row, the next card peeking so it's
 * obvious there's more, with page dots. Tapping a card opens that category.
 */
export function HomeCategories() {
  const { width } = useAppWidth();
  const cardW = Math.min(Math.round(width - GUTTER * 2 - 56), 320);
  const cardH = Math.round(cardW * 1.52);
  const step = cardW + space.md;
  const [page, setPage] = useState(0);
  const list = useRef<FlatList>(null);
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => setPage(Math.max(0, Math.min(CATEGORIES.length - 1, Math.round(e.nativeEvent.contentOffset.x / step)))),
    [step],
  );
  return (
    <View>
      <FlatList
        ref={list}
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c.key}
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: GUTTER, gap: space.md, paddingBottom: space.lg, paddingTop: space.xs }}
        onScroll={onScroll}
        scrollEventThrottle={32}
        accessibilityRole="list"
        renderItem={({ item }) => <PhotoCard c={item} width={cardW} height={cardH} onPress={() => router.push(`/category/${item.key}`)} />}
      />
      <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {CATEGORIES.map((c, i) => (
          <View key={c.key} style={[styles.dot, i === page && styles.dotOn]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gray300 },
  dotOn: { width: 18, backgroundColor: colors.midnight },
});

import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { Extrapolation, interpolate, interpolateColor, runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useReducedMotion, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { colors, GUTTER, space } from '@/theme/tokens';
import { useAppWidth } from '@/lib/layout';
import { CATEGORIES, type Category } from '@/domain/categories';
import { PhotoCard } from './PhotoCard';

/**
 * Home categories: the approved photo cards in a swipeable row, the next card peeking so it's
 * obvious there's more. As you swipe, each photo drifts slower than its card (parallax) and the
 * page dot stretches with your finger. Tapping a card opens that category.
 */
export function HomeCategories() {
  const { width } = useAppWidth();
  const cardW = Math.min(Math.round(width - GUTTER * 2 - 56), 320);
  const cardH = Math.round(cardW * 1.52);
  const step = cardW + space.md;
  const scrollX = useSharedValue(0);
  const lastPage = useSharedValue(0);
  const [page, setPage] = useState(0);
  const onPage = useCallback((p: number) => setPage(p), []);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.set(e.contentOffset.x);
    const p = Math.max(0, Math.min(CATEGORIES.length - 1, Math.round(e.contentOffset.x / step)));
    if (p !== lastPage.get()) {
      lastPage.set(p);
      runOnJS(onPage)(p);
    }
  });
  return (
    <View>
      <Animated.FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c: Category) => c.key}
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: GUTTER, gap: space.md, paddingBottom: space.lg, paddingTop: space.xs }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        accessibilityRole="list"
        renderItem={({ item, index }: { item: Category; index: number }) => (
          <PhotoCard c={item} width={cardW} height={cardH} parallax={{ scrollX, index, step }} onPress={() => router.push(`/category/${item.key}`)} />
        )}
      />
      <View style={styles.dots} accessible accessibilityLabel={`Card ${page + 1} of ${CATEGORIES.length}`}>
        {CATEGORIES.map((c, i) => (
          <Dot key={c.key} i={i} scrollX={scrollX} step={step} />
        ))}
      </View>
    </View>
  );
}

/** A page dot that widens from 6 to 18pt as its card comes into place, following the finger. */
function Dot({ i, scrollX, step }: { i: number; scrollX: SharedValue<number>; step: number }) {
  const reduced = useReducedMotion();
  const style = useAnimatedStyle(() => {
    const k = interpolate(scrollX.get() / step, [i - 1, i, i + 1], [0, 1, 0], Extrapolation.CLAMP);
    const on = reduced ? (k > 0.5 ? 1 : 0) : k;
    return { width: 6 + 12 * on, backgroundColor: interpolateColor(on, [0, 1], [colors.gray300, colors.midnight]) };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { height: 6, borderRadius: 3 },
});

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition, useReducedMotion } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { PressScale } from './ui/motion';
import { Wordmark } from './ui/Brand';
import { MaterialCard, MATERIALS, type Material } from './ui/wallet';
import { CATEGORIES } from '@/domain/categories';
import { formatINR } from '@/domain/booking';
import { priceFor } from '@/domain/pricing';

const TAB_MATS: Material[] = ['midnight', 'pearl', 'steel', 'mist'];

/**
 * Home categories, approved Wallet "B · Lift to choose": the chosen category is a lifted photo
 * card with "Find company"; the others are engraved cards stacked under it. Tap one to lift it.
 */
export function HomeCategories() {
  const [sel, setSel] = useState(0);
  const reduced = useReducedMotion();
  const layout = reduced ? undefined : LinearTransition.duration(220);
  const big = CATEGORIES[sel];
  const others = CATEGORIES.filter((_, i) => i !== sel);
  const open = () => router.push(`/category/${big.key}`);
  const from = priceFor(big.hours);

  return (
    <View>
      <Animated.View layout={layout} key={`hero-${big.key}`}>
        <PressScale accessibilityRole="button" accessibilityLabel={`${big.title}. ${big.line}. Find company`} onPress={open} scaleTo={0.985} innerStyle={styles.hero}>
          <Image source={big.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          <LinearGradient colors={['rgba(24,27,52,0.05)', 'rgba(24,27,52,0.05)', 'rgba(24,27,52,0.92)']} locations={[0, 0.3, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.heroTop}>
            <Wordmark size={12} color={colors.porcelain} dotColor={colors.champagne} />
            <Text variant="caption" color={colors.porcelain} style={{ opacity: 0.85 }}>
              {sel + 1} of {CATEGORIES.length}
            </Text>
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.heroLine}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text variant="title2" color={colors.porcelain} numberOfLines={2}>
                  {big.title}
                </Text>
                <Text variant="footnote" color={colors.porcelain} style={{ opacity: 0.85, marginTop: 2 }} numberOfLines={2}>
                  {big.line}
                </Text>
              </View>
              {from ? (
                <Text variant="caption" color={colors.champagne} style={{ fontFamily: fonts.semibold, flexShrink: 0 }}>
                  from {formatINR(from)}
                </Text>
              ) : null}
            </View>
            <View style={styles.cta}>
              <Text variant="subhead" color={colors.midnight} style={{ fontFamily: fonts.semibold }}>
                Find company
              </Text>
              <Icon name="arrowRight" size={16} color={colors.midnight} />
            </View>
          </View>
        </PressScale>
      </Animated.View>

      {others.map((c, k) => {
        const mat = TAB_MATS[k % TAB_MATS.length];
        const m = MATERIALS[mat];
        return (
          <Animated.View layout={layout} key={c.key} style={{ marginTop: k === 0 ? space.md : -16, zIndex: k + 1 }}>
            <PressScale accessibilityRole="button" accessibilityLabel={`${c.title}. Show this category`} onPress={() => setSel(CATEGORIES.indexOf(c))} scaleTo={0.98}>
              <MaterialCard material={mat} style={styles.tab}>
                <View style={styles.tabRow}>
                  <Text variant="headline" color={m.fg} numberOfLines={1} style={{ flex: 1, minWidth: 0 }}>
                    {c.title}
                  </Text>
                  <Image source={c.image} style={[styles.thumb, { borderColor: m.accent }]} contentFit="cover" />
                </View>
              </MaterialCard>
            </PressScale>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 208,
    borderRadius: radius.xxl - 4,
    overflow: 'hidden',
    backgroundColor: colors.midnight,
    justifyContent: 'space-between',
    shadowColor: colors.midnight,
    shadowOpacity: 0.28,
    shadowRadius: 17,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingTop: 14 },
  heroBottom: { paddingHorizontal: space.lg, paddingBottom: 14, paddingTop: space.xxxl },
  heroLine: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm },
  cta: { marginTop: space.md - 2, minHeight: 42, borderRadius: 14, backgroundColor: colors.champagne, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  tab: { minHeight: 56, paddingHorizontal: space.lg, paddingTop: 10, paddingBottom: 14, borderRadius: radius.xl },
  tabRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  thumb: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, backgroundColor: colors.mistDeep },
});

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './ui/Text';
import { Icon, type IconName } from './ui/Icon';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useReducedMotion, type SharedValue } from 'react-native-reanimated';
import { PressScale } from './ui/motion';
import { formatINR } from '@/domain/booking';
import { priceFor } from '@/domain/pricing';
import type { Category, CategoryKey } from '@/domain/categories';

/** Category icons on the card pill (same as the website). */
const ICON: Record<CategoryKey, IconName> = {
  new_in_town: 'mapPin',
  dont_go_alone: 'ticket',
  explore: 'compass',
  loved_one: 'heart',
  work_study: 'book',
};
/** Night photos sit on a midnight card so the fade stays clean. */
const DARK: Partial<Record<CategoryKey, true>> = { dont_go_alone: true };

/**
 * The approved photo card (design canvas "Photo cards"): pill with the category, the pain line as
 * the headline, a one-line promise, the photo fading up into the card, and a round arrow in the
 * corner so it never covers a face. The website renders the same card from the same words.
 */
/** Swipe parallax: the photo moves 20% slower than its card in a carousel. */
type Parallax = { scrollX: SharedValue<number>; index: number; step: number };

export function PhotoCard({ c, width, height, onPress, showPrice = true, style, parallax }: { c: Category; width: number; height: number; onPress?: () => void; showPrice?: boolean; style?: StyleProp<ViewStyle>; parallax?: Parallax }) {
  const dark = !!DARK[c.key];
  const bg = dark ? colors.midnight : colors.paper;
  const fg = dark ? colors.porcelain : colors.midnight;
  const sub = dark ? '#C8CAD6' : colors.textMuted;
  const from = priceFor(c.hours);
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={`${c.title}. ${c.pain} ${c.promise}`}
      onPress={onPress}
      scaleTo={0.98}
      style={style}
      innerStyle={[styles.card, { width, height, backgroundColor: bg }]}
    >
      <LinearGradient colors={dark ? [colors.midnight, '#2A2E4A'] : [colors.champagneMist, colors.paper]} locations={[0, 0.46]} style={StyleSheet.absoluteFill} />
      {parallax ? (
        <ParallaxPhoto c={c} width={width} height={height * 0.6} p={parallax} />
      ) : (
        <Image source={c.image} style={[styles.photo, { height: height * 0.6 }]} contentFit="cover" contentPosition={c.focus} transition={200} accessibilityIgnoresInvertColors />
      )}
      <LinearGradient colors={dark ? ['#2A2E4A', 'rgba(42,46,74,0)'] : [colors.paper, 'rgba(255,255,255,0)']} style={[styles.fade, { top: height * 0.4, height: height * 0.2 }]} />
      <View style={styles.text}>
        <View style={[styles.pill, dark ? styles.pillDark : styles.pillLight]}>
          <Icon name={ICON[c.key]} size={14} color={dark ? colors.champagne : colors.champagneDeep} />
          <Text variant="caption" color={fg} style={{ fontFamily: fonts.semibold }} numberOfLines={1}>
            {c.title}
          </Text>
        </View>
        <Text style={[styles.h, { color: fg }]} numberOfLines={3}>
          {c.pain}
        </Text>
        <Text variant="footnote" color={sub} numberOfLines={2}>
          {c.promise}
          {showPrice && from ? ` From ${formatINR(from)}.` : ''}
        </Text>
      </View>
      <View style={[styles.go, { backgroundColor: dark ? colors.champagne : colors.midnight }]}>
        <Icon name="arrowRight" size={18} color={dark ? colors.midnight : colors.champagne} />
      </View>
    </PressScale>
  );
}

function ParallaxPhoto({ c, width, height, p }: { c: Category; width: number; height: number; p: Parallax }) {
  const reduced = useReducedMotion();
  const drift = width * 0.07;
  const anim = useAnimatedStyle(() => {
    if (reduced) return { transform: [{ translateX: 0 }] };
    const d = p.scrollX.get() - p.index * p.step;
    return { transform: [{ translateX: interpolate(d, [-p.step, p.step], [-drift, drift], Extrapolation.CLAMP) }] };
  });
  return (
    <Animated.View style={[styles.photo, { height, left: -drift, right: -drift, width: width + drift * 2 }, anim]}>
      <Image source={c.image} style={{ width: '100%', height: '100%' }} contentFit="cover" contentPosition={c.focus} transition={200} accessibilityIgnoresInvertColors />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xxl - 2,
    overflow: 'hidden',
    shadowColor: colors.midnight,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
  photo: { position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%' },
  fade: { position: 'absolute', left: 0, right: 0 },
  text: { position: 'absolute', top: 18, left: 18, right: 18, gap: space.sm },
  pill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingLeft: 9, paddingRight: 12, borderRadius: radius.pill, maxWidth: '100%' },
  pillLight: { backgroundColor: colors.paper, shadowColor: colors.midnight, shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  pillDark: { backgroundColor: 'rgba(241,241,244,0.14)' },
  h: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 27, letterSpacing: -0.6, marginTop: 2 },
  go: { position: 'absolute', right: 14, bottom: 14, width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 9, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
});

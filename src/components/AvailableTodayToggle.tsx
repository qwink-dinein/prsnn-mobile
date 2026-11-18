import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors, space } from '@/theme/tokens';
import { Text } from './ui/Text';

/**
 * The "Available today" switch at the top of Search. Off, it glows (champagne border, soft
 * shadow, pulsing dot) so people notice it; on, it turns midnight like a selected chip.
 * The pulse stops when the system asks for reduced motion.
 */
export function AvailableTodayToggle({ on, count, loading, onToggle }: { on: boolean; count: number; loading?: boolean; onToggle: () => void }) {
  const reduced = useReducedMotion();
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    pulse.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }), -1, false);
    return () => cancelAnimation(pulse);
  }, [reduced, pulse]);
  const ring = useAnimatedStyle(() => ({ opacity: 0.55 * (1 - pulse.value), transform: [{ scale: 1 + pulse.value * 1.4 }] }));

  const sub = loading ? 'Checking who’s free…' : count === 0 ? 'No one is free for the rest of today' : `${count} ${count === 1 ? 'companion' : 'companions'} free for the rest of today`;
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={`Available today. ${sub}`}
      onPress={onToggle}
      style={({ pressed }) => [styles.box, on ? styles.on : styles.off, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.dotWrap}>
        {reduced ? null : <Animated.View style={[styles.ring, ring]} />}
        <View style={styles.dot} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="headline" color={on ? colors.white : colors.midnight}>
          Available today
        </Text>
        <Text variant="footnote" color={on ? colors.gray200 : colors.gray600} numberOfLines={1}>
          {sub}
        </Text>
      </View>
      <View style={[styles.track, on && styles.trackOn]}>
        <View style={[styles.thumb, on && styles.thumbOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 60, paddingHorizontal: space.lg, paddingVertical: space.sm, borderRadius: 16, borderWidth: 2, borderColor: colors.champagne },
  off: { backgroundColor: colors.champagneMist, shadowColor: colors.champagne, shadowOpacity: 0.55, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  on: { backgroundColor: colors.midnight },
  dotWrap: { width: 14, height: 14, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: colors.champagne },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.champagneDeep },
  track: { width: 46, height: 28, borderRadius: 14, backgroundColor: colors.gray300, padding: 3, justifyContent: 'center' },
  trackOn: { backgroundColor: colors.champagne },
  thumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white },
  thumbOn: { alignSelf: 'flex-end' },
});

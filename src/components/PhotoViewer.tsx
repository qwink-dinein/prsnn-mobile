import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors, space } from '@/theme/tokens';
import { formatINR } from '@/domain/booking';
import { usePhotoViewer } from '@/lib/photoViewer';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { Button } from './ui/Button';
import { EASE_OUT } from './ui/motion';
import { firstName, fromPrice, placeOf } from './companions';

const OPEN_MS = 320;

/**
 * Tap a companion's photo: it grows out of where it was into a large round photo over a
 * dark backdrop (like a profile picture on Instagram). Swipe down, tap outside or the close
 * button to shrink it back. Mounted once at the app root; opened with openPhoto().
 */
export function PhotoViewerHost() {
  const target = usePhotoViewer((s) => s.target);
  const hide = usePhotoViewer((s) => s.hide);
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  const dy = useSharedValue(0);

  const S = Math.min(W - 64, 340);
  const tx = (W - S) / 2;
  const ty = Math.max(insets.top + 80, H * 0.42 - S / 2);
  const o = target?.origin ?? { x: tx + S * 0.1, y: ty + S * 0.1, width: S * 0.8, height: S * 0.8, radius: S * 0.4 };

  useEffect(() => {
    if (!target) return;
    dy.set(0);
    p.set(0);
    p.set(withTiming(1, { duration: reduced ? 0 : OPEN_MS, easing: EASE_OUT }));
  }, [target, reduced, p, dy]);

  const close = () => {
    p.set(
      withTiming(0, { duration: reduced ? 0 : 240, easing: EASE_OUT }, (done) => {
        if (done) runOnJS(hide)();
      }),
    );
  };

  const pan = Gesture.Pan()
    .activeOffsetY(10)
    .onUpdate((e) => {
      dy.set(Math.max(0, e.translationY));
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 900) {
        dy.set(withTiming(0, { duration: 200 }));
        p.set(
          withTiming(0, { duration: 220 }, (done) => {
            if (done) runOnJS(hide)();
          }),
        );
      } else dy.set(withSpring(0, { damping: 18, stiffness: 220 }));
    });

  const photo = useAnimatedStyle(() => ({
    left: interpolate(p.get(), [0, 1], [o.x, tx]),
    top: interpolate(p.get(), [0, 1], [o.y, ty]) + dy.get(),
    width: interpolate(p.get(), [0, 1], [o.width, S]),
    height: interpolate(p.get(), [0, 1], [o.height, S]),
    borderRadius: interpolate(p.get(), [0, 1], [o.radius, S / 2]),
    transform: [{ scale: 1 - Math.min(dy.get(), 300) / 1500 }],
  }));
  const backdrop = useAnimatedStyle(() => ({ opacity: p.get() * (1 - Math.min(dy.get(), 300) / 400) }));
  const details = useAnimatedStyle(() => ({ opacity: interpolate(p.get(), [0.6, 1], [0, 1], 'clamp') * (1 - Math.min(dy.get(), 200) / 200) }));

  if (!target) return null;
  const c = target.c;
  const go = (book: boolean) => {
    hide();
    router.push({ pathname: '/companion/[id]', params: book ? { id: c.id, book: '1' } : { id: c.id } });
  };

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={close}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={pan}>
          <View style={StyleSheet.absoluteFill}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdrop]}>
              <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close photo" />
            </Animated.View>

            <Animated.View style={[styles.photo, photo]} accessibilityViewIsModal>
              <Image source={{ uri: c.profilePhoto! }} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityLabel={`Photo of ${c.fullName ?? 'companion'}`} />
            </Animated.View>

            <Animated.View style={[styles.close, { top: insets.top + space.sm }, details]}>
              <Pressable onPress={close} accessibilityRole="button" accessibilityLabel="Close photo" hitSlop={8} style={styles.closeBtn}>
                <Icon name="close" size={20} color={colors.white} />
              </Pressable>
            </Animated.View>

            <Animated.View style={[styles.info, { top: ty + S + space.xl }, details]} pointerEvents="box-none">
              <View style={styles.nameRow}>
                <Text variant="title1" color={colors.white} numberOfLines={1} style={{ flexShrink: 1 }}>
                  {firstName(c.fullName)}
                </Text>
                {c.idVerified !== false ? <Icon name="shieldCheck" size={20} color={colors.champagne} /> : null}
              </View>
              <Text variant="callout" color={colors.gray200}>
                {[placeOf(c) || null, `from ${formatINR(fromPrice(c))}`].filter(Boolean).join(' · ')}
              </Text>
              {target.free ? (
                <View style={styles.free}>
                  <View style={styles.freeDot} />
                  <Text variant="caption" color={colors.champagne} style={{ fontFamily: 'Urbanist-Bold' }}>
                    Free today · {target.free}
                  </Text>
                </View>
              ) : null}
            </Animated.View>

            {target.actions ? (
              <Animated.View style={[styles.actions, { paddingBottom: insets.bottom + space.xl }, details]}>
                <View style={styles.buttons}>
                  <Button label="View profile" variant="secondary" onPress={() => go(false)} style={{ flex: 1 }} backgroundColor="transparent" textColor={colors.white} borderColor="rgba(255,255,255,0.4)" />
                  <Button label="Book" onPress={() => go(true)} style={{ flex: 1 }} backgroundColor={colors.champagne} textColor={colors.midnight} haptic />
                </View>
                <Text variant="caption" color={colors.gray300} center>
                  Swipe down or tap outside to close
                </Text>
              </Animated.View>
            ) : null}
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(24,27,52,0.94)' },
  photo: { position: 'absolute', overflow: 'hidden', borderWidth: 3, borderColor: colors.champagne, backgroundColor: colors.steel },
  close: { position: 'absolute', right: space.lg },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  info: { position: 'absolute', left: space.xl, right: space.xl, alignItems: 'center', gap: space.xs },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  free: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: space.xs, paddingHorizontal: space.md, height: 26, borderRadius: 13, backgroundColor: 'rgba(201,182,142,0.18)' },
  freeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.champagne },
  actions: { position: 'absolute', left: space.xl, right: space.xl, bottom: 0, gap: space.md },
  buttons: { flexDirection: 'row', gap: space.md },
});

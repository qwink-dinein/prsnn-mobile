import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useReducedMotion } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useSession } from '@/state/session';

const FILM = require('../../assets/video/welcome.mp4');
const POSTER = require('../../assets/images/welcome-poster.jpg');

/**
 * Screen 2 · Onboarding: value first, then one clear action. Behind it, the same film as the website:
 * two friends laughing over coffee, silent and looping (it never interrupts music the person is
 * playing), paused when the screen isn't showing, and a still frame with reduced motion.
 */
export default function Welcome() {
  const setPrefs = useSession((s) => s.setPrefs);
  const reduced = useReducedMotion();
  const player = useVideoPlayer(FILM, (p) => {
    p.loop = true;
    p.muted = true;
    p.audioMixingMode = 'mixWithOthers';
  });
  useFocusEffect(
    useCallback(() => {
      if (!reduced) player.play();
      return () => player.pause();
    }, [player, reduced]),
  );
  const start = () => {
    setPrefs({ seenOnboarding: true });
    router.push('/role');
  };
  return (
    <View style={styles.fill}>
      <StatusBar style="light" />
      {/* The film starts below the words (her face sits high in the frame), fading up into midnight. */}
      <View style={styles.film} pointerEvents="none">
        <Image source={POSTER} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" />
        {reduced ? null : (
          <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} allowsPictureInPicture={false} accessible={false} importantForAccessibility="no-hide-descendants" />
        )}
        <LinearGradient colors={[colors.midnight, 'rgba(24,27,52,0.35)', 'rgba(24,27,52,0)']} locations={[0, 0.16, 0.32]} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['rgba(24,27,52,0)', 'rgba(24,27,52,0.75)', colors.midnight]} locations={[0.55, 0.82, 1]} style={StyleSheet.absoluteFill} />
      </View>
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <View style={{ gap: space.md, marginTop: space.xxxl }}>
          <Text variant="largeTitle" color={colors.porcelain} style={{ fontSize: 36, lineHeight: 42 }}>
            Life is better{'\n'}with good company.
          </Text>
          <Text variant="body" color="rgba(241,241,244,0.86)" style={{ maxWidth: 300 }}>
            Find ID-checked companions near you for walks, coffee, events and more. Platonic company only: not dating, errands or therapy.
          </Text>
        </View>
        <View style={{ gap: space.sm }}>
          <Button label="Get started" iconRight="arrowRight" onPress={start} backgroundColor={colors.champagne} textColor={colors.midnight} />
          <Button label="I already have an account" variant="ghost" onPress={() => router.push('/login')} textColor={colors.porcelain} backgroundColor="rgba(241,241,244,0.1)" borderColor="rgba(241,241,244,0.35)" />
          {/* Straight into companion sign-up: the same choice as "Become a companion" on the next screen. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Want to earn as a companion? Apply"
            onPress={() => {
              setPrefs({ seenOnboarding: true, intendedRole: 'companion' });
              router.push('/login');
            }}
            hitSlop={8}
            style={styles.earnLink}
          >
            <Text variant="subhead" color="rgba(241,241,244,0.86)">
              Want to earn as a companion?{' '}
              <Text variant="subhead" color={colors.champagne} style={{ fontFamily: 'Urbanist-Bold' }}>
                Apply
              </Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  earnLink: { alignSelf: 'center', minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  fill: { flex: 1, backgroundColor: colors.midnight },
  film: { position: 'absolute', left: 0, right: 0, top: '22%', bottom: 0, overflow: 'hidden' },
  content: { flex: 1, justifyContent: 'space-between', paddingHorizontal: GUTTER, paddingBottom: space.lg },
});

import { useAppWidth } from '@/lib/layout';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadow, space } from '@/theme/tokens';
import { Logo } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { useSession } from '@/state/session';
import { goToLogin } from '@/lib/flow';

const PHOTOS = [require('../../assets/images/coffee.jpg'), require('../../assets/images/together.jpg'), require('../../assets/images/walks.jpg'), require('../../assets/images/study.jpg')];

/** Screen 1 · Splash: photo collage, wordmark, then on to onboarding. */
export default function Splash() {
  const token = useSession((s) => s.token);
  const { width } = useAppWidth();

  useEffect(() => {
    if (token) return;
    const t = setTimeout(() => void goToLogin('/welcome'), 1600);
    return () => clearTimeout(t);
  }, [token]);

  if (token) return <Redirect href="/home" />;

  const w = Math.min(width * 0.42, 190);
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.collageTop}>
        <Image source={PHOTOS[0]} style={[styles.photo, { width: w, height: w * 0.8, transform: [{ rotate: '-6deg' }] }]} contentFit="cover" />
        <Image source={PHOTOS[1]} style={[styles.photo, { width: w * 0.85, height: w * 1.05, transform: [{ rotate: '5deg' }], marginTop: space.xl }]} contentFit="cover" />
      </View>
      <View style={styles.center}>
        <Logo size={56} />
        <Text variant="callout" color={colors.gray600}>
          Good company, on your terms.
        </Text>
      </View>
      <View style={styles.collageBottom}>
        <Image source={PHOTOS[2]} style={[styles.photo, { width: w * 0.9, height: w * 0.75, transform: [{ rotate: '4deg' }] }]} contentFit="cover" />
        <Image source={PHOTOS[3]} style={[styles.photo, { width: w, height: w * 0.8, transform: [{ rotate: '-5deg' }], marginTop: space.lg }]} contentFit="cover" />
      </View>
      <Text variant="footnote" center style={styles.tagline} color={colors.gray500}>
        Real people. Real moments.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist, justifyContent: 'space-between', paddingVertical: space.lg },
  collageTop: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: space.lg },
  collageBottom: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: space.lg },
  photo: { borderRadius: radius.sm, borderWidth: 5, borderColor: colors.paper, ...shadow.card },
  center: { alignItems: 'center', gap: space.xs },
  tagline: { fontFamily: 'Lora-Medium', fontStyle: 'italic' },
});

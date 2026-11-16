import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, radius, space } from '@/theme/tokens';
import { Text } from './ui/Text';
import { PressScale } from './ui/motion';
import { COMMUNITY_FOCUS, COMMUNITY_IMAGE } from '@/domain/categories';

/**
 * "Real people. Real connections." (same photo and words as the website). The photo sits on top and
 * fades into midnight, with the words below it, so no face is ever under the text.
 */
export function CommunityBanner() {
  return (
    <PressScale accessibilityRole="button" accessibilityLabel="Real people. Real connections. Every companion is approved and ID-checked. Learn about becoming a companion" onPress={() => router.push('/fellow/apply')} innerStyle={styles.card}>
      <View style={styles.photoBox}>
        <Image source={COMMUNITY_IMAGE} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={COMMUNITY_FOCUS} accessibilityIgnoresInvertColors />
        <LinearGradient colors={['rgba(24,27,52,0)', colors.midnight]} locations={[0.55, 1]} style={StyleSheet.absoluteFill} />
      </View>
      <View style={styles.text}>
        <Text variant="title2" color={colors.porcelain}>
          Real people.{'\n'}Real connections.
        </Text>
        <Text variant="footnote" color="#C8CAD6">
          Every companion approved by our team and ID-checked. Book one, or become one and keep 80%.
        </Text>
        <View style={styles.cta}>
          <Text variant="subhead" color={colors.midnight} style={{ fontWeight: '600' }}>
            Become a companion
          </Text>
        </View>
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xxl - 2, overflow: 'hidden', backgroundColor: colors.midnight },
  photoBox: { width: '100%', aspectRatio: 1600 / 781 },
  text: { paddingHorizontal: space.lg, paddingBottom: space.lg, paddingTop: space.xs, gap: space.sm },
  cta: { alignSelf: 'flex-start', minHeight: 44, paddingHorizontal: space.lg, borderRadius: 14, backgroundColor: colors.champagne, justifyContent: 'center', marginTop: space.xs },
});

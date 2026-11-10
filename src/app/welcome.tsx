import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useSession } from '@/state/session';

/** Screen 2 · Onboarding: value first, then one clear action. */
export default function Welcome() {
  const setPrefs = useSession((s) => s.setPrefs);
  const start = () => {
    setPrefs({ seenOnboarding: true });
    router.push('/role');
  };
  return (
    <View style={styles.fill}>
      <Image source={require('../../assets/images/coffee.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" />
      <LinearGradient colors={[colors.mist, 'rgba(243,241,235,0.85)', 'rgba(243,241,235,0)']} locations={[0, 0.4, 0.62]} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(14,17,13,0)', 'rgba(14,17,13,0.55)']} locations={[0.65, 1]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <View style={{ gap: space.md, marginTop: space.xxxl }}>
          <Text variant="largeTitle" style={{ fontSize: 36, lineHeight: 42 }}>
            Life is better{'\n'}with good company.
          </Text>
          <Text variant="body" color={colors.gray600} style={{ maxWidth: 300 }}>
            Find ID-checked companions near you for walks, coffee, events and more.
          </Text>
        </View>
        <View style={{ gap: space.sm }}>
          <Button label="Get started" iconRight="arrowRight" onPress={start} />
          <Button label="I already have an account" variant="ghost" onPress={() => router.push('/login')} style={styles.ghost} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.mist },
  content: { flex: 1, justifyContent: 'space-between', paddingHorizontal: GUTTER, paddingBottom: space.lg },
  ghost: { backgroundColor: 'rgba(250,249,246,0.9)' },
});

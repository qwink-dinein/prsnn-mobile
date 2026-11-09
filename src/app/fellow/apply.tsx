import { useAppWidth } from '@/lib/layout';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

const PERKS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'users', title: 'Meet new people', body: 'Coffee, walks, events — the things you already enjoy.' },
  { icon: 'clock', title: 'Flexible schedule', body: 'Choose your days and hours. Accept only what suits you.' },
  { icon: 'shieldCheck', title: 'Safe and verified', body: 'Every member is ID-verified. Public places only. Numbers stay hidden.' },
  { icon: 'wallet', title: 'Competitive earnings', body: 'Set your own hourly rate. Paid securely through Razorpay.' },
];

/** Screen 17 · Become a companion. */
export default function Apply() {
  const { width } = useAppWidth();
  return (
    <Screen footer={<Button label="Apply now" iconRight="arrowRight" onPress={() => router.push('/fellow/onboarding')} />}>
      <Header />
      <Text variant="title1">Earn doing what you love</Text>
      <Text variant="callout" muted style={{ marginTop: space.xs }}>
        Be good company. Spend time with people who could use some, on your own terms.
      </Text>
      <Image source={require('../../../assets/images/together.jpg')} style={[styles.image, { height: Math.min(width * 0.55, 260) }]} contentFit="cover" />
      <View style={{ gap: space.lg }}>
        {PERKS.map((p) => (
          <View key={p.title} style={styles.perk}>
            <View style={styles.icon}>
              <Icon name={p.icon} size={20} color={colors.moss} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="headline">{p.title}</Text>
              <Text variant="footnote" muted>
                {p.body}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', borderRadius: radius.xl, marginVertical: space.xl, backgroundColor: colors.mistDeep },
  perk: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center' },
});

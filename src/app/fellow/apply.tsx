import { useAppWidth } from '@/lib/layout';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Card } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/domain/booking';
import { companionShareOf, POPULAR_HOURS, priceFor } from '@/domain/pricing';

const perks = (): { icon: IconName; title: string; body: string }[] => {
  const pay = companionShareOf(priceFor(POPULAR_HOURS) ?? 0);
  return [
    { icon: 'users', title: 'Meet new people', body: 'Coffee, walks, events: the things you already enjoy.' },
    { icon: 'clock', title: 'Your hours, your lengths', body: 'Choose your days, hours and booking lengths. Accept only what suits you.' },
    { icon: 'shieldCheck', title: 'Safe by design', body: 'Public places only, numbers hidden in chat, and a panic button in every session.' },
    { icon: 'wallet', title: 'Keep 80% of every booking', body: `One fair price list for everyone. A ${POPULAR_HOURS}-hour booking pays you ${formatINR(pay)}.` },
  ];
};

/** Screen 17 · Become a companion. */
export default function Apply() {
  const { width } = useAppWidth();
  const list = perks();
  return (
    <Screen footer={<Button label="Apply now" iconRight="arrowRight" onPress={() => router.push('/fellow/onboarding')} />}>
      <Header />
      <View style={[styles.hero, { height: Math.max(200, Math.min(width * 0.6, 280)) }]}>
        <Image source={require('../../../assets/images/evening.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={['rgba(24,27,52,0)', 'rgba(24,27,52,0.9)']} style={StyleSheet.absoluteFill} />
        <View style={styles.heroText}>
          <Text variant="title1" color={colors.porcelain} accessibilityRole="header">
            Earn doing what you love
          </Text>
          <Text variant="footnote" color={colors.porcelain} style={{ opacity: 0.9 }}>
            Be good company. Spend time with people who could use some, on your own terms.
          </Text>
        </View>
      </View>
      <Card style={{ paddingVertical: space.xs }}>
        {list.map((p, k) => (
          <View key={p.title} style={[styles.perk, k < list.length - 1 && styles.line]}>
            <View style={styles.icon}>
              <Icon name={p.icon} size={18} color={colors.champagneDeep} />
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text variant="headline">{p.title}</Text>
              <Text variant="footnote" muted>
                {p.body}
              </Text>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', borderRadius: radius.xl, overflow: 'hidden', marginTop: space.sm, marginBottom: space.xl, backgroundColor: colors.midnight, justifyContent: 'flex-end' },
  heroText: { padding: space.lg, gap: space.xs },
  perk: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start', paddingVertical: space.md },
  line: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.champagneMist, alignItems: 'center', justifyContent: 'center' },
});

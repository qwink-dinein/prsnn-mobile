import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { useSession } from '@/state/session';

type R = 'user' | 'companion';

const OPTIONS: { role: R; title: string; body: string; image: number }[] = [
  { role: 'user', title: 'Find a companion', body: 'Book ID-checked companions for walks, coffee, events and more.', image: require('../../assets/images/walks.jpg') },
  { role: 'companion', title: 'Become a companion', body: 'Spend time with people and earn on your own terms.', image: require('../../assets/images/together.jpg') },
];

/** Screen 3 · Choose role — tapping a card is the choice (no Continue button). */
export default function Role() {
  const initial = useSession((s) => s.prefs.intendedRole);
  const [role, setRole] = useState<R | undefined>(initial);
  const setPrefs = useSession((s) => s.setPrefs);
  return (
    <Screen>
      <Header />
      <Text variant="title1" style={{ marginTop: space.sm, marginBottom: space.xl }} accessibilityRole="header">
        I’m here as a…
      </Text>
      <View style={{ gap: space.lg }} accessibilityRole="radiogroup">
        {OPTIONS.map((o) => {
          const on = role === o.role;
          return (
            <Pressable
              key={o.role}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`${o.title}. ${o.body}`}
              onPress={() => {
                // One tap: remember the choice and go straight on.
                setRole(o.role);
                setPrefs({ intendedRole: o.role });
                router.push('/login');
              }}
              style={({ pressed }) => [styles.card, on && styles.cardOn, pressed && { opacity: 0.92 }]}
            >
              <Image source={o.image} style={styles.image} contentFit="cover" />
              <View style={styles.body}>
                <Text variant="title3">{o.title}</Text>
                <Text variant="footnote" muted>
                  {o.body}
                </Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>{on ? <Icon name="check" size={16} color={colors.onMoss} /> : <Icon name="chevronRight" size={16} color={colors.gray500} />}</View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paper, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1.5, borderColor: colors.line, minHeight: 140 },
  cardOn: { borderColor: colors.moss, backgroundColor: colors.green50 },
  image: { width: 116, alignSelf: 'stretch', backgroundColor: colors.mistDeep },
  body: { flex: 1, padding: space.lg, gap: space.xs },
  radio: { width: 32, height: 32, borderRadius: 16, marginRight: space.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mistDeep },
  radioOn: { backgroundColor: colors.moss },
});

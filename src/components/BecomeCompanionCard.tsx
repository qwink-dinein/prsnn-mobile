import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space } from '@/theme/tokens';
import { formatINR } from '@/domain/booking';
import { companionKeepFor } from '@/domain/pricing';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { Button } from './ui/Button';
import { PressScale } from './ui/motion';

/** The lengths shown; amounts come from today's prices × the companion share, so they never drift. */
export const EARN_HOURS = [1, 2, 4] as const;
const keepFor = companionKeepFor;

const STEPS = [
  { title: 'Tell us about you', body: 'A clear photo, what you enjoy, your area and the hours you’re free.' },
  { title: 'Check your ID', body: 'Aadhaar and a selfie. Only our team sees them.' },
  { title: 'We review your profile', body: 'You’ll get a notification when you’re approved.' },
  { title: 'Get booked', body: 'Members pay first; you accept the requests you want and earn after each session.' },
];

/**
 * Home (members): "Become a companion" with what they'd keep, opening a short how-it-works sheet
 * whose "Apply now" starts companion sign-up. Many members were phoning to ask how to apply.
 */
export function BecomeCompanionCard({ style }: { style?: object }) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const one = keepFor(1);
  return (
    <>
      <PressScale
        accessibilityRole="button"
        accessibilityLabel={`Become a companion. Keep 80% of every booking: ${formatINR(one)} for an hour. See how it works`}
        onPress={() => setOpen(true)}
        style={style}
        innerStyle={styles.card}
      >
        <Image source={require('../../assets/images/become-companion.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ left: '50%', top: '35%' }} accessibilityIgnoresInvertColors />
        <LinearGradient colors={['rgba(24,27,52,0.15)', 'rgba(24,27,52,0.9)']} locations={[0, 0.62]} style={StyleSheet.absoluteFill} />
        <View style={styles.cardText}>
          <View style={styles.label}>
            <Text variant="caption" color={colors.midnight} style={{ fontFamily: 'Urbanist-Bold', letterSpacing: 0.6 }}>
              EARN WITH PRSNN
            </Text>
          </View>
          <Text variant="title2" color={colors.white}>
            Become a companion
          </Text>
          <Text variant="footnote" color={colors.mistCard}>
            Meet people in your city, at public places. Keep 80% of every booking: {formatINR(one)} for an hour.
          </Text>
          <View style={styles.cardFoot}>
            <View style={styles.cta}>
              <Text variant="subhead" color={colors.midnight} style={{ fontFamily: 'Urbanist-Bold' }}>
                See how it works
              </Text>
              <Icon name="arrowRight" size={16} color={colors.midnight} />
            </View>
            <Text variant="caption" color={colors.gray200}>
              Takes 5 minutes
            </Text>
          </View>
        </View>
      </PressScale>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: space.xl + insets.bottom }]} accessibilityViewIsModal>
          <View style={styles.handle} />
          <ScrollView contentContainerStyle={{ gap: space.lg }} showsVerticalScrollIndicator={false}>
            <View style={{ gap: space.xs }}>
              <Text variant="title1" accessibilityRole="header">
                Become a companion
              </Text>
              <Text variant="callout" muted>
                Spend time with people who want company: a coffee, a walk, an event. Always in public places, never dating.
              </Text>
            </View>
            <View style={{ gap: space.xs }}>
              <View style={styles.earnRow}>
                {EARN_HOURS.map((h) => (
                  <View key={h} style={styles.earn}>
                    <Text variant="footnote" muted>
                      {h} {h === 1 ? 'hour' : 'hours'}
                    </Text>
                    <Text variant="title3">{formatINR(keepFor(h))}</Text>
                  </View>
                ))}
              </View>
              <Text variant="caption" muted>
                What you keep (80% of the price). You choose your days and hours.
              </Text>
            </View>
            <View style={{ gap: space.md }}>
              {STEPS.map((s, i) => (
                <View key={s.title} style={styles.step}>
                  <View style={styles.num}>
                    <Text variant="subhead" color={colors.white} style={{ fontFamily: 'Urbanist-Bold' }}>
                      {i + 1}
                    </Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                    <Text variant="headline">{s.title}</Text>
                    <Text variant="subhead" muted>
                      {s.body}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={{ gap: space.xs }}>
              <Button
                label="Apply now"
                iconRight="arrowRight"
                haptic
                onPress={() => {
                  setOpen(false);
                  router.push('/fellow/onboarding');
                }}
              />
              <Button label="Not now" variant="ghost" onPress={() => setOpen(false)} />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { height: 236, borderRadius: radius.xxl - 2, overflow: 'hidden', backgroundColor: colors.midnight },
  cardText: { position: 'absolute', left: space.lg, right: space.lg, bottom: space.lg, gap: space.sm },
  label: { alignSelf: 'flex-start', paddingHorizontal: space.sm, height: 24, borderRadius: 12, backgroundColor: colors.champagne, justifyContent: 'center' },
  cardFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  cta: { flexDirection: 'row', alignItems: 'center', gap: space.xs, minHeight: 44, paddingHorizontal: space.lg, borderRadius: 22, backgroundColor: colors.white },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(24,27,52,0.55)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '92%', backgroundColor: colors.paper, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: space.xl, paddingTop: space.md, gap: space.md },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.gray200 },
  earnRow: { flexDirection: 'row', gap: space.sm },
  earn: { flex: 1, padding: space.md, borderRadius: 14, backgroundColor: colors.champagneMist, gap: 2 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md },
  num: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.midnight, alignItems: 'center', justifyContent: 'center' },
});

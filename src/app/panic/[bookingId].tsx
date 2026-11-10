import { useCallback, useEffect, useState } from 'react';
import { Linking, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { PinPad } from '@/components/ui/forms';
import { Loading, ErrorState } from '@/components/ui/layout';
import { useConfirm } from '@/components/ui/confirm';
import { useShake } from '@/components/ui/motion';
import { whenOf } from '@/components/bookings';
import { companionOf, idOf, personOf } from '@/domain/booking';
import { svc, qk } from '@/services';
import { loginIdOf } from '@/services/backend';
import { checkLocalPin, hasLocalPin } from '@/lib/pin';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';

/**
 * While a panic alert is open. Shows that the team was told and when the next
 * alert goes, what was shared, Call 112, and "I'm safe — stop alerts" (PIN).
 */
export default function PanicScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const me = useSession((s) => s.user);
  const qc = useQueryClient();
  const confirm = useConfirm();
  const reduced = useReducedMotion();
  const q = useQuery({ queryKey: qk.booking(bookingId), queryFn: () => svc.booking(bookingId), refetchInterval: 15_000 });
  const [now, setNow] = useState(() => Date.now());
  const [pinOpen, setPinOpen] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const stop = useCallback(async () => {
    const alertId = q.data?.panic?.id;
    if (!alertId) return;
    setStopping(true);
    setError(null);
    try {
      await svc.resolvePanic(alertId, 'Stopped by the person who pressed it (PIN checked).');
      qc.invalidateQueries({ queryKey: qk.booking(bookingId) });
      setPinOpen(false);
      router.replace(`/booking/${bookingId}`);
    } catch (e) {
      setError(`${errorMessage(e)} The alert keeps going until it’s stopped.`);
    } finally {
      setStopping(false);
    }
  }, [q.data?.panic?.id, bookingId, qc]);

  const askToStop = async () => {
    if (await hasLocalPin(loginIdOf(me))) setPinOpen(true);
    else if (await confirm({ title: 'Stop the alerts?', message: 'Only do this if you’re safe. Our team will still check on the booking.', confirmLabel: 'I’m safe — stop', destructive: true })) void stop();
  };

  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />;
  const b = q.data;
  const p = b.panic;
  const isCompanion = idOf(b.companionId) === me?.id;
  const other = isCompanion ? personOf(b.requesterId) : companionOf(b);

  if (!p) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.mist }]}>
        <View style={{ flex: 1, justifyContent: 'center', padding: GUTTER, gap: space.md }}>
          <Text variant="title1" center>
            Alert closed
          </Text>
          <Text variant="callout" muted center>
            This safety alert has been stopped. If you still need help, call 112 or contact us from the booking.
          </Text>
          <Button label="Back to the booking" onPress={() => router.replace(`/booking/${bookingId}`)} />
          <Button label="Call 112" variant="ghost" onPress={() => Linking.openURL('tel:112')} />
        </View>
      </SafeAreaView>
    );
  }

  const next = Math.max(0, (p.lastSentAt ? new Date(p.lastSentAt).getTime() : now) + 5 * 60_000 - now);
  const mm = Math.floor(next / 60000);
  const ss = Math.floor((next % 60000) / 1000);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: GUTTER, gap: space.lg }}>
        <View style={styles.head}>
          <Animated.View style={[styles.badge, reduced ? null : { animationName: PULSE, animationDuration: 1400, animationIterationCount: 'infinite' }]}>
            <Text style={styles.sos}>SOS</Text>
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text variant="title1" color={colors.paper} accessibilityRole="header">
              Alert sent
            </Text>
            <Text variant="footnote" color={colors.paper} style={{ opacity: 0.9 }}>
              {new Date(p.raisedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} · our team has been told{p.mine ? '' : ` (raised by ${other?.fullName?.split(' ')[0] ?? 'the other person'})`}
            </Text>
          </View>
        </View>

        <View style={styles.panel} accessible accessibilityLabel={`Next alert in ${mm} minutes ${ss} seconds. Alerts sent: ${p.sends}.`}>
          <Text variant="footnote" color={colors.paper} style={{ opacity: 0.85 }}>
            Next alert in
          </Text>
          <Text style={styles.count}>
            {mm}:{String(ss).padStart(2, '0')}
          </Text>
          <Text variant="footnote" color={colors.paper} style={{ opacity: 0.85 }}>
            Sent {p.sends} {p.sends === 1 ? 'time' : 'times'}. Repeats every 5 minutes until {p.mine ? 'you or our team stop it' : 'our team stops it'}.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text variant="headline" color={colors.paper}>
            Shared with every prsnn admin
          </Text>
          {[
            'Both names and mobile numbers',
            whenOf(b),
            b.meetingPlace ? `Meeting place: ${b.meetingPlace}` : 'The booking’s area',
          ].map((t) => (
            <Text key={t} variant="footnote" color={colors.paper}>
              • {t}
            </Text>
          ))}
        </View>

        <Button label="Call 112 (police, ambulance)" icon="phone" onPress={() => Linking.openURL('tel:112')} backgroundColor={colors.paper} textColor={colors.danger} />
        {p.mine ? <Button label="I’m safe — stop alerts" variant="ghost" onPress={askToStop} loading={stopping} borderColor={colors.paper} textColor={colors.paper} /> : null}
        <Button label="Back to the booking" variant="ghost" onPress={() => router.replace(`/booking/${bookingId}`)} textColor={colors.paper} />
        {error ? (
          <Text variant="footnote" color={colors.paper} center accessibilityLiveRegion="assertive">
            {error}
          </Text>
        ) : null}
      </ScrollView>
      <PinCheck visible={pinOpen} id={loginIdOf(me) ?? ''} busy={stopping} onClose={() => setPinOpen(false)} onOk={stop} />
    </SafeAreaView>
  );
}

function PinCheck({ visible, id, busy, onClose, onOk }: { visible: boolean; id: string; busy: boolean; onClose: () => void; onOk: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { style, shake } = useShake();
  const onKey = useCallback(
    (k: string) => {
      setError(null);
      setPin((cur) => {
        const v = k === 'del' ? cur.slice(0, -1) : (cur + k).slice(0, 4);
        if (v.length === 4) {
          checkLocalPin(id, v)
            .then((ok) => (ok ? onOk() : (setError('That PIN isn’t right.'), shake(), setPin(''))))
            .catch((e) => setError(errorMessage(e)));
        }
        return v;
      });
    },
    [id, onOk, shake],
  );
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <Text variant="title2" center>
            Enter your PIN to stop
          </Text>
          <Animated.View style={[styles.dots, style]}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.dot, i < pin.length && styles.dotOn]} />
            ))}
          </Animated.View>
          {error ? (
            <Text variant="footnote" color={colors.danger} center accessibilityLiveRegion="assertive">
              {error}
            </Text>
          ) : null}
          <PinPad onKey={onKey} disabled={busy} />
          <Button label="Cancel — keep alerting" variant="ghost" onPress={onClose} />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const PULSE = { '0%': { transform: [{ scale: 1 }] }, '50%': { transform: [{ scale: 1.08 }] }, '100%': { transform: [{ scale: 1 }] } };

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.danger },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.lg },
  badge: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  sos: { fontFamily: fonts.semibold, fontSize: 18, color: colors.danger, letterSpacing: 1 },
  panel: { gap: 4, padding: space.lg, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.14)' },
  count: { fontFamily: fonts.semibold, fontSize: 40, lineHeight: 48, color: colors.paper },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(14,17,13,0.5)' },
  sheet: { backgroundColor: colors.mist, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: GUTTER, gap: space.md },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: space.lg, marginVertical: space.sm },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.moss },
  dotOn: { backgroundColor: colors.moss },
});

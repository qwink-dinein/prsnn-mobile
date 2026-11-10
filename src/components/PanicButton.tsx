import { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, runOnJS, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { useConfirm } from './ui/confirm';
import { formatTime, startsAt } from '@/domain/booking';
import type { Booking } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

const HOLD_MS = 3000;
const AFTER_END_MS = 60 * 60_000;

/** When the panic button is on: from the session start until 1 hour after it ends (confirmed, paid bookings). */
export function panicWindow(b: Pick<Booking, 'scheduledDate' | 'startTime' | 'duration' | 'status' | 'paymentStatus'>, now = Date.now()) {
  const start = startsAt(b).getTime();
  const end = start + Number(b.duration) * 60_000 + AFTER_END_MS;
  const eligible = (b.status === 'accepted' || b.status === 'completed') && b.paymentStatus === 'paid';
  return { start, end, eligible, on: eligible && now >= start && now <= end, before: eligible && now < start, after: now > end };
}

/**
 * The panic button on a booking. Off (and says when it turns on) before the
 * session; during the session and 1 hour after, hold 3 seconds to alert every
 * admin by WhatsApp and push — repeated every 5 minutes until stopped.
 * Screen readers get a double-tap with a confirm instead of the hold.
 */
export function PanicButton({ b }: { b: Booking }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const w = panicWindow(b, now);
  if (!w.eligible || w.after) return null;
  if (b.panic) return <ActiveAlert b={b} />;
  if (w.before) {
    const end = new Date(w.end);
    return (
      <View style={[styles.card, { opacity: 0.85 }]} accessible accessibilityLabel={`Panic button. Turns on at ${formatTime(b.startTime)} and stays on until ${end.toTimeString().slice(0, 5)}.`}>
        <View style={[styles.mini, { backgroundColor: colors.mistDeep }]}>
          <Text style={[styles.sos, { fontSize: 13, color: colors.gray500 }]}>SOS</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="headline">Panic button</Text>
          <Text variant="footnote" muted>
            Turns on at {formatTime(b.startTime)} and stays on until {formatTime(`${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`)} (1 hour after the end).
          </Text>
        </View>
      </View>
    );
  }
  return <HoldButton b={b} />;
}

function ActiveAlert({ b }: { b: Booking }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Safety alert active. Open it." onPress={() => router.push(`/panic/${b._id}`)} style={[styles.card, styles.active]}>
      <View style={[styles.mini, { backgroundColor: colors.paper }]}>
        <Text style={[styles.sos, { fontSize: 13, color: colors.danger }]}>SOS</Text>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="headline" color={colors.paper}>
          Safety alert active
        </Text>
        <Text variant="footnote" color={colors.paper} style={{ opacity: 0.9 }}>
          {b.panic?.mine ? 'Our team is being alerted every 5 minutes. Tap to see details or stop it.' : 'The other person raised an alert. Our team is on it.'}
        </Text>
      </View>
      <Icon name="chevronRight" size={18} color={colors.paper} />
    </Pressable>
  );
}

function HoldButton({ b }: { b: Booking }) {
  const reduced = useReducedMotion();
  const confirm = useConfirm();
  const qc = useQueryClient();
  const progress = useSharedValue(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fired = useRef(false);

  const raise = async () => {
    if (fired.current) return;
    fired.current = true;
    setBusy(true);
    setError(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    try {
      await svc.raisePanic(b._id);
      qc.invalidateQueries({ queryKey: qk.booking(b._id) });
      router.push(`/panic/${b._id}`);
    } catch (e) {
      fired.current = false;
      setError(`${errorMessage(e)} If you’re in danger, call 112 now.`);
    } finally {
      setBusy(false);
      progress.set(0);
    }
  };

  const fill = useAnimatedStyle(() => ({ transform: [{ scale: 0.55 + progress.get() * 0.45 }], opacity: 0.25 + progress.get() * 0.5 }));

  const start = () => {
    if (busy) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    progress.set(
      withTiming(1, { duration: HOLD_MS, easing: Easing.linear }, (done) => {
        if (done) runOnJS(raise)();
      }),
    );
  };
  const stop = () => {
    cancelAnimation(progress);
    progress.set(withTiming(0, { duration: 180 }));
  };

  return (
    <View style={[styles.card, { flexDirection: 'column', alignItems: 'center', gap: space.md, paddingVertical: space.xl }]}>
      <Pressable
        onPressIn={start}
        onPressOut={stop}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel="Panic button. Hold for 3 seconds to alert the prsnn safety team."
        accessibilityHint="Screen reader users: double-tap, then confirm."
        accessibilityActions={[{ name: 'activate' }]}
        onAccessibilityAction={async () => {
          if (await confirm({ title: 'Send a safety alert?', message: 'Our team gets your details at once, and again every 5 minutes until it’s stopped.', confirmLabel: 'Send alert', destructive: true })) void raise();
        }}
        style={styles.bigWrap}
      >
        <Animated.View style={[styles.halo, fill]} />
        <Animated.View style={[styles.big, reduced ? null : { animationName: PULSE, animationDuration: 1600, animationIterationCount: 'infinite' }]}>
          <Text style={styles.sos}>SOS</Text>
          <Text variant="caption" color={colors.paper}>
            {busy ? 'Sending…' : 'hold 3 s'}
          </Text>
        </Animated.View>
      </Pressable>
      <Text variant="headline" center>
        Feel unsafe? Hold the button.
      </Text>
      <Text variant="footnote" muted center style={{ maxWidth: 300 }}>
        Alerts every prsnn admin at once with both your details and the meeting place — and again every 5 minutes until it’s stopped.
      </Text>
      {error ? (
        <Text variant="footnote" color={colors.danger} center accessibilityLiveRegion="assertive">
          {error}
        </Text>
      ) : null}
      <Pressable accessibilityRole="button" accessibilityLabel="Call 112, India emergency number" onPress={() => Linking.openURL('tel:112')} style={styles.call}>
        <Icon name="phone" size={16} color={colors.danger} />
        <Text variant="subhead" color={colors.danger}>
          Call 112 (police, ambulance)
        </Text>
      </Pressable>
    </View>
  );
}

const PULSE = { '0%': { transform: [{ scale: 1 }] }, '50%': { transform: [{ scale: 1.06 }] }, '100%': { transform: [{ scale: 1 }] } };

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.paper, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, marginTop: space.lg },
  active: { backgroundColor: colors.danger, borderColor: colors.danger },
  mini: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  bigWrap: { width: 150, height: 150, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: colors.danger },
  big: { width: 118, height: 118, borderRadius: 59, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  sos: { fontFamily: fonts.semibold, fontSize: 28, color: colors.paper, letterSpacing: 1 },
  call: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 44, paddingHorizontal: space.lg, borderRadius: radius.pill, backgroundColor: colors.dangerSoft },
});

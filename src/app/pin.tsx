import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { PinPad } from '@/components/ui/forms';
import { Enter, useShake } from '@/components/ui/motion';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';
import { afterAuth, afterPin, displayLogin } from '@/lib/flow';
import { useSession } from '@/state/session';

const LEN = 4;
/** Trivial PINs the server also refuses. */
const WEAK = new Set(['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '0123', '9876']);
/** Pause on a full PIN so the 4th box is seen filling before the screen moves on. */
const SETTLE_MS = 160;

/** Screen 5 · Set a 4-digit PIN (mode=set) or log in with it (mode=login). */
export default function Pin() {
  const { mode = 'set', phone, reset } = useLocalSearchParams<{ mode?: 'set' | 'login'; phone?: string; reset?: string }>();
  const updateUser = useSession((s) => s.updateUser);
  const [first, setFirst] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { style: shakeStyle, shake } = useShake();
  const reduced = useReducedMotion();

  // The source of truth for typing. A ref updates synchronously, so two fast
  // taps between renders both count (state alone would drop the second).
  const valueRef = useRef('');
  const firstRef = useRef<string | null>(null);
  const lockRef = useRef(false);

  const put = (v: string) => {
    valueRef.current = v;
    setValue(v);
  };

  const fail = useCallback(
    (msg: string) => {
      setError(msg);
      put('');
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    },
    [shake],
  );

  const submit = useCallback(
    async (pin: string) => {
      if (mode === 'login') {
        setBusy(true);
        try {
          await afterAuth(await svc.pinLogin(phone ?? '', pin), { viaPin: true });
        } catch (e) {
          fail(errorMessage(e));
        } finally {
          setBusy(false);
        }
        return;
      }
      if (!firstRef.current) {
        if (WEAK.has(pin)) return fail('That PIN is too easy to guess. Try another.');
        firstRef.current = pin;
        setFirst(pin);
        setError(null);
        put('');
        return;
      }
      if (firstRef.current !== pin) {
        firstRef.current = null;
        setFirst(null);
        return fail('PINs didn’t match. Start again.');
      }
      setBusy(true);
      try {
        await svc.setPin(pin);
        await updateUser({ hasPin: true });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        afterPin();
      } catch (e) {
        firstRef.current = null;
        setFirst(null);
        fail(errorMessage(e));
      } finally {
        setBusy(false);
      }
    },
    [mode, phone, fail, updateUser],
  );

  const onKey = useCallback(
    (k: string) => {
      if (lockRef.current) return;
      const cur = valueRef.current;
      if (k === 'del') {
        put(cur.slice(0, -1));
        return;
      }
      if (cur.length >= LEN) return;
      const next = cur + k;
      put(next);
      if (error) setError(null);
      if (next.length === LEN) {
        lockRef.current = true;
        setTimeout(async () => {
          await submit(next);
          lockRef.current = false;
        }, SETTLE_MS);
      }
    },
    [error, submit],
  );

  const title = mode === 'login' ? 'Enter your PIN' : first ? 'Confirm your PIN' : reset ? 'Choose a new PIN' : 'Set a 4-digit PIN';
  const sub = mode === 'login' ? `For ${displayLogin(phone)}` : first ? 'Enter the same 4 digits again.' : 'You’re verified. Next time, open prsnn with this PIN — no code needed.';

  return (
    <Screen scroll={false}>
      <Header
        right={
          mode === 'set' && !reset ? (
            <Text variant="subhead" color={colors.moss} onPress={() => afterPin()} accessibilityRole="button" style={{ padding: space.md }}>
              Skip
            </Text>
          ) : undefined
        }
      />
      <View style={styles.top}>
        <Enter index={0}>
          <View style={styles.badge}>
            <Icon name="lock" size={26} color={colors.onMoss} />
          </View>
        </Enter>
        <Enter index={1} style={{ alignItems: 'center', gap: space.xs }}>
          <Text variant="title1" center>
            {title}
          </Text>
          <Text variant="callout" muted center style={{ maxWidth: 280 }}>
            {sub}
          </Text>
        </Enter>
        <Enter index={2}>
          <Animated.View style={[styles.boxes, shakeStyle]} accessibilityLabel={`${value.length} of ${LEN} digits entered`} accessibilityLiveRegion="polite">
            {Array.from({ length: LEN }).map((_, i) => {
              const on = i < value.length;
              return (
                <View key={i} style={[styles.box, on && styles.boxOn, !!error && styles.boxError]}>
                  <Animated.View
                    style={[
                      styles.dot,
                      {
                        opacity: on ? 1 : 0,
                        transform: [{ scale: on || reduced ? 1 : 0.5 }],
                        transitionProperty: ['opacity', 'transform'],
                        transitionDuration: 140,
                        transitionTimingFunction: 'ease-out',
                      },
                    ]}
                  />
                </View>
              );
            })}
          </Animated.View>
        </Enter>
        <Text variant="footnote" color={colors.danger} center style={styles.error} accessibilityLiveRegion="assertive">
          {error ?? ''}
        </Text>
      </View>
      <Enter index={3}>
        <PinPad onKey={onKey} disabled={busy} />
      </Enter>
      {mode === 'login' ? (
        <View>
          <Text
            variant="subhead"
            color={colors.moss}
            center
            onPress={() => router.replace({ pathname: '/login', params: { reset: '1', phone: phone ?? '' } })}
            accessibilityRole="button"
            style={{ paddingTop: space.lg, paddingBottom: space.sm, paddingHorizontal: space.lg }}
          >
            Forgot PIN? Reset it with a code
          </Text>
          <Text
            variant="footnote"
            color={colors.textMuted}
            center
            onPress={() => router.replace('/login')}
            accessibilityRole="button"
            style={{ paddingTop: space.sm, paddingBottom: space.lg, paddingHorizontal: space.lg }}
          >
            Not you? Log in with another number
          </Text>
        </View>
      ) : (
        <View style={{ height: space.xl }} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md },
  badge: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  boxes: { flexDirection: 'row', gap: space.md, marginTop: space.md },
  box: { width: 52, height: 56, borderRadius: radius.md, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  boxOn: { borderColor: colors.moss, borderWidth: 1.5 },
  boxError: { borderColor: colors.danger },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.moss },
  error: { minHeight: 20, paddingHorizontal: space.lg },
});

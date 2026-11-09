import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, space } from '@/theme/tokens';
import { Screen, Header } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { PinPad } from '@/components/ui/forms';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';
import { afterAuth, displayPhone, goHome } from '@/lib/flow';
import { useSession } from '@/state/session';

const LEN = 4;
/** Trivial PINs the server also refuses. */
const WEAK = new Set(['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '0123', '9876']);

/** Screen 5 · Set a 4-digit PIN (mode=set) or log in with it (mode=login). */
export default function Pin() {
  const { mode = 'set', phone } = useLocalSearchParams<{ mode?: 'set' | 'login'; phone?: string }>();
  const updateUser = useSession((s) => s.updateUser);
  const [first, setFirst] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fail = (msg: string) => {
    setError(msg);
    setValue('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  };

  useEffect(() => {
    if (value.length !== LEN || busy) return;
    const run = async () => {
      if (mode === 'login') {
        setBusy(true);
        try {
          await afterAuth(await svc.pinLogin(phone ?? '', value));
        } catch (e) {
          fail(errorMessage(e));
        } finally {
          setBusy(false);
        }
        return;
      }
      if (!first) {
        if (WEAK.has(value)) return fail('That PIN is too easy to guess. Try another.');
        setFirst(value);
        setValue('');
        setError(null);
        return;
      }
      if (first !== value) {
        setFirst(null);
        return fail('PINs didn’t match. Start again.');
      }
      setBusy(true);
      try {
        await svc.setPin(value);
        await updateUser({ hasPin: true });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        goHome();
      } catch (e) {
        setFirst(null);
        fail(errorMessage(e));
      } finally {
        setBusy(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const title = mode === 'login' ? 'Enter your PIN' : first ? 'Confirm your PIN' : 'Set a 4-digit PIN';
  const sub = mode === 'login' ? `For ${displayPhone(phone)}` : 'Use this PIN for quicker and more secure access.';

  return (
    <Screen scroll={false}>
      <Header
        right={
          mode === 'set' ? (
            <Text variant="subhead" color={colors.moss} onPress={() => goHome()} accessibilityRole="button" style={{ padding: space.md }}>
              Skip
            </Text>
          ) : undefined
        }
      />
      <View style={styles.top}>
        <View style={styles.badge}>
          <Icon name="lock" size={28} color={colors.onMoss} />
        </View>
        <Text variant="title1" center>
          {title}
        </Text>
        <Text variant="callout" muted center style={{ maxWidth: 280 }}>
          {sub}
        </Text>
        <View style={styles.dots} accessibilityLabel={`${value.length} of ${LEN} digits entered`}>
          {Array.from({ length: LEN }).map((_, i) => (
            <View key={i} style={[styles.dot, i < value.length && styles.dotOn]} />
          ))}
        </View>
        <Text variant="footnote" color={colors.danger} center style={{ minHeight: 20 }} accessibilityLiveRegion="polite">
          {error ?? ''}
        </Text>
      </View>
      <PinPad value={value} onChange={(v) => !busy && setValue(v)} length={LEN} />
      {mode === 'login' ? (
        <Text variant="subhead" color={colors.moss} center onPress={() => router.replace('/login')} accessibilityRole="button" style={{ padding: space.lg }}>
          Forgot PIN? Log in with OTP
        </Text>
      ) : (
        <View style={{ height: space.xxl }} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md },
  badge: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  dots: { flexDirection: 'row', gap: space.lg, marginTop: space.lg },
  dot: { width: 52, height: 56, borderRadius: 12, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.paper },
  dotOn: { borderColor: colors.moss, backgroundColor: colors.mossSoft },
});

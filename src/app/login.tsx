import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Logo } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';
import { displayPhone, normaliseIndianMobile } from '@/lib/flow';
import { LINKS } from '@/lib/config';
import { useSession } from '@/state/session';

/** Screen 4 · Login / Sign up with mobile number (code arrives on WhatsApp, SMS as backup). */
export default function Login() {
  const lastPhone = useSession((s) => s.prefs.lastPhone);
  const params = useLocalSearchParams<{ reset?: string; phone?: string }>();
  const resetting = params.reset === '1';
  const [phone, setPhone] = useState(resetting && params.phone ? params.phone.replace(/^91/, '') : '');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const normalised = normaliseIndianMobile(phone);

  const send = async () => {
    if (!normalised) {
      setError('Enter a 10-digit Indian mobile number.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await svc.sendOtp(normalised);
      router.push({ pathname: '/otp', params: { phone: normalised, ...(resetting ? { reset: '1' } : {}) } });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Header />
      <View style={styles.head}>
        {resetting ? (
          <Text variant="title1" center>
            Reset your PIN
          </Text>
        ) : (
          <>
            <Text variant="title1" center>
              Welcome to
            </Text>
            <Logo size={44} />
          </>
        )}
        <Text variant="callout" muted center style={{ marginTop: space.sm }}>
          {resetting ? 'We’ll send a code to your number, then you can choose a new PIN.' : 'Continue with your mobile number'}
        </Text>
      </View>

      <View style={{ gap: space.lg }}>
        <TextField
          label="Mobile number"
          prefix="🇮🇳  +91"
          value={phone}
          onChangeText={(t) => {
            setPhone(t.replace(/[^\d ]/g, ''));
            setError(null);
          }}
          placeholder="98765 43210"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          maxLength={12}
          returnKeyType="send"
          onSubmitEditing={send}
          error={error}
          hint="We’ll send a 6-digit code on WhatsApp."
        />
        <Button label="Send OTP" onPress={send} loading={busy} disabled={!normalised} />

        {lastPhone && !resetting ? (
          <Button
            label={`Log in with PIN · ${displayPhone(lastPhone)}`}
            variant="secondary"
            icon="lock"
            onPress={() => router.push({ pathname: '/pin', params: { mode: 'login', phone: lastPhone } })}
          />
        ) : null}

        {resetting ? null : (
        <>
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text variant="footnote" muted>
            or continue with
          </Text>
          <View style={styles.line} />
        </View>
        <Button label="Email" icon="mail" variant="secondary" onPress={() => router.push('/login-email')} />
        </>
        )}
      </View>

      <Text variant="caption" muted center style={styles.legal}>
        By continuing, you agree to get login codes and booking updates on WhatsApp, and to our{' '}
        <Text variant="caption" color={colors.moss} onPress={() => Linking.openURL(LINKS.terms)} accessibilityRole="link">
          Terms of Service
        </Text>{' '}
        and{' '}
        <Text variant="caption" color={colors.moss} onPress={() => Linking.openURL(LINKS.privacy)} accessibilityRole="link">
          Privacy Policy
        </Text>
        .
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', marginTop: space.lg, marginBottom: space.xxxl },
  divider: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginVertical: space.xs },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.lineStrong, borderRadius: radius.pill },
  legal: { marginTop: space.xxxl, paddingHorizontal: space.xl },
});

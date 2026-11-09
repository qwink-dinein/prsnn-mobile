import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header } from '@/components/ui/layout';
import { Enter, EASE_OUT_CSS, useShake } from '@/components/ui/motion';
import { BRAND_WORD } from '@/components/ui/Brand';
import { fonts } from '@/theme/fonts';
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
  const { style: shakeStyle, shake } = useShake();

  const send = async () => {
    if (!normalised) {
      setError('Enter a 10-digit Indian mobile number.');
      shake();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await svc.sendOtp(normalised);
      router.push({ pathname: '/otp', params: { phone: normalised, ...(resetting ? { reset: '1' } : {}) } });
    } catch (e) {
      setError(errorMessage(e));
      shake();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Header />
      <View style={styles.head}>
        {resetting ? (
          <Enter index={0}>
            <Text variant="title1" center>
              Reset your PIN
            </Text>
          </Enter>
        ) : (
          <>
            <Enter index={0}>
              <Text variant="title1" center>
                Welcome to
              </Text>
            </Enter>
            <Enter index={1}>
              <Wordmark />
            </Enter>
          </>
        )}
        <Enter index={2}>
          <Text variant="callout" muted center style={{ marginTop: space.sm }}>
            {resetting ? 'We’ll send a code to your number, then you can choose a new PIN.' : 'Continue with your mobile number'}
          </Text>
        </Enter>
      </View>

      <View style={{ gap: space.lg }}>
        <Enter index={3}>
        <Animated.View style={shakeStyle}>
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
        </Animated.View>
        </Enter>
        <Enter index={4}>
          <Button label="Send OTP" onPress={send} loading={busy} disabled={!normalised} haptic />
        </Enter>

        {lastPhone && !resetting ? (
          <Enter index={5}>
          <Button
            label={`Log in with PIN · ${displayPhone(lastPhone)}`}
            variant="secondary"
            icon="lock"
            onPress={() => router.push({ pathname: '/pin', params: { mode: 'login', phone: lastPhone } })}
          />
          </Enter>
        ) : null}

        {resetting ? null : (
        <Enter index={6} style={{ gap: space.lg }}>
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text variant="footnote" muted>
            or continue with
          </Text>
          <View style={styles.line} />
        </View>
        <Button label="Email" icon="mail" variant="secondary" onPress={() => router.push('/login-email')} />
        </Enter>
        )}
      </View>

      <Enter index={7}>
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
      </Enter>
    </Screen>
  );
}

/**
 * The italic "prsnn." wordmark with its clay full stop settling in after the
 * word: the one deliberate flourish on a screen people see rarely.
 */
function Wordmark() {
  const reduced = useReducedMotion();
  return (
    <View style={styles.wordmark} accessible accessibilityRole="header" accessibilityLabel={BRAND_WORD}>
      <Text style={styles.wordmarkText} maxFontSizeMultiplier={1.3}>
        {BRAND_WORD}
      </Text>
      <Animated.Text
        maxFontSizeMultiplier={1.3}
        style={[
          styles.wordmarkText,
          {
            color: colors.clay,
            animationName: reduced ? DOT_FADE : DOT_SETTLE,
            animationDuration: reduced ? 200 : 320,
            animationDelay: reduced ? 0 : 620,
            animationTimingFunction: EASE_OUT_CSS,
            animationFillMode: 'backwards',
          },
        ]}
      >
        .
      </Animated.Text>
    </View>
  );
}

const DOT_SETTLE = {
  from: { opacity: 0, transform: [{ translateY: -10 }, { scale: 0.6 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
};
const DOT_FADE = { from: { opacity: 0 }, to: { opacity: 1 } };

const styles = StyleSheet.create({
  wordmark: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  wordmarkText: { fontFamily: fonts.brand, fontSize: 46, lineHeight: 58, letterSpacing: -0.9, color: colors.ink },
  head: { alignItems: 'center', marginTop: space.lg, marginBottom: space.xxxl },
  divider: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginVertical: space.xs },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.lineStrong, borderRadius: radius.pill },
  legal: { marginTop: space.xxxl, paddingHorizontal: space.xl },
});

import { useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { router } from 'expo-router';
import { space } from '@/theme/tokens';
import { Screen, Header } from '@/components/ui/layout';
import { Enter, useShake } from '@/components/ui/motion';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Visitors from abroad without an Indian number: a 6-digit code by email. */
export default function LoginEmail() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { style, shake } = useShake();
  const valid = EMAIL.test(email.trim());
  const fieldError = error ?? (touched && email && !valid ? 'Check the email address — it should look like name@example.com.' : null);

  const send = async () => {
    setTouched(true);
    if (!valid) {
      shake();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await svc.sendEmailOtp(email.trim());
      router.push({ pathname: '/otp', params: { email: email.trim().toLowerCase() } });
    } catch (e) {
      setError(errorMessage(e));
      shake();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button label="Email me a code" onPress={send} loading={busy} disabled={!email} haptic />}>
      <Header />
      <Enter index={0}>
        <View style={{ gap: space.sm, marginTop: space.lg, marginBottom: space.xxl }}>
          <Text variant="title1">Visiting India?</Text>
          <Text variant="callout" muted>
            Sign up with your email. We’ll send a 6-digit code. You’ll add a mobile number with your country code next, for booking updates and safety alerts.
          </Text>
        </View>
      </Enter>
      <Enter index={1}>
        <Animated.View style={style}>
          <TextField
            label="Email"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError(null);
            }}
            onBlur={() => setTouched(true)}
            placeholder="name@example.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            returnKeyType="send"
            onSubmitEditing={send}
            error={fieldError}
          />
        </Animated.View>
      </Enter>
    </Screen>
  );
}

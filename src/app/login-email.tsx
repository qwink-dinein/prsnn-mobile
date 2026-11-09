import { useState } from 'react';
import { Linking, View } from 'react-native';
import { colors, space } from '@/theme/tokens';
import { Screen, Header } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { CodeBoxes, TextField } from '@/components/ui/forms';
import { svc } from '@/services';
import { ApiError, errorMessage } from '@/lib/api';
import { afterAuth } from '@/lib/flow';
import { LINKS } from '@/lib/config';

/** Email / username + password, for accounts created on prsnn.com. Handles the email-verification step. */
export default function LoginEmail() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyFor, setVerifyFor] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const login = async () => {
    if (!email.trim() || !password) return setError('Enter your email or username and password.');
    setBusy(true);
    setError(null);
    try {
      await afterAuth(await svc.emailLogin(email.trim(), password));
    } catch (e) {
      if (e instanceof ApiError && e.data.emailVerificationRequired) {
        setVerifyFor(String(e.data.email ?? email.trim()));
      } else setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const verify = async (v = code) => {
    if (!verifyFor || v.length !== 6) return;
    setBusy(true);
    setError(null);
    try {
      await afterAuth(await svc.verifyEmail(verifyFor, v));
    } catch (e) {
      setError(errorMessage(e));
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  if (verifyFor) {
    return (
      <Screen footer={<Button label="Verify email" onPress={() => verify()} loading={busy} disabled={code.length !== 6} />}>
        <Header onBack={() => setVerifyFor(null)} />
        <View style={{ gap: space.sm, marginVertical: space.xl }}>
          <Text variant="title1">Check your email</Text>
          <Text variant="callout" muted>
            We sent a 6-digit code to {verifyFor}.
          </Text>
        </View>
        <CodeBoxes
          length={6}
          value={code}
          onChange={(v) => {
            setCode(v);
            if (v.length === 6) verify(v);
          }}
        />
        {error ? (
          <Text variant="footnote" color={colors.danger} center style={{ marginTop: space.md }}>
            {error}
          </Text>
        ) : null}
      </Screen>
    );
  }

  return (
    <Screen footer={<Button label="Log in" onPress={login} loading={busy} />}>
      <Header title="Log in with email" />
      <View style={{ gap: space.lg, marginTop: space.lg }}>
        <TextField label="Email or username" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="username" autoComplete="email" returnKeyType="next" />
        <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry textContentType="password" autoComplete="current-password" returnKeyType="go" onSubmitEditing={login} error={error} />
        <Text variant="subhead" color={colors.moss} onPress={() => Linking.openURL(`${LINKS.website}/forgot-password`)} accessibilityRole="link">
          Forgot password?
        </Text>
      </View>
    </Screen>
  );
}

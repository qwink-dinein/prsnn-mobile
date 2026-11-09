import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, space } from '@/theme/tokens';
import { Screen, Header } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { CodeBoxes } from '@/components/ui/forms';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';
import { afterAuth, displayPhone } from '@/lib/flow';
import { useSession } from '@/state/session';

const RESEND_AFTER = 30;

/** Verify the 6-digit code sent on WhatsApp (or SMS). */
export default function Otp() {
  const { phone = '' } = useLocalSearchParams<{ phone: string }>();
  const role = useSession((s) => s.prefs.intendedRole);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(RESEND_AFTER);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const verify = async (value = code) => {
    if (value.length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    try {
      await afterAuth(await svc.verifyOtp(phone, value, role));
    } catch (e) {
      setError(errorMessage(e));
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const resend = async (channel: 'whatsapp' | 'sms') => {
    setError(null);
    setNotice(null);
    try {
      await svc.sendOtp(phone, channel);
      setWait(RESEND_AFTER);
      setNotice(channel === 'sms' ? 'We sent a new code by SMS.' : 'We sent a new code on WhatsApp.');
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return (
    <Screen footer={<Button label="Verify" onPress={() => verify()} loading={busy} disabled={code.length !== 6} haptic />}>
      <Header />
      <View style={{ gap: space.sm, marginTop: space.lg, marginBottom: space.xxl }}>
        <Text variant="title1">Enter the code</Text>
        <Text variant="callout" muted>
          We sent a 6-digit code to {displayPhone(phone)} on WhatsApp.
        </Text>
      </View>
      <CodeBoxes
        length={6}
        value={code}
        onChange={(v) => {
          setCode(v);
          setError(null);
          if (v.length === 6) verify(v);
        }}
      />
      {error ? (
        <Text variant="footnote" color={colors.danger} center style={{ marginTop: space.md }} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : notice ? (
        <Text variant="footnote" color={colors.moss} center style={{ marginTop: space.md }} accessibilityLiveRegion="polite">
          {notice}
        </Text>
      ) : null}
      <View style={{ marginTop: space.xxl, gap: space.xs }}>
        {wait > 0 ? (
          <Text variant="footnote" muted center>
            Resend code in {wait}s
          </Text>
        ) : (
          <>
            <Button label="Resend on WhatsApp" variant="ghost" onPress={() => resend('whatsapp')} compact />
            <Button label="Send by SMS instead" variant="ghost" onPress={() => resend('sms')} compact />
          </>
        )}
      </View>
    </Screen>
  );
}

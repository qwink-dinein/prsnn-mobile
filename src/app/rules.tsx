import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Card } from '@/components/ui/layout';
import { Notice } from '@/components/ui/states';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { HOUSE_RULES, NOT_FOR, agreedAt } from '@/domain/rules';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

const longDate = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' });

/**
 * House rules: what prsnn is (company, nothing more), what it isn't, and the rules everyone agrees
 * to. Opened from the booking review, companion forms and Profile. Agreeing is saved on the server
 * with the date, time and policy version.
 */
export default function Rules() {
  const qc = useQueryClient();
  const consents = useQuery({ queryKey: qk.consents, queryFn: () => svc.myConsents() });
  const at = agreedAt(consents.data, 'house_rules');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agree = async () => {
    setBusy(true);
    setError(null);
    try {
      const list = await svc.recordConsents(['house_rules']);
      qc.setQueryData(qk.consents, list);
      if (router.canGoBack()) router.back();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        at ? (
          <Button label="Done" variant="secondary" onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
        ) : (
          <Button label="I agree to the house rules" icon="check" onPress={agree} loading={busy} disabled={consents.isLoading} haptic />
        )
      }
    >
      <Header title="House rules" />
      <View style={styles.hero}>
        <Text variant="title1" accessibilityRole="header">
          Company. Nothing more.
        </Text>
        <Text variant="callout" muted>
          prsnn is for platonic company on everyday plans. Respect is the whole deal, for members, companions and the loved ones families book for.
        </Text>
      </View>

      {at ? <Notice tone="success" text={`You agreed to these rules on ${longDate(at)}.`} /> : null}
      {consents.isError ? <Notice tone="warning" text={`Couldn’t check whether you’ve agreed before. ${errorMessage(consents.error)}`} /> : null}

      <Text variant="title3" style={styles.h}>
        What prsnn is not
      </Text>
      <Card style={{ paddingVertical: space.xs }}>
        {NOT_FOR.map(([t, d], i) => (
          <View key={t} style={[styles.row, i < NOT_FOR.length - 1 && styles.line]} accessible accessibilityLabel={`${t}. ${d}`}>
            <View style={styles.x}>
              <Icon name="close" size={12} color={colors.champagne} strokeWidth={2.6} />
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text variant="headline">{t}</Text>
              <Text variant="footnote" muted>
                {d}
              </Text>
            </View>
          </View>
        ))}
      </Card>

      <Text variant="title3" style={styles.h}>
        House rules
      </Text>
      <Card style={{ paddingVertical: space.xs }}>
        {HOUSE_RULES.map(([t, d], i) => (
          <View key={t} style={[styles.row, i < HOUSE_RULES.length - 1 && styles.line]} accessible accessibilityLabel={`Rule ${i + 1}. ${t}. ${d}`}>
            <View style={styles.n}>
              <Text variant="caption" color={colors.midnight} style={{ fontWeight: '700' }}>
                {i + 1}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text variant="headline">{t}</Text>
              <Text variant="footnote" muted>
                {d}
              </Text>
            </View>
          </View>
        ))}
      </Card>

      <Text variant="footnote" muted style={{ marginTop: space.lg }}>
        Breaking these rules can mean a permanent ban, and serious cases are reported to the police. In danger? Hold the panic button in your booking, and call 112.
      </Text>
      {error ? <Notice tone="danger" text={error} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: space.sm, marginTop: space.sm, marginBottom: space.lg },
  h: { marginTop: space.xl, marginBottom: space.md },
  row: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start', paddingVertical: space.md },
  line: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  x: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.midnight, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  n: { width: 24, height: 24, borderRadius: radius.sm, backgroundColor: colors.champagneMist, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
});

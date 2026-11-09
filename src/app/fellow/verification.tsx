import { useEffect } from 'react';
import { Linking, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Card } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { svc, qk } from '@/services';
import { LINKS } from '@/lib/config';
import { useSession } from '@/state/session';

const COPY: Record<string, { icon: IconName; title: string; body: string }> = {
  pending: { icon: 'clock', title: 'Verification in progress', body: 'Our team is reviewing your ID and photos. This usually takes 24–48 hours. We’ll notify you when you’re live.' },
  verified: { icon: 'badgeCheck', title: 'You’re verified', body: 'Your profile is live. Members can now find and book you.' },
  rejected: { icon: 'info', title: 'We couldn’t verify you yet', body: 'Something in your documents needs another look. Contact support and we’ll help you sort it out.' },
  not_submitted: { icon: 'idCard', title: 'Not submitted yet', body: 'Complete your companion profile to start verification.' },
};

/** Screen 19 · Verification status for companions. */
export default function Verification() {
  const updateUser = useSession((s) => s.updateUser);
  const q = useQuery({ queryKey: qk.profileCheck, queryFn: svc.checkProfile, refetchInterval: 60_000 });
  const status = (q.data?.status === 'not_found' ? 'not_submitted' : q.data?.status) ?? 'pending';
  const c = COPY[status] ?? COPY.pending;

  useEffect(() => {
    if (q.data && q.data.status !== 'not_found') updateUser({ verification_status: q.data.status, is_verified: q.data.status === 'verified' });
  }, [q.data, updateUser]);

  return (
    <Screen
      refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
      footer={
        status === 'verified' ? (
          <Button label="Go to dashboard" onPress={() => router.replace('/home')} />
        ) : status === 'not_submitted' ? (
          <Button label="Complete profile" onPress={() => router.replace('/fellow/onboarding')} />
        ) : status === 'rejected' ? (
          <Button label="Contact support" icon="mail" onPress={() => Linking.openURL(LINKS.support)} />
        ) : (
          <Button label="Back to home" variant="secondary" onPress={() => router.replace('/home')} />
        )
      }
    >
      <Header title="Verification" onBack={() => router.replace('/home')} />
      <View style={styles.hero}>
        <View style={[styles.badge, status === 'rejected' && { backgroundColor: colors.warningSoft }]}>
          <Icon name={c.icon} size={36} color={status === 'rejected' ? colors.clay : colors.moss} />
        </View>
        <Text variant="title1" center>
          {c.title}
        </Text>
        <Text variant="callout" muted center style={{ maxWidth: 320 }}>
          {c.body}
        </Text>
      </View>
      <Card style={{ gap: space.md }}>
        {[
          ['Profile details', status !== 'not_submitted'],
          ['Government ID', status !== 'not_submitted'],
          ['Photo', status !== 'not_submitted'],
          ['Team review', status === 'verified'],
        ].map(([label, done]) => (
          <View key={String(label)} style={styles.row}>
            <Icon name={done ? 'check' : 'clock'} size={18} color={done ? colors.moss : colors.gray400} />
            <Text variant="callout" color={done ? colors.ink : colors.gray500}>
              {label}
            </Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: space.md, marginVertical: space.xxl },
  badge: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});

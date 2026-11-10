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
  id_required: { icon: 'sparkle', title: 'You’re live', body: 'Members in your city can find and book you. When your first booking arrives, we’ll ask for a photo ID and a selfie — about 2 minutes. You can also do it now.' },
  pending: { icon: 'clock', title: 'ID check in progress', body: 'Our team is checking your ID. Bookings you accept meanwhile are held for you and confirmed as soon as it’s approved.' },
  verified: { icon: 'badgeCheck', title: 'You’re verified', body: 'Your ID is approved. Every booking is one tap to accept.' },
  rejected: { icon: 'info', title: 'Your ID needs another look', body: 'We couldn’t verify the photo you sent. Send a clearer one (good light, all corners visible) and you’ll be back in the listings once it’s approved.' },
  not_submitted: { icon: 'idCard', title: 'Not live yet', body: 'Complete your companion profile to go live.' },
};

/** Screen 19 · Verification status for companions. */
export default function Verification() {
  const updateUser = useSession((s) => s.updateUser);
  const q = useQuery({ queryKey: qk.profileCheck, queryFn: svc.checkProfile, refetchInterval: 60_000 });
  const status = (q.data?.status === 'not_found' ? 'not_submitted' : q.data?.status) ?? 'id_required';
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
        ) : status === 'rejected' || status === 'id_required' ? (
          <View style={{ gap: space.xs }}>
            <Button label={status === 'rejected' ? 'Send a new ID' : 'Verify my ID now'} icon="shieldCheck" onPress={() => router.push('/fellow/verify-id')} />
            {status === 'rejected' ? <Button label="Contact support" variant="ghost" onPress={() => Linking.openURL(LINKS.support)} /> : <Button label="Later" variant="ghost" onPress={() => router.replace('/home')} />}
          </View>
        ) : (
          <Button label="Back to home" variant="secondary" onPress={() => router.replace('/home')} />
        )
      }
    >
      <Header title="ID check" onBack={() => router.replace('/home')} />
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
          ['Profile live', status !== 'not_submitted' && status !== 'rejected'],
          ['Photo ID and selfie', status === 'pending' || status === 'verified'],
          ['Safety check by our team', status === 'verified'],
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

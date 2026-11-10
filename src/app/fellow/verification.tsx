import { useEffect } from 'react';
import { Linking, RefreshControl, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Card } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Celebrate, Notice } from '@/components/ui/states';
import { svc } from '@/services';
import { LINKS } from '@/lib/config';
import { useSession } from '@/state/session';

const ID_COPY: Record<string, { icon: IconName; title: string; body: string }> = {
  id_required: { icon: 'sparkle', title: 'You’re live', body: 'Members in your city can find and book you. When your first booking arrives, we’ll ask for a photo ID and a selfie — about 2 minutes. You can also do it now.' },
  pending: { icon: 'clock', title: 'ID check in progress', body: 'Our team is checking your ID. Bookings you accept meanwhile are held for you and confirmed as soon as it’s approved.' },
  verified: { icon: 'badgeCheck', title: 'You’re verified', body: 'Your ID is approved. Every booking is one tap to accept.' },
  rejected: { icon: 'info', title: 'Your ID needs another look', body: 'We couldn’t verify the photo you sent. Send a clearer one (good light, all corners visible) and you’ll be back in the listings once it’s approved.' },
};

/** Companion status: profile approval by our team, then the ID check at the first booking. */
export default function Verification() {
  const { sent } = useLocalSearchParams<{ sent?: string }>();
  const updateUser = useSession((s) => s.updateUser);
  const user = useSession((s) => s.user);
  const q = useQuery({ queryKey: ['me'], queryFn: svc.me, refetchInterval: 30_000 });
  const me = q.data ?? user;

  useEffect(() => {
    if (q.data) void updateUser({ ...q.data, hasPin: user?.hasPin });
  }, [q.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const approval = me?.approvalStatus ?? 'draft';
  const id = me?.verification_status ?? 'id_required';
  const live = approval === 'approved';

  const footer =
    approval === 'changes_requested' ? (
      <Button label="Fix and resubmit" icon="edit" onPress={() => router.push({ pathname: '/fix', params: { target: 'profile' } })} />
    ) : approval === 'rejected' ? (
      <View style={{ gap: space.xs }}>
        <Button label="Update my profile" icon="edit" onPress={() => router.push({ pathname: '/fix', params: { target: 'profile' } })} />
        <Button label="Contact support" variant="ghost" onPress={() => Linking.openURL(LINKS.support)} />
      </View>
    ) : approval === 'draft' ? (
      <Button label="Complete my profile" onPress={() => router.replace('/fellow/onboarding')} />
    ) : live && (id === 'id_required' || id === 'rejected') ? (
      <View style={{ gap: space.xs }}>
        <Button label={id === 'rejected' ? 'Send a new ID' : 'Verify my ID now'} icon="shieldCheck" onPress={() => router.push('/fellow/verify-id')} />
        <Button label="Go to my dashboard" variant="ghost" onPress={() => router.replace('/home')} />
      </View>
    ) : (
      <Button label="Go to my dashboard" onPress={() => router.replace('/home')} />
    );

  return (
    <Screen refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />} footer={footer}>
      <Header title="My status" onBack={() => router.replace('/home')} />
      {approval === 'pending' ? (
        <Celebrate
          icon={sent === '1' ? 'check' : 'clock'}
          title={sent === '1' ? 'Profile sent for approval' : 'Your profile is being reviewed'}
          body="Our team reviews every companion before they go live — usually within 24 hours. We’ll let you know in your notifications."
        />
      ) : approval === 'approved' ? (
        <Celebrate icon={ID_COPY[id]?.icon ?? 'check'} title={ID_COPY[id]?.title ?? 'You’re live'} body={ID_COPY[id]?.body} />
      ) : approval === 'changes_requested' || approval === 'rejected' ? (
        <View style={{ gap: space.md, marginVertical: space.xl }}>
          <Text variant="title1">{approval === 'rejected' ? 'Your profile wasn’t approved' : 'A few changes, please'}</Text>
          <Notice tone="warning" text={`Our team says: “${me?.approvalNote ?? me?.photoNote ?? 'Please review your profile.'}”`} />
          <Text variant="callout" muted>
            Make the changes and send it back. It goes straight to the top of our review list.
          </Text>
        </View>
      ) : (
        <View style={{ marginVertical: space.xl }}>
          <Text variant="title1">Finish your profile</Text>
          <Text variant="callout" muted>
            Complete companion sign-up to go live.
          </Text>
        </View>
      )}

      <Card style={{ gap: space.md }}>
        {[
          ['Profile complete', approval !== 'draft', false],
          ['Approved by the prsnn team', live, approval === 'pending'],
          ['Live — members in your city can book you', live, false],
          ['First booking — quick ID check', id === 'verified', live && id === 'pending'],
        ].map(([label, done, now]) => (
          <View key={String(label)} style={styles.row}>
            <Icon name={done ? 'check' : 'clock'} size={18} color={done ? colors.moss : now ? colors.clay : colors.gray400} />
            <Text variant="callout" color={done || now ? colors.ink : colors.gray500}>
              {label as string}
            </Text>
          </View>
        ))}
      </Card>
      {live ? (
        <Card style={{ marginTop: space.md, backgroundColor: colors.green50, gap: 4 }}>
          <Text variant="headline">Tip: get booked sooner</Text>
          <Text variant="footnote" muted>
            Keep evenings and weekends open, and offer 2 and 4 hour bookings — they’re the easiest to say yes to.
          </Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});

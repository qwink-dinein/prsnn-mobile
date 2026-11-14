import { useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Avatar, Card, ListRow, Section, BellButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { RequestCard } from './RequestCard';
import { awaitingAnswer, earningsFor, formatINR } from '@/domain/booking';
import { svc, qk } from '@/services';
import { useSession } from '@/state/session';
import { companionStatusLine, isLiveCompanion } from '@/domain/verification';

/** Screen 20 · Companion dashboard. */
export function CompanionDashboard() {
  const user = useSession((s) => s.user);
  const q = useQuery({ queryKey: qk.incoming, queryFn: svc.incomingBookings });
  const check = useQuery({ queryKey: qk.profileCheck, queryFn: svc.checkProfile });
  const meQ = useQuery({ queryKey: ['me'], queryFn: svc.me, refetchInterval: 60_000 });
  const approval = meQ.data?.approvalStatus ?? user?.approvalStatus ?? 'approved';
  const now = new Date();
  const month = useMemo(() => earningsFor(q.data ?? [], now.getFullYear(), now.getMonth()), [q.data]); // eslint-disable-line react-hooks/exhaustive-deps
  const pending = (q.data ?? []).filter((b) => awaitingAnswer(b));
  const status = check.data && check.data.status !== 'not_found' ? check.data.status : user?.verification_status;
  const live = approval === 'approved' && isLiveCompanion(status);
  const verified = status === 'verified';

  return (
    <Screen refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => { q.refetch(); check.refetch(); meQ.refetch(); }} tintColor={colors.moss} />}>
      <View style={styles.head}>
        <Avatar uri={user?.profilePhoto} name={user?.fullName} size={56} />
        <View style={{ flex: 1 }}>
          <Text variant="caption" muted>
            Welcome back
          </Text>
          <Text variant="title2" numberOfLines={1}>
            {user?.fullName?.split(' ')[0] ?? 'there'}
          </Text>
          <View style={styles.status}>
            <View style={[styles.dot, { backgroundColor: live ? '#3FB950' : colors.clay }]} />
            <Text variant="footnote" muted>
              {approval === 'pending' ? 'Waiting for approval' : approval === 'changes_requested' ? 'Changes requested' : approval === 'rejected' ? 'Not approved' : companionStatusLine(status)}
            </Text>
          </View>
        </View>
        <BellButton />
      </View>

      {approval !== 'approved' ? (
        <Card style={[styles.banner, approval !== 'pending' && { backgroundColor: colors.warningSoft }]} onPress={() => router.push(approval === 'draft' ? '/fellow/onboarding' : approval === 'pending' ? '/fellow/verification' : { pathname: '/fix', params: { target: 'profile' } })} accessibilityLabel="Profile approval status">
          <Icon name={approval === 'pending' ? 'clock' : 'edit'} size={24} color={approval === 'pending' ? colors.moss : colors.clay} />
          <View style={{ flex: 1 }}>
            <Text variant="headline">{approval === 'pending' ? 'Your profile is being reviewed' : approval === 'draft' ? 'Finish your profile' : approval === 'rejected' ? 'Your profile wasn’t approved' : 'A few changes, please'}</Text>
            <Text variant="footnote" muted>
              {approval === 'pending' ? 'Usually within 24 hours. You go live as soon as it’s approved.' : approval === 'draft' ? 'Complete companion sign-up to go live.' : `“${meQ.data?.approvalNote ?? user?.approvalNote ?? 'See the note from our team.'}” Tap to fix and resubmit.`}
            </Text>
          </View>
          <Icon name="chevronRight" size={18} color={colors.gray400} />
        </Card>
      ) : !verified ? (
        <Card style={styles.banner} onPress={() => router.push(status === 'not_submitted' ? '/fellow/onboarding' : '/fellow/verification')} accessibilityLabel="ID check status">
          <Icon name="shieldCheck" size={24} color={colors.moss} />
          <View style={{ flex: 1 }}>
            <Text variant="headline">
              {status === 'not_submitted' ? 'Finish your profile' : status === 'id_required' && pending.length ? 'Your first booking is here' : status === 'id_required' ? 'You’re live' : status === 'pending' ? 'ID check in progress' : 'Your ID needs another look'}
            </Text>
            <Text variant="footnote" muted>
              {status === 'not_submitted'
                ? 'Complete your profile to go live.'
                : status === 'id_required'
                  ? pending.length
                    ? 'Verify your ID to accept it. About 2 minutes.'
                    : 'We’ll ask for a photo ID when your first booking arrives.'
                  : status === 'pending'
                    ? 'Bookings you accept are held for you until it’s approved.'
                    : 'You’re hidden from members until a new ID is approved. Tap to send one.'}
            </Text>
          </View>
          <Icon name="chevronRight" size={18} color={colors.gray400} />
        </Card>
      ) : null}

      <View style={styles.stats}>
        <Stat label="Sessions" value={String(month.sessions)} />
        <Stat label="Earnings" value={formatINR(month.total)} />
        <Stat label="Pending" value={String(pending.length)} />
      </View>
      <Text variant="caption" muted style={{ marginTop: space.xs }}>
        This month · paid sessions only
      </Text>

      {pending.length ? (
        <Section title="Waiting for your answer" action="See all" onAction={() => router.push('/bookings')}>
          <View style={{ gap: space.md }}>
            {pending.slice(0, 2).map((b) => (
              <RequestCard key={b._id} b={b} />
            ))}
          </View>
        </Section>
      ) : null}

      <View style={[styles.group, { marginTop: space.xxl }]}>
        <ListRow icon="calendar" label="Upcoming bookings" onPress={() => router.push('/bookings')} />
        <ListRow icon="wallet" label="Earnings" value={formatINR(month.total) + ' this month'} onPress={() => router.push('/fellow/earnings')} />
        <ListRow icon="edit" label="Edit profile" onPress={() => router.push('/edit-profile')} />
        <ListRow icon="clock" label="Packages & availability" value="Durations, days and hours" onPress={() => router.push('/fellow/availability')} last />
      </View>
      {!pending.length && live ? <Button label="Share your profile" variant="secondary" icon="users" onPress={() => router.push(`/companion/${user?.id}`)} /> : null}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="title3" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text variant="caption" muted>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingTop: space.sm, marginBottom: space.lg },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginBottom: space.lg, backgroundColor: colors.green50 },
  stats: { flexDirection: 'row', gap: space.sm },
  stat: { flex: 1, backgroundColor: colors.paper, borderRadius: radius.lg, padding: space.md, gap: 2, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, alignItems: 'center' },
  group: { backgroundColor: colors.paper, borderRadius: radius.xl, overflow: 'hidden', marginBottom: space.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
});

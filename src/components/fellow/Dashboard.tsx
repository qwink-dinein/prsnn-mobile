import { useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Avatar, Card, ListRow, Section, IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { RequestCard } from './RequestCard';
import { awaitingAnswer, earningsFor, formatINR } from '@/domain/booking';
import { svc, qk } from '@/services';
import { useSession } from '@/state/session';

/** Screen 20 · Companion dashboard. */
export function CompanionDashboard() {
  const user = useSession((s) => s.user);
  const q = useQuery({ queryKey: qk.incoming, queryFn: svc.incomingBookings });
  const check = useQuery({ queryKey: qk.profileCheck, queryFn: svc.checkProfile });
  const now = new Date();
  const month = useMemo(() => earningsFor(q.data ?? [], now.getFullYear(), now.getMonth()), [q.data]); // eslint-disable-line react-hooks/exhaustive-deps
  const pending = (q.data ?? []).filter((b) => awaitingAnswer(b));
  const status = check.data?.status ?? user?.verification_status;
  const live = status === 'verified';

  return (
    <Screen refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => { q.refetch(); check.refetch(); }} tintColor={colors.moss} />}>
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
              {live ? 'Live · accepting bookings' : status === 'pending' ? 'Verification in progress' : status === 'rejected' ? 'Verification needs attention' : 'Not live yet'}
            </Text>
          </View>
        </View>
        <IconButton name="bell" label="Notifications" onPress={() => router.push('/notifications')} />
      </View>

      {!live ? (
        <Card style={styles.banner} onPress={() => router.push(status === 'not_submitted' ? '/fellow/onboarding' : '/fellow/verification')} accessibilityLabel="Verification status">
          <Icon name="shieldCheck" size={24} color={colors.moss} />
          <View style={{ flex: 1 }}>
            <Text variant="headline">{status === 'not_submitted' ? 'Finish your profile' : 'Verification'}</Text>
            <Text variant="footnote" muted>
              {status === 'not_submitted' ? 'Complete onboarding to start receiving bookings.' : status === 'rejected' ? 'Your documents need another look. Tap for details.' : 'We usually review within 24–48 hours.'}
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

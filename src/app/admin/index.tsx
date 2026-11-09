import { RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Header, ListRow, Loading, ErrorState, Screen } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { StatTile } from '@/components/admin';
import { can, roleLabel } from '@/domain/admin';
import { formatINR } from '@/domain/booking';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';

/** Admin · Overview: what needs attention, then every section. */
export default function AdminOverview() {
  const role = useSession((s) => s.user?.role);
  const q = useQuery({ queryKey: qk.admin.overview, queryFn: svc.admin.overview, refetchInterval: 60_000 });
  const o = q.data;

  return (
    <Screen padded={false} refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}>
      <Header title="Admin" />
      <View style={{ paddingHorizontal: 20, gap: space.lg }}>
        <Text variant="footnote" muted>
          Signed in as {role ? roleLabel(role).toLowerCase() : 'staff'}.{role !== 'superadmin' ? ' Refunds, prices and broadcasts are handled by a superadmin.' : ''}
        </Text>
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
        ) : o ? (
          <>
            <View style={styles.grid}>
              <StatTile icon="shieldCheck" label="Companions to verify" value={o.pendingVerifications} tone={o.pendingVerifications ? 'warning' : 'neutral'} onPress={() => router.push('/admin/verify')} />
              <StatTile icon="calendar" label="Live bookings" value={o.liveBookings} onPress={() => router.push('/admin/bookings')} />
              <StatTile icon="flag" label="Open disputes" value={o.openDisputes} tone={o.openDisputes ? 'danger' : 'neutral'} onPress={() => router.push('/admin/disputes')} />
              <StatTile
                icon="rupee"
                label={o.failedRefunds ? `Refunds to decide · ${o.failedRefunds} failed` : 'Refunds to decide'}
                value={o.refundsToReview + o.failedRefunds}
                tone={o.failedRefunds ? 'danger' : o.refundsToReview ? 'warning' : 'neutral'}
                onPress={() => router.push({ pathname: '/admin/bookings', params: { tab: 'refunds' } })}
              />
            </View>
            <Text variant="footnote" muted>
              {o.members} members · {o.companions} verified companions · {o.bookingsToday} bookings today
            </Text>
            {o.money ? (
              <View style={styles.money} accessible accessibilityLabel={`Collected ${formatINR(o.money.collected)}, refunded ${formatINR(o.money.refunded)}, companion payouts ${formatINR(o.money.companionPayouts)}, prsnn net ${formatINR(o.money.platformNet)}`}>
                <Text variant="subhead" color={colors.gray600}>
                  Money (all time)
                </Text>
                <View style={styles.moneyRow}>
                  <Money label="Collected" v={o.money.collected} />
                  <Money label="Refunded" v={o.money.refunded} />
                </View>
                <View style={styles.moneyRow}>
                  <Money label="Companion payouts" v={o.money.companionPayouts} />
                  <Money label="prsnn net" v={o.money.platformNet} />
                </View>
              </View>
            ) : null}
          </>
        ) : null}

        <View style={styles.group}>
          <ListRow icon="shieldCheck" label="Verify companions" onPress={() => router.push('/admin/verify')} />
          <ListRow icon="calendar" label="Bookings" value="Live · Refunds · Done" onPress={() => router.push('/admin/bookings')} />
          <ListRow icon="flag" label="Disputes" onPress={() => router.push('/admin/disputes')} />
          <ListRow icon="users" label="Users" value="Search, edit, suspend" onPress={() => router.push('/admin/users')} last={!can(role, 'editPrices')} />
          {can(role, 'manageAdmins') ? <ListRow icon="shield" label="Sub-admins" onPress={() => router.push('/admin/admins')} /> : null}
          {can(role, 'editPrices') ? <ListRow icon="rupee" label="Prices" value="Packages, split, cancellation" onPress={() => router.push('/admin/prices')} /> : null}
          {can(role, 'broadcast') ? <ListRow icon="send" label="Broadcast" value="Push to members or companions" onPress={() => router.push('/admin/broadcast')} /> : null}
          {can(role, 'viewActivity') ? <ListRow icon="doc" label="Activity log" onPress={() => router.push('/admin/activity')} last /> : null}
        </View>
      </View>
    </Screen>
  );
}

function Money({ label, v }: { label: string; v: number }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text variant="headline">{formatINR(v)}</Text>
      <Text variant="caption" muted>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  money: { gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.green50, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.mossSoft },
  moneyRow: { flexDirection: 'row', gap: space.md },
  group: { backgroundColor: colors.paper, borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, overflow: 'hidden', marginBottom: space.xl },
});

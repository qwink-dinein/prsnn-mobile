import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { Icon } from '@/components/ui/Icon';
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
  const counts = useQuery({ queryKey: ['admin', 'counts'], queryFn: svc.admin.approvalCounts, refetchInterval: 20_000 });
  const panics = useQuery({ queryKey: ['admin', 'panics', true], queryFn: () => svc.admin.panics(true), refetchInterval: 15_000 });
  const o = q.data;
  const c = counts.data;

  return (
    <Screen padded={false} refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void Promise.all([q.refetch(), counts.refetch(), panics.refetch()])} tintColor={colors.moss} />}>
      <Header title="Admin" />
      <View style={{ paddingHorizontal: 20, gap: space.lg }}>
        <Text variant="footnote" muted>
          Signed in as {role ? roleLabel(role).toLowerCase() : 'staff'}.{role !== 'superadmin' ? ' Refunds, prices and broadcasts are handled by a superadmin.' : ''}
        </Text>
        {(panics.data ?? []).map((a) => (
          <PanicBanner key={a.id} name={a.raisedRole === 'member' ? a.member.name : a.companion.name} role={a.raisedRole} ref_={a.ref} sends={a.sends} at={a.raisedAt} onPress={() => router.push({ pathname: '/admin/panic/[id]', params: { id: a.id } })} />
        ))}
        {c ? (
          <View style={styles.grid}>
            <StatTile icon="users" label="Companion profiles to approve" value={c.companions} tone={c.companions ? 'warning' : 'neutral'} onPress={() => router.push('/admin/approvals')} />
            <StatTile icon="camera" label="Member photos to approve" value={c.photos} tone={c.photos ? 'warning' : 'neutral'} onPress={() => router.push({ pathname: '/admin/approvals', params: { tab: 'photos' } })} />
          </View>
        ) : null}
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
        ) : o ? (
          <>
            <View style={styles.grid}>
              <StatTile icon="shieldCheck" label="ID checks" value={o.pendingVerifications} tone={o.pendingVerifications ? 'warning' : 'neutral'} onPress={() => router.push('/admin/verify')} />
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
          <ListRow icon="info" label="Panic alerts" value={panics.data?.length ? `${panics.data.length} open` : 'None open'} onPress={() => router.push('/admin/panics')} />
          <ListRow icon="users" label="Approvals" value="Companion profiles · member photos" onPress={() => router.push('/admin/approvals')} />
          <ListRow icon="shieldCheck" label="ID checks" value="Held bookings first" onPress={() => router.push('/admin/verify')} />
          <ListRow icon="mapPin" label="City plans" value="“Popular in your city”" onPress={() => router.push('/admin/plans')} />
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

function PanicBanner({ name, role, ref_, sends, at, onPress }: { name: string; role: string; ref_: string; sends: number; at: string; onPress: () => void }) {
  const reduced = useReducedMotion();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Panic alert from ${name}, booking ${ref_}. Open it.`} onPress={onPress}>
      <Animated.View style={[styles.panic, reduced ? null : { animationName: BLINK, animationDuration: 1200, animationIterationCount: 'infinite', animationDirection: 'alternate' }]}>
        <View style={styles.sos}>
          <Text variant="caption" color={colors.paper} style={{ fontWeight: '800' }}>
            SOS
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="headline" color={colors.paper}>
            Panic alert · #{ref_}
          </Text>
          <Text variant="footnote" color={colors.paper} style={{ opacity: 0.9 }}>
            {name} ({role}) · {new Date(at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} · sent {sends}×
          </Text>
        </View>
        <Icon name="chevronRight" size={18} color={colors.paper} />
      </Animated.View>
    </Pressable>
  );
}
const BLINK = { from: { opacity: 1 }, to: { opacity: 0.78 } };

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
  panic: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.danger },
  sos: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  group: { backgroundColor: colors.paper, borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, overflow: 'hidden', marginBottom: space.xl },
});

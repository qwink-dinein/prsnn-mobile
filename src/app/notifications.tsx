import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { PressScale } from '@/components/ui/motion';
import { Skeleton } from '@/components/ui/states';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useConfirm } from '@/components/ui/confirm';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Header, Segmented, EmptyState, ErrorState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { AppNotification, NotificationType } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { ago } from '@/domain/time';

type Filter = 'all' | 'bookings' | 'payments';
const ICON: Record<NotificationType, IconName> = {
  booking_request: 'calendar',
  booking_offer: 'calendar',
  booking_accepted: 'check',
  booking_confirmed: 'check',
  booking_cancelled: 'close',
  payment_completed: 'rupee',
  refund: 'rupee',
  dispute: 'flag',
  other: 'sparkle',
  action_needed: 'edit',
  approval: 'badgeCheck',
  panic: 'info',
};

/** Where tapping a notification goes. */
function open(n: AppNotification) {
  const a = n.action;
  if (!a) return;
  if (a.kind === 'fix' || a.kind === 'rejected') router.push({ pathname: '/fix', params: { target: a.target ?? 'photo' } });
  else if (a.kind === 'approved') router.push('/fellow/verification');
  else if (a.kind === 'review') router.push('/admin/approvals');
  else if (a.kind === 'panic' && a.alertId) router.push({ pathname: '/admin/panic/[id]', params: { id: a.alertId } });
  else if (a.kind === 'panic_resolved' && a.bookingId) router.push(`/booking/${a.bookingId}`);
}
const inFilter = (n: AppNotification, f: Filter) => f === 'all' || (f === 'bookings' ? n.type.startsWith('booking') || n.type === 'dispute' || n.type === 'panic' : n.type === 'payment_completed' || n.type === 'refund');

/** Screen 16 · Notifications. */
export default function Notifications() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [filter, setFilter] = useState<Filter>('all');
  const q = useQuery({ queryKey: qk.notifications, queryFn: svc.notifications });
  const clear = useMutation({
    mutationFn: svc.clearNotifications,
    onSuccess: () => qc.setQueryData(qk.notifications, []),
    onError: (e) => confirm({ title: 'Could not clear', message: errorMessage(e) }),
  });
  // Panic alerts and things to fix come first.
  const rank = (n: AppNotification) => (n.type === 'panic' && n.action?.kind === 'panic' ? 0 : n.type === 'action_needed' && !n.isRead ? 1 : 2);
  const list = useMemo(() => (q.data ?? []).filter((n) => inFilter(n, filter)).sort((a, b) => rank(a) - rank(b)), [q.data, filter]);
  // Opening the bell marks everything read (after a moment, so unread ones are still highlighted).
  useEffect(() => {
    if (!q.data?.some((n) => !n.isRead)) return;
    const t = setTimeout(() => svc.markNotificationsRead().then(() => qc.invalidateQueries({ queryKey: ['notifications', 'unread'] })).catch(() => {}), 2500);
    return () => clearTimeout(t);
  }, [q.data, qc]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header
        title="Notifications"
        right={
          q.data?.length ? (
            <Text
              variant="subhead"
              color={colors.moss}
              accessibilityRole="button"
              style={{ padding: space.md }}
              onPress={async () => {
                if (await confirm({ title: 'Clear all notifications?', confirmLabel: 'Clear all', destructive: true })) clear.mutate();
              }}
            >
              Clear
            </Text>
          ) : undefined
        }
      />
      <View style={{ paddingHorizontal: GUTTER, paddingBottom: space.sm }}>
        <Segmented
          options={[
            { value: 'all', label: 'All' },
            { value: 'bookings', label: 'Bookings' },
            { value: 'payments', label: 'Payments' },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </View>
      {q.isLoading ? (
        <View style={{ padding: GUTTER }}>
          <Skeleton rows={5} height={72} />
        </View>
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(n) => n._id}
          contentContainerStyle={{ padding: GUTTER, gap: space.sm, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          renderItem={({ item }) =>
            item.type === 'action_needed' ? (
              <View style={styles.action} accessible accessibilityLabel={`Action needed from the prsnn team: ${item.message}`}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                  <View style={styles.actionPill}>
                    <Text variant="caption" color={colors.clay} style={{ fontWeight: '700' }}>
                      Action needed
                    </Text>
                  </View>
                  <Text variant="caption" muted>
                    from the prsnn team · {ago(item.createdAt)}
                  </Text>
                </View>
                <Text variant="callout">“{item.message}”</Text>
                {item.action ? <Button label={item.action.kind === 'rejected' ? 'Update my profile' : 'Fix and resubmit'} icon="edit" compact onPress={() => open(item)} /> : null}
              </View>
            ) : (
              <PressScale
                disabled={!item.action}
                onPress={() => open(item)}
                accessibilityRole={item.action ? 'button' : undefined}
                accessibilityLabel={`${item.isRead ? '' : 'Unread. '}${item.message}, ${ago(item.createdAt)}`}
                innerStyle={[styles.item, !item.isRead && styles.unread, item.type === 'panic' && item.action?.kind === 'panic' && styles.panic]}
              >
                <View style={[styles.icon, item.type === 'panic' && { backgroundColor: colors.dangerSoft }]}>
                  <Icon name={ICON[item.type] ?? 'bell'} size={20} color={item.type === 'panic' ? colors.danger : colors.moss} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="callout">{item.message}</Text>
                  <Text variant="caption" muted>
                    {ago(item.createdAt)}
                  </Text>
                </View>
                {item.action ? <Icon name="chevronRight" size={16} color={colors.gray400} /> : !item.isRead ? <View style={styles.dot} /> : null}
              </PressScale>
            )
          }
          ListEmptyComponent={<EmptyState icon="bell" title="You’re all caught up" body={filter === 'all' ? 'Booking updates, payments and messages from our team show up here.' : 'Nothing here yet. Try “All”.'} action={filter === 'all' ? undefined : 'Show all'} onAction={() => setFilter('all')} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  item: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  unread: { backgroundColor: colors.green50, borderColor: colors.mossSoft },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.clay },
  action: { gap: space.sm, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.warningSoft, borderWidth: 1, borderColor: '#E9DDC3' },
  actionPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: colors.paper },
  panic: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
});

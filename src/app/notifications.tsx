import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useConfirm } from '@/components/ui/confirm';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Header, Segmented, EmptyState, ErrorState, Loading } from '@/components/ui/layout';
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
};
const inFilter = (n: AppNotification, f: Filter) => f === 'all' || (f === 'bookings' ? n.type.startsWith('booking') || n.type === 'dispute' : n.type === 'payment_completed' || n.type === 'refund');

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
  const list = useMemo(() => (q.data ?? []).filter((n) => inFilter(n, filter)), [q.data, filter]);

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
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(n) => n._id}
          contentContainerStyle={{ padding: GUTTER, gap: space.sm, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          renderItem={({ item }) => (
            <View style={[styles.item, !item.isRead && styles.unread]} accessible accessibilityLabel={`${item.isRead ? '' : 'Unread. '}${item.message}, ${ago(item.createdAt)}`}>
              <View style={styles.icon}>
                <Icon name={ICON[item.type] ?? 'bell'} size={20} color={colors.moss} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="callout">{item.message}</Text>
                <Text variant="caption" muted>
                  {ago(item.createdAt)}
                </Text>
              </View>
              {!item.isRead ? <View style={styles.dot} /> : null}
            </View>
          )}
          ListEmptyComponent={<EmptyState icon="bell" title="You’re all caught up" body="Booking updates and payments will show up here." />}
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
});

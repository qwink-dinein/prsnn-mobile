import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Header, Segmented, Loading, ErrorState, EmptyState } from '@/components/ui/layout';
import { AdminBookingRow } from '@/components/admin';
import type { BookingTab } from '@/domain/admin';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

const EMPTY: Record<BookingTab, { title: string; body: string }> = {
  live: { title: 'No live bookings', body: 'Unpaid, finding a companion and confirmed bookings show up here.' },
  refunds: { title: 'No refunds to handle', body: 'Refunds that need a decision, failed refunds and recent refunds show up here.' },
  done: { title: 'Nothing finished yet', body: 'Completed and cancelled bookings show up here.' },
};

/** Admin · Bookings: Live / Refunds / Done. */
export default function AdminBookings() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<BookingTab>(params.tab === 'refunds' || params.tab === 'done' ? params.tab : 'live');
  const q = useQuery({ queryKey: qk.admin.bookings(tab), queryFn: () => svc.admin.bookings(tab) });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Bookings" />
      <View style={{ paddingHorizontal: GUTTER, paddingBottom: space.sm }}>
        <Segmented
          options={[
            { value: 'live', label: 'Live' },
            { value: 'refunds', label: 'Refunds' },
            { value: 'done', label: 'Done' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={q.data ?? []}
          keyExtractor={(b) => b._id}
          contentContainerStyle={{ padding: GUTTER, gap: space.sm, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          renderItem={({ item }) => <AdminBookingRow b={item} />}
          ListEmptyComponent={<EmptyState icon="calendar" title={EMPTY[tab].title} body={EMPTY[tab].body} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.mist } });

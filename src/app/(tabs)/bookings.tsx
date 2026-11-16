import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, space } from '@/theme/tokens';
import { EmptyState, ErrorState, Loading, Segmented } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { BookingCard } from '@/components/bookings';
import { RequestCard } from '@/components/fellow/RequestCard';
import { awaitingAnswer, isMineAsCompanion, sideOf, startsAt, tabOf, type BookingTab } from '@/domain/booking';
import type { Booking } from '@/domain/types';
import { useAllMyBookings } from '@/lib/myBookings';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';

const TABS: { value: BookingTab; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'cancelled', label: 'Cancelled' },
];

/**
 * Screen 14 · My bookings. Companions see the requests they received and, alongside them, any
 * bookings they made themselves as a member (the side is read per booking, never from the role).
 */
export default function BookingsTab() {
  const meId = useSession((s) => s.user?.id);
  const [tab, setTab] = useState<BookingTab>('upcoming');
  const q = useAllMyBookings();
  const isCompanion = q.isCompanion;

  const list = useMemo(() => {
    const now = new Date();
    // Companions: offers that ended without them (declined, expired, taken) sit under "Cancelled".
    const asCompanion = (b: Booking) => sideOf(b, meId) === 'companion';
    const tabFor = (b: Booking) => (asCompanion(b) && b.flow === 'prepaid' && !isMineAsCompanion(b) && !awaitingAnswer(b, now) ? 'cancelled' : tabOf(b, now));
    const rows = (q.data ?? []).filter((b) => tabFor(b) === tab);
    // Upcoming: soonest first. Past/cancelled: most recent first.
    return rows.sort((a, b) => (tab === 'upcoming' ? 1 : -1) * (startsAt(a).getTime() - startsAt(b).getTime()));
  }, [q.data, tab, meId]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        <Text variant="title2" accessibilityRole="header">
          {isCompanion ? 'Booking requests' : 'My bookings'}
        </Text>
        <Segmented options={TABS} value={tab} onChange={setTab} />
      </View>
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(b) => b._id}
          contentContainerStyle={{ padding: GUTTER, gap: space.md, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          renderItem={({ item }) => (sideOf(item, meId) === 'companion' ? <RequestCard b={item} /> : <BookingCard b={item} />)}
          ListEmptyComponent={
            tab === 'upcoming' ? (
              isCompanion ? (
                <EmptyState icon="calendar" title="No requests yet" body="When someone books you, the request shows up here for you to accept." />
              ) : (
                <EmptyState icon="calendar" title="No upcoming bookings" body="Find someone to spend time with — coffee, a walk, an event." action="Find a companion" onAction={() => router.push('/search')} />
              )
            ) : (
              <EmptyState icon="calendar" title={tab === 'past' ? 'No past bookings' : 'Nothing cancelled'} />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  head: { paddingHorizontal: GUTTER, paddingTop: space.sm, gap: space.md },
});

import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Header, Segmented, Loading, ErrorState, EmptyState, Card, Pill } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { personName } from '@/domain/admin';
import { ago } from '@/domain/time';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Admin · Disputes: open (oldest first) and resolved. Opens the booking to reply, read the chat or close. */
export default function AdminDisputes() {
  const [status, setStatus] = useState<'open' | 'resolved'>('open');
  const q = useQuery({ queryKey: qk.admin.disputes(status), queryFn: () => svc.admin.disputes(status) });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Disputes" />
      <View style={{ paddingHorizontal: GUTTER, paddingBottom: space.sm }}>
        <Segmented
          options={[
            { value: 'open', label: 'Open' },
            { value: 'resolved', label: 'Resolved' },
          ]}
          value={status}
          onChange={setStatus}
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
          ListEmptyComponent={<EmptyState icon="flag" title={status === 'open' ? 'No open disputes' : 'No resolved disputes yet'} body="Problems reported on a booking show up here." />}
          renderItem={({ item: b }) => (
            <Card onPress={() => router.push(`/admin/booking/${b._id}`)} accessibilityLabel={`Dispute on booking ${b.ref}`} style={{ gap: space.xs, padding: space.md }}>
              <View style={styles.top}>
                <Text variant="headline">#{b.ref}</Text>
                <Pill label={status === 'open' ? `${b.dispute?.notes?.length ?? 0} replies` : 'Resolved'} tone={status === 'open' ? 'danger' : 'success'} />
                <View style={{ flex: 1 }} />
                <Text variant="caption" muted>
                  {b.dispute?.openedAt ? ago(b.dispute.openedAt) : ''}
                </Text>
              </View>
              <Text variant="callout" numberOfLines={3}>
                {b.dispute?.reason}
              </Text>
              <Text variant="footnote" muted>
                {personName(b.requesterId, 'Member')} · {personName(b.companionId, 'no companion')}
              </Text>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
});

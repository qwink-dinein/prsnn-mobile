import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Header, Loading, ErrorState, EmptyState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { AdminGate } from '@/components/admin';
import { describeAction, roleLabel } from '@/domain/admin';
import type { AuditEntry } from '@/domain/types';
import { ago } from '@/domain/time';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Admin · Activity log (superadmin): every admin action, newest first. */
export default function AdminActivity() {
  return (
    <AdminGate superOnly>
      <Activity />
    </AdminGate>
  );
}

const short = (o?: Record<string, unknown>) =>
  o && Object.keys(o).length
    ? Object.entries(o)
        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
        .join(' · ')
        .slice(0, 240)
    : '';

function Activity() {
  const q = useInfiniteQuery({
    queryKey: qk.admin.activity,
    queryFn: ({ pageParam }) => svc.admin.activity(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.length === 50 ? last[last.length - 1].at : undefined),
  });
  const rows = q.data?.pages.flat() ?? [];

  const open = (e: AuditEntry) => {
    if (e.target?.kind === 'booking' && e.target.id && e.action !== 'booking.delete') router.push(`/admin/booking/${e.target.id}`);
    else if (e.target?.kind === 'user' && e.target.id && e.action !== 'user.delete') router.push(`/admin/user/${e.target.id}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Activity" />
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(e) => e._id}
          contentContainerStyle={{ padding: GUTTER, gap: space.sm, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching && !q.isFetchingNextPage} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          ListEmptyComponent={<EmptyState icon="doc" title="No admin activity yet" body="Every admin action is recorded here." />}
          ListFooterComponent={q.hasNextPage ? <Button label="Load more" variant="secondary" loading={q.isFetchingNextPage} onPress={() => void q.fetchNextPage()} /> : undefined}
          renderItem={({ item: e }) => {
            const diff = [short(e.before) && `before ${short(e.before)}`, short(e.after) && `after ${short(e.after)}`].filter(Boolean).join('\n');
            return (
              <Pressable style={({ pressed }) => [styles.item, pressed && { opacity: 0.85 }]} accessibilityRole={e.target?.id ? 'button' : undefined} accessibilityLabel={`${e.actorName || roleLabel(e.role)} ${describeAction(e.action)}, ${ago(e.at)}`} onPress={() => open(e)}>
                <Text variant="callout">
                  <Text variant="headline">{e.actorName || roleLabel(e.role)}</Text> {describeAction(e.action)}
                  {e.target?.id ? ` · #${String(e.target.id).slice(-6).toUpperCase()}` : ''}
                </Text>
                {diff ? (
                  <Text variant="caption" muted numberOfLines={4}>
                    {diff}
                  </Text>
                ) : null}
                <Text variant="caption" muted>
                  {roleLabel(e.role)} · {ago(e.at)}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  item: { gap: 4, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
});

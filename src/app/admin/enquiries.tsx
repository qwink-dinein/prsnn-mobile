import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Header, Loading, ErrorState, EmptyState, Pill } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { ago } from '@/domain/time';

const LABEL = { member: 'Find company', companion: 'Companion', both: 'Both' } as const;

/** Admin · Interested: mobile numbers left on the website, with what they're interested in. */
export default function Enquiries() {
  const q = useQuery({ queryKey: qk.admin.enquiries, queryFn: () => svc.admin.enquiries(500) });
  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={errorMessage(q.error)} onRetry={() => void q.refetch()} />;
  const { counts, items } = q.data;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mist }} edges={['top']}>
      <Header title="Interested (website)" />
      <FlatList
        data={items}
        keyExtractor={(e) => e.phone}
        contentContainerStyle={{ padding: GUTTER, gap: space.sm, paddingBottom: space.huge }}
        refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
        ListHeaderComponent={
          <View style={styles.counts} accessible accessibilityLabel={`${counts.total} people: ${counts.member} find company, ${counts.companion} companion, ${counts.both} both`}>
            {([['Total', counts.total], ['Find company', counts.member], ['Companion', counts.companion], ['Both', counts.both]] as const).map(([l, n]) => (
              <View key={l} style={styles.count}>
                <Text variant="title2">{n}</Text>
                <Text variant="caption" muted numberOfLines={1}>{l}</Text>
              </View>
            ))}
          </View>
        }
        ListEmptyComponent={<EmptyState icon="users" title="No one yet" body="Numbers left on the website’s “Count me in” form show here." />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text variant="headline" selectable>{item.phone}</Text>
              <Text variant="caption" muted numberOfLines={1}>
                {item.source.replace('website:', 'from /')} · {ago(item.updatedAt)}{item.submissions > 1 ? ` · ${item.submissions}×` : ''}
              </Text>
            </View>
            <Pill label={LABEL[item.interest]} tone={item.interest === 'member' ? 'neutral' : 'success'} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  counts: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginBottom: space.md },
  count: { flexGrow: 1, flexBasis: '22%', minWidth: 72, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
});

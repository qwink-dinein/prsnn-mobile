import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Header, Loading, ErrorState, EmptyState, Pill, Segmented } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { svc, qk } from '@/services';
import type { EnquiryList, SignupList } from '@/services/backend';
import { errorMessage } from '@/lib/api';
import { ago } from '@/domain/time';
import { roleLabel, signupDetails, topCategories } from '@/domain/interest';

const LABEL = { member: 'Find company', companion: 'Companion', both: 'Both' } as const;
type Tab = 'website' | 'app';

/**
 * Admin · Interested: numbers left on the website (with what they're interested in), and
 * everyone who signed up in the app with what they chose there.
 */
export default function Interested() {
  const [tab, setTab] = useState<Tab>('website');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mist }} edges={['top']}>
      <Header title="Interested" />
      <View style={{ paddingHorizontal: GUTTER, paddingBottom: space.sm }}>
        <Segmented<Tab> options={[{ value: 'website', label: 'Website' }, { value: 'app', label: 'App sign-ups' }]} value={tab} onChange={setTab} />
      </View>
      {tab === 'website' ? <Website /> : <AppSignups />}
    </SafeAreaView>
  );
}

function Counts({ items, label }: { items: readonly (readonly [string, number])[]; label: string }) {
  return (
    <View style={styles.counts} accessible accessibilityLabel={label}>
      {items.map(([l, n]) => (
        <View key={l} style={styles.count}>
          <Text variant="title2">{n}</Text>
          <Text variant="caption" muted numberOfLines={1}>
            {l}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Website() {
  const q = useQuery({ queryKey: qk.admin.enquiries, queryFn: () => svc.admin.enquiries(500) });
  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={errorMessage(q.error)} onRetry={() => void q.refetch()} />;
  const { counts, items } = q.data as EnquiryList;
  return (
    <FlatList
      data={items}
      keyExtractor={(e) => e.phone}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
      ListHeaderComponent={
        <Counts
          label={`${counts.total} numbers: ${counts.member} find company, ${counts.companion} companion, ${counts.both} both`}
          items={[['Total', counts.total], ['Members', counts.member], ['Companions', counts.companion], ['Both', counts.both]]}
        />
      }
      ListEmptyComponent={<EmptyState icon="users" title="No one yet" body="Numbers left on the website’s “Count me in” form show here." />}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <Text variant="headline" selectable>
              {item.phone}
            </Text>
            <Text variant="caption" muted numberOfLines={1}>
              {item.source.replace('website:', 'from /')} · {ago(item.updatedAt)}
              {item.submissions > 1 ? ` · ${item.submissions}×` : ''}
              {item.joinedApp ? ' · joined the app' : ''}
            </Text>
          </View>
          <Pill label={LABEL[item.interest]} tone={item.interest === 'member' ? 'neutral' : 'success'} />
        </View>
      )}
    />
  );
}

function AppSignups() {
  const q = useQuery({ queryKey: qk.admin.signups, queryFn: () => svc.admin.signups(500) });
  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={errorMessage(q.error)} onRetry={() => void q.refetch()} />;
  const { counts, items } = q.data as SignupList;
  const top = topCategories(counts.categories);
  return (
    <FlatList
      data={items}
      keyExtractor={(u) => u.id}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
      ListHeaderComponent={
        <View>
          <Counts
            label={`${counts.total} sign-ups: ${counts.member} find company, ${counts.companion} companions, ${counts.setupDone} finished setup`}
            items={[['Total', counts.total], ['Members', counts.member], ['Companions', counts.companion], ['Set up', counts.setupDone]]}
          />
          {top.length > 0 && (
            <View style={styles.card} accessible accessibilityLabel={`What members want: ${top.map((c) => `${c.title} ${c.n}`).join(', ')}`}>
              <Text variant="subhead" style={{ marginBottom: space.xs }}>
                What members want
              </Text>
              {top.map((c) => (
                <View key={c.key} style={styles.bar}>
                  <Text variant="footnote" numberOfLines={1} style={{ flex: 1.6 }}>
                    {c.title}
                  </Text>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${Math.round((c.n / Math.max(1, top[0].n)) * 100)}%` }]} />
                  </View>
                  <Text variant="footnote" style={styles.n}>
                    {c.n}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      }
      ListEmptyComponent={<EmptyState icon="users" title="No sign-ups yet" body="People who sign up in the app show here with what they chose." />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(`/admin/user/${item.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`${item.fullName || 'No name yet'}, ${roleLabel(item.role)}. Open profile`}
          style={({ pressed }) => [styles.row, styles.signup, pressed && { opacity: 0.7 }]}
        >
          <View style={styles.top}>
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text variant="headline" numberOfLines={1}>
                {item.fullName || 'No name yet'}
              </Text>
              <Text variant="caption" muted numberOfLines={1} selectable>
                {item.phone ?? 'No number'} · joined {ago(item.createdAt)}
              </Text>
            </View>
            <Pill label={roleLabel(item.role)} tone={item.role === 'companion' ? 'success' : 'neutral'} />
          </View>
          {signupDetails(item).map(([k, v]) => (
            <View key={k} style={styles.detail}>
              <Text variant="caption" muted style={styles.key}>
                {k}
              </Text>
              <Text variant="footnote" style={{ flex: 1, minWidth: 0 }}>
                {v}
              </Text>
            </View>
          ))}
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: GUTTER, paddingTop: space.xs, gap: space.sm, paddingBottom: space.huge },
  counts: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginBottom: space.md },
  count: { flexGrow: 1, flexBasis: '22%', minWidth: 72, paddingVertical: space.md, paddingHorizontal: space.xs, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, alignItems: 'center' },
  card: { padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, marginBottom: space.md, gap: space.xs },
  bar: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.mist, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.champagneDeep },
  n: { width: 28, textAlign: 'right' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  signup: { flexDirection: 'column', alignItems: 'stretch', gap: space.xs },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  detail: { flexDirection: 'row', gap: space.sm },
  key: { width: 56, paddingTop: 1 },
});

import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { EmptyState, ErrorState, Header, Segmented } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { PressScale } from '@/components/ui/motion';
import { Skeleton } from '@/components/ui/states';
import { AdminGate } from '@/components/admin';
import { ago } from '@/domain/time';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';

/** Admin · Panic alerts: open ones first (refreshes every 15 s), then history. */
export default function Panics() {
  const [tab, setTab] = useState<'open' | 'all'>('open');
  const q = useQuery({ queryKey: ['admin', 'panics', tab === 'open'], queryFn: () => svc.admin.panics(tab === 'open'), refetchInterval: 15_000 });
  return (
    <AdminGate>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Header title="Panic alerts" />
        <View style={{ paddingHorizontal: GUTTER, paddingBottom: space.sm }}>
          <Segmented
            options={[
              { value: 'open', label: 'Open' },
              { value: 'all', label: 'All' },
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>
        {q.isLoading ? (
          <View style={{ padding: GUTTER }}>
            <Skeleton rows={3} height={84} />
          </View>
        ) : q.isError ? (
          <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
        ) : (
          <FlatList
            data={q.data ?? []}
            keyExtractor={(a) => a.id}
            contentContainerStyle={{ padding: GUTTER, gap: space.md, paddingBottom: space.huge }}
            refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
            renderItem={({ item: a }) => {
              const open = !a.resolvedAt;
              return (
                <PressScale accessibilityRole="button" accessibilityLabel={`Panic alert ${a.ref}${open ? ', open' : ', resolved'}`} onPress={() => router.push({ pathname: '/admin/panic/[id]', params: { id: a.id } })} innerStyle={[styles.row, open && styles.open]}>
                  <View style={[styles.sos, !open && { backgroundColor: colors.mistDeep }]}>
                    <Text variant="caption" color={open ? colors.paper : colors.gray600} style={{ fontWeight: '800' }}>
                      SOS
                    </Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="headline" color={open ? colors.paper : colors.ink}>
                      #{a.ref} · {a.raisedRole === 'member' ? a.member.name : a.companion.name}
                    </Text>
                    <Text variant="footnote" color={open ? colors.paper : colors.gray600}>
                      {open ? `Open · sent ${a.sends}× · ${ago(a.raisedAt)}` : `Resolved by ${a.resolvedBy ?? '—'} · ${ago(a.resolvedAt!)}`}
                    </Text>
                  </View>
                  <Icon name="chevronRight" size={18} color={open ? colors.paper : colors.gray400} />
                </PressScale>
              );
            }}
            ListEmptyComponent={<EmptyState icon="shieldCheck" title={tab === 'open' ? 'No open alerts' : 'No alerts yet'} body="When someone presses the panic button, it shows here, on your phone and on WhatsApp — every 5 minutes until resolved." />}
          />
        )}
      </SafeAreaView>
    </AdminGate>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  open: { backgroundColor: colors.danger, borderColor: colors.danger },
  sos: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
});

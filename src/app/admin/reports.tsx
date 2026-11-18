import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Header, Segmented, Loading, ErrorState, EmptyState, Card, Pill } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { ago } from '@/domain/time';
import { displayPhone } from '@/domain/phone';
import type { AdminReport } from '@/domain/safety';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

const roleWord = (r?: string | null) => (r === 'companion' ? 'companion' : 'member');

/** Admin · Reports: people reported by members or companions. Open the person to suspend, or close with a note. */
export default function AdminReports() {
  const [status, setStatus] = useState<'open' | 'closed'>('open');
  const q = useQuery({ queryKey: qk.admin.reports(status), queryFn: () => svc.admin.reports(status), refetchInterval: 60_000 });
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Reports" />
      <View style={{ paddingHorizontal: GUTTER, paddingBottom: space.sm }}>
        <Segmented
          options={[
            { value: 'open', label: 'Open' },
            { value: 'closed', label: 'Closed' },
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
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ padding: GUTTER, gap: space.sm, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          renderItem={({ item }) => <ReportCard r={item} />}
          ListEmptyComponent={<EmptyState icon="flag" title={status === 'open' ? 'No open reports' : 'No closed reports yet'} body="When someone reports a member or companion, it shows up here and you get a notification." />}
        />
      )}
    </SafeAreaView>
  );
}

function ReportCard({ r }: { r: AdminReport }) {
  const [note, setNote] = useState('');
  const qc = useQueryClient();
  const close = useMutation({
    mutationFn: () => svc.admin.closeReport(r.id, note.trim()),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin', 'reports'] }),
  });
  const open = r.status === 'open';
  return (
    <Card style={{ gap: space.sm }}>
      <View style={styles.top}>
        <Pill label={r.reasonLabel} tone={r.reason === 'safety' || r.reason === 'harassment' ? 'danger' : 'warning'} />
        <Text variant="caption" muted>
          {ago(r.createdAt)}
        </Text>
      </View>
      <Text variant="headline">
        {r.reported.name || 'Deleted account'} ({roleWord(r.reported.role)}){r.reported.suspended ? ' · suspended' : ''}
      </Text>
      <Text variant="footnote" muted>
        Reported by {r.reporter.name || 'a deleted account'} ({roleWord(r.reporter.role)}){r.reporter.phone ? ` · ${displayPhone(r.reporter.phone)}` : ''}
        {r.booking ? ` · booking #${r.booking.ref}` : ''}
        {r.reported.reportsTotal && r.reported.reportsTotal > 1 ? ` · ${r.reported.reportsTotal} reports about them in total` : ''}
      </Text>
      {r.details ? <Text variant="callout">“{r.details}”</Text> : null}
      <View style={styles.actions}>
        {r.reported.id ? <Button label={`Open ${r.reported.name?.split(' ')[0] || 'profile'}`} variant="secondary" compact onPress={() => router.push(`/admin/user/${r.reported.id}`)} /> : null}
        {r.booking ? <Button label="Open booking" variant="secondary" compact onPress={() => router.push({ pathname: '/admin/booking/[id]', params: { id: r.booking!.id } })} /> : null}
      </View>
      {open ? (
        <View style={{ gap: space.sm }}>
          <TextField label="What you did (optional)" value={note} onChangeText={setNote} placeholder="Spoke to both · suspended · no action needed" />
          <Button label="Close report" compact loading={close.isPending} onPress={() => close.mutate()} />
          {close.isError ? <Text variant="footnote" color={colors.danger}>{errorMessage(close.error)}</Text> : null}
        </View>
      ) : r.resolution ? (
        <Text variant="footnote" muted>
          Closed{r.handledAt ? ` ${ago(r.handledAt)}` : ''}: {r.resolution}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});

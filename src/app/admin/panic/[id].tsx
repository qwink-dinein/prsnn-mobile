import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Card, EmptyState, ErrorState, Header, Loading, Screen } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/confirm';
import { Celebrate } from '@/components/ui/states';
import { AdminGate, InputSheet, KV } from '@/components/admin';
import { endTimeOf, formatTime } from '@/domain/booking';
import { formatDate } from '@/components/bookings';
import { displayPhone } from '@/domain/phone';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';

const tel = (p?: string | null) => (p ? `tel:+${p.replace(/\D/g, '')}` : null);

/** Admin · One panic alert: who, numbers, when, where; call either person; resolve to stop the repeats. */
export default function PanicDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['admin', 'panics', false], queryFn: () => svc.admin.panics(false), refetchInterval: 15_000 });
  const [resolving, setResolving] = useState(false);
  const resolve = useMutation({
    mutationFn: (note: string) => svc.admin.resolvePanic(id, note),
    onSuccess: () => {
      setResolving(false);
      qc.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (e) => confirm({ title: 'Couldn’t resolve', message: errorMessage(e) }),
  });

  return (
    <AdminGate>
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        (() => {
          const a = (q.data ?? []).find((x) => x.id === id);
          if (!a) return <EmptyState icon="search" title="Alert not found" body="It may have been removed." action="All alerts" onAction={() => router.replace('/admin/panics')} />;
          const open = !a.resolvedAt;
          if (resolve.isSuccess) {
            return (
              <Screen footer={<Button label="Back to alerts" onPress={() => router.replace('/admin/panics')} />}>
                <Celebrate title="Alert resolved" body="Repeats have stopped. The person who pressed it was told." />
              </Screen>
            );
          }
          const when = `${formatDate(a.scheduledDate)} · ${formatTime(a.startTime)} – ${formatTime(endTimeOf(a.startTime, String(a.duration)))}`;
          return (
            <Screen footer={open ? <Button label="Mark resolved — stop alerts" variant="danger" onPress={() => setResolving(true)} /> : undefined}>
              <Header title={`Alert #${a.ref}`} />
              <View style={[styles.head, !open && { backgroundColor: colors.paper }]}>
                <Text variant="title2" color={open ? colors.paper : colors.ink}>
                  {open ? 'PANIC — act now' : 'Resolved'}
                </Text>
                <Text variant="footnote" color={open ? colors.paper : colors.gray600}>
                  Pressed by {a.raisedRole === 'member' ? a.member.name : a.companion.name} ({a.raisedRole}) at {new Date(a.raisedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} · sent {a.sends}×{open ? ' · repeats every 5 min' : ''}
                  {a.resolvedAt ? ` · resolved by ${a.resolvedBy ?? '—'}${a.resolvedNote ? `: ${a.resolvedNote}` : ''}` : ''}
                </Text>
              </View>
              <Card style={{ gap: space.sm, marginTop: space.lg }}>
                <KV k="Member" v={`${a.member.name}${a.member.phone ? ` · ${displayPhone(a.member.phone)}` : ''}`} />
                <KV k="Companion" v={`${a.companion.name}${a.companion.phone ? ` · ${displayPhone(a.companion.phone)}` : ''}`} />
                {a.recipient ? <KV k="Meeting" v={`${a.recipient.name} (${a.recipient.relation})${a.recipient.phone ? ` · ${displayPhone(a.recipient.phone)}` : ''}`} /> : null}
                <KV k="When" v={when} />
                <KV k="Where" v={[a.meetingPlace, a.area, a.city].filter(Boolean).join(', ') || 'Not given'} />
              </Card>
              <View style={styles.calls}>
                <Button label={`Call ${a.member.name.split(' ')[0]}`} icon="phone" style={{ flex: 1 }} disabled={!tel(a.member.phone)} onPress={() => Linking.openURL(tel(a.member.phone)!)} />
                <Button label={`Call ${a.companion.name.split(' ')[0]}`} icon="phone" variant="secondary" style={{ flex: 1 }} disabled={!tel(a.companion.phone)} onPress={() => Linking.openURL(tel(a.companion.phone)!)} />
              </View>
              <Button label="Open the booking" variant="ghost" onPress={() => router.push(`/admin/booking/${a.bookingId}`)} />
              <InputSheet
                visible={resolving}
                title="Mark this alert resolved?"
                message="Repeats stop for every admin. Write what happened (kept in the activity log)."
                fields={[{ key: 'note', label: 'What happened', placeholder: 'e.g. Called both, all safe', multiline: true }]}
                confirmLabel="Resolve"
                busy={resolve.isPending}
                onClose={() => setResolving(false)}
                onSubmit={(v) => resolve.mutate(v.note)}
              />
            </Screen>
          );
        })()
      )}
    </AdminGate>
  );
}

const styles = StyleSheet.create({
  head: { gap: 4, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.danger, marginTop: space.sm },
  calls: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
});

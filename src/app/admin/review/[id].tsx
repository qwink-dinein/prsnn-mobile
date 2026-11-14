import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Card, Chip, ErrorState, Header, Loading, Screen } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/confirm';
import { Celebrate } from '@/components/ui/states';
import { AdminGate, InputSheet, KV } from '@/components/admin';
import { RequestChangesSheet } from '@/components/RequestChangesSheet';
import { categoryTitle } from '@/domain/categories';
import { displayPhone } from '@/domain/phone';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';

/** Admin · Review a companion profile: approve (goes live), ask for changes, or reject. */
export default function ReviewCompanion() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['admin', 'user', id], queryFn: () => svc.admin.user(id) });
  const [asking, setAsking] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['admin'] });
  };
  const decide = useMutation({
    mutationFn: (v: { decision: 'approve' | 'reject'; note?: string }) => svc.admin.decideProfile(id, v.decision, v.note),
    onSuccess: (r) => {
      refresh();
      setRejecting(false);
      setDone(r.message);
    },
    onError: (e) => confirm({ title: 'Couldn’t save', message: errorMessage(e) }),
  });

  return (
    <AdminGate>
      {done ? (
        <Screen footer={<Button label="Next in the queue" onPress={() => router.replace('/admin/approvals')} />}>
          <Celebrate title={done} body="They’ve been told in their notifications." />
        </Screen>
      ) : q.isLoading ? (
        <Loading />
      ) : q.isError || !q.data ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        (() => {
          const u = q.data.user;
          return (
            <Screen
              footer={
                <View style={{ gap: space.sm }}>
                  <Button
                    label="Approve — go live"
                    icon="check"
                    loading={decide.isPending && decide.variables?.decision === 'approve'}
                    onPress={async () => {
                      if (await confirm({ title: `Approve ${u.fullName}?`, message: 'They go live straight away. Their ID is still checked at their first booking.', confirmLabel: 'Approve' })) decide.mutate({ decision: 'approve' });
                    }}
                  />
                  <View style={{ flexDirection: 'row', gap: space.sm }}>
                    <Button label="Ask for changes" variant="secondary" style={{ flex: 1 }} onPress={() => setAsking(true)} />
                    <Button label="Reject" variant="danger" style={{ flex: 1 }} onPress={() => setRejecting(true)} />
                  </View>
                </View>
              }
            >
              <Header title={u.fullName || 'Companion'} />
              <View style={styles.top}>
                {u.profilePhotoUrl ? <Image source={{ uri: u.profilePhotoUrl }} style={styles.photo} contentFit="cover" /> : <View style={[styles.photo, { backgroundColor: colors.mistDeep }]} />}
                <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                  <Text variant="title2">{u.fullName}</Text>
                  <Text variant="footnote" muted>
                    {[u.gender, u.profileVisibility === 'locked' ? 'photo locked' : 'photo open'].filter(Boolean).join(' · ')}
                  </Text>
                </View>
              </View>
              <Card style={{ gap: space.sm, marginTop: space.lg }}>
                <KV k="Where" v={[u.area, u.city, u.state].filter(Boolean).join(', ')} />
                <KV k="Phone" v={u.phone ? displayPhone(u.phone) : undefined} />
                <KV k="Email" v={u.email ?? undefined} />
                <KV k="Hours" v={u.startTime && u.endTime ? `${u.startTime}–${u.endTime}` : undefined} />
                <KV k="Durations" v={u.packages?.length ? u.packages.map((h) => `${h} h`).join(', ') : undefined} />
              </Card>
              <Text variant="subhead" style={{ marginTop: space.lg, marginBottom: space.sm }}>
                About
              </Text>
              <Card>
                <Text variant="callout">{u.description || 'No bio yet.'}</Text>
              </Card>
              <Text variant="subhead" style={{ marginTop: space.lg, marginBottom: space.sm }}>
                Offers
              </Text>
              <View style={styles.chips}>
                {(u.categories ?? []).map((k) => (
                  <Chip key={k} label={categoryTitle(k)} />
                ))}
                {(u.tags ?? []).map((t) => (
                  <Chip key={t} label={t} />
                ))}
              </View>
              <RequestChangesSheet user={asking ? u : null} target="profile" onClose={() => setAsking(false)} onDone={() => {
                refresh();
                setDone('Changes requested');
              }} />
              <InputSheet
                visible={rejecting}
                title={`Reject ${u.fullName}?`}
                message="They’re told why and won’t be listed. Prefer “Ask for changes” if it can be fixed."
                fields={[{ key: 'note', label: 'Reason (they’ll see this)', multiline: true }]}
                confirmLabel="Reject"
                destructive
                busy={decide.isPending}
                onClose={() => setRejecting(false)}
                onSubmit={(v) => decide.mutate({ decision: 'reject', note: v.note })}
              />
            </Screen>
          );
        })()
      )}
    </AdminGate>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.lg, marginTop: space.sm },
  photo: { width: 110, height: 110, borderRadius: radius.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});

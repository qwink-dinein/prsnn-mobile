import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Header, Loading, ErrorState, EmptyState, Card, Avatar, Chip } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/confirm';
import { InputSheet, KV } from '@/components/admin';
import type { AdminUser } from '@/domain/types';
import { displayPhone } from '@/domain/phone';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Admin · Verify: companions waiting for ID review, oldest first. */
export default function AdminVerify() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [rejecting, setRejecting] = useState<AdminUser | null>(null);
  const q = useQuery({ queryKey: qk.admin.verifications, queryFn: svc.admin.verifications });
  const decide = useMutation({
    mutationFn: (v: { id: string; decision: 'verified' | 'rejected'; note?: string }) => svc.admin.decideVerification(v.id, v.decision, v.note),
    onSuccess: (r) => {
      setRejecting(null);
      qc.setQueryData<AdminUser[]>(qk.admin.verifications, (list) => list?.filter((u) => u.id !== r.user.id));
      void qc.invalidateQueries({ queryKey: qk.admin.overview });
    },
    onError: (e) => confirm({ title: 'Could not save', message: errorMessage(e) }),
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Verify companions" />
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={q.data ?? []}
          keyExtractor={(u) => u.id}
          contentContainerStyle={{ padding: GUTTER, gap: space.md, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          ListEmptyComponent={<EmptyState icon="shieldCheck" title="Nobody waiting" body="New companion applications show up here for ID review." />}
          renderItem={({ item: u }) => (
            <Card style={{ gap: space.md }}>
              <View style={styles.head}>
                <Avatar uri={u.profilePhotoUrl} name={u.fullName} size={56} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="headline">{u.fullName || 'No name'}</Text>
                  <Text variant="footnote" muted>
                    {[u.phone ? displayPhone(u.phone) : null, [u.area, u.city].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}
                  </Text>
                </View>
              </View>
              {u.description ? <Text variant="callout">{u.description}</Text> : null}
              {u.tags.length ? (
                <View style={styles.tags}>
                  {u.tags.map((t) => (
                    <Chip key={t} label={t} />
                  ))}
                </View>
              ) : null}
              <KV k="Gender" v={u.gender} />
              <KV k="Hours" v={u.startTime && u.endTime ? `${u.startTime}–${u.endTime}` : undefined} />
              <View style={styles.docs}>
                <Doc uri={u.idProofFrontUrl} label="ID front" />
                <Doc uri={u.idProofBackUrl} label="ID back" />
                <Doc uri={u.backupPhotoUrl} label="Selfie" />
              </View>
              <View style={styles.actions}>
                <Button label="Reject" variant="danger" compact style={{ flex: 1 }} onPress={() => setRejecting(u)} />
                <Button
                  label="Verify"
                  compact
                  style={{ flex: 1 }}
                  loading={decide.isPending && decide.variables?.id === u.id && decide.variables.decision === 'verified'}
                  onPress={async () => {
                    if (await confirm({ title: `Verify ${u.fullName || 'this companion'}?`, message: 'They become bookable straight away.', confirmLabel: 'Verify' })) decide.mutate({ id: u.id, decision: 'verified' });
                  }}
                />
              </View>
            </Card>
          )}
        />
      )}
      <InputSheet
        visible={!!rejecting}
        title={`Reject ${rejecting?.fullName || 'companion'}?`}
        message="They’ll see this note and can submit again."
        fields={[{ key: 'note', label: 'Reason', placeholder: 'e.g. ID photo is blurry', multiline: true }]}
        confirmLabel="Reject"
        destructive
        busy={decide.isPending}
        onClose={() => setRejecting(null)}
        onSubmit={(v) => rejecting && decide.mutate({ id: rejecting.id, decision: 'rejected', note: v.note })}
      />
    </SafeAreaView>
  );
}

function Doc({ uri, label }: { uri?: string; label: string }) {
  return (
    <View style={{ flex: 1, gap: 4 }}>
      {uri ? (
        <Image source={{ uri }} style={styles.doc} contentFit="cover" accessibilityLabel={label} />
      ) : (
        <View style={[styles.doc, styles.noDoc]}>
          <Text variant="caption" muted>
            Missing
          </Text>
        </View>
      )}
      <Text variant="caption" muted center>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  docs: { flexDirection: 'row', gap: space.sm },
  doc: { width: '100%', aspectRatio: 1, borderRadius: radius.md, backgroundColor: colors.mistDeep },
  noDoc: { alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: space.sm },
});

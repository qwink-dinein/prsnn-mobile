import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Avatar, Card, EmptyState, ErrorState, Header, Segmented } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { PressScale } from '@/components/ui/motion';
import { Skeleton } from '@/components/ui/states';
import { useConfirm } from '@/components/ui/confirm';
import { AdminGate } from '@/components/admin';
import { RequestChangesSheet } from '@/components/RequestChangesSheet';
import { ago } from '@/domain/time';
import type { AdminUser } from '@/domain/types';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';

type Tab = 'companions' | 'photos';

/** Admin · Approvals: every companion profile and every member photo, oldest first. */
export default function Approvals() {
  const params = useLocalSearchParams<{ tab?: Tab }>();
  const [tab, setTab] = useState<Tab>(params.tab === 'photos' ? 'photos' : 'companions');
  const qc = useQueryClient();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['admin', 'approvals', tab], queryFn: () => svc.admin.approvals(tab), refetchInterval: 30_000 });
  const [asking, setAsking] = useState<AdminUser | null>(null);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'approvals'] });
    qc.invalidateQueries({ queryKey: ['admin', 'counts'] });
  };
  const approvePhoto = useMutation({ mutationFn: (id: string) => svc.admin.approvePhoto(id), onSuccess: refresh, onError: (e) => confirm({ title: 'Couldn’t approve', message: errorMessage(e) }) });

  return (
    <AdminGate>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Header title="Approvals" />
        <View style={{ paddingHorizontal: GUTTER, paddingBottom: space.sm }}>
          <Segmented
            options={[
              { value: 'companions', label: 'Companion profiles' },
              { value: 'photos', label: 'Member photos' },
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>
        {q.isLoading ? (
          <View style={{ padding: GUTTER }}>
            <Skeleton rows={4} height={88} />
          </View>
        ) : q.isError ? (
          <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
        ) : (
          <FlatList
            data={q.data ?? []}
            keyExtractor={(u) => u.id}
            contentContainerStyle={{ padding: GUTTER, gap: space.md, paddingBottom: space.huge }}
            refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
            renderItem={({ item: u }) =>
              tab === 'companions' ? (
                <PressScale accessibilityRole="button" accessibilityLabel={`Review ${u.fullName}`} onPress={() => router.push({ pathname: '/admin/review/[id]', params: { id: u.id } })} innerStyle={styles.row}>
                  <Avatar uri={u.profilePhotoUrl} name={u.fullName} size={56} />
                  <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                    <Text variant="headline">{u.fullName || 'No name'}</Text>
                    <Text variant="footnote" muted numberOfLines={1}>
                      {[u.area, u.city].filter(Boolean).join(', ') || 'No area'} · {u.updatedAt ? ago(u.updatedAt) : ''}
                    </Text>
                  </View>
                  <Icon name="chevronRight" size={18} color={colors.gray400} />
                </PressScale>
              ) : (
                <Card style={{ gap: space.md }}>
                  <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
                    {u.profilePhotoUrl ? <Image source={{ uri: u.profilePhotoUrl }} style={styles.photo} contentFit="cover" /> : <View style={[styles.photo, { backgroundColor: colors.mistDeep }]} />}
                    <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                      <Text variant="headline">{u.fullName || 'No name'}</Text>
                      <Text variant="footnote" muted>
                        {u.role === 'companion' ? 'Companion' : 'Member'} · {u.city ?? ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: space.sm }}>
                    <Button label="Ask for a new photo" variant="secondary" compact style={{ flex: 1 }} onPress={() => setAsking(u)} />
                    <Button label="Approve" compact style={{ flex: 1 }} loading={approvePhoto.isPending && approvePhoto.variables === u.id} onPress={() => approvePhoto.mutate(u.id)} />
                  </View>
                </Card>
              )
            }
            ListEmptyComponent={<EmptyState icon="check" title="All caught up" body={tab === 'companions' ? 'New and resubmitted companion profiles show up here.' : 'New member photos show up here.'} />}
          />
        )}
        <RequestChangesSheet user={asking} target="photo" onClose={() => setAsking(null)} onDone={refresh} />
      </SafeAreaView>
    </AdminGate>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  photo: { width: 96, height: 96, borderRadius: radius.lg },
});

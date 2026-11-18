import { FlatList, StyleSheet, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Avatar, EmptyState, ErrorState, Header, Loading } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/confirm';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Profile → Blocked people: everyone I've blocked, with Unblock. */
export default function Blocked() {
  const q = useQuery({ queryKey: qk.blocks, queryFn: svc.myBlocks });
  const qc = useQueryClient();
  const confirm = useConfirm();
  const unblock = useMutation({
    mutationFn: (id: string) => svc.unblockUser(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.blocks });
      void qc.invalidateQueries({ queryKey: qk.companions });
    },
    onError: (e) => void confirm({ title: 'Couldn’t unblock', message: errorMessage(e) }),
  });
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Blocked people" />
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={q.data ?? []}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: GUTTER, gap: space.sm, paddingBottom: space.huge }}
          ListHeaderComponent={
            <Text variant="footnote" muted style={{ paddingBottom: space.sm }}>
              You and the people here don’t see each other, aren’t matched for bookings and can’t message each other.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Avatar uri={item.photo} name={item.name} size={48} />
              <Text variant="headline" style={{ flex: 1 }} numberOfLines={1}>
                {item.name}
              </Text>
              <Button
                label="Unblock"
                variant="secondary"
                compact
                loading={unblock.isPending && unblock.variables === item.id}
                accessibilityLabel={`Unblock ${item.name}`}
                onPress={async () => (await confirm({ title: `Unblock ${item.name}?`, message: 'You’ll be able to see and book each other again.', confirmLabel: 'Unblock' })) && unblock.mutate(item.id)}
              />
            </View>
          )}
          ListEmptyComponent={<EmptyState icon="shield" title="No one blocked" body="To block someone, tap ⋯ on their profile or in your chat with them." />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
});

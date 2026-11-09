import { FlatList } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Header, EmptyState, Loading } from '@/components/ui/layout';
import { CompanionRow } from '@/components/companions';
import { svc, qk } from '@/services';
import { useSession } from '@/state/session';

/** Companions saved with the heart (stored on this device). */
export default function Saved() {
  const saved = useSession((s) => s.prefs.saved);
  const q = useQuery({ queryKey: qk.companions, queryFn: svc.companions });
  const list = (q.data ?? []).filter((c) => saved.includes(c.id));
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mist }} edges={['top']}>
      <Header title="Saved companions" />
      {q.isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: GUTTER - space.sm, paddingBottom: space.huge }}
          renderItem={({ item }) => <CompanionRow c={item} />}
          ListEmptyComponent={<EmptyState icon="heart" title="Nothing saved yet" body="Tap the heart on a companion to keep them here." action="Browse companions" onAction={() => router.push('/search')} />}
        />
      )}
    </SafeAreaView>
  );
}

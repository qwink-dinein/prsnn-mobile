import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Header, Loading, ErrorState, EmptyState, Chip } from '@/components/ui/layout';
import { TextField } from '@/components/ui/forms';
import { UserRow } from '@/components/admin';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

const FILTERS = [
  { value: '', label: 'Everyone' },
  { value: 'user', label: 'Members' },
  { value: 'companion', label: 'Companions' },
  { value: 'staff', label: 'Staff' },
] as const;

/** Admin · Users: search by name, phone or city; filter by role. */
export default function AdminUsers() {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');
  useEffect(() => {
    const t = setTimeout(() => setSearch(text.trim()), 300);
    return () => clearTimeout(t);
  }, [text]);
  const q = useQuery({ queryKey: qk.admin.users(search, role), queryFn: () => svc.admin.users({ q: search, role }) });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Users" />
      <View style={{ paddingHorizontal: GUTTER, gap: space.sm, paddingBottom: space.sm }}>
        <TextField icon="search" placeholder="Name, phone or city" value={text} onChangeText={setText} autoCorrect={false} autoCapitalize="none" returnKeyType="search" />
        <View style={styles.chips}>
          {FILTERS.map((f) => (
            <Chip key={f.value} label={f.label} selected={role === f.value} onPress={() => setRole(f.value)} />
          ))}
        </View>
      </View>
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={q.data ?? []}
          keyExtractor={(u) => u.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: GUTTER, gap: space.sm, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          renderItem={({ item }) => <UserRow u={item} />}
          ListEmptyComponent={<EmptyState icon="users" title={search ? 'No one matches' : 'No users yet'} body={search ? 'Try part of the name or the last 4 digits of the phone.' : undefined} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
});

import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Header, Loading, ErrorState, EmptyState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/confirm';
import { AdminGate, InputSheet, UserRow } from '@/components/admin';
import { normaliseIndianMobile } from '@/domain/phone';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Admin · Sub-admins (superadmin). Superadmins themselves come from SUPERADMIN_PHONES on the server. */
export default function AdminAdmins() {
  return (
    <AdminGate superOnly>
      <Admins />
    </AdminGate>
  );
}

function Admins() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [adding, setAdding] = useState(false);
  const q = useQuery({ queryKey: qk.admin.admins, queryFn: svc.admin.admins });
  const add = useMutation({
    mutationFn: (phone: string) => svc.admin.addAdmin(phone),
    onSuccess: (r) => {
      setAdding(false);
      void qc.invalidateQueries({ queryKey: qk.admin.all });
      void confirm({ title: 'Sub-admin added', message: `${r.user.fullName || 'They'} can open Profile → Admin after logging in with this number.` });
    },
    onError: (e) => confirm({ title: 'Could not add', message: errorMessage(e) }),
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Sub-admins" />
      <View style={{ paddingHorizontal: GUTTER, gap: space.sm }}>
        <Text variant="footnote" muted>
          Sub-admins verify companions, edit users and bookings, and answer disputes. They can’t refund, change prices, see payout totals, add admins or send broadcasts. Tap a person to remove access.
        </Text>
        <Button label="Add sub-admin by phone" icon="plus" onPress={() => setAdding(true)} />
      </View>
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={q.data ?? []}
          keyExtractor={(u) => u.id}
          contentContainerStyle={{ padding: GUTTER, gap: space.sm, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          renderItem={({ item }) => <UserRow u={item} />}
          ListEmptyComponent={<EmptyState icon="shield" title="No staff yet" body="Add a sub-admin by their mobile number." />}
        />
      )}
      <InputSheet
        visible={adding}
        title="Add sub-admin"
        message="If nobody has this number yet, an account is made for it. They log in with OTP as usual."
        fields={[{ key: 'phone', label: 'Mobile number', keyboardType: 'phone-pad', placeholder: '98765 43210', validate: (v) => (normaliseIndianMobile(v) ? null : 'Enter a 10-digit Indian mobile number.') }]}
        confirmLabel="Add"
        busy={add.isPending}
        onClose={() => setAdding(false)}
        onSubmit={(v) => add.mutate(v.phone)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.mist } });

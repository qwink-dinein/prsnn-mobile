import { Stack } from 'expo-router';
import { colors } from '@/theme/tokens';
import { AdminGate } from '@/components/admin';

/** In-app admin (ADMIN_SPEC.md). Shown only to staff; every action is checked again on the server. */
export default function AdminLayout() {
  return (
    <AdminGate>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.mist } }} />
    </AdminGate>
  );
}

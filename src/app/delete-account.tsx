import { useState } from 'react';
import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Card } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useSession } from '@/state/session';

/** In-app account deletion (required by the App Store and Google Play). */
export default function DeleteAccount() {
  const signOut = useSession((s) => s.signOut);
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const run = () =>
    Alert.alert('Delete your account?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          try {
            await svc.deleteAccount();
            await signOut();
            queryClient.clear();
            router.replace('/welcome');
          } catch (e) {
            Alert.alert('Could not delete account', errorMessage(e));
          } finally {
            setBusy(false);
          }
        },
      },
    ]);

  return (
    <Screen footer={<Button label="Delete my account" variant="danger" disabled={confirm.trim().toUpperCase() !== 'DELETE'} loading={busy} onPress={run} />}>
      <Header title="Delete account" />
      <Card style={{ gap: space.sm, marginTop: space.sm }}>
        <Text variant="headline">What happens</Text>
        <Text variant="callout" color={colors.gray600}>
          • Your profile, photos and PIN are removed and you are signed out on every device.{'\n'}• Upcoming bookings are cancelled.{'\n'}• Payment records are kept as the law requires (tax and dispute records).
        </Text>
      </Card>
      <View style={{ marginTop: space.xl }}>
        <TextField label="Type DELETE to confirm" value={confirm} onChangeText={setConfirm} autoCapitalize="characters" autoCorrect={false} />
      </View>
    </Screen>
  );
}

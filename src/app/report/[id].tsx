import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { View } from 'react-native';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Card , Chip } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

const REASONS = ['Companion didn’t show up', 'Safety or behaviour concern', 'Session ended early', 'Charged incorrectly', 'Refund not received', 'Something else'];

/**
 * Report a problem / open a dispute on a paid booking (refund policy §4B, §8).
 * Available at any time after payment — paying never blocks a dispute.
 */
export default function Report() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const text = [reason, details.trim()].filter(Boolean).join(': ');
  const send = useMutation({
    mutationFn: () => svc.openDispute(id, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.booking(id) }),
  });

  if (send.isSuccess) {
    return (
      <Screen footer={<Button label="Back to booking" onPress={() => router.back()} />}>
        <Header title="Report a problem" />
        <Card style={{ gap: space.sm, marginTop: space.lg }}>
          <Text variant="title3">Thanks — we’ve got it</Text>
          <Text variant="callout" muted>
            {send.data.message} If you’re unsafe right now, leave and call 112.
          </Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <View style={{ gap: space.xs }}>
          {send.isError ? (
            <Text variant="footnote" color={colors.danger} center>
              {errorMessage(send.error)}
            </Text>
          ) : null}
          <Button label="Send report" onPress={() => send.mutate()} loading={send.isPending} disabled={text.length < 10} />
        </View>
      }
    >
      <Header title="Report a problem" />
      <Text variant="callout" muted style={{ marginVertical: space.md }}>
        Tell us what happened. Our team reviews every report and can refund under the refund policy. If you’re unsafe right now, leave and call 112.
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginBottom: space.lg }}>
        {REASONS.map((r) => (
          <Chip key={r} label={r} selected={reason === r} onPress={() => setReason(reason === r ? null : r)} />
        ))}
      </View>
      <TextField label="Details" value={details} onChangeText={setDetails} multiline maxLength={800} placeholder="What happened, and what would you like us to do?" />
    </Screen>
  );
}

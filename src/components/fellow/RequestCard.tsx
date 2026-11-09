import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { space } from '@/theme/tokens';
import { Avatar, Card, Pill } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { MetaLine, totalOf, whenOf } from '@/components/bookings';
import { durationLabel, formatINR, personOf, startsAt } from '@/domain/booking';
import type { Booking, BookingStatus } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** A booking request as the companion sees it, with Accept / Decline / Complete. */
export function RequestCard({ b }: { b: Booking }) {
  const qc = useQueryClient();
  const who = personOf(b.requesterId);
  const update = useMutation({
    mutationFn: (status: Exclude<BookingStatus, 'pending'>) => svc.setBookingStatus(b._id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.incoming }),
    onError: (e) => Alert.alert('Could not update booking', errorMessage(e)),
  });
  const [now] = useState(() => Date.now());
  const started = startsAt(b).getTime() < now;

  const pill =
    b.status === 'pending'
      ? { label: 'New request', tone: 'warning' as const }
      : b.status === 'accepted'
        ? b.paymentStatus === 'paid'
          ? { label: 'Paid · confirmed', tone: 'success' as const }
          : { label: 'Accepted · awaiting payment', tone: 'neutral' as const }
        : b.status === 'completed'
          ? { label: 'Completed', tone: 'neutral' as const }
          : { label: b.status === 'rejected' ? 'Declined' : 'Cancelled', tone: 'danger' as const };

  return (
    <Card style={{ gap: space.md }}>
      <View style={styles.top}>
        <Avatar uri={who?.profilePhotoUrl} name={who?.fullName} size={52} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="headline" numberOfLines={1}>
            {who?.fullName ?? 'Member'}
          </Text>
          <Pill label={pill.label} tone={pill.tone} />
        </View>
        <Text variant="subhead">{formatINR(totalOf(b))}</Text>
      </View>
      <MetaLine icon="calendar" text={whenOf(b)} />
      <MetaLine icon="clock" text={durationLabel(b.duration)} />
      {b.message ? <MetaLine icon="message" text={`“${b.message}”`} /> : null}

      {b.status === 'pending' ? (
        <View style={styles.actions}>
          <Button
            label="Decline"
            variant="secondary"
            compact
            style={{ flex: 1 }}
            loading={update.isPending && update.variables === 'rejected'}
            onPress={() =>
              Alert.alert('Decline this request?', `${who?.fullName ?? 'They'} will be told.`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Decline', style: 'destructive', onPress: () => update.mutate('rejected') },
              ])
            }
          />
          <Button label="Accept" compact style={{ flex: 1 }} haptic loading={update.isPending && update.variables === 'accepted'} onPress={() => update.mutate('accepted')} />
        </View>
      ) : b.status === 'accepted' ? (
        <View style={styles.actions}>
          <Button label="Chat" icon="message" variant="secondary" compact style={{ flex: 1 }} onPress={() => router.push(`/chat/${b._id}`)} />
          {b.paymentStatus === 'paid' && started ? (
            <Button label="Mark completed" compact style={{ flex: 1 }} loading={update.isPending} onPress={() => update.mutate('completed')} />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  actions: { flexDirection: 'row', gap: space.sm },
});

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Avatar, Card, Pill } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/confirm';
import { MetaLine, totalOf, whenOf } from '@/components/bookings';
import { durationLabel, formatINR, minutesLeft, personOf, startsAt } from '@/domain/booking';
import type { Booking, BookingStatus } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Re-render every 30 s so offer countdowns stay current. */
function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

/**
 * A booking as the companion sees it.
 *  - Prepaid offer: already paid by the customer; accept within the deadline
 *    (first to accept wins), or decline so it goes to someone else.
 *  - Website request: Accept / Decline, then the customer pays.
 *  - Confirmed: Chat, and Mark completed after the start time.
 */
export function RequestCard({ b }: { b: Booking }) {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const now = useNow();
  const who = personOf(b.requesterId);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: qk.incoming });
    qc.invalidateQueries({ queryKey: qk.booking(b._id) });
  };
  const update = useMutation({
    mutationFn: (status: Exclude<BookingStatus, 'pending'>) => svc.setBookingStatus(b._id, status),
    onSuccess: refresh,
    onError: (e) => confirm({ title: 'Could not update booking', message: errorMessage(e) }),
  });
  const accept = useMutation({
    mutationFn: () => svc.acceptOffer(b._id),
    onSuccess: refresh,
    onError: (e) => {
      refresh();
      confirm({ title: 'Couldn’t accept', message: errorMessage(e) });
    },
  });
  const decline = useMutation({ mutationFn: () => svc.declineOffer(b._id), onSuccess: refresh, onError: (e) => confirm({ title: 'Couldn’t decline', message: errorMessage(e) }) });

  const started = startsAt(b).getTime() < now;
  const offer = b.flow === 'prepaid' ? b.myOffer : null;
  const offerLive = offer?.status === 'offered' && new Date(offer.expiresAt).getTime() > now;
  const mine = b.status === 'accepted' && (b.flow !== 'prepaid' || offer?.status === 'accepted');
  const left = minutesLeft(offer?.expiresAt, new Date(now));

  const pill = offer
    ? offerLive
      ? { label: `Paid offer · ${left} min left`, tone: 'warning' as const }
      : offer.status === 'accepted'
        ? b.status === 'completed'
          ? { label: 'Completed', tone: 'neutral' as const }
          : b.status === 'cancelled'
            ? { label: 'Cancelled', tone: 'danger' as const }
            : { label: 'Confirmed · paid', tone: 'success' as const }
        : offer.status === 'declined'
          ? { label: 'You declined', tone: 'neutral' as const }
          : offer.status === 'withdrawn'
            ? { label: 'Taken by someone else', tone: 'neutral' as const }
            : { label: 'Offer expired', tone: 'neutral' as const }
    : b.status === 'pending'
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
        <Avatar uri={who?.profilePhotoUrl} name={who?.fullName} size={52} locked={who?.locked} />
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

      {offer && offerLive ? (
        <>
          <Text variant="footnote" color={colors.gray600}>
            Already paid by the customer. The first companion to accept gets it — after {left} min it goes to someone else.
          </Text>
          <View style={styles.actions}>
            <Button
              label="Decline"
              variant="secondary"
              compact
              style={{ flex: 1 }}
              loading={decline.isPending}
              onPress={async () => {
                if (await confirm({ title: 'Decline this booking?', message: 'We’ll offer it to another companion.', confirmLabel: 'Decline', destructive: true })) decline.mutate();
              }}
            />
            <Button label="Accept" compact style={{ flex: 1 }} haptic loading={accept.isPending} onPress={() => accept.mutate()} />
          </View>
        </>
      ) : !offer && b.status === 'pending' ? (
        <View style={styles.actions}>
          <Button
            label="Decline"
            variant="secondary"
            compact
            style={{ flex: 1 }}
            loading={update.isPending && update.variables === 'rejected'}
            onPress={async () => {
              if (await confirm({ title: 'Decline this request?', message: `${who?.fullName ?? 'They'} will be told.`, confirmLabel: 'Decline', destructive: true })) update.mutate('rejected');
            }}
          />
          <Button label="Accept" compact style={{ flex: 1 }} haptic loading={update.isPending && update.variables === 'accepted'} onPress={() => update.mutate('accepted')} />
        </View>
      ) : mine ? (
        <View style={styles.actions}>
          <Button label="Chat" icon="message" variant="secondary" compact style={{ flex: 1 }} onPress={() => router.push(`/chat/${b._id}`)} />
          {b.paymentStatus === 'paid' && started ? <Button label="Mark completed" compact style={{ flex: 1 }} loading={update.isPending} onPress={() => update.mutate('completed')} /> : null}
          {!started ? <Button label="Details" variant="ghost" compact style={{ flex: 1 }} onPress={() => router.push(`/booking/${b._id}`)} /> : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  actions: { flexDirection: 'row', gap: space.sm },
});

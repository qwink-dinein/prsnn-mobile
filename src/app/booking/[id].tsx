import { Alert, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Card, Avatar, Pill, Loading, ErrorState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { MetaLine, STAGE_LABEL, totalOf, whenOf } from '@/components/bookings';
import { canChat, durationLabel, formatINR, idOf, personOf, stageOf } from '@/domain/booking';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';

/** Booking details for either side, with the actions that stage allows. */
export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const me = useSession((s) => s.user);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: qk.booking(id), queryFn: () => svc.booking(id) });
  const cancel = useMutation({
    mutationFn: () => svc.cancelBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: qk.booking(id) });
    },
    onError: (e) => Alert.alert('Could not cancel', errorMessage(e)),
  });

  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />;
  const b = q.data;
  const isCompanion = idOf(b.companionId) === me?.id;
  const other = personOf(isCompanion ? b.requesterId : b.companionId);
  const stage = stageOf(b);
  const s = STAGE_LABEL[stage];
  const cancellable = b.status === 'pending' || b.status === 'accepted';

  const confirmCancel = () =>
    Alert.alert(
      'Cancel this booking?',
      b.paymentStatus === 'paid' ? 'Refunds follow the prsnn refund policy. Your companion will be told.' : 'Your companion will be told.',
      [
        { text: 'Keep booking', style: 'cancel' },
        { text: 'Cancel booking', style: 'destructive', onPress: () => cancel.mutate() },
      ],
    );

  return (
    <Screen
      footer={
        <View style={{ gap: space.sm }}>
          {stage === 'pay' && !isCompanion ? <Button label={`Pay ${formatINR(totalOf(b))}`} onPress={() => router.push(`/pay/${b._id}`)} /> : null}
          {canChat(b, isCompanion) ? <Button label={`Chat with ${other?.fullName?.split(' ')[0] ?? 'them'}`} icon="message" onPress={() => router.push(`/chat/${b._id}`)} /> : null}
          {cancellable ? <Button label="Cancel booking" variant="danger" onPress={confirmCancel} loading={cancel.isPending} /> : null}
        </View>
      }
    >
      <Header title="Booking details" />
      <Card style={{ gap: space.md, marginTop: space.sm }}>
        <View style={styles.row}>
          <Avatar uri={other?.profilePhotoUrl} name={other?.fullName} size={60} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text variant="headline">{other?.fullName ?? (isCompanion ? 'Member' : 'Companion')}</Text>
            <Pill label={s.label} tone={s.tone} />
          </View>
        </View>
        <MetaLine icon="calendar" text={whenOf(b)} />
        <MetaLine icon="clock" text={durationLabel(b.duration)} />
        <MetaLine icon="rupee" text={`${formatINR(totalOf(b))} · ${b.paymentStatus === 'paid' ? 'paid' : 'not paid yet'}`} />
        <MetaLine icon="info" text={`Booking #${b._id.slice(-6).toUpperCase()}`} />
      </Card>
      {b.message ? (
        <Card style={{ marginTop: space.lg, gap: space.xs }}>
          <Text variant="subhead" muted>
            Message
          </Text>
          <Text variant="body">{b.message}</Text>
        </Card>
      ) : null}
      <Text variant="footnote" muted style={{ marginTop: space.lg }}>
        Meet only in public places. Phone numbers are hidden in chat for your safety.
      </Text>
      {cancel.isSuccess ? (
        <Text variant="footnote" color={colors.moss} style={{ marginTop: space.sm }}>
          Booking cancelled.
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: space.md } });

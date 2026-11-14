import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Card, Avatar, Pill, Loading, ErrorState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/confirm';
import { MetaLine, PrepaidStatus, STAGE_LABEL, totalOf, whenOf } from '@/components/bookings';
import { canChat, companionOf, durationLabel, formatINR, idOf, paymentLabel, personOf, refundIfCancelledNow, stageOf } from '@/domain/booking';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';
import { PanicButton } from '@/components/PanicButton';
import { categoryTitle } from '@/domain/categories';

/** Booking details for either side: status, payment, and the actions the policy allows. */
export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const me = useSession((s) => s.user);
  const qc = useQueryClient();
  const confirm = useConfirm();
  const q = useQuery({
    queryKey: qk.booking(id),
    queryFn: () => svc.booking(id),
    refetchInterval: (query) => (query.state.data && (['finding', 'checking'].includes(stageOf(query.state.data)) || query.state.data.panic) ? 10_000 : 60_000),
  });
  const cancel = useMutation({
    mutationFn: () => svc.cancelBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: qk.booking(id) });
    },
    onError: (e) => confirm({ title: 'Could not cancel', message: errorMessage(e) }),
  });

  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />;
  const b = q.data;
  const isCompanion = idOf(b.companionId) === me?.id || (!!b.myOffer && idOf(b.requesterId) !== me?.id);
  const other = isCompanion ? personOf(b.requesterId) : companionOf(b);
  const stage = stageOf(b);
  const s = STAGE_LABEL[stage];
  const prepaid = b.flow === 'prepaid';
  const closed = ['cancelled', 'completed', 'declined', 'unfulfilled'].includes(stage);
  const cancellable = !closed && (isCompanion ? !!b.companionId && idOf(b.companionId) === me?.id : true);
  const canReport = b.paymentStatus === 'paid' || b.paymentStatus === 'refunded';

  const confirmCancel = async () => {
    const r = refundIfCancelledNow(b);
    const message = isCompanion
      ? `The customer gets a full refund and will be told.`
      : `${r.reason}${r.amount > 0 ? ` You’ll get ${formatINR(r.amount)} back to your original payment method.` : ''}`;
    if (await confirm({ title: 'Cancel this booking?', message, confirmLabel: 'Cancel booking', cancelLabel: 'Keep booking', destructive: true })) cancel.mutate();
  };

  return (
    <Screen
      footer={
        <View style={{ gap: space.sm }}>
          {(stage === 'pay' || stage === 'paying') && !isCompanion ? <Button label={`Pay ${formatINR(totalOf(b))}`} onPress={() => router.push(`/pay/${b._id}`)} /> : null}
          {canChat(b, isCompanion) ? <Button label={`Chat with ${other?.fullName?.split(' ')[0] ?? 'them'}`} icon="message" onPress={() => router.push(`/chat/${b._id}`)} /> : null}
          {cancellable ? <Button label="Cancel booking" variant="danger" onPress={confirmCancel} loading={cancel.isPending} /> : null}
          {canReport ? <Button label={b.dispute?.status === 'open' ? 'Problem reported · add details' : 'Report a problem'} variant="ghost" icon="flag" onPress={() => router.push(`/report/${b._id}`)} /> : null}
        </View>
      }
    >
      <Header title="Booking details" />
      <Card style={{ gap: space.md, marginTop: space.sm }}>
        <View style={styles.row}>
          <Avatar uri={other?.profilePhotoUrl} name={other?.fullName} size={60} locked={other?.locked} />
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <Text variant="headline">{other?.fullName ?? (isCompanion ? 'Member' : 'Companion')}</Text>
            <Pill label={s.label} tone={s.tone} />
          </View>
        </View>
        <MetaLine icon="calendar" text={whenOf(b)} />
        <MetaLine icon="clock" text={durationLabel(b.duration)} />
        <MetaLine icon="rupee" text={`${formatINR(totalOf(b))} · ${paymentLabel(b)}`} />
        <MetaLine icon="info" text={`Booking #${b._id.slice(-6).toUpperCase()}`} />
      </Card>

      <PanicButton b={b} />

      {b.meetingPlace || b.recipient ? (
        <Card style={{ gap: space.sm, marginTop: space.lg }}>
          {b.meetingPlace ? <MetaLine icon="mapPin" text={`Meeting place: ${b.meetingPlace}`} /> : null}
          {b.recipient ? <MetaLine icon="users" text={`For ${b.recipient.name} (${b.recipient.relation})${!isCompanion && b.recipient.phone ? ` · +${b.recipient.phone}` : ''}`} /> : null}
          {b.category ? <MetaLine icon="sparkle" text={categoryTitle(b.category)} /> : null}
        </Card>
      ) : null}

      {prepaid && !isCompanion ? (
        <Card style={{ marginTop: space.lg }}>
          <Text variant="subhead" muted style={{ marginBottom: space.md }}>
            Status
          </Text>
          <PrepaidStatus b={b} />
        </Card>
      ) : null}

      {b.dispute?.status === 'open' ? (
        <Card style={{ marginTop: space.lg, gap: space.xs, backgroundColor: colors.warningSoft }}>
          <Text variant="subhead">Problem reported</Text>
          <Text variant="footnote" color={colors.gray600}>
            Our team is reviewing it and will contact you. This doesn’t change your booking or payment by itself.
          </Text>
        </Card>
      ) : null}

      {b.message ? (
        <Card style={{ marginTop: space.lg, gap: space.xs }}>
          <Text variant="subhead" muted>
            Message
          </Text>
          <Text variant="body">{b.message}</Text>
        </Card>
      ) : null}
      <Text variant="footnote" muted style={{ marginTop: space.lg }}>
        Meet only in public places. Phone numbers are hidden in chat for your safety. During the session, the panic button alerts our team at once.
      </Text>
      {cancel.isSuccess ? (
        <Text variant="footnote" color={colors.moss} style={{ marginTop: space.sm }} accessibilityLiveRegion="polite">
          Booking cancelled.{b.refund && b.refund.status !== 'none' ? ` ${paymentLabel(b)}.` : ''}
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: space.md } });

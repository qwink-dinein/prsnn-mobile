import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { colors, space } from '@/theme/tokens';
import { durationLabel, endTimeOf, formatINR, formatTime, parseDateKey, companionOf, stageOf, totalOfBooking, paymentLabel, minutesLeft, formatMinutes, type Stage } from '@/domain/booking';
import type { Booking } from '@/domain/types';
import { Text } from './ui/Text';
import { Icon, type IconName } from './ui/Icon';
import { Avatar, Card, Pill } from './ui/layout';
import { Button } from './ui/Button';

export const STAGE_LABEL: Record<Stage, { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' }> = {
  awaiting: { label: 'Awaiting confirmation', tone: 'warning' },
  pay: { label: 'Accepted · pay to confirm', tone: 'warning' },
  paying: { label: 'Payment not finished', tone: 'warning' },
  finding: { label: 'Paid · awaiting companion', tone: 'warning' },
  checking: { label: 'Accepted · safety check', tone: 'warning' },
  unfulfilled: { label: 'No companion · refunded', tone: 'danger' },
  confirmed: { label: 'Confirmed', tone: 'success' },
  completed: { label: 'Completed', tone: 'neutral' },
  declined: { label: 'Declined', tone: 'danger' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
};

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  parseDateKey(iso).toLocaleDateString('en-IN', opts);

export const whenOf = (b: Booking) => `${formatDate(b.scheduledDate)} · ${formatTime(b.startTime)} – ${formatTime(endTimeOf(b.startTime, b.duration))}`;

export const totalOf = (b: Booking) => totalOfBooking(b);

export function MetaLine({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.meta}>
      <Icon name={icon} size={16} color={colors.gray500} />
      <Text variant="footnote" muted style={{ flex: 1 }} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

/** Requester's booking card (mock-up 14). */
export function BookingCard({ b }: { b: Booking }) {
  const person = companionOf(b);
  const stage = stageOf(b);
  const s = STAGE_LABEL[stage];
  const assigned = !!b.companionId;
  const left = minutesLeft(b.offerSummary?.liveUntil);
  return (
    <Card style={{ gap: space.md }}>
      <View style={styles.top}>
        <Avatar uri={person?.profilePhotoUrl} name={person?.fullName} size={56} locked={person?.locked} />
        <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
          <Text variant="headline" numberOfLines={1}>
            {person?.fullName ?? 'Companion'}
          </Text>
          <Pill label={s.label} tone={s.tone} />
        </View>
        <Text variant="subhead" style={{ flexShrink: 0, alignSelf: 'flex-start' }} numberOfLines={1}>
          {formatINR(totalOf(b))}
        </Text>
      </View>
      <MetaLine icon="calendar" text={whenOf(b)} />
      <MetaLine icon="clock" text={durationLabel(b.duration)} />
      {b.flow === 'prepaid' ? <MetaLine icon="wallet" text={paymentLabel(b)} /> : null}
      {stage === 'finding' ? (
        <MetaLine icon="users" text={assigned ? 'Confirmed' : `Waiting for ${b.offerSummary?.tried && b.offerSummary.tried > 1 ? 'a similar companion' : person?.fullName?.split(' ')[0] ?? 'your companion'}${left ? ` · ${formatMinutes(left)} left to answer` : ''}`} />
      ) : null}
      {stage === 'checking' ? <MetaLine icon="shieldCheck" text={`${person?.fullName?.split(' ')[0] ?? 'Your companion'} accepted. We’re checking their ID before confirming.`} /> : null}
      {stage === 'pay' || stage === 'paying' ? (
        <Button label={stage === 'paying' ? `Finish payment · ${formatINR(totalOf(b))}` : `Pay ${formatINR(totalOf(b))}`} onPress={() => router.push(`/pay/${b._id}`)} compact />
      ) : null}
      {stage === 'confirmed' ? (
        <View style={styles.actions}>
          <Button label="View" variant="secondary" compact style={{ flex: 1 }} onPress={() => router.push(`/booking/${b._id}`)} />
          <Button label="Chat" icon="message" compact style={{ flex: 1 }} onPress={() => router.push(`/chat/${b._id}`)} />
        </View>
      ) : stage !== 'pay' && stage !== 'paying' ? (
        <Button label="View details" variant="secondary" compact onPress={() => router.push(`/booking/${b._id}`)} />
      ) : null}
    </Card>
  );
}

/**
 * Prepaid progress, booking state and payment state shown separately:
 *   Booked → Paid → Finding your companion → Confirmed   (or → Refunded)
 */
export function PrepaidStatus({ b }: { b: Booking }) {
  const stage = stageOf(b);
  const left = minutesLeft(b.offerSummary?.liveUntil);
  const tried = b.offerSummary?.tried ?? 0;
  const failed = stage === 'unfulfilled' || stage === 'cancelled';
  const steps: { label: string; detail?: string; state: 'done' | 'now' | 'todo' | 'stop' }[] = [
    { label: 'Booked', state: 'done' },
    { label: 'Paid', detail: paymentLabel(b), state: b.paymentStatus === 'paid' || b.paymentStatus === 'refunded' ? 'done' : stage === 'paying' ? 'now' : 'todo' },
    {
      label: 'Finding your companion',
      detail:
        stage === 'finding'
          ? `${tried > 1 ? `Offered to companion ${tried} of 3` : 'Offered to your chosen companion'}${left ? ` · ${formatMinutes(left)} left to answer` : ''}`
          : stage === 'unfulfilled'
            ? 'Nobody could take it in time'
            : undefined,
      // Cancelled before anyone accepted: matching never finished.
      state: stage === 'finding' ? 'now' : stage === 'paying' ? 'todo' : stage === 'unfulfilled' ? 'stop' : stage === 'cancelled' && !b.companionId ? 'todo' : 'done',
    },
    ...(stage === 'checking'
      ? [{ label: `Safety check of ${companionOf(b)?.fullName?.split(' ')[0] ?? 'your companion'}’s ID`, detail: 'They’re new on prsnn. Nobody meets anyone before their ID is checked. If it doesn’t pass, we offer your booking to another companion or refund you in full.', state: 'now' as const }]
      : []),
    failed
      ? { label: stage === 'unfulfilled' ? 'Cancelled · refunded' : 'Cancelled', detail: b.refund && b.refund.status !== 'none' ? paymentLabel(b) : undefined, state: 'stop' }
      : { label: stage === 'completed' ? 'Completed' : 'Confirmed', detail: stage === 'confirmed' ? 'Chat is open' : undefined, state: stage === 'confirmed' || stage === 'completed' ? 'done' : 'todo' },
  ];
  return (
    <View style={{ gap: 0 }} accessibilityRole="list">
      {steps.map((st, i) => (
        <View key={st.label} style={styles.step} accessible accessibilityLabel={`${st.label}${st.detail ? `, ${st.detail}` : ''}, ${st.state === 'done' ? 'done' : st.state === 'now' ? 'in progress' : st.state === 'stop' ? 'stopped' : 'not yet'}`}>
          <View style={styles.rail}>
            <View style={[styles.node, st.state === 'done' && styles.nodeDone, st.state === 'now' && styles.nodeNow, st.state === 'stop' && styles.nodeStop]}>
              {st.state === 'done' ? <Icon name="check" size={12} color={colors.onMoss} strokeWidth={2.6} /> : st.state === 'stop' ? <Icon name="close" size={12} color={colors.onMoss} strokeWidth={2.6} /> : null}
            </View>
            {i < steps.length - 1 ? <View style={[styles.line, st.state === 'done' && { backgroundColor: colors.moss }]} /> : null}
          </View>
          <View style={{ flex: 1, paddingBottom: i < steps.length - 1 ? space.lg : 0 }}>
            <Text variant="callout" color={st.state === 'todo' ? colors.gray500 : colors.ink} style={{ fontFamily: st.state === 'now' ? 'Urbanist-SemiBold' : undefined }}>
              {st.label}
            </Text>
            {st.detail ? (
              <Text variant="footnote" muted>
                {st.detail}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  actions: { flexDirection: 'row', gap: space.sm },
  step: { flexDirection: 'row', gap: space.md },
  rail: { alignItems: 'center', width: 22 },
  node: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.gray300, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: colors.moss, borderColor: colors.moss },
  nodeNow: { borderColor: colors.moss, borderWidth: 6 },
  nodeStop: { backgroundColor: colors.clay, borderColor: colors.clay },
  line: { flex: 1, width: 2, backgroundColor: colors.gray200, marginVertical: 2 },
});

import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { colors, space } from '@/theme/tokens';
import { durationLabel, endTimeOf, formatINR, formatTime, parseDateKey, personOf, stageOf, amountDuePaise, rupees, type Stage } from '@/domain/booking';
import type { Booking } from '@/domain/types';
import { Text } from './ui/Text';
import { Icon, type IconName } from './ui/Icon';
import { Avatar, Card, Pill } from './ui/layout';
import { Button } from './ui/Button';

export const STAGE_LABEL: Record<Stage, { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' }> = {
  awaiting: { label: 'Awaiting confirmation', tone: 'warning' },
  pay: { label: 'Accepted · pay to confirm', tone: 'warning' },
  confirmed: { label: 'Confirmed', tone: 'success' },
  completed: { label: 'Completed', tone: 'neutral' },
  declined: { label: 'Declined', tone: 'danger' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
};

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  parseDateKey(iso).toLocaleDateString('en-IN', opts);

export const whenOf = (b: Booking) => `${formatDate(b.scheduledDate)} · ${formatTime(b.startTime)} – ${formatTime(endTimeOf(b.startTime, b.duration))}`;

export const totalOf = (b: Booking) => b.amountPaid || rupees(amountDuePaise(b.pricePerHour, b.duration));

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
  const person = personOf(b.companionId);
  const stage = stageOf(b);
  const s = STAGE_LABEL[stage];
  return (
    <Card style={{ gap: space.md }}>
      <View style={styles.top}>
        <Avatar uri={person?.profilePhotoUrl} name={person?.fullName} size={56} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="headline" numberOfLines={1}>
            {person?.fullName ?? 'Companion'}
          </Text>
          <Pill label={s.label} tone={s.tone} />
        </View>
        <Text variant="subhead">{formatINR(totalOf(b))}</Text>
      </View>
      <MetaLine icon="calendar" text={whenOf(b)} />
      <MetaLine icon="clock" text={durationLabel(b.duration)} />
      {stage === 'pay' ? <Button label={`Pay ${formatINR(totalOf(b))}`} onPress={() => router.push(`/pay/${b._id}`)} compact /> : null}
      {stage === 'confirmed' ? (
        <View style={styles.actions}>
          <Button label="View" variant="secondary" compact style={{ flex: 1 }} onPress={() => router.push(`/booking/${b._id}`)} />
          <Button label="Chat" icon="message" compact style={{ flex: 1 }} onPress={() => router.push(`/chat/${b._id}`)} />
        </View>
      ) : stage !== 'pay' ? (
        <Button label="View details" variant="secondary" compact onPress={() => router.push(`/booking/${b._id}`)} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  actions: { flexDirection: 'row', gap: space.sm },
});

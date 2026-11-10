import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { colors, space } from '@/theme/tokens';
import { Screen, Card, Avatar } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { MetaLine, PrepaidStatus, whenOf } from '@/components/bookings';
import { companionOf, stageOf } from '@/domain/booking';
import { svc, qk } from '@/services';

/**
 * Screen 12 · After payment (prepaid: "Paid — finding your companion", then
 * "Booking confirmed!" when someone accepts) or after a website-style request.
 */
export default function Confirmed() {
  const { kind = 'request', bookingId } = useLocalSearchParams<{ kind?: 'request' | 'paid'; bookingId: string }>();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: qk.booking(bookingId),
    queryFn: () => svc.booking(bookingId),
    enabled: !!bookingId,
    // Prepaid: keep checking while a companion is being found.
    refetchInterval: (query) => (query.state.data && ['finding', 'checking'].includes(stageOf(query.state.data)) ? 5000 : false),
  });
  const b = q.data;
  const person = b ? companionOf(b) : null;
  const first = person?.fullName?.split(' ')[0] ?? 'your companion';
  const prepaid = b?.flow === 'prepaid';
  const stage = b ? stageOf(b) : null;
  const done = stage === 'confirmed' || (!prepaid && kind === 'paid');
  const failed = stage === 'unfulfilled' || stage === 'cancelled';

  // One success haptic when it becomes confirmed.
  const buzzed = useRef(false);
  useEffect(() => {
    if ((done || kind === 'request') && !buzzed.current) {
      buzzed.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      qc.invalidateQueries({ queryKey: qk.myBookings });
    }
  }, [done, kind, qc]);

  const title = prepaid ? (done ? 'Booking confirmed!' : failed ? 'No companion available' : 'Payment received') : kind === 'paid' ? 'Booking confirmed!' : 'Request sent!';
  const body = prepaid
    ? done
      ? `${first} accepted. Say hello and agree on a public meeting spot in chat.`
      : failed
        ? 'Nobody could take this booking in time. Your full payment is being refunded to your original payment method.'
        : `We’ve sent your booking to ${first}. If they can’t make it, we’ll offer it to a similar companion. You’ll be notified the moment it’s confirmed.`
    : kind === 'paid'
      ? `You’re all set. Say hello to ${first} and agree on a public meeting spot in chat.`
      : `${first} has been notified. You’ll get a notification when they accept — then you can pay to confirm.`;

  return (
    <Screen
      edges={['top']}
      footer={
        <View style={{ gap: space.sm }}>
          {done ? <Button label={`Chat with ${first}`} icon="message" onPress={() => router.replace(`/chat/${bookingId}`)} /> : null}
          <Button label={prepaid ? 'View booking' : 'View my bookings'} variant={done ? 'secondary' : 'primary'} onPress={() => router.replace(prepaid ? `/booking/${bookingId}` : '/bookings')} />
          {!done ? <Button label="Back to home" variant="ghost" onPress={() => router.replace('/home')} /> : null}
        </View>
      }
    >
      <View style={styles.hero}>
        <View style={[styles.check, prepaid && !done && !failed && styles.waiting, failed && styles.failed]}>
          <Icon name={done || !prepaid ? 'check' : failed ? 'rupee' : 'clock'} size={40} color={colors.onMoss} strokeWidth={2.4} />
        </View>
        <Text variant="title1" center accessibilityRole="header" accessibilityLiveRegion="polite">
          {title}
        </Text>
        <Text variant="callout" muted center style={{ maxWidth: 320 }}>
          {body}
        </Text>
      </View>
      {b ? (
        <Card style={{ gap: space.md }}>
          <View style={styles.row}>
            <Avatar uri={person?.profilePhotoUrl} name={person?.fullName} size={52} locked={person?.locked} />
            <Text variant="headline" style={{ flex: 1 }}>
              {person?.fullName}
            </Text>
          </View>
          <MetaLine icon="calendar" text={whenOf(b)} />
          <MetaLine icon="info" text={`Booking #${b._id.slice(-6).toUpperCase()}`} />
          {prepaid ? (
            <View style={{ marginTop: space.sm }}>
              <PrepaidStatus b={b} />
            </View>
          ) : null}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: space.md, marginTop: space.huge, marginBottom: space.xxl },
  check: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  waiting: { backgroundColor: colors.mossMid },
  failed: { backgroundColor: colors.clay },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});

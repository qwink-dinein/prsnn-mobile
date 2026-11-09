import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { colors, space } from '@/theme/tokens';
import { Screen, Card, Avatar } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { MetaLine, whenOf } from '@/components/bookings';
import { personOf } from '@/domain/booking';
import { svc, qk } from '@/services';

/** Screen 12 · Booking confirmed (after payment) or request sent (before acceptance). */
export default function Confirmed() {
  const { kind = 'request', bookingId } = useLocalSearchParams<{ kind?: 'request' | 'paid'; bookingId: string }>();
  const q = useQuery({ queryKey: qk.booking(bookingId), queryFn: () => svc.booking(bookingId), enabled: !!bookingId });
  const b = q.data;
  const person = b ? personOf(b.companionId) : null;
  const first = person?.fullName?.split(' ')[0] ?? 'your companion';
  const paid = kind === 'paid';

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  return (
    <Screen
      edges={['top']}
      footer={
        <View style={{ gap: space.sm }}>
          {paid ? <Button label={`Chat with ${first}`} icon="message" onPress={() => router.replace(`/chat/${bookingId}`)} /> : null}
          <Button label="View my bookings" variant={paid ? 'secondary' : 'primary'} onPress={() => router.replace('/bookings')} />
          {!paid ? <Button label="Back to home" variant="ghost" onPress={() => router.replace('/home')} /> : null}
        </View>
      }
    >
      <View style={styles.hero}>
        <View style={styles.check}>
          <Icon name="check" size={40} color={colors.onMoss} strokeWidth={2.4} />
        </View>
        <Text variant="title1" center accessibilityRole="header">
          {paid ? 'Booking confirmed!' : 'Request sent!'}
        </Text>
        <Text variant="callout" muted center style={{ maxWidth: 300 }}>
          {paid
            ? `You’re all set. Say hello to ${first} and agree on a public meeting spot in chat.`
            : `${first} has been notified. You’ll get a notification when they accept — then you can pay to confirm.`}
        </Text>
      </View>
      {b ? (
        <Card style={{ gap: space.md }}>
          <View style={styles.row}>
            <Avatar uri={person?.profilePhotoUrl} name={person?.fullName} size={52} />
            <Text variant="headline" style={{ flex: 1 }}>
              {person?.fullName}
            </Text>
          </View>
          <MetaLine icon="calendar" text={whenOf(b)} />
          <MetaLine icon="info" text={`Booking #${b._id.slice(-6).toUpperCase()}`} />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: space.md, marginTop: space.huge, marginBottom: space.xxl },
  check: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});

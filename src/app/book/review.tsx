import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Avatar, Card, Loading, ErrorState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { MetaLine, formatDate } from '@/components/bookings';
import { placeOf } from '@/components/companions';
import { amountDuePaise, durationLabel, endTimeOf, formatINR, formatTime, rupees } from '@/domain/booking';
import type { Duration } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Screen 10 · Booking summary → sends the request to the companion. */
export default function Review() {
  const p = useLocalSearchParams<{ id: string; date: string; time: string; duration: Duration }>();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: qk.companion(p.id), queryFn: () => svc.companion(p.id) });
  const [note, setNote] = useState('');
  const send = useMutation({
    mutationFn: () => svc.createBooking({ companionId: p.id, scheduledDate: p.date, startTime: p.time, duration: p.duration, message: note.trim() || undefined }),
    onSuccess: ({ booking }) => {
      qc.invalidateQueries({ queryKey: qk.myBookings });
      router.replace({ pathname: '/confirmed', params: { kind: 'request', bookingId: booking._id } });
    },
  });

  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />;
  const c = q.data;
  const rate = c.pricePerHour ?? 0;
  const total = rupees(amountDuePaise(rate, p.duration));
  const hours = Number(p.duration) / 60;

  return (
    <Screen
      footer={
        <View style={{ gap: space.xs }}>
          {send.isError ? (
            <Text variant="footnote" color={colors.danger} center accessibilityLiveRegion="polite">
              {errorMessage(send.error)}
            </Text>
          ) : null}
          <Button label="Send booking request" onPress={() => send.mutate()} loading={send.isPending} haptic />
          <Text variant="caption" muted center>
            You’ll pay only after {c.fullName?.split(' ')[0]} accepts.
          </Text>
        </View>
      }
    >
      <Header title="Review your booking" />
      <Card style={styles.person}>
        <Avatar uri={c.profilePhoto} name={c.fullName} size={64} online />
        <View style={{ flex: 1 }}>
          <Text variant="headline">{c.fullName}</Text>
          <Text variant="footnote" muted>
            {placeOf(c)}
          </Text>
        </View>
      </Card>

      <Card style={styles.block}>
        <MetaLine icon="calendar" text={formatDate(p.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} />
        <MetaLine icon="clock" text={`${formatTime(p.time)} – ${formatTime(endTimeOf(p.time, p.duration))} (${durationLabel(p.duration)})`} />
        <MetaLine icon="mapPin" text={`A public place you agree on in chat${c.area ? `, near ${c.area}` : ''}`} />
      </Card>

      <View style={{ marginTop: space.lg }}>
        <TextField label="Message (optional)" value={note} onChangeText={setNote} placeholder="Say what you’d like to do — coffee, a walk, an event…" multiline maxLength={300} />
      </View>

      <Card style={styles.block}>
        <View style={styles.line}>
          <Text variant="callout" muted>
            {formatINR(rate)} × {hours % 1 === 0 ? hours : hours.toFixed(1)} {hours === 1 ? 'hour' : 'hours'}
          </Text>
          <Text variant="callout">{formatINR(total)}</Text>
        </View>
        <View style={[styles.line, styles.total]}>
          <Text variant="headline">Total</Text>
          <Text variant="headline">{formatINR(total)}</Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  person: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.sm },
  block: { gap: space.md, marginTop: space.lg },
  line: { flexDirection: 'row', justifyContent: 'space-between' },
  total: { paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.lineStrong, borderRadius: radius.sm },
});

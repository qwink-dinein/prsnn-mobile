import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Avatar, Card, Loading, ErrorState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { MetaLine, formatDate } from '@/components/bookings';
import { placeOf } from '@/components/companions';
import { amountDuePaise, durationLabel, endTimeOf, formatINR, formatTime, rupees } from '@/domain/booking';
import { hourlyFor, hoursLabel, priceFor, savingFor } from '@/domain/pricing';
import type { Duration } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Random key for this checkout: retries reuse it, so the server never creates a second booking. */
const newKey = () => `bk_${Date.now().toString(36)}_${Array.from({ length: 16 }, () => Math.floor(Math.random() * 36).toString(36)).join('')}`;

/**
 * Screen 10 · Checkout (prepaid). Shows the price, fees, how companion
 * matching works, and the cancellation & refund terms BEFORE payment; the
 * customer agrees, then pays. The booking is created once (idempotency key).
 */
export default function Checkout() {
  const p = useLocalSearchParams<{ id: string; date: string; time: string; duration: Duration }>();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: qk.companion(p.id), queryFn: () => svc.companion(p.id) });
  const policy = useQuery({ queryKey: ['policy'], queryFn: svc.policy, staleTime: 3600_000 });
  const [note, setNote] = useState('');
  const [agree, setAgree] = useState(false);
  const [key] = useState(newKey);

  const create = useMutation({
    mutationFn: () =>
      svc.createPrepaidBooking({
        companionId: p.id,
        scheduledDate: p.date,
        startTime: p.time,
        duration: p.duration,
        message: note.trim() || undefined,
        idempotencyKey: key,
        acceptTerms: true,
        city: q.data?.city,
        area: q.data?.area,
      }),
    onSuccess: ({ booking }) => {
      qc.invalidateQueries({ queryKey: qk.myBookings });
      router.push(`/pay/${booking._id}`);
    },
  });

  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />;
  const c = q.data;
  const hours = Number(p.duration) / 60;
  const total = priceFor(hours) ?? rupees(amountDuePaise(c.pricePerHour ?? 0, p.duration));
  const first = c.fullName?.split(' ')[0] ?? 'your companion';

  return (
    <Screen
      footer={
        <View style={{ gap: space.xs }}>
          {create.isError ? (
            <Text variant="footnote" color={colors.danger} center accessibilityLiveRegion="polite">
              {errorMessage(create.error)}
            </Text>
          ) : null}
          <Button label={`Continue to pay ${formatINR(total)}`} icon="lock" onPress={() => create.mutate()} loading={create.isPending} disabled={!agree} haptic />
          {!agree ? (
            <Text variant="caption" muted center>
              Tick the box above to agree to the terms.
            </Text>
          ) : null}
        </View>
      }
    >
      <Header title="Review & pay" />
      <Card style={styles.person}>
        <Avatar uri={c.profilePhoto} name={c.fullName} size={64} online locked={c.locked} />
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

      <Text variant="title3" style={styles.h}>
        Price
      </Text>
      <Card style={{ gap: space.md }}>
        <View style={styles.line}>
          <Text variant="callout" muted>
            {hoursLabel(hours)} package · {formatINR(hourlyFor(hours))}/hour
          </Text>
          <Text variant="callout">{formatINR(total)}</Text>
        </View>
        {savingFor(hours) ? (
          <View style={styles.line}>
            <Text variant="callout" muted>
              You save vs. hourly
            </Text>
            <Text variant="callout" color={colors.moss}>
              {formatINR(savingFor(hours))}
            </Text>
          </View>
        ) : null}
        <View style={styles.line}>
          <Text variant="callout" muted>
            Booking fee
          </Text>
          <Text variant="callout" color={colors.moss}>
            ₹0 · no fee
          </Text>
        </View>
        <View style={[styles.line, styles.total]}>
          <Text variant="headline">Total you pay now</Text>
          <Text variant="headline">{formatINR(total)}</Text>
        </View>
      </Card>

      <Text variant="title3" style={styles.h}>
        How it works
      </Text>
      <Card style={{ gap: space.md }}>
        <Step n={1} text="You pay now. Payment reserves your booking; it’s confirmed when a companion accepts. It shows “Paid — awaiting companion” until then." />
        <Step n={2} text={`${first} gets between 15 minutes and 5 hours to accept, depending on how far away your session is.`} />
        <Step n={3} text="If they can’t, we offer it to up to 2 similar verified companions (same city, your “show me” choice, available for this duration) — one at a time." />
        <Step n={4} text="Nobody accepts by 1 hour before the session? It’s cancelled and you get a full refund automatically." />
      </Card>

      <Text variant="title3" style={styles.h}>
        Cancellation & refunds
      </Text>
      <Card style={{ gap: space.sm }}>
        {(policy.data?.cancellation ?? []).map((line) => (
          <View key={line} style={styles.bullet}>
            <Icon name="check" size={16} color={colors.moss} />
            <Text variant="footnote" style={{ flex: 1 }}>
              {line}
            </Text>
          </View>
        ))}
        {policy.data ? (
          <Text variant="footnote" muted>
            {policy.data.refunds} Questions: {policy.data.support}
          </Text>
        ) : policy.isLoading ? (
          <Text variant="footnote" muted>
            Loading terms…
          </Text>
        ) : (
          <Text variant="footnote" color={colors.danger}>
            Couldn’t load the terms. Check your connection.
          </Text>
        )}
      </Card>

      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: agree, disabled: !policy.data }} disabled={!policy.data} onPress={() => setAgree(!agree)} style={styles.agree}>
        <View style={[styles.box, agree && styles.boxOn]}>{agree ? <Icon name="check" size={14} color={colors.onMoss} strokeWidth={2.4} /> : null}</View>
        <Text variant="footnote" style={{ flex: 1 }}>
          I’ve read and agree to the price, the cancellation and refund terms, and that my booking may go to a similar companion if {first} can’t make it.
        </Text>
      </Pressable>
    </Screen>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.num}>
        <Text variant="caption" color={colors.onMoss}>
          {n}
        </Text>
      </View>
      <Text variant="footnote" style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  person: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.sm },
  block: { gap: space.md, marginTop: space.lg },
  h: { marginTop: space.xl, marginBottom: space.md },
  line: { flexDirection: 'row', justifyContent: 'space-between' },
  total: { paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.lineStrong, borderRadius: radius.sm },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  num: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  agree: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md, marginTop: space.lg, padding: space.md, borderRadius: radius.md, backgroundColor: colors.mistDeep, minHeight: 48 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.gray400, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxOn: { backgroundColor: colors.moss, borderColor: colors.moss },
});

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Avatar, Card, Loading, ErrorState, Chip } from '@/components/ui/layout';
import { Notice, useDraft } from '@/components/ui/states';
import { CATEGORIES, offersCategory } from '@/domain/categories';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { MetaLine, formatDate } from '@/components/bookings';
import { placeOf } from '@/components/companions';
import { amountDuePaise, durationLabel, endTimeOf, formatINR, formatTime, rupees } from '@/domain/booking';
import { hourlyFor, hoursLabel, priceFor, savingFor } from '@/domain/pricing';
import type { Duration, Relation } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

const RELATIONS: { value: Relation; label: string }[] = [
  { value: 'mother', label: 'Mother' },
  { value: 'father', label: 'Father' },
  { value: 'grandparent', label: 'Grandparent' },
  { value: 'relative', label: 'Relative' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' },
];

/** Random key for this checkout: retries reuse it, so the server never creates a second booking. */
const newKey = () => `bk_${Date.now().toString(36)}_${Array.from({ length: 16 }, () => Math.floor(Math.random() * 36).toString(36)).join('')}`;

/**
 * Screen 10 · Checkout (prepaid). Shows the price, fees, how companion
 * matching works, and the cancellation & refund terms BEFORE payment; the
 * customer agrees, then pays. The booking is created once (idempotency key).
 */
export default function Checkout() {
  const p = useLocalSearchParams<{ id: string; date: string; time: string; duration: Duration; category?: string }>();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: qk.companion(p.id), queryFn: () => svc.companion(p.id) });
  const policy = useQuery({ queryKey: ['policy'], queryFn: svc.policy, staleTime: 3600_000 });
  const [d, setD, clearDraft] = useDraft(`checkout.${p.id}.${p.date}.${p.time}`, {
    note: '',
    category: (p.category ?? '') as string,
    place: '',
    forWho: 'me' as 'me' | 'other',
    relation: '' as Relation | '',
    relationOther: '',
    rName: '',
    rPhone: '',
    rCity: '',
  });
  const set = (x: Partial<typeof d>) => setD((cur) => ({ ...cur, ...x }));
  const [agree, setAgree] = useState(false);
  const [tried, setTried] = useState(false);
  const [key] = useState(newKey);

  const rDigits = d.rPhone.replace(/\D/g, '');
  const errors = {
    place: d.place.trim().length < 3 ? 'Add a public place to meet, like a café, a mall or a park entrance.' : null,
    relation: d.forWho === 'other' && !d.relation ? 'Choose who the booking is for.' : d.forWho === 'other' && d.relation === 'other' && d.relationOther.trim().length < 2 ? 'Tell us who they are to you.' : null,
    rName: d.forWho === 'other' && d.rName.trim().length < 2 ? 'Add their name.' : null,
    rPhone: d.forWho === 'other' && !(rDigits.length === 10 || (rDigits.length >= 11 && rDigits.length <= 15)) ? 'Add their 10-digit mobile number.' : null,
  };
  const firstError = Object.values(errors).find(Boolean) ?? null;

  const create = useMutation({
    mutationFn: () =>
      svc.createPrepaidBooking({
        companionId: p.id,
        scheduledDate: p.date,
        startTime: p.time,
        duration: p.duration,
        message: [d.forWho === 'other' && d.relation === 'other' ? `For my ${d.relationOther.trim()}.` : '', d.note.trim()].filter(Boolean).join(' ') || undefined,
        idempotencyKey: key,
        acceptTerms: true,
        city: q.data?.city,
        area: q.data?.area,
        category: d.category || null,
        meetingPlace: d.place.trim(),
        recipient: d.forWho === 'other' ? { relation: d.relation as Relation, name: d.rName.trim(), phone: rDigits, city: d.rCity.trim() || q.data?.city || null, state: q.data?.state ?? null } : null,
      }),
    onSuccess: ({ booking }) => {
      clearDraft();
      qc.invalidateQueries({ queryKey: qk.myBookings });
      router.push(`/pay/${booking._id}`);
    },
  });
  const pay = () => {
    setTried(true);
    if (!firstError) create.mutate();
  };

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
          ) : tried && firstError ? (
            <Text variant="footnote" color={colors.danger} center accessibilityLiveRegion="polite">
              {firstError}
            </Text>
          ) : null}
          <Button label={`Continue to pay ${formatINR(total)}`} icon="lock" onPress={pay} loading={create.isPending} disabled={!agree} haptic />
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
      </Card>

      <Text variant="title3" style={styles.h}>
        What’s it for?
      </Text>
      <View style={styles.chips}>
        {CATEGORIES.filter((k) => offersCategory(c.categories, k.key)).map((k) => (
          <Chip key={k.key} label={k.title} selected={d.category === k.key} onPress={() => set({ category: d.category === k.key ? '' : k.key })} />
        ))}
      </View>

      <Text variant="title3" style={styles.h}>
        Where will you meet?
      </Text>
      <TextField
        label="A public place"
        value={d.place}
        onChangeText={(v) => set({ place: v })}
        placeholder={`e.g. a café or mall${c.area ? ` near ${c.area}` : ''}`}
        maxLength={120}
        error={tried ? errors.place : null}
        hint="Public places only — cafés, malls, parks. You can fine-tune it in chat."
      />

      <Text variant="title3" style={styles.h}>
        Who is this for?
      </Text>
      <View style={styles.seg}>
        {(['me', 'other'] as const).map((w) => (
          <Pressable key={w} accessibilityRole="radio" accessibilityState={{ checked: d.forWho === w }} onPress={() => set({ forWho: w })} style={[styles.segItem, d.forWho === w && styles.segOn]}>
            <Text variant="subhead" color={d.forWho === w ? colors.onMoss : colors.ink}>
              {w === 'me' ? 'Me' : 'Someone else'}
            </Text>
          </Pressable>
        ))}
      </View>
      {d.forWho === 'other' ? (
        <View style={{ gap: space.md, marginTop: space.md }}>
          <View style={styles.chips} accessibilityRole="radiogroup">
            {RELATIONS.map((r) => (
              <Chip key={r.value} label={r.label} selected={d.relation === r.value} onPress={() => set({ relation: r.value })} />
            ))}
          </View>
          {tried && errors.relation && d.relation !== 'other' ? (
            <Text variant="footnote" color={colors.danger}>
              {errors.relation}
            </Text>
          ) : null}
          {d.relation === 'other' ? <TextField label="Who are they to you?" value={d.relationOther} onChangeText={(v) => set({ relationOther: v })} placeholder="e.g. my neighbour, my aunt" maxLength={40} error={tried ? errors.relation : null} /> : null}
          <TextField label="Their name" value={d.rName} onChangeText={(v) => set({ rName: v })} autoCapitalize="words" error={tried ? errors.rName : null} />
          <TextField label="Their mobile" prefix="🇮🇳  +91" value={d.rPhone} onChangeText={(v) => set({ rPhone: v.replace(/[^\d ]/g, '') })} keyboardType="phone-pad" maxLength={14} error={tried ? errors.rPhone : null} hint="Kept private: only our team sees it, for safety. The companion never does." />
          <TextField label="Their city (if not the same)" value={d.rCity} onChangeText={(v) => set({ rCity: v })} placeholder={c.city ?? ''} autoCapitalize="words" />
          <Notice text={`You pay and get every update. They meet ${first} in a public place. Companionship only — no medical or care services.`} />
        </View>
      ) : null}

      <View style={{ marginTop: space.lg }}>
        <TextField label="Anything else? (optional)" value={d.note} onChangeText={(v) => set({ note: v })} placeholder="Say what you’d like to do" multiline maxLength={300} />
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
        <Step n={3} text="If they can’t, we offer it to up to 2 similar companions (same city, your “show me” choice, available for this duration) — one at a time." />
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  seg: { flexDirection: 'row', backgroundColor: colors.mistDeep, borderRadius: radius.md, padding: 4, gap: 4 },
  segItem: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm },
  segOn: { backgroundColor: colors.moss },
  agree: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md, marginTop: space.lg, padding: space.md, borderRadius: radius.md, backgroundColor: colors.mistDeep, minHeight: 48 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.gray400, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxOn: { backgroundColor: colors.moss, borderColor: colors.moss },
});

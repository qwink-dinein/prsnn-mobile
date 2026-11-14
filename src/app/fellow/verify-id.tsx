import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Card, Pill, Loading, ErrorState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Upload } from '@/components/fellow/IdParts';
import { whenOf, totalOf } from '@/components/bookings';
import { durationLabel, formatINR, personOf } from '@/domain/booking';
import { companionShareOf } from '@/domain/pricing';
import { ID_TYPES, idUploadError, needsBack } from '@/domain/verification';
import type { Booking, IdType } from '@/domain/types';
import type { UploadFile } from '@/lib/api';
import { errorMessage } from '@/lib/api';
import { svc, qk } from '@/services';
import { useSession } from '@/state/session';

type Phase = 'why' | 'form' | 'held' | 'sent';

/**
 * Companion ID check. Opened from a first booking offer (`?booking=<id>`): explain
 * why, take the ID + selfie, then accept, and the booking is held until staff
 * approve. Opened from the profile without a booking, it just sends the ID.
 */
export default function VerifyId() {
  const { booking: bookingId } = useLocalSearchParams<{ booking?: string }>();
  const qc = useQueryClient();
  const updateUser = useSession((s) => s.updateUser);
  const [phase, setPhase] = useState<Phase>(bookingId ? 'why' : 'form');
  const [idType, setIdType] = useState<IdType | null>('aadhaar');
  const [front, setFront] = useState<UploadFile | null>(null);
  const [back, setBack] = useState<UploadFile | null>(null);
  const [selfie, setSelfie] = useState<UploadFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const bq = useQuery({ queryKey: qk.booking(bookingId ?? ''), queryFn: () => svc.booking(bookingId!), enabled: !!bookingId });

  const submit = async () => {
    const err = idUploadError(idType, { front, back, selfie });
    if (err || !idType || !front || !selfie) return setError(err);
    setError(null);
    setBusy(true);
    try {
      await svc.submitIdDocuments({ idType, front, back: needsBack(idType) ? back : null, selfie });
      await updateUser({ verification_status: 'pending', is_verified: false });
      qc.invalidateQueries({ queryKey: qk.profileCheck });
      if (bookingId) {
        try {
          await svc.acceptOffer(bookingId);
          setPhase('held');
        } catch (e) {
          // The ID is in; only the booking was lost (expired or taken).
          setError(`Your ID was sent. ${errorMessage(e)}`);
          setPhase('sent');
        }
        qc.invalidateQueries({ queryKey: qk.incoming });
        qc.invalidateQueries({ queryKey: qk.booking(bookingId) });
      } else {
        setPhase('sent');
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const b = bq.data;
  const earn = b ? formatINR(b.companionShare ?? companionShareOf(totalOf(b))) : null;

  if (phase === 'held' || phase === 'sent') {
    return (
      <Screen footer={<Button label="Go to my dashboard" onPress={() => router.replace('/home')} />}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Icon name="shieldCheck" size={36} color={colors.moss} />
          </View>
          <Text variant="title1" center>
            {phase === 'held' ? 'Checking your ID' : 'ID sent'}
          </Text>
          <Text variant="callout" muted center style={{ maxWidth: 320 }} accessibilityLiveRegion="polite">
            {phase === 'held'
              ? `${personOf(b?.requesterId)?.fullName?.split(' ')[0] ?? 'The'}${personOf(b?.requesterId) ? '’s' : ''} booking is held for you. We’ll message you as soon as it’s confirmed.`
              : error ?? 'We’ll check it as soon as we can. Bookings you accept meanwhile are held for you until it’s approved.'}
          </Text>
        </View>
        <Card style={{ gap: space.md }}>
          {[
            [bookingId && phase === 'held' ? 'You accepted' : 'Profile live', 'done'],
            ['ID submitted', 'done'],
            ['Safety check by our team', 'now'],
            [phase === 'held' ? 'Confirmed: chat opens' : 'Verified: one tap to accept bookings', 'todo'],
          ].map(([label, st]) => (
            <View key={label} style={styles.row}>
              <Icon name={st === 'done' ? 'check' : 'clock'} size={18} color={st === 'done' ? colors.moss : st === 'now' ? colors.clay : colors.gray400} />
              <Text variant="callout" color={st === 'todo' ? colors.gray500 : colors.ink}>
                {label}
              </Text>
            </View>
          ))}
        </Card>
        {phase === 'held' && earn ? (
          <Card style={[styles.row, { justifyContent: 'space-between', marginTop: space.md }]}>
            <Text variant="callout">You earn</Text>
            <Text variant="headline">{earn}</Text>
          </Card>
        ) : null}
      </Screen>
    );
  }

  if (phase === 'why') {
    if (bq.isLoading) return <Loading />;
    if (bq.isError || !b) return <ErrorState message={errorMessage(bq.error)} onRetry={() => void bq.refetch()} />;
    return (
      <Screen
        footer={
          <View style={{ gap: space.xs }}>
            <Button label="Choose an ID" onPress={() => setPhase('form')} />
            <Button label="Not now" variant="ghost" onPress={() => router.back()} />
          </View>
        }
      >
        <Header title="Accept booking" />
        <OfferSummary b={b} earn={earn} />
        <Text variant="title2" style={{ marginTop: space.lg }}>
          Quick ID check, then it’s yours
        </Text>
        <Text variant="callout" muted style={{ marginTop: space.xs }}>
          Every companion does this once, before their first meeting. You won’t be asked again. If you choose not now, the booking goes to someone else when your time to answer runs out.
        </Text>
        <View style={{ gap: space.sm, marginTop: space.lg }}>
          {['Encrypted and stored privately', `Only our safety team sees it, never ${personOf(b.requesterId)?.fullName?.split(' ')[0] ?? 'the member'} or any member`, 'Used only to confirm you are you', 'Deleted if you close your account'].map((t) => (
            <View key={t} style={styles.row}>
              <Icon name="shieldCheck" size={18} color={colors.moss} />
              <Text variant="callout" style={{ flex: 1 }}>
                {t}
              </Text>
            </View>
          ))}
        </View>
      </Screen>
    );
  }

  const needBack = idType ? needsBack(idType) : false;
  return (
    <Screen
      footer={
        <View style={{ gap: space.xs }}>
          {error ? (
            <Text variant="footnote" color={colors.danger} center accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : null}
          <Button label={bookingId ? 'Submit and accept booking' : 'Send my ID'} icon="lock" onPress={submit} loading={busy} />
        </View>
      }
    >
      <Header title="Verify your ID" onBack={() => (bookingId ? setPhase('why') : router.back())} />
      <Text variant="title2">Which ID will you use?</Text>
      <Text variant="callout" muted style={{ marginBottom: space.md }}>
        Any one of these.
      </Text>
      <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
        {ID_TYPES.map((t) => {
          const on = idType === t.type;
          return (
            <Pressable
              key={t.type}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${t.label}, ${t.sides}`}
              onPress={() => {
                setIdType(t.type);
                if (!t.needsBack) setBack(null);
              }}
              style={[styles.opt, on && styles.optOn]}
            >
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text variant="headline">{t.label}</Text>
                <Text variant="footnote" muted>
                  {t.sides}
                </Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
      {idType === 'aadhaar' ? (
        <Text variant="footnote" muted style={{ marginTop: space.sm }}>
          You can cover the first 8 digits of your Aadhaar number before taking the photo (masked Aadhaar).
        </Text>
      ) : null}

      <View style={{ gap: space.md, marginTop: space.xl }}>
        <Upload label={needBack ? 'Front of ID' : idType === 'passport' ? 'Passport photo page' : 'Photo of your ID'} file={front} onPick={setFront} />
        {needBack ? <Upload label="Back of ID" file={back} onPick={setBack} /> : null}
        <Upload label="Selfie" file={selfie} onPick={setSelfie} camera square />
        <Text variant="footnote" muted>
          Good light, all four corners visible, no glare. For the selfie, face the camera without sunglasses. Sent encrypted and never shown on your profile.
        </Text>
      </View>
    </Screen>
  );
}

function OfferSummary({ b, earn }: { b: Booking; earn: string | null }) {
  return (
    <Card style={styles.offer}>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text variant="footnote" muted>
          {personOf(b.requesterId)?.fullName?.split(' ')[0] ?? 'Member'} · {whenOf(b)} · {durationLabel(b.duration)}
        </Text>
        {earn ? <Text variant="headline">You earn {earn}</Text> : null}
      </View>
      <Pill label="Paid" tone="success" />
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: space.md, marginVertical: space.xxl },
  badge: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  offer: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.green50, borderColor: colors.mossSoft },
  opt: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56, padding: space.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper },
  optOn: { borderColor: colors.moss, borderWidth: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.moss },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.moss },
});

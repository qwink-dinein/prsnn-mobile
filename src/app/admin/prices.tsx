import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Header, Loading, ErrorState, Screen, Card, Chip } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/forms';
import { useConfirm } from '@/components/ui/confirm';
import { AdminGate } from '@/components/admin';
import { ALL_HOURS, applyPricing, hoursLabel, priceCurveError, type PricingSettings } from '@/domain/pricing';
import { formatINR } from '@/domain/booking';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Admin · Prices (superadmin). New bookings only; paid bookings keep their price. */
export default function AdminPrices() {
  return (
    <AdminGate superOnly>
      <Prices />
    </AdminGate>
  );
}

type Draft = { prices: Record<number, string>; share: string; fee: string; cutoff: string; offerMin: string; offerMax: string; dayStart: string; dayEnd: string; headline: number[] };
const draftOf = (p: PricingSettings): Draft => ({
  prices: Object.fromEntries(ALL_HOURS.map((h) => [h, String(p.packagePrices[h] ?? '')])),
  share: String(Math.round(p.platformShare * 100)),
  fee: String(Math.round(p.cancellationFee * 100)),
  cutoff: String(p.cancellationCutoffMinutes),
  offerMin: String(p.offerMinMinutes),
  offerMax: String(p.offerMaxMinutes),
  dayStart: p.dayStart,
  dayEnd: p.dayEnd,
  headline: [...p.headlineHours],
});
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

function Prices() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: qk.pricing, queryFn: svc.pricing, staleTime: 0 });
  // Local edits; until the first edit the form shows the server's values.
  const [edit, setD] = useState<Draft | null>(null);
  const d = edit ?? (q.data ? draftOf(q.data) : null);
  const [reprice, setReprice] = useState(false);

  const parsed = useMemo(() => {
    if (!d) return null;
    const packagePrices = Object.fromEntries(ALL_HOURS.map((h) => [h, Number(d.prices[h])]));
    const n = (s: string) => Number(s);
    const errors: string[] = [];
    const curve = priceCurveError(packagePrices);
    if (curve) errors.push(curve);
    if (!(n(d.share) >= 0 && n(d.share) <= 50)) errors.push('prsnn share must be 0–50%.');
    if (!(n(d.fee) >= 0 && n(d.fee) <= 100)) errors.push('Cancellation fee must be 0–100%.');
    if (!Number.isInteger(n(d.cutoff)) || n(d.cutoff) < 0) errors.push('Cutoff must be whole minutes.');
    if (!Number.isInteger(n(d.offerMin)) || n(d.offerMin) < 5) errors.push('Shortest offer window is at least 5 minutes.');
    if (!Number.isInteger(n(d.offerMax)) || n(d.offerMax) < n(d.offerMin)) errors.push('Longest offer window must be at least the shortest.');
    if (!HHMM.test(d.dayStart) || !HHMM.test(d.dayEnd)) errors.push('Day start and end are HH:MM (24-hour).');
    if (!d.headline.length) errors.push('Choose at least one headline package.');
    const value: Partial<PricingSettings> = {
      packagePrices,
      platformShare: n(d.share) / 100,
      cancellationFee: n(d.fee) / 100,
      cancellationCutoffMinutes: n(d.cutoff),
      offerMinMinutes: n(d.offerMin),
      offerMaxMinutes: n(d.offerMax),
      dayStart: d.dayStart,
      dayEnd: d.dayEnd,
      headlineHours: d.headline,
    };
    return { errors, value };
  }, [d]);

  const save = useMutation({
    mutationFn: () => svc.admin.savePricing({ ...parsed!.value, repriceUnpaid: reprice }),
    onSuccess: (r) => {
      applyPricing(r.pricing);
      qc.setQueryData(qk.pricing, r.pricing);
      setD(null);
      setReprice(false);
      void confirm({ title: 'Saved', message: r.message });
    },
    onError: (e) => confirm({ title: 'Could not save', message: errorMessage(e) }),
  });

  if (q.isLoading)
    return (
      <Screen>
        <Header title="Prices" />
        <Loading />
      </Screen>
    );
  if (q.isError || !d || !parsed)
    return (
      <Screen>
        <Header title="Prices" />
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      </Screen>
    );

  const set = (p: Partial<Draft>) => setD({ ...d, ...p });
  const share = Number(d.share) / 100;

  return (
    <Screen
      padded={false}
      footer={
        <Button
          label="Save prices"
          disabled={parsed.errors.length > 0}
          loading={save.isPending}
          onPress={async () => {
            if (await confirm({ title: 'Save new prices?', message: `New bookings use them within a minute.${reprice ? ' Unpaid bookings are re-priced too.' : ' Existing bookings keep their price.'}`, confirmLabel: 'Save' })) save.mutate();
          }}
        />
      }
    >
      <Header title="Prices" />
      <View style={{ paddingHorizontal: 20, gap: space.lg }}>
        <Text variant="footnote" muted>
          One price list for every companion. Each longer package must cost more in total and less per hour.
        </Text>
        {parsed.errors.length ? (
          <View style={styles.error} accessibilityLiveRegion="polite">
            {parsed.errors.map((e) => (
              <Text key={e} variant="footnote" color={colors.danger}>
                {e}
              </Text>
            ))}
          </View>
        ) : null}

        <Card style={{ gap: space.sm }}>
          <Text variant="headline">Packages</Text>
          {ALL_HOURS.map((h) => {
            const price = Number(d.prices[h]);
            return (
              <View key={h} style={styles.priceRow}>
                <Text variant="callout" style={{ width: 72 }}>
                  {hoursLabel(h)}
                </Text>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <TextField prefix="₹" value={d.prices[h]} onChangeText={(t) => set({ prices: { ...d.prices, [h]: t.replace(/\D/g, '') } })} keyboardType="number-pad" accessibilityLabel={`Price for ${hoursLabel(h)}`} />
                </View>
                <Text variant="caption" muted style={{ width: 92, textAlign: 'right' }}>
                  {price > 0 ? `${formatINR(Math.round(price / h))}/h\n${formatINR(Math.floor(price * (1 - share)))} to them` : ''}
                </Text>
              </View>
            );
          })}
        </Card>

        <Card style={{ gap: space.sm }}>
          <Text variant="headline">Headline packages</Text>
          <Text variant="footnote" muted>
            Shown first, and offered by companions who haven’t picked their own.
          </Text>
          <View style={styles.chips}>
            {ALL_HOURS.map((h) => (
              <Chip key={h} label={hoursLabel(h)} selected={d.headline.includes(h)} onPress={() => set({ headline: d.headline.includes(h) ? d.headline.filter((x) => x !== h) : [...d.headline, h].sort((a, b) => a - b) })} />
            ))}
          </View>
        </Card>

        <Card style={{ gap: space.md }}>
          <Text variant="headline">Split and cancellation</Text>
          <Pair a={<TextField label="prsnn share (%)" value={d.share} onChangeText={(t) => set({ share: t })} keyboardType="number-pad" hint={`Companion gets ${100 - (Number(d.share) || 0)}%`} />} b={<TextField label="Cancellation fee (%)" value={d.fee} onChangeText={(t) => set({ fee: t })} keyboardType="number-pad" />} />
          <TextField label="Free-cancellation cutoff (minutes before start)" value={d.cutoff} onChangeText={(t) => set({ cutoff: t })} keyboardType="number-pad" />
        </Card>

        <Card style={{ gap: space.md }}>
          <Text variant="headline">Timing</Text>
          <Pair a={<TextField label="Day starts" value={d.dayStart} onChangeText={(t) => set({ dayStart: t })} keyboardType="numbers-and-punctuation" />} b={<TextField label="Day ends" value={d.dayEnd} onChangeText={(t) => set({ dayEnd: t })} keyboardType="numbers-and-punctuation" />} />
          <Pair a={<TextField label="Offer window min (min)" value={d.offerMin} onChangeText={(t) => set({ offerMin: t })} keyboardType="number-pad" />} b={<TextField label="Offer window max (min)" value={d.offerMax} onChangeText={(t) => set({ offerMax: t })} keyboardType="number-pad" />} />
        </Card>

        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: reprice }} onPress={() => setReprice((v) => !v)} style={styles.check}>
          <View style={[styles.box, reprice && styles.boxOn]}>{reprice ? <Icon name="check" size={16} color={colors.onMoss} /> : null}</View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="callout">Re-price unpaid bookings</Text>
            <Text variant="footnote" muted>
              Only bookings still awaiting payment. Paid bookings never change.
            </Text>
          </View>
        </Pressable>
      </View>
    </Screen>
  );
}

function Pair({ a, b }: { a: React.ReactNode; b: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: space.sm }}>
      <View style={{ flex: 1, minWidth: 0 }}>{a}</View>
      <View style={{ flex: 1, minWidth: 0 }}>{b}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  error: { gap: 4, padding: space.md, borderRadius: radius.md, backgroundColor: colors.dangerSoft },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  check: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 48, marginBottom: space.lg },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.moss },
});

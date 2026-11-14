import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Loading, ErrorState, IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { PackageGrid } from '@/components/PackageGrid';
import { MIN_LEAD_MINUTES, formatTime, isDayAvailable, monthGrid, timeSlots, toDateKey, endTimeOf , formatINR } from '@/domain/booking';
import { POPULAR_HOURS, hoursLabel, offeredHours, priceFor } from '@/domain/pricing';
import type { Duration } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BOOK_AHEAD_DAYS = 60;

/** Screen 9 · Choose your time (package), day and start time. */
export default function SelectDateTime() {
  const { id, category } = useLocalSearchParams<{ id: string; category?: string }>();
  const q = useQuery({ queryKey: qk.companion(id), queryFn: () => svc.companion(id) });
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [picked, setHours] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const c = q.data;
  const offered = offeredHours(c?.packages);
  // Start on the suggested length (as in the approved design); one tap lifts another.
  const hours = picked ?? (offered.includes(POPULAR_HOURS) ? POPULAR_HOURS : (offered[0] ?? null));
  const weeks = monthGrid(cursor.y, cursor.m);
  const last = new Date(today);
  last.setDate(last.getDate() + BOOK_AHEAD_DAYS);
  // Starts inside the companion's hours, ends by 10 PM, and ~90 min notice so a companion can be confirmed.
  const slots = c && date && hours ? timeSlots(c, date, new Date(), 30, MIN_LEAD_MINUTES, hours * 60) : [];
  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const canPrev = cursor.y > today.getFullYear() || cursor.m > today.getMonth();
  const canNext = new Date(cursor.y, cursor.m + 1, 1) <= last;

  if (q.isLoading) return <Loading />;
  if (q.isError || !c) return <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />;

  const shift = (n: number) => setCursor(({ y, m }) => ({ y: m + n < 0 ? y - 1 : m + n > 11 ? y + 1 : y, m: (m + n + 12) % 12 }));
  const duration = hours ? (String(hours * 60) as Duration) : null;

  return (
    <Screen
      footer={
        <Button
          label={hours ? `Continue · ${formatINR(priceFor(hours) ?? 0)}` : 'Continue'}
          disabled={!date || !time || !duration}
          onPress={() => router.push({ pathname: '/book/review', params: { id: c.id, date: toDateKey(date!), time: time!, duration: duration!, ...(category ? { category } : {}) } })}
        />
      }
    >
      <Header title="Book a time" />

      <Text variant="title2" style={styles.h1} accessibilityRole="header">
        Choose your time
      </Text>
      <Text variant="callout" muted style={{ marginBottom: space.md }}>
        Choose how long you’d like company. Longer bookings offer a lower hourly rate.
      </Text>
      <PackageGrid
        mode="book"
        hours={offered}
        selected={hours}
        onSelect={(h) => {
          setHours(h);
          setTime(null);
        }}
      />

      <Text variant="title3" style={styles.h}>
        Pick a day
      </Text>
      <View style={styles.card}>
        <View style={styles.monthRow}>
          <IconButton name="chevronLeft" label="Previous month" onPress={() => canPrev && shift(-1)} color={canPrev ? colors.ink : colors.gray300} />
          <Text variant="headline">{monthLabel}</Text>
          <IconButton name="chevronRight" label="Next month" onPress={() => canNext && shift(1)} color={canNext ? colors.ink : colors.gray300} />
        </View>
        <View style={styles.week}>
          {WEEK.map((w) => (
            <Text key={w} variant="caption" muted style={styles.cellText}>
              {w}
            </Text>
          ))}
        </View>
        {weeks.map((row, i) => (
          <View key={i} style={styles.week}>
            {row.map((d, j) => {
              if (!d) return <View key={j} style={styles.cell} />;
              const ok = d >= today && d <= last && isDayAvailable(c.availability, d);
              const on = date && toDateKey(d) === toDateKey(date);
              return (
                <Pressable
                  key={j}
                  disabled={!ok}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !ok, selected: !!on }}
                  accessibilityLabel={d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) + (ok ? '' : ', unavailable')}
                  onPress={() => {
                    setDate(d);
                    setTime(null);
                  }}
                  style={styles.cell}
                >
                  <View style={[styles.day, on && styles.dayOn]}>
                    <Text variant="subhead" color={on ? colors.onMoss : ok ? colors.ink : colors.gray300} style={!ok && { textDecorationLine: 'line-through' }}>
                      {d.getDate()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <Text variant="title3" style={styles.h}>
        Start time
      </Text>
      {!hours ? (
        <Text variant="callout" muted>
          Choose how long first.
        </Text>
      ) : !date ? (
        <Text variant="callout" muted>
          Pick a day first.
        </Text>
      ) : slots.length === 0 ? (
        <Text variant="callout" muted>
          No {hoursLabel(hours)} slot fits that day between 7 AM and 10 PM. Try another day or a shorter time.
        </Text>
      ) : (
        <>
          <View style={styles.wrap}>
            {slots.map((s) => (
              <Pressable key={s} accessibilityRole="button" accessibilityState={{ selected: time === s }} onPress={() => setTime(s)} style={[styles.slot, time === s && styles.slotOn]}>
                <Text variant="subhead" color={time === s ? colors.onMoss : colors.ink}>
                  {formatTime(s)}
                </Text>
              </Pressable>
            ))}
          </View>
          {time ? (
            <Text variant="footnote" muted style={{ marginTop: space.sm }}>
              {formatTime(time)} – {formatTime(endTimeOf(time, String(hours * 60)))} · sessions run between 7 AM and 10 PM
            </Text>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: { marginTop: space.sm, marginBottom: space.xs },
  card: { backgroundColor: colors.paper, borderRadius: radius.xl, padding: space.md, borderWidth: 1, borderColor: colors.line },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  week: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  cellText: { flex: 1, textAlign: 'center', paddingVertical: space.xs },
  day: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  dayOn: { backgroundColor: colors.moss },
  h: { marginTop: space.xl, marginBottom: space.md },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  slot: { minWidth: '30%', flexGrow: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  slotOn: { backgroundColor: colors.moss, borderColor: colors.moss },
});

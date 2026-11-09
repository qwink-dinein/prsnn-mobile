import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Chip, Loading, ErrorState, IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { MIN_LEAD_MINUTES, DURATIONS, durationLabel, formatTime, isDayAvailable, monthGrid, timeSlots, toDateKey, endTimeOf, toMinutes, DEFAULT_END } from '@/domain/booking';
import type { Duration } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BOOK_AHEAD_DAYS = 60;

/** Screen 9 · Select date & time. */
export default function SelectDateTime() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useQuery({ queryKey: qk.companion(id), queryFn: () => svc.companion(id) });
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<Duration>('60');

  const c = q.data;
  const weeks = monthGrid(cursor.y, cursor.m);
  const last = new Date(today);
  last.setDate(last.getDate() + BOOK_AHEAD_DAYS);
  // Prepaid bookings need ~90 minutes to offer up to three companions before the start.
  const slots = c && date ? timeSlots(c, date, new Date(), 30, MIN_LEAD_MINUTES) : [];
  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const canPrev = cursor.y > today.getFullYear() || cursor.m > today.getMonth();
  const canNext = new Date(cursor.y, cursor.m + 1, 1) <= last;
  // Sessions may run past the companion's listed end time only by the session length itself; warn, don't block.
  const runsLate = time && c ? toMinutes(endTimeOf(time, duration)) > toMinutes(c.endTime || DEFAULT_END) : false;

  if (q.isLoading) return <Loading />;
  if (q.isError || !c) return <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />;

  const shift = (n: number) => setCursor(({ y, m }) => ({ y: m + n < 0 ? y - 1 : m + n > 11 ? y + 1 : y, m: (m + n + 12) % 12 }));

  return (
    <Screen
      footer={
        <Button
          label="Continue"
          disabled={!date || !time}
          onPress={() => router.push({ pathname: '/book/review', params: { id: c.id, date: toDateKey(date!), time: time!, duration } })}
        />
      }
    >
      <Header title="Select date & time" />

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
        How long?
      </Text>
      <View style={styles.wrap}>
        {DURATIONS.map((d) => (
          <Chip key={d} label={durationLabel(d)} selected={duration === d} onPress={() => setDuration(d)} />
        ))}
      </View>

      <Text variant="title3" style={styles.h}>
        Start time
      </Text>
      {!date ? (
        <Text variant="callout" muted>
          Pick a day first.
        </Text>
      ) : slots.length === 0 ? (
        <Text variant="callout" muted>
          No times left on this day. Try another day.
        </Text>
      ) : (
        <View style={styles.wrap}>
          {slots.map((s) => (
            <Pressable
              key={s}
              accessibilityRole="button"
              accessibilityState={{ selected: time === s }}
              onPress={() => setTime(s)}
              style={[styles.slot, time === s && styles.slotOn]}
            >
              <Text variant="subhead" color={time === s ? colors.onMoss : colors.ink}>
                {formatTime(s)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
      {runsLate ? (
        <Text variant="footnote" color={colors.clay} style={{ marginTop: space.sm }}>
          This session ends after {formatTime(c.endTime || DEFAULT_END)}, when {c.fullName?.split(' ')[0]} usually stops. They can still accept.
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
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

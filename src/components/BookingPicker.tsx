import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { PackageGrid } from '@/components/PackageGrid';
import { firstName } from '@/components/companions';
import { MIN_LEAD_MINUTES, endTimeOf, formatTime, freeSlots, isDayAvailable, monthGrid, timeSlots, toDateKey } from '@/domain/booking';
import { POPULAR_HOURS, hoursLabel, offeredHours } from '@/domain/pricing';
import type { Companion } from '@/domain/types';
import { svc } from '@/services';

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BOOK_AHEAD_DAYS = 60;

export type BookingChoice = { hours: number | null; date: Date | null; time: string | null };

/**
 * How long, which day and what time, in one place (on the companion's page): the price cards are the
 * duration choice, the calendar only offers their days, and start times hide anything that would run
 * past 10 PM, is too soon, or overlaps a time they're already booked. Reports the choice to the parent.
 */
export function BookingPicker({ c, onChange, initialHours }: { c: Companion; onChange: (p: BookingChoice) => void; initialHours?: number }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [picked, setHours] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const offered = offeredHours(c.packages);
  // Start on the length already chosen (a plan from Home), else the suggested one; one tap picks another.
  const start = initialHours && offered.includes(initialHours) ? initialHours : offered.includes(POPULAR_HOURS) ? POPULAR_HOURS : (offered[0] ?? null);
  const hours = picked ?? start;
  const weeks = monthGrid(cursor.y, cursor.m);
  const last = new Date(today);
  last.setDate(last.getDate() + BOOK_AHEAD_DAYS);
  const allSlots = date && hours ? timeSlots(c, date, new Date(), 30, MIN_LEAD_MINUTES, hours * 60) : [];
  // Times this companion is already booked that day are hidden (the server refuses them too).
  const busy = useQuery({ queryKey: ['companion', c.id, 'busy', date ? toDateKey(date) : ''], queryFn: () => svc.companionBusy(c.id, toDateKey(date!)), enabled: !!date, staleTime: 30_000 });
  const slots = hours ? freeSlots(allSlots, busy.data ?? [], hours * 60) : allSlots;
  const hidden = allSlots.length - slots.length;
  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const canPrev = cursor.y > today.getFullYear() || cursor.m > today.getMonth();
  const canNext = new Date(cursor.y, cursor.m + 1, 1) <= last;
  const shift = (n: number) => setCursor(({ y, m }) => ({ y: m + n < 0 ? y - 1 : m + n > 11 ? y + 1 : y, m: (m + n + 12) % 12 }));
  const name = firstName(c.fullName);

  // Tell the parent; a time that's no longer free (just booked by someone else) is dropped.
  const validTime = time && slots.includes(time) ? time : null;
  useEffect(() => {
    onChange({ hours, date, time: validTime });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours, date?.getTime(), validTime]);

  return (
    <View>
      <Text variant="headline" style={styles.step}>
        How long?
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

      <Text variant="headline" style={styles.step}>
        Which day?
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

      <Text variant="headline" style={styles.step}>
        What time?
      </Text>
      {!hours ? (
        <Text variant="callout" muted>
          Choose how long first.
        </Text>
      ) : !date ? (
        <Text variant="callout" muted>
          Pick a day to see the free times.
        </Text>
      ) : busy.isLoading ? (
        <Text variant="callout" muted>
          Checking which times are free…
        </Text>
      ) : slots.length === 0 ? (
        <Text variant="callout" muted>
          {hidden > 0 ? `${name} is already booked for the rest of that day. Try another day or a shorter time.` : `No ${hoursLabel(hours)} slot fits that day between 7 AM and 10 PM. Try another day or a shorter time.`}
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
          {hidden > 0 ? (
            <Text variant="footnote" muted style={{ marginTop: space.sm }}>
              Times when {name} is already booked aren’t shown.
            </Text>
          ) : null}
          {validTime ? (
            <Text variant="footnote" muted style={{ marginTop: space.sm }}>
              {formatTime(validTime)} – {formatTime(endTimeOf(validTime, String(hours * 60)))} · sessions run between 7 AM and 10 PM
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  step: { marginTop: space.lg, marginBottom: space.sm },
  card: { backgroundColor: colors.paper, borderRadius: radius.xl, padding: space.md, borderWidth: 1, borderColor: colors.line },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  week: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  cellText: { flex: 1, textAlign: 'center', paddingVertical: space.xs },
  day: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  dayOn: { backgroundColor: colors.moss },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  slot: { minWidth: '30%', flexGrow: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  slotOn: { backgroundColor: colors.moss, borderColor: colors.moss },
});

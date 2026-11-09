import { ScrollView, StyleSheet, View } from 'react-native';
import { space } from '@/theme/tokens';
import { Chip } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { formatTime, fromMinutes, toMinutes } from '@/domain/booking';
import type { DayKey } from '@/domain/types';

export const WEEK_DAYS: { key: DayKey; label: string }[] = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

/** Hourly options inside the backend's allowed window, 9 AM – 9 PM. */
export const HOURS = Array.from({ length: 13 }, (_, i) => fromMinutes(540 + i * 60));

export type AvailabilityValue = { days: Record<DayKey, boolean>; startTime: string; endTime: string };

export const emptyAvailability = (): AvailabilityValue => ({
  days: { monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: true, sunday: true },
  startTime: '10:00',
  endTime: '19:00',
});

export function AvailabilityEditor({ value, onChange }: { value: AvailabilityValue; onChange: (v: AvailabilityValue) => void }) {
  return (
    <View style={{ gap: space.md }}>
      <Text variant="subhead">Days</Text>
      <View style={styles.wrap}>
        {WEEK_DAYS.map((d) => (
          <Chip key={d.key} label={d.label} selected={value.days[d.key]} onPress={() => onChange({ ...value, days: { ...value.days, [d.key]: !value.days[d.key] } })} />
        ))}
      </View>
      <Text variant="subhead" style={{ marginTop: space.sm }}>
        From
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {HOURS.slice(0, -1).map((h) => (
          <Chip
            key={h}
            label={formatTime(h)}
            selected={value.startTime === h}
            onPress={() => onChange({ ...value, startTime: h, endTime: toMinutes(value.endTime) <= toMinutes(h) ? fromMinutes(toMinutes(h) + 60) : value.endTime })}
          />
        ))}
      </ScrollView>
      <Text variant="subhead">Until</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {HOURS.filter((h) => toMinutes(h) > toMinutes(value.startTime)).map((h) => (
          <Chip key={h} label={formatTime(h)} selected={value.endTime === h} onPress={() => onChange({ ...value, endTime: h })} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  row: { gap: space.sm },
});

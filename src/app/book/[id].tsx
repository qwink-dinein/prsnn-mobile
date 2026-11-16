import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { space } from '@/theme/tokens';
import { Screen, Header, Loading, ErrorState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { BookingPicker, type BookingChoice } from '@/components/BookingPicker';
import { formatINR, toDateKey } from '@/domain/booking';
import { priceFor } from '@/domain/pricing';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/**
 * Choose length, day and time on its own screen. The companion's page now has the same picker
 * built in, so this only serves older links into the booking flow.
 */
export default function SelectDateTime() {
  const { id, category } = useLocalSearchParams<{ id: string; category?: string }>();
  const q = useQuery({ queryKey: qk.companion(id), queryFn: () => svc.companion(id) });
  const [choice, setChoice] = useState<BookingChoice>({ hours: null, date: null, time: null });
  const ready = !!(choice.hours && choice.date && choice.time);

  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />;
  const c = q.data;

  return (
    <Screen
      footer={
        <Button
          label={choice.hours ? `Continue · ${formatINR(priceFor(choice.hours) ?? 0)}` : 'Continue'}
          disabled={!ready}
          onPress={() => router.push({ pathname: '/book/review', params: { id: c.id, date: toDateKey(choice.date!), time: choice.time!, duration: String(choice.hours! * 60), ...(category ? { category } : {}) } })}
        />
      }
    >
      <Header title="Book a time" />
      <Text variant="callout" muted style={{ marginBottom: space.sm }}>
        Longer bookings offer a lower hourly rate.
      </Text>
      <BookingPicker c={c} onChange={setChoice} />
    </Screen>
  );
}

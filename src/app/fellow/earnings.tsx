import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Card, IconButton, Loading, ErrorState, EmptyState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { RequestCard } from '@/components/fellow/RequestCard';
import { earningsFor, formatINR, parseDateKey } from '@/domain/booking';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Screen 21 · Earnings (from paid sessions; payouts are handled by prsnn outside the app for now). */
export default function Earnings() {
  const q = useQuery({ queryKey: qk.incoming, queryFn: svc.incomingBookings });
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const sum = useMemo(() => earningsFor(q.data ?? [], cursor.y, cursor.m), [q.data, cursor]);
  const paid = useMemo(
    () =>
      (q.data ?? []).filter((b) => {
        const d = parseDateKey(b.scheduledDate);
        return b.paymentStatus === 'paid' && d.getFullYear() === cursor.y && d.getMonth() === cursor.m;
      }),
    [q.data, cursor],
  );
  const max = Math.max(1, ...sum.weeks.map((w) => w.amount));
  const label = new Date(cursor.y, cursor.m, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const isCurrent = cursor.y === now.getFullYear() && cursor.m === now.getMonth();
  const shift = (n: number) => setCursor(({ y, m }) => ({ y: m + n < 0 ? y - 1 : m + n > 11 ? y + 1 : y, m: (m + n + 12) % 12 }));

  if (q.isLoading) return <Loading />;
  if (q.isError) return <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />;

  return (
    <Screen>
      <Header title="Earnings" />
      <View style={styles.month}>
        <IconButton name="chevronLeft" label="Previous month" onPress={() => shift(-1)} />
        <Text variant="headline">{label}</Text>
        <IconButton name="chevronRight" label="Next month" onPress={() => !isCurrent && shift(1)} color={isCurrent ? colors.gray300 : colors.ink} />
      </View>
      <View style={styles.total}>
        <Text variant="largeTitle">{formatINR(sum.total)}</Text>
        <Text variant="footnote" muted>
          Total earnings
        </Text>
      </View>
      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Text variant="title3">{sum.sessions}</Text>
          <Text variant="caption" muted>
            Paid sessions
          </Text>
        </Card>
        <Card style={styles.stat}>
          <Text variant="title3">{formatINR(sum.average)}</Text>
          <Text variant="caption" muted>
            Avg per session
          </Text>
        </Card>
      </View>

      <Card style={{ marginTop: space.lg }}>
        <Text variant="subhead" style={{ marginBottom: space.md }}>
          By week
        </Text>
        <View style={styles.chart} accessible accessibilityLabel={sum.weeks.map((w) => `Days ${w.label}: ${formatINR(w.amount)}`).join('. ')}>
          {sum.weeks.map((w) => (
            <View key={w.label} style={styles.barCol}>
              <Text variant="caption" muted numberOfLines={1}>
                {w.amount ? formatINR(w.amount) : ''}
              </Text>
              <View style={[styles.bar, { height: Math.max(4, (w.amount / max) * 120) }, !w.amount && { backgroundColor: colors.mistDeep }]} />
              <Text variant="caption" muted>
                {w.label}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Text variant="title3" style={{ marginTop: space.xl, marginBottom: space.md }}>
        Paid sessions
      </Text>
      {paid.length ? (
        <View style={{ gap: space.md }}>
          {paid.map((b) => (
            <RequestCard key={b._id} b={b} />
          ))}
        </View>
      ) : (
        <EmptyState icon="wallet" title="No paid sessions this month" />
      )}
      <Text variant="footnote" muted style={{ marginTop: space.lg }}>
        Payouts go to your bank account as set up with the prsnn team. Questions? Contact support.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  month: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  total: { alignItems: 'center', marginVertical: space.lg, gap: 2 },
  stats: { flexDirection: 'row', gap: space.md },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 170 },
  barCol: { flex: 1, alignItems: 'center', gap: space.xs },
  bar: { width: 28, borderRadius: radius.sm, backgroundColor: colors.moss },
});

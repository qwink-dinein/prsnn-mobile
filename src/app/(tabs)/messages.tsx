import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Avatar, EmptyState, ErrorState, Loading } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { formatDate, whenOf } from '@/components/bookings';
import { personOf } from '@/domain/booking';
import { chatThreads } from '@/domain/chat';
import { useMode, useModeBookings } from '@/lib/mode';
import { ModeSwitch } from '@/components/ModeSwitch';
import { errorMessage } from '@/lib/api';
import { badgeLabel, useUnread } from '@/lib/live';
import { fonts } from '@/theme/fonts';

/**
 * Chats: one per person (every confirmed booking with them, in one thread). A thread is open from a
 * booking's confirmation until its session ends, and opens again with a new booking.
 * Booking mode: companions I booked. Companion mode: my clients.
 */
export default function MessagesTab() {
  const { mode, canSwitch } = useMode();
  const q = useModeBookings();
  const isCompanion = mode === 'companion';
  const { perChat } = useUnread();
  const chats = q.chats;
  // Re-checked every minute, so a thread shows "Closed" once its session ends.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  const threads = useMemo(() => chatThreads(chats(mode), now), [chats, mode, now]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ModeSwitch style={{ marginTop: space.sm }} />
      <Text variant="title2" style={styles.title} accessibilityRole="header">
        Chats
      </Text>
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(t) => t.key}
          contentContainerStyle={{ paddingHorizontal: GUTTER, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          renderItem={({ item, index }) => {
            const b = item.main;
            const other = personOf(isCompanion ? b.requesterId : b.companionId);
            const n = item.bookings.reduce((sum, x) => sum + (perChat[x._id] ?? 0), 0);
            const badge = badgeLabel(n);
            const open = !!item.sendTo;
            const count = item.bookings.length;
            const detail = open ? `${count > 1 ? `${count} bookings · ` : ''}${whenOf(item.sendTo!)}` : `Last session ${formatDate(b.scheduledDate)}`;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Chat with ${other?.fullName ?? 'your companion'}, ${open ? 'open' : 'closed'}, ${detail}${n ? `, ${n} unread` : ''}`}
                onPress={() => router.push(`/chat/${b._id}`)}
                style={({ pressed }) => [styles.row, index > 0 && styles.line, pressed && { opacity: 0.7 }]}
              >
                <Avatar uri={other?.profilePhotoUrl} name={other?.fullName} size={52} />
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Text variant="headline" numberOfLines={1} style={badge ? { fontFamily: fonts.bold } : undefined}>
                    {other?.fullName ?? 'Companion'}
                  </Text>
                  <Text variant="footnote" muted numberOfLines={1}>
                    {detail}
                  </Text>
                </View>
                {badge ? (
                  <View style={styles.count}>
                    <Text style={styles.countText}>{badge}</Text>
                  </View>
                ) : (
                  <View style={[styles.pill, open ? styles.pillOpen : null]}>
                    {open ? null : <Icon name="lock" size={11} color={colors.gray500} />}
                    <Text variant="caption" color={open ? colors.moss : colors.gray500} style={{ fontFamily: fonts.semibold }}>
                      {open ? 'Open' : 'Closed'}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon="message"
              title="No conversations yet"
              body={isCompanion ? 'A chat with a client opens when their booking is confirmed and closes when the session ends.' : canSwitch ? 'Chat opens once your companion accepts and you’ve paid. Chats with your clients are in Companion mode.' : 'Chat opens once your companion accepts and you’ve paid.'}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  title: { paddingHorizontal: GUTTER, paddingTop: space.sm, paddingBottom: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  line: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  count: { minWidth: 22, height: 22, paddingHorizontal: 6, borderRadius: 11, backgroundColor: colors.champagne, alignItems: 'center', justifyContent: 'center' },
  countText: { fontFamily: fonts.bold, fontSize: 12, color: colors.midnight },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: colors.mist },
  pillOpen: { backgroundColor: colors.green50 },
});

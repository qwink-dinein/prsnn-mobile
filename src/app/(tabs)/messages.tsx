import { useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Avatar, EmptyState, ErrorState, Loading } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { whenOf } from '@/components/bookings';
import { canChat, isMineAsCompanion, personOf, sideOf, startsAt } from '@/domain/booking';
import { useAllMyBookings } from '@/lib/myBookings';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';
import { badgeLabel, useUnread } from '@/lib/live';
import { fonts } from '@/theme/fonts';

/**
 * Conversations: one per confirmed booking (chat opens once the booking is accepted and paid). A
 * companion also sees the chats of bookings they made as a member; the side is read per booking.
 */
export default function MessagesTab() {
  const meId = useSession((s) => s.user?.id);
  const q = useAllMyBookings();
  const isCompanion = q.isCompanion;
  const { perChat } = useUnread();
  const threads = useMemo(
    () =>
      (q.data ?? [])
        .filter((b) => canChat(b) && (sideOf(b, meId) === 'member' || isMineAsCompanion(b)))
        .sort((a, b) => startsAt(b).getTime() - startsAt(a).getTime()),
    [q.data, meId],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text variant="title2" style={styles.title} accessibilityRole="header">
        Messages
      </Text>
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(b) => b._id}
          contentContainerStyle={{ paddingHorizontal: GUTTER, paddingBottom: space.huge }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
          renderItem={({ item, index }) => {
            const asMember = sideOf(item, meId) === 'member';
            const other = personOf(asMember ? item.companionId : item.requesterId);
            const n = perChat[item._id] ?? 0;
            const badge = badgeLabel(n);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Chat with ${other?.fullName ?? 'your companion'}, ${whenOf(item)}${n ? `, ${n} unread` : ''}`}
                onPress={() => router.push(`/chat/${item._id}`)}
                style={({ pressed }) => [styles.row, index > 0 && styles.line, pressed && { opacity: 0.7 }]}
              >
                <Avatar uri={other?.profilePhotoUrl} name={other?.fullName} size={52} />
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Text variant="headline" numberOfLines={1} style={badge ? { fontFamily: fonts.bold } : undefined}>
                    {other?.fullName ?? 'Companion'}
                  </Text>
                  <Text variant="footnote" muted numberOfLines={1}>
                    {whenOf(item)}
                    {item.ref ? ` · #${item.ref}` : ''}
                    {isCompanion ? (asMember ? ' · you booked' : ' · your client') : ''}
                  </Text>
                </View>
                {badge ? (
                  <View style={styles.count}>
                    <Text style={styles.countText}>{badge}</Text>
                  </View>
                ) : (
                  <Icon name="chevronRight" size={18} color={colors.gray400} />
                )}
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon="message"
              title="No conversations yet"
              body={isCompanion ? 'Chats open when you accept a request, or when a companion you booked accepts.' : 'Chat opens once your companion accepts and you’ve paid.'}
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
});

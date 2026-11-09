import { useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Avatar, EmptyState, ErrorState, Loading } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { whenOf } from '@/components/bookings';
import { canChat, isMineAsCompanion, personOf, startsAt } from '@/domain/booking';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';

/** Conversations: one per confirmed booking (chat opens once the booking is accepted and paid). */
export default function MessagesTab() {
  const isCompanion = useSession((s) => s.user?.role === 'companion');
  const q = useQuery({ queryKey: isCompanion ? qk.incoming : qk.myBookings, queryFn: isCompanion ? svc.incomingBookings : svc.myBookings });
  const threads = useMemo(
    () => (q.data ?? []).filter((b) => canChat(b, isCompanion) && (!isCompanion || isMineAsCompanion(b))).sort((a, b) => startsAt(b).getTime() - startsAt(a).getTime()),
    [q.data, isCompanion],
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
            const other = personOf(isCompanion ? item.requesterId : item.companionId);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Chat with ${other?.fullName ?? 'your companion'}, ${whenOf(item)}`}
                onPress={() => router.push(`/chat/${item._id}`)}
                style={({ pressed }) => [styles.row, index > 0 && styles.line, pressed && { opacity: 0.7 }]}
              >
                <Avatar uri={other?.profilePhotoUrl} name={other?.fullName} size={52} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="headline" numberOfLines={1}>
                    {other?.fullName ?? 'Companion'}
                  </Text>
                  <Text variant="footnote" muted numberOfLines={1}>
                    {whenOf(item)}
                  </Text>
                </View>
                <Icon name="chevronRight" size={18} color={colors.gray400} />
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon="message"
              title="No conversations yet"
              body={isCompanion ? 'Chats open when you accept a request.' : 'Chat opens once your companion accepts and you’ve paid.'}
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
});

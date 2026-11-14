import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Avatar, IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { whenOf } from '@/components/bookings';
import { idOf, personOf } from '@/domain/booking';
import type { ChatMessage } from '@/domain/types';
import { MAX_MESSAGE_LENGTH, useChat } from '@/lib/chat';
import { svc, qk } from '@/services';
import { useSession } from '@/state/session';

const time = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

/** Screen 13 · Chat for one booking (live over Socket.io). */
export default function Chat() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const me = useSession((s) => s.user);
  const booking = useQuery({ queryKey: qk.booking(bookingId), queryFn: () => svc.booking(bookingId) });
  const { messages, status, error, ended, send } = useChat(bookingId, me?.id ?? '');
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const b = booking.data;
  const isCompanion = b ? idOf(b.companionId) === me?.id : false;
  const other = b ? personOf(isCompanion ? b.requesterId : b.companionId) : null;
  const closed = ended || (b ? b.status !== 'accepted' : false);

  useEffect(() => {
    if (messages.length) setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length]);

  const submit = () => {
    if (send(text)) setText('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton name="chevronLeft" label="Back" onPress={() => router.back()} />
        <Avatar uri={other?.profilePhotoUrl} name={other?.fullName} size={40} online={status === 'open'} />
        <Pressable style={{ flex: 1 }} accessibilityRole="button" accessibilityLabel="Booking details" onPress={() => router.push(`/booking/${bookingId}`)}>
          <Text variant="headline" numberOfLines={1}>
            {other?.fullName ?? 'Chat'}
          </Text>
          <Text variant="caption" muted numberOfLines={1}>
            {status === 'open' ? (b ? whenOf(b) : 'Online') : status === 'connecting' ? 'Connecting…' : 'Reconnecting…'}
          </Text>
        </Pressable>
        <IconButton name="info" label="Booking details" onPress={() => router.push(`/booking/${bookingId}`)} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m._id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.safety} accessibilityRole="summary">
              <Icon name="shieldCheck" size={16} color={colors.moss} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="caption" color={colors.ink} style={{ fontWeight: '600' }}>
                  Keep it safe and about the plan
                </Text>
                <Text variant="caption" color={colors.gray600}>
                  Don’t share mobile numbers, addresses, social handles or other personal details, and keep politics and religion out of the chat. Meet only in public places. Numbers are hidden automatically, and you can report anything from the booking.
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const mine = String(item.senderId) === me?.id;
            return (
              <View style={[styles.bubbleRow, mine && { justifyContent: 'flex-end' }]}>
                <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                  <Text variant="callout" color={mine ? colors.onMoss : colors.ink}>
                    {item.content}
                  </Text>
                  <Text variant="caption" color={mine ? 'rgba(255,255,255,0.7)' : colors.gray400} style={{ alignSelf: 'flex-end', marginTop: 2 }}>
                    {time(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
        {error ? (
          <Text variant="footnote" color={colors.danger} center style={{ paddingHorizontal: space.lg }} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}
        {closed ? (
          <View style={styles.closed}>
            <Text variant="footnote" muted center>
              This session has ended, so the chat is read-only.
            </Text>
          </View>
        ) : (
          <View style={styles.composer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message…"
              placeholderTextColor={colors.gray400}
              style={styles.input}
              multiline
              maxLength={MAX_MESSAGE_LENGTH}
              accessibilityLabel="Message"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send"
              disabled={!text.trim() || status !== 'open'}
              onPress={submit}
              style={[styles.send, (!text.trim() || status !== 'open') && { opacity: 0.4 }]}
            >
              <Icon name="send" size={20} color={colors.onMoss} />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingRight: space.xs, paddingVertical: space.xs, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, backgroundColor: colors.paper },
  list: { padding: space.lg, gap: space.sm },
  safety: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: colors.green50, marginBottom: space.md },
  bubbleRow: { flexDirection: 'row' },
  bubble: { maxWidth: '80%', paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.lg },
  mine: { backgroundColor: colors.moss, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: colors.paper, borderBottomLeftRadius: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, padding: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, backgroundColor: colors.paper },
  input: { flex: 1, maxHeight: 120, minHeight: 44, fontFamily: fonts.body, fontSize: 16, color: colors.ink, paddingHorizontal: space.lg, paddingTop: 11, paddingBottom: 11, backgroundColor: colors.mist, borderRadius: 22 },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  closed: { padding: space.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
});

import { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Avatar, IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { whenOf } from '@/components/bookings';
import { idOf, personOf } from '@/domain/booking';
import type { ChatMessage } from '@/domain/types';
import { MAX_MESSAGE_LENGTH, useChat } from '@/lib/chat';
import { HoldButton } from '@/components/PanicButton';
import { panicWindow } from '@/domain/safety';

import { svc, qk } from '@/services';
import { useSession } from '@/state/session';

const time = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

/** Screen 13 · Chat for one booking (live over Socket.io). */
export default function Chat() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const me = useSession((s) => s.user);
  const booking = useQuery({ queryKey: qk.booking(bookingId), queryFn: () => svc.booking(bookingId) });
  const { messages, status, error, send } = useChat(bookingId, me?.id ?? '');
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const b = booking.data;
  const isCompanion = b ? idOf(b.companionId) === me?.id : false;
  const other = b ? personOf(isCompanion ? b.requesterId : b.companionId) : null;
  const closed = b ? b.status !== 'accepted' : false;

  useEffect(() => {
    if (messages.length) setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length]);

  // Reading the chat clears its unread badge (and again as new messages arrive while it's open).
  const qc = useQueryClient();
  useEffect(() => {
    if (!bookingId || status !== 'open') return;
    svc.markChatRead(bookingId).then(() => qc.invalidateQueries({ queryKey: qk.unread })).catch(() => {});
  }, [bookingId, status, messages.length, qc]);

  // SOS in the header while the panic button is on (session start → 1 h after the end).
  const [sos, setSos] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const panicOn = b ? panicWindow(b, now).on : false;

  // Keyboard: the composer shows a "hide" button while it's up; tapping or dragging the chat hides it too.
  const [kb, setKb] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKb(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKb(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  const [tipOpen, setTipOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // The box clears at once; if the message didn't reach the server, the text comes back.
  const [sending, setSending] = useState(false);
  const submit = async () => {
    const draft = text;
    if (!draft.trim() || sending) return;
    setText('');
    setSending(true);
    const ok = await send(draft);
    setSending(false);
    if (!ok) setText((cur) => (cur ? cur : draft));
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
        {panicOn && b ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={b.panic ? 'Safety alert active. Open it.' : 'SOS. Open the panic button.'}
            onPress={() => (b.panic ? router.push(`/panic/${b._id}`) : (Keyboard.dismiss(), setSos(true)))}
            hitSlop={6}
            style={styles.sos}
          >
            <Text style={styles.sosText}>SOS</Text>
          </Pressable>
        ) : null}
        <IconButton name="info" label="Booking details" onPress={() => router.push(`/booking/${bookingId}`)} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m._id}
          contentContainerStyle={styles.list}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => kb && listRef.current?.scrollToEnd({ animated: false })}
          ListHeaderComponent={
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: tipOpen }}
              accessibilityLabel="Keep it safe, public places only. Show the chat rules"
              onPress={() => setTipOpen((o) => !o)}
              style={[styles.safety, tipOpen && styles.safetyOpen]}
            >
              <View style={styles.safetyLine}>
                <Icon name="shieldCheck" size={14} color={colors.champagneDeep} />
                <Text variant="caption" color={colors.champagneDeep} style={{ fontFamily: fonts.semibold }} numberOfLines={1}>
                  Keep it safe · public places only
                </Text>
                <Icon name={tipOpen ? 'chevronUp' : 'chevronRight'} size={12} color={colors.champagneDeep} />
              </View>
              {tipOpen ? (
                <Text variant="caption" color={colors.gray600} style={{ marginTop: 6 }}>
                  Don’t share mobile numbers, addresses, social handles or other personal details, and keep politics and religion out of the chat. Meet only in public places. Numbers are hidden automatically, and you can report anything from the booking.
                </Text>
              ) : null}
            </Pressable>
          }
          renderItem={({ item }) => {
            const mine = String(item.senderId) === me?.id;
            return (
              <Pressable onPress={Keyboard.dismiss} accessible={false} style={[styles.bubbleRow, mine && { justifyContent: 'flex-end' }]}>
                <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                  <Text variant="callout" color={mine ? colors.onMoss : colors.ink}>
                    {item.content}
                  </Text>
                  <Text variant="caption" color={mine ? 'rgba(255,255,255,0.7)' : colors.gray400} style={{ alignSelf: 'flex-end', marginTop: 2 }}>
                    {time(item.createdAt)}
                  </Text>
                </View>
              </Pressable>
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
            {kb ? <IconButton name="chevronDown" label="Hide keyboard" onPress={() => Keyboard.dismiss()} style={styles.hideKb} size={20} /> : null}
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
              disabled={!text.trim() || status !== 'open' || sending}
              onPress={() => void submit()}
              style={[styles.send, (!text.trim() || status !== 'open') && { opacity: 0.4 }]}
            >
              <Icon name="send" size={20} color={colors.onMoss} />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>

      {b ? (
        <Modal visible={sos} transparent animationType="slide" onRequestClose={() => setSos(false)}>
          <Pressable style={styles.scrim} onPress={() => setSos(false)} accessibilityLabel="Close" accessibilityRole="button" />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + space.lg }]} accessibilityViewIsModal>
            <View style={styles.grabber} />
            <HoldButton b={b} bare />
            <Pressable accessibilityRole="button" onPress={() => setSos(false)} style={styles.notNow}>
              <Text variant="subhead" muted>
                Not now
              </Text>
            </Pressable>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingRight: space.xs, paddingVertical: space.xs, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, backgroundColor: colors.paper },
  list: { padding: space.lg, gap: space.sm },
  safety: { alignSelf: 'center', maxWidth: '100%', paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.champagneMist, borderWidth: 1, borderColor: colors.line, marginBottom: space.md },
  safetyOpen: { alignSelf: 'stretch', borderRadius: radius.lg, padding: space.md },
  safetyLine: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  sos: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 },
  sosText: { fontFamily: fonts.bold, fontSize: 11, color: colors.white, letterSpacing: 0.5 },
  hideKb: { width: 44, height: 44 },
  scrim: { flex: 1, backgroundColor: 'rgba(24,27,52,0.45)' },
  sheet: { backgroundColor: colors.paper, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, paddingHorizontal: space.xl },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.mistDeep, marginTop: space.sm },
  notNow: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  bubbleRow: { flexDirection: 'row' },
  bubble: { maxWidth: '80%', paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.lg },
  mine: { backgroundColor: colors.moss, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: colors.paper, borderBottomLeftRadius: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, padding: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, backgroundColor: colors.paper },
  input: { flex: 1, maxHeight: 120, minHeight: 44, fontFamily: fonts.body, fontSize: 16, color: colors.ink, paddingHorizontal: space.lg, paddingTop: 11, paddingBottom: 11, backgroundColor: colors.mist, borderRadius: 22 },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  closed: { padding: space.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
});
